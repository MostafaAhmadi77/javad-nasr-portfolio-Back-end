const app = require("./app.js")
const dotenv = require("dotenv")
const {default:mongoose} = require("mongoose")

const productionMode = process.env.NODE_ENV === "production"
if (!productionMode) {
    dotenv.config()
}

async function connectionToDB(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ---> ${mongoose.connection.host}`)
}

function startServer() {
    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`server running on port --> ${port}`)
    })
}

async function run() {
    startServer()
    await connectionToDB()
}

run()