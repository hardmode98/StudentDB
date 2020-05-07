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


//Handle reconnection also 
var connectHandleCrash  = function(){
    mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser :true , useUnifiedTopology: true  },  ).then(()=>{
        //Port listen
           app.listen(3000);
            console.log("Connected");
        })
        .catch((err)=>{
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                setTimeout(connectHandleCrash, 5000);
              }    
        });
}

//Connect
connectHandleCrash();



