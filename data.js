const fs = require('fs')
const os = require('os')
const { Try, not, string_utils } = require('./base-utils')
const { jsonEmpty, jsonInfoError, noKeyFound, jsonError, customError, } = require('./jsonUtils')


const strUtils = string_utils()

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!! FILE SYSTEM API !!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
function fs_api() {

    const operations = Object.freeze({
        READ: "read",
        WRITE: "write",
        APPEND: "append",
        APPEND_LINE: "append line",
        UPDATE: "update",
        VALIDATION: "validation"
    })

    const readFormat = "utf8"

    /**
     * Reading row data
     * @param {string} path 
     * @param {string} format 
     */
    function r(path, format = readFormat) {
        return Try(() => fs.readFileSync(path, format))
    }

    /**
     * Writing & overriding file
     * Returns Try -> optional
     * @param {string} path 
     */
    function w(path) {
        return content => Try(() => fs.writeFileSync(path, content))
    }

    /**
     * Appending new row data to a file
     * Returns Try -> optional
     * @param {string} path 
     */
    function a(path) {
        return content => results = Try(() => fs.appendFileSync(path, content))

    }

    /**
     * Appending new row data in a new line
     * Retrurns Try -> optional
     * @param {string} path 
     */
    function al(path) {
        return content => Try(() => fs.appendFileSync(path, `${content}${os.EOL}`))
    }

    /**
     * Reading JSON from file
     * Returns JSON or error message as a JSON
     * @param {string} path 
     * @param {string} format 
     */
    function rJson(path, format = readFormat) {
        const optional = r(path, format);
        const results = optional.getOrElse(error => jsonInfoError(path)(operations.READ, error))
        if (strUtils.isEmpty(results)) return jsonEmpty
        return optional.hasError ? results : JSON.parse(results)
    }

    /**
     * Writing & overriding JSON to file
     * Returns Object or error message as JSON 
     * @param {string} path 
     */
    function wJson(path) {
        return content => w(path)(JSON.stringify(content))
            .getOrElse(error => jsonInfoError(path)(operations.WRITE, error))
    }

    /**
     * Update JSON attribute if exists
     * Returns JSON or error message as JSON
     * @param {string} path 
     */
    function uJson(path) {
        return (key, value) => {
            const obj = rJson(path)
            if (!obj) return jsonInfoError(path)(operations.UPDATE, obj.error)
            if (!(key in obj)) return noKeyFound(obj)(key)
            obj[key] = value
            wJson(path)(obj)
            return obj
        }
    }

    /**
     * Appending new Json
     * @param {string} path 
     */
    function aJson(path) {
        return content => {
            const obj = rJson(path)
            if (!obj) return jsonInfoError(path)(operations.APPEND, obj.error)
            if(not(Array.isArray)(obj)) {
                const withNewContent = [obj, content]
                wJson(path)(withNewContent)
                return withNewContent
            } 
            obj.push(content)
            wJson(path)(obj)
            return obj   
        }
    }

    /**
     * Check out if attribute is in file
     * Returns true if it does
     * @param {string} path 
     * @param {string} format 
     */
    function isFileContains(path, format = readFormat) {
        const read = r(path, format)
        return token => {
            if (read.hasError) return false;
            const data = read.get()
            if (strUtils.isEmpty(data)) return false;
            return data.includes(token)
        }
    }

    return { isFileContains, r, w, a, al, rJson, wJson, uJson, aJson }
}


/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!! VOCABULARY API !!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!! A WRAPPER FOR FS - API !!!!!
 * !!! HANDLES VOCABULARY ONLY !!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
function vocabularyIO() {

    // attributes
    const PATH = "vocabulary.dat"
    const { wJson, isFileContains, aJson, } = fs_api()

    /**
     * Closure id -> in order to generate auto increment id
     */
    function id() {
        let initId = 0
        return () => initId++
    }

    // ID ++
    const increaseId = id()

    /**
     * Insert new word to vocabulary
     * word = {
     * id : uniq
     * name : the actual word
     * simliarWords: other words with the same meaning
     * }
     * @param {string} name 
     */
    function insert(name) {
        return  simliarWords => {
            
            if (isFileContains(PATH)(name)) return name

            const noDuplicate = Array.from(new Set(simliarWords))
            console.log(noDuplicate)
            noDuplicate.forEach(e => {
                if (!isFileContains(PATH)(e)) {
                    const withoutElement = noDuplicate.filter(element => element !== e)
                    return insert(e)(withoutElement)
                }
            })
            const objId = increaseId()
            const toInsert = { objId, name, simliarWords, }
            return aJson(PATH)(toInsert)
        }
    }

    return {
        insert
    }
}

const fsAPI = fs_api()
const vocaAPI = vocabularyIO()

module.exports = {
    fsAPI,
    vocaAPI,
} 


