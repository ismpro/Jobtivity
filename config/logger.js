const morgan = require('morgan');
const chalk = require('chalk');

var codes = [
    {
        "code": 200,
        "message": "Request Accepted",
        "color": "#00ff00"
    },
    {
        "code": 201,
        "message": "Request Created",
        "color": "#00ff00"
    },
    {
        "code": 209,
        "message": "Link Expired",
        "color": "#cc0000"
    },
    {
        "code": 304,
        "message": "Request Not Modified",
        "color": "#ffff00"
    },
    {
        "code": 401,
        "message": "Request Unauthorized",
        "color": "#0000ff"
    },
    {
        "code": 404,
        "message": "Request Not Found",
        "color": "#cc0000"
    },
    {
        "code": 417,
        "message": "Request With Expectation Failed",
        "color": "#9900cc"
    },
    {
        "code": 501,
        "message": "Request Not Implemented",
        "color": "#cc0000"
    },
    {
        "code": 500,
        "message": "Server Error",
        "color": "#cc0000"
    }
]

function loggerCodes(code) {

    if (!code) {
        throw new Error('Code Not Sent')
    }

    let findedCode = codes.find((element) => {
        return element.code == code
    })

    if (!findedCode) {
        throw new Error('Code Not Found')
    } else {
        return findedCode;
    }
}

module.exports = morgan(function (tokens, req, res) {
    try {
        let status = loggerCodes(tokens.status(req, res))
        let ip = Boolean(
            tokens['remote-addr'](req, res) === '::1' ||
            tokens['remote-addr'](req, res) === '[::1]' ||
            // 127.0.0.1/8 is considered localhost for IPv4.
            tokens['remote-addr'](req, res).match(
                /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
            ) ||
            tokens['remote-addr'](req, res) === '0000:0000:0000:0000:0000:0000:0000:0001'
        ) ? 'localhost' : tokens['remote-addr'](req, res);
        return `\nRequest: ${ip} ${tokens.method(req, res)} ${tokens.url(req, res)} - ${tokens['response-time'](req, res)}
    Code: ${chalk.hex(status.color)(status.code)} -> ${status.message}`
    } catch (error) {
        if (error.message === 'Code Not Found') { console.error("\n Erro on code: " + tokens.status(req, res)) }
        else { console.error("Error on logger") }
    }
})
