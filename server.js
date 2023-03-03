
const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//handling uncaught expectation
process.on("uncaughtExpectation",(err) => {
    console.log(`Error ${err.message}`);
    console.log("shutting down the server due to uncaught expectation");

    process.exit(1);
});

//console.log(youTube);

dotenv.config();

connectDatabase();

const server = app.listen(process.env.PORT, () => {

    console.log(`server is working on http://localhost:${process.env.PORT}`);
    //console.log("server is working");
})


//unhandled promise rejection
process.on("unhandledRejection",(err) => {
    console.log(`Error ${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection");

    server.close(()=>{
        process.exit(1);
    })

});