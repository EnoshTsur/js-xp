function is(something) {
    return predicate => predicate(something)
}

function _with(fn) {
    return (...args) => fn(...args)
}

function Try(fn, ...args) {
    let results = null;
    let error = null;
    let hasError = null

    try {
        console.log(args)
        results = args && args.length > 0 ? fn(...args) : fn() 
        hasError = false;
    } catch (e) {
        error = e;
        hasError = true;
    }

    function get() {
        return results
    }

    function getOrElse(fn) {
        return isNullOrUndefined(results) ? fn(error) : results
    }

    function getOrElseGet(other) {
        return isNullOrUndefined(results) ? other : results
    }

    const isEmpty = () => isNullOrUndefined(results)

    const getError = () => isNullOrUndefined(error) ? 'No error available' : error

    return {
        get,
        getOrElse,
        getOrElseGet,
        isEmpty,
        getError,
        hasError
    }
}

function sizeGreaterThanZero(something) {
    return something.length > 0
}

const isLengthGreaterThanZero = something => is(something)(x => x.length > 0)

const isNullOrUndefined = something => is(something)(x => x == undefined)

function equalsTo(a, b) {
    return a === b
}

function not(fn) {
    return arg => !fn(arg)
}

function ifTrueApply(predicate, next) {
    return action => predicate(next) && action()
}


function string_utils() {

    const EMPTY_STRING = ""

    const isEmpty = str => is(str)(x => {
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
    Try,
    not,
    is,
}