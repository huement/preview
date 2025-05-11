#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-argument */

//  Runs the PUG command with a number of custom filters
//  Allowing for JSTransformer & other dynamic data to be applied on build

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const pug = require('pug')
const packData = require('../package.json')
const fs = require('fs-extra')
const c = require('ansi-colors')
const path = require('path')
const async = require('async')
const glob = require('glob')
const jetpack = require( 'fs-jetpack' )
const { textUI } = require( './tui.cjs' )
const { fileMGMT } = require('./filemgmt.cjs')
require('dotenv').config()

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs( hideBin( process.argv ) ).argv

class PugPageBuilder {
    constructor( tokenFile, outputFile ) {
        textUI.headerLog('Building HTML Page from Pug Templates')

        this.pageList = require('../pages/webpages.json')

        this.tokenFile = tokenFile
        this.resultFile = outputFile
        this. pugMojo = {
            pretty: true,
            filters: {
                stylus: function (str, opts) {
                    let ret
                    str = str.replace(/\\n /g, '')
                    const styl = require('stylus')
                    styl(str, opts).render(function (err, css) {
                        if (err) throw err
                        ret = css.replace(/\s/g, '')
                    })
                    return '\n<style>' + ret + '</style>'
                },
                markdownify: function (block) {
                    const jstransformer = require('jstransformer')
                    const marked = jstransformer(require('jstransformer-markdown-it'))
                    const markdownBlock = marked.render(block).body
                    return markdownBlock
                },
                prismify: function (block, options) {
                    const jstransformer = require('jstransformer')
                    const prism = jstransformer(require('jstransformer-prismjs'))

                    const lang = options.lang || 'html'
                    const render = prism.render(block, { language: lang }).body

                    // prettier-ignore
                    const results = "<pre class='code' data-lang='" + lang + "'><code>" + render + '</code></pre>'
                    return results
                },
                codeblock: function (block, option) {
                    const jstransformer = require('jstransformer')
                    const highlight = jstransformer(require('jstransformer-prismjs'))

                    const lang = option.lang || 'html'
                    const cName = option.class || ''
                    const prevC = option.previewClass || ''
                    const fClass = 'documentation-content' + ' ' + cName

                    let escaped = ''
                    if (lang === 'html') {
                        escaped = `<div class="preview-wrapper"><div class="mojo-preview ${prevC}">${block}</div></div>`
                    }

                    const highlightBlock = prism.render(block, {
                        language: lang,
                    }).body
                    const highlighted = `<div class='mojo-highlight'><pre class="code" data-lang="${lang}"><code>${highlightBlock}</code></pre></div>`

                    const ex = "<span class='mojo-doclabel'>EXAMPLE</span>"
                    const htmlTemplate =
                        "<div class='mojo-docblock'>" +
                        ex +
                        escaped +
                        highlighted +
                        '</div>'
                    const final =
                        "<div class='" + fClass + "'>" + htmlTemplate + '</div>'

                    return final
                },
                iconify: function (block) {},
            },
        }

        this.buildDataObject = {
            pages: [],
            package: packData,
            envData: { url: process.env.URL },
            iconList: [],
            templatePages: [],
        }
    }

    transformPugPageTemplates(pageData) {
        // const dynamicData = this.buildDataObject

        const html = pug.compileFile(
            pageData.path + pageData.file,
            this.pugMojo
        )({
            pages: require('../pages/webpages'),
            package: packData,
            envData: { url: process.env.URL },
        })

        fs.writeFile('./' + pageData.url, html, (err) => {
            if (err !== null && err !== undefined) {
                console.error(err)
            }

            // file written successfully
            console.log(
                c.green.bold('./' + pageData.url),
                c.green(' created successfully!')
            )
        })
    }

    /**
     * use regex to find a string for a given file. useful for finding page config data etc
     * @param {String} fullPath - path to file that will be searched
     * @param {String} regexString - string converted into regex filter
     * @return {String|bool} returns either the first instance of found string or false
     */
    async findStringInFile(fullPath, regexString) {
        const data = fs.readFileSync(fullPath).toString('utf8')
        const dataArr = data.split('\n')
        const regex = new RegExp(regexString)
        if (regex.test(data)) {
            for (const line of dataArr) {
                if (regex.test(line)) {
                    return line
                }
            }
        }

        return false
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }

    buildWebpages(searchDir = 'pages/') {
        textUI.statusTxt( 'TRANSFORMING PUG -> HTML...' )
        console.log( this.pageList )

        for (const pObj of this.pageList) {
            pObj.path = searchDir

            if ( pObj.file ) {
                console.log('Target: ' + searchDir + pObj.file)
                this.transformPugPageTemplates(pObj)
            } else {
                console.log('skipping ' + pObj.name + '. no file given')
            }
        }

        console.log('', '', '')
    }
}

module.exports = PugPageBuilder

if ( argv.build ) {
    textUI.headerLog("RUNNING PUG PAGE BUILDER...")
    const pugBuilder = new PugPageBuilder()
    pugBuilder.buildWebpages()
}
