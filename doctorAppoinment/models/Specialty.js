const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({

        SpecialtyType : {
        type: String,
    },
    TotalPractitioners : {
        type: Number,
    }
});

module.exports = mongoose.model('Specialty', specialtySchema);
