function is(something) {
    return predicate => predicate(something)
}

function _with(fn) {
    return (...args) => fn(...args)
}

function sizeGreaterThanZero(something) {
    return something.length > 0
}

const isLengthGreaterThanZero = something => is(something)(x => x.length > 0)

const isNullOrUndefined = something => is(something)(x => x == undefined)

function equalsTo(a, b) {
    return a === b
} 

function not(fn){
    return arg => !fn(arg)
}

function ifTrueApply(predicate, next) {
    return action => predicate(next) && action()
}


function string_utils() {

    const EMPTY_STRING = ""

    const isEmpty = str => is(str)( x => {
        return isNullOrUndefined(x) ? true :
        sizeGreaterThanZero(x) ? false : 
        equalsTo(x, EMPTY_STRING) ? true :
        false
    })

    const withBackSlashN = _with(x => `${x}\n`)

    return {
        EMPTY_STRING,
        isEmpty,
        withBackSlashN,
    }
}

module.exports = {
    isLengthGreaterThanZero,
    isNullOrUndefined,
    string_utils,
    ifTrueApply,
    equalsTo,
    not,
    is,
}