const io = require('./data')
const utils = require('./base-utils')
const rl = require('readline-sync')


const str_utils = utils.string_utils()
const { } = io
const { not, } = utils

function singleWordHandler(word) {


        

        // console.log(`I dont know this word ${word}`)
        // const like = rl.question(str_utils.withBackSlashN("Please write another word with the same meaning?"))
        // console.log('Thanks')
        // const description = rl.question(str_utils.withBackSlashN(`Please provide a simple description about ${word}`))
        // io.w(`${word}.dat`)(JSON.stringify({ like, description }))
        // io.al(vocabulary)(word)
        // } else {
        // const opinion = JSON.parse(io.r(`${word}.dat`)()).description
        // console.log(`I think ${opinion}`)
        // }
    }

    let next = utils.string_utils().EMPTY_STRING

    while (true) {
        next = rl.question(str_utils.withBackSlashN("Hi! Please tell me some word")).trim().toLowerCase()
        if (next === "quit") break;
        singleWordHandler(next)

    }





