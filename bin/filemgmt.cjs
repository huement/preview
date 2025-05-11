/*jshint esversion: 6 */
const { textUI } = require('./tui.cjs')
const jetpack = require('fs-jetpack')
const logo = require('asciiart-logo')
const chalk = require('chalk')
const crypto = require('crypto')
const fs = require('fs')
const cg = require('../package.json')
const path = require('path')
const bannerFile = './_header.txt'

/**
 * Everything and anything todo with file system files
 * @function fileMGMT
 * @yields {fileOk:boolean} Almost always returns Boolean result
 */
const fileMGMT = {
    getParsedPackage(jsonFile = './package.json') {
        return JSON.parse(fs.readFileSync(jsonFile))
    },
    templateNewFile(newFilePath, fileDesc) {
        let newFileName = path.basename(newFilePath)
        let tempFilePath = path.resolve(__dirname, '../.cache/' + newFileName)
        let bannerFilePath = path.resolve(__dirname, bannerFile)

        //this.statusTxt("Creating New Templated File");

        // Setup New File from Template
        //jetpack.copy(bannerFile, tempFilePath, { overwrite: true });

        let fileData = jetpack.read(bannerFilePath)

        let dString = textUI.makeADate()

        let result3 = fileData.replace(/<<NAME>>/g, newFileName)
        let result2 = result3.replace(/<<DATE>>/g, dString)
        let result1 = result2.replace(/<<DESCRIPTION>>/g, fileDesc)
        let result0 = result1.replace(/<<VERSION>>/g, cg.version)

        // Replace templated data with the real thing
        if (jetpack.exists(tempFilePath)) {
            jetpack.remove(tempFilePath)
        }
        jetpack.write(tempFilePath, result0)

        // Add some space to make room for the actual SASS data
        jetpack.append(tempFilePath, '\r\n')

        jetpack.move(tempFilePath, newFilePath, { overwrite: true })
    },
    blankNewFile(newFilePath) {
        //let filePath = path.resolve(__dirname, "../../" + newFilePath);

        if (jetpack.exists(newFilePath)) {
            jetpack.remove(newFilePath)
        }

        jetpack.write(newFilePath, '')
    },
    returnAllFiles() {
        return true
    },
    writeJson(destPath, data) {
        fs.writeJson(destPath, data, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log('success!')
        })
        console.log(c.green.bold('JSON FILE'))
    },
    writeOutFile(destination, fileData) {
        try {
            jetpack.write(destination, fileData)
        } catch (err) {
            console.error(err)
        }
    }
}

// export the courses so other modules can use them
exports.fileMGMT = fileMGMT
