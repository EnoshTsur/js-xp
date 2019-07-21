function jsonUtils() {
    const jsonError = path => operation => Object.freeze({ error: `Faild to ${operation} from ${path}` })
    const jsonInfoError = path => (operation, error) => `${jsonError(path)(operation)} ${error}`
    const noKeyFound = obj => key => `${obj} does not contains key: ${key}`
    const jsonEmpty = Object.freeze({})
    const customError = message =>  Object.freeze({message})

    return {
        jsonError,
        jsonInfoError,
        noKeyFound,
        jsonEmpty,
        customError,
    }
}

const json = jsonUtils()

module.exports = json