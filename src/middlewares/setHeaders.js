exports.setHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    next()
}