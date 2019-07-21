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

    return { FILE_ATTRIBUTES, isFileContains, r, w, a, al, rJson, wJson, uJson }
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
    const { wJson, isFileContains, } = fs_api()

    /**
     * Closure id -> to 
     */
    function id() {
        let initId = 0
        return () => initId++
    }

    const increaseId = id()

    function insert(name) {
        return (description, simliarWords) => {
            if (isFileContains(PATH)(name)) {
                return customError(`${name} already exists in vocabulary`)
            }
            const objId = increaseId()
            const toInsert = { objId, name, description, simliarWords, }
            return wJson(PATH)(toInsert)
        }
    }

    return {
        insert
    }
}

module.exports = fs_api()


