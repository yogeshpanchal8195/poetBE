const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    name :{
        type:String
    },
    date:{
        type:Date
    }
})




const poetData = mongoose.model('Poet',schema);


module.exports = poetData;
