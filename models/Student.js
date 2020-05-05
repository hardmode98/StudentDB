const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name_of_student: {
        type: String,
        required:true
    },
    school:{
        type:Object,
        required:true,
        district: {
            type: String,
            required : true
        },
        name:{
            type: String,
            required:true
        }
    },
    subject:{
        type:Array,
        required:true
    },
    
    
});

module.exports = mongoose.model("students" , studentSchema);