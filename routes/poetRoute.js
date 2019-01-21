const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Poet = require('../models/poetModel.js');
var request = require('request');


router.get('', async (req, res) => {
    try {
        // console.log(req.query.name);
        var name = req.query.name;
        var max = req.query.max || 10;
        if (name) {
            var reqData = {
                url: "https://api.datamuse.com/words?rel_rhy=" + name + "&&max=" + max,
                json: true,
            }
            request.get(reqData, function (error, httpResponse, body) {
                if (error) {
                    return res.status(500).send();
                }
                Poet.findOne({ name: req.query.name }, (err, result) => {
                        console.log("RESSS",result)
                        var poet = result;
                        if(err) {
                            return res.status(500).send();
                        }
                        if (!poet) {
                            var poetData = new Poet(_.pick(req.query, ['name', 'date']));
                            poetData.save().then((result) => {
                                console.log("SAVED", result);
                            });
                            Poet.find({},(err,array)=>{
                                if(err){
                                    return res.status(500).send();
                                }
                                if(array.length >= 10){
                                    console.log(array);
                                    var deletedId = array[0]._id;
                                    Poet.findByIdAndDelete(deletedId,(err,delres)=>{
                                        if(err){
                                            return res.status(500).send();
                                        }
                                        console.log("DELETEDDD",delres);
                                    })
                                }
                            }).sort({ "date": 1 })
                        } else {
                            Poet.findByIdAndUpdate(poet._id, { $set: {date:req.query.date} }, (err, result) => {
                                console.log("UPDATED", result);
                            });
                        }
                });
                return res.status(200).send(body);
            })
        }
    }
    catch (ex) {
        console.log(ex)
    }

});


router.post('/recent', async (req, res) => {
    try {
        Poet.find({},(err,result)=>{
            if(err){
                return res.status(500).send();
            }
            return res.status(200).send(result);
        }).sort({date : -1});
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/suggestions', async (req, res) => {
    try {
        var name = req.query.name;
        if (name) {
            var reqData = {
                url: "https://api.datamuse.com/sug?s=" + name,
                json: true,
            }
            request.get(reqData, function (error, httpResponse, body) {
                if (error) {
                    return res.status(500).send();
                }
                return res.status(200).send(body);
            })
        }
    }
    catch (ex) {
        console.log(ex);
    }

});

module.exports = router;


