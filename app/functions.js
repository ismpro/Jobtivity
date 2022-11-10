const fs = require('fs');
const path = require('path')

exports.jsonReader = function (filePath, cb) {
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

exports.jsonWriter = function (filePath, object, cb) {
    if (filePath && object)
        fs.writeFile(filePath, JSON.stringify(object), (err) => {
            if (err) {
                return cb && cb(err)
            } else {
                return cb && cb(null)
            }
        })
}

exports.asyncForEach = async function (array, callback) {
    if (array) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
}

exports.createid = function (length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.average = function (data) {
    var sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}

exports.minuteToHourConvert = function (n) {
    var mins_num = parseFloat(n, 10); // don't forget the second param
    var hours = Math.floor(mins_num / 60);
    var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));

    // Appends 0 when unit is less than 10
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours + ':' + minutes;
}

exports.getMonday = function (d = new Date()) {
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1)
    return exports.formatDate(new Date(d.setDate(diff)));
}

exports.formatDate = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

exports.standardDeviation = function (values) {
    var avg = exports.average(values);

    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = exports.average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return [Math.round(stdDev), Math.round(avg)];
}