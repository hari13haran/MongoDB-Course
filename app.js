const express = require('express')
const { ObjectId } = require('mongodb')
const { connnectToDb, getDb } = require('./db')

// init app & middleware
const app = express()
// middleware to parse json in request body
app.use(express.json())

// db connection
let db

connnectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
})

// routes
app.get('/phones', (req,res) => {

    const page = req.query.p || 0
    const phonesPerPage = 2

    let phones = []

    db.collection('phones_2022')
        .find()
        .sort({ brand: 1})
        .skip(page * phonesPerPage)
        .limit(phonesPerPage)
        .forEach(phone => phones.push(phone))
        .then(() => {
            res.status(200).json(phones)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})

app.get('/phones/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)) {
        db.collection('phones_2022')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
         })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch the document'})
        }) 
    } else {
        res.status(500).json({error: 'Not a valid _id'})
    }
})

app.post('/phones', (req,res) => {
    const newPhone = req.body

    db.collection('phones_2022')
    .insertOne(newPhone)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not add new document'})
    })
})

app.delete('/phones/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)) {
        db.collection('phones_2022')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
         })
        .catch(err => {
            res.status(500).json({error: 'Could not delete the document'})
        }) 
    } else {
        res.status(500).json({error: 'Not a valid _id'})
    }
})

app.patch('/phones/:id', (req,res) => {
    const updatedPhone = req.body

    if(ObjectId.isValid(req.params.id)) {
        db.collection('phones_2022')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: updatedPhone})
        .then(result => {
            res.status(200).json(result)
         })
        .catch(err => {
            res.status(500).json({error: 'Could not update the document'})
        }) 
    } else {
        res.status(500).json({error: 'Not a valid _id'})
    }
})
