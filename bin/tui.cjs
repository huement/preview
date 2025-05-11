/*jshint esversion: 6 */
const jetpack = require('fs-jetpack')
const logo = require('asciiart-logo')
const chalk = require('chalk')
const crypto = require('crypto')
const fs = require('fs')
const cg = require('../package.json')
const path = require('path')
const bannerFile = './_header.txt'

const good = chalk.bold.greenBright
const oktxt = chalk.bold.green
const info = chalk.bold.cyan
const infoB = chalk.bold.cyanBright
const bad = chalk.bold.red
const vapor = chalk.bold.magenta
const paper = chalk.bold.white

/**
 * Brief description of the function here.
 * @generator
 * @function functionNameHere
 * @yields {yieldDataType} Brief description of yielded items here.
 */
const textUI = {
    // Header Display
    outputHeader(pc) {
        // Output Logo to Terminal
        console.log(
            logo({
                name: pc.name,
                font: 'Cosmike',
                lineChars: 10,
                padding: 2,
                margin: 2,
                borderColor: 'black',
                logoColor: 'bold-cyan',
                textColor: 'bold-magenta',
            })
                .right('ver: ' + pc.version)
                .emptyLine()
                .center(pc.description)
                .render()
        )
    },
    outputMiniHeader(pc) {
        console.log(
            logo({
                name: '  ' + pc.name + '  ',
                font: 'Cosmike',
                lineChars: 20,
                padding: 2,
                margin: 2,
                borderColor: 'black',
                logoColor: 'bold-cyan',
            })
                .emptyLine()
                .render()
        )
    },
    headerLog(text, hC = 0) {
        // prettier-ignore
        let headerCount = ["⚀","⚁","⚂","⚃","⚄","⚅","⚀⚅","⚁⚅","⚂⚅","⚃⚅","⚄⚅","⚅⚅"];

        let bSpace = ' '
        if (hC < 7) {
            bSpace = ' ◼'
        }

        console.log(
            info(
                '  ◼◼◼◼◼◼◼ ◼◼◼◼◼◼◼◼◼ ◼◼◼◼◼◼◼◼◼◼ ◼◼◼ ◼◼◼ ' +
                    headerCount[hC] +
                    ' ◼◼◼◼ ◼◼◼◼◼◼◼◼ ◼◼'
            )
        )

        console.log(good('  ' + text))
        console.log(
            info(
                '  ◼◼◼ ◼◼◼ ◼◼◼◼◼◼◼◼◼◼◼◼ ◼◼ ◼◼◼◼◼◼ ◼◼◼ ◼◼◼◼◼◼' +
                    bSpace +
                    '◼◼◼◼◼◼◼◼ ◼◼◼'
            )
        )
        console.log(' ')
    },
    statusTxt(text) {
        console.log(infoB('  [UPDT]  ') + info(text))
    },
    infoTxt(text) {
        console.log(info('  [INFO]  ') + paper(text))
    },
    taskTxt(text) {
        console.log(oktxt('  [ OK ]  ') + oktxt(text))
    },
    doneTxt(text) {
        console.log(good('  [DONE]  ') + good(text))
    },
    errorTxt(text) {
        console.log('', bad('  [FAIL]  ') + bad(text), '')
    },
    warnTxt(text) {
        console.log(bad('  [WARN]  ') + paper(text))
    },
    basicMsg(text) {
        console.log('  | ' + paper(text))
    },
    quoteString(string) {
        return "'" + string + "'"
    },
    // FILE SYSTEM CONFIG
    getParsedPackage(jsonFile = './package.json') {
        return JSON.parse(fs.readFileSync(jsonFile))
    },
    formatBytes(a, b = 2) {
        if (!+a) return '0 Bytes'
        const c = 0 > b ? 0 : b,
            d = Math.floor(Math.log(a) / Math.log(1024))
        return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][d]}`
    },
    scssVar(name, value, quotes = false) {
        let scssString = ''
        if (quotes !== false) {
            scssString = '$' + name + ': "' + value + '" !default;'
        } else {
            scssString = '$' + name + ': ' + value + ' !default;'
        }

        return scssString
    },
    makeADate() {
        // prettier-ignore
        const monthNames = ["JAN","FEB","MAR","APR","MAY","JUNE","JULY","AUG","SEPT","OCT","NOV","DEC"];

        let date_ob = new Date()
        let date = ('0' + date_ob.getDate()).slice(-2)
        let month = monthNames[date_ob.getMonth()]
        let year = date_ob.getFullYear()
        let dateString = month + ' ' + date + ' ' + year

        return dateString
    },
    hashString(string, limit = false) {
        // change to 'md5' if you want an MD5 hash
        var hash = crypto.createHash('sha256')

        // change to 'binary' if you want a binary hash.
        hash.setEncoding('hex')

        // the text that you want to hash
        hash.write(string)

        // very important! You cannot read from the stream until you have called end()
        hash.end()

        // and now you get the resulting hash
        let sha256sum = hash.read()

        if (limit) {
            sha256sum = sha256sum.substring(0, limit)
        }

        return sha256sum
    },
}

//outputHeader(config);

// export the courses so other modules can use them
exports.textUI = textUI
