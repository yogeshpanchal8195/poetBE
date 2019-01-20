
const rhymes = require('./routes/poetRoute'); 
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');



app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/rhymes',rhymes);


mongoose.connect('mongodb://yogesh12345:Yogesh123@ds147344.mlab.com:47344/rough', {
    useNewUrlParser: true
}).catch((err)=>{
    console.log("not connected to the database")
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})