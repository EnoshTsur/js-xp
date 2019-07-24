const io = require('./data')
const utils = require('./base-utils')
const rl = require('readline-sync')


const str_utils = utils.string_utils()
const { vocaAPI, fsAPI } = io
const { not, } = utils

function singleWordHandler(word) {
    
        vocaAPI.insert("enosh")(['human', 'human-been', 'adam'])
       
}

    let next = utils.string_utils().EMPTY_STRING

    while (true) {
        next = rl.question(str_utils.withBackSlashN("Hi! Please tell me some word")).trim().toLowerCase()
        if (next === "quit") break;
        singleWordHandler(next)

    }





