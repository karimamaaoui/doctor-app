const mongoose = require('mongoose');
const user= require("./userModel");
const userModel = require('./userModel');
const { Schema, Types } = mongoose;


const evaluationSchema = new mongoose.Schema({


        EvaluationDate : {
        type: Date,
        required: true,
        default: Date.now 
        },

        Pm: {
            type: Types.ObjectId,
            ref: 'User', 
            required: true
        },

        Patient : {
            type: Types.ObjectId,
            ref: 'User', 
            required: true
        },
        
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
