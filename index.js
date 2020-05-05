//Import all stuff here
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//imprt vvalues
require("dotenv/config");

//Instantiate
const app = express();
app.use(bodyParser.json());

//Handle student crud
const studentHandler = require('./Handlers/StudentHandler');

app.use("/students" , studentHandler);

app.get('/' , (req , res)=>{
    res.send("Thanks for using home page");
});


//Connect to database
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser :true , useUnifiedTopology: true},  ).then(()=>{
//Port listen
   app.listen(3000);
    console.log("Connected");
})
.catch((err)=>{
    console.log(err);
});



