const adminAuth = (req, res, next) => {
    console.log('admin auth cheking')
    const token = 'qwerty';
    const isAuthorised = token === 'qwerty'
    if (isAuthorised) {
        next()
    } else {
        res.status(401).end('not admin')
    }
}

const userAuth = (req, res, next) => {
    console.log('user auth cheking')
    const token = 'qwerty';
    const isAuthorised = token === 'qwerty'
    if (isAuthorised) {
        next()
    } else {
        res.status(401).end('not user')
    }
}

module.exports = {
    adminAuth,
    userAuth
}