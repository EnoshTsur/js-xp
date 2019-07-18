const fs = require('fs')
const os = require('os')
const utils = require('./base-utils')


const strUtils = utils.string_utils()

function fs_api() {

    const FILE_ATTRIBUTES = Object.freeze(
        { vocabulary: "vocabulary.dat", readFormat: "utf8"}
    )

    function r(path, format=FILE_ATTRIBUTES.readFormat) {
        return () => fs.readFileSync(path, format)
    }

    function w(path) {
        return content => fs.writeFileSync(path, content)
    }
    
    function a(path) {
        return content => fs.appendFileSync(path, content)
    }

    function al(path) {
        return content => fs.appendFileSync(path, `${content}${os.EOL}`)
    }

    function isFileContains(path, format=FILE_ATTRIBUTES.readFormat) {
        const read = r(path, format)     
        return token => {
            const data = read()
            if (strUtils.isEmpty(data)) return false;
            return data.includes(token)
        }
    }

    return { FILE_ATTRIBUTES, isFileContains, r, w, a, al }
}

module.exports = fs_api()


