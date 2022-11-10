const iplocate = require('node-iplocate')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

function loggerCodes(code) {
    return new Promise((resolve, reject) => {
        jsonReader(path.resolve('./app/config/severConfig.json'), (err, object) => {

            if (!code) {
                reject(Error('Code Not Sent'))
            }

            if (!err) {
                let codes = object.codes

                let findedCode = codes.find((element) => {
                    return element.code === code
                })

                if (!findedCode) {
                    reject(Error('Code Not Found'))
                } else {
                    resolve(findedCode)
                }
            } else {
                reject(err)
            }
        })
    })
}

function jsonReader(filePath, cb) {
    if (filePath)
        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                return cb && cb(err)
            }
            try {
                const object = JSON.parse(fileData)
                return cb && cb(null, object)
            } catch (err) {
                return cb && cb(err)
            }
        })
}

function jsonWriter(filePath, object, cb) {
    if (filePath && object)
        fs.writeFile(filePath, JSON.stringify(object), (err) => {
            if (err) {
                return cb && cb(err)
            } else {
                return cb && cb(null)
            }
        })
}

/**
 * 
 * @param 
 */
module.exports = function (options) {
    return function (req, res, next) {
        let startTime = new Date().getTime()
        res.on('finish', () => {
            const fileLocation = path.resolve('./db/logs/requests.json');
            let ip = req.headers['x-forwarded-for'] || req.ip
            var promise1 = new Promise((resolve, reject) => {
                loggerCodes(res.statusCode).then(resolve).catch(reject)
            });
            var promise2 = new Promise((resolve, reject) => {
                iplocate(ip).then(resolve).catch(reject)
            });
            Promise.all([promise1, promise2]).then((values) => {
                let results = values[1]
                let code = values[0]
                const isLocalhost = Boolean(
                    results.ip === '[::1]' ||
                    // 127.0.0.1/8 is considered localhost for IPv4.
                    results.ip.match(
                        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
                    ) ||
                    results.ip === '0000:0000:0000:0000:0000:0000:0000:0001'
                );
                let localion = isLocalhost ? 'localhost' : results.country + (results.city ? ' - ' + results.city : '')
                let endTime = new Date().getTime()
                console.log(`\nRequest ${req.method} -> ${req.path} : ${isLocalhost ? 'localhost' : `${results.ip} - ${localion}`} ${req.session ? (req.session.name ? 'by ' + req.session.name : '') : ''} Time: ${endTime - startTime} ms`)
                console.log(`Code: ${chalk.hex(code.color)(code.code)} -> ${code.message}`);
                if (!global.NODE_MODE) {
                    jsonReader(fileLocation, function (err, object) {
                        if (!err) {
                            object.requests.push({
                                id: object.requests.length + 1,
                                date: new Date().toISOString().replace('T', ' ').replace('Z', ''),
                                method: req.method,
                                path: req.path,
                                ip: results.ip,
                                localion: localion,
                                user: req.session.name ? req.session.name : 'Not specific',
                                code: code.code,
                                message: code.message
                            })
                            jsonWriter(fileLocation, object)
                        } else {
                            console.log('Logger Error:')
                            console.log(err)
                        }
                    })
                }
            }).catch((err) => {
                console.log('Logger Error:')
                console.log(err)
            });
        })
        next()
    };
};