const express = require('express');
const app = express();
const mongoose = require("mongoose");
const User = require("./users");


const users = [
    {id: 1,name:'User 1'},
    {id: 2,name:'User 2'},
    {id: 3,name:'User 3'},
    {id: 4,name:'User 4'},
    {id: 5,name:'User 5'},
    {id: 6,name:'User 6'},
    {id: 7,name:'User 7'},
    {id: 8,name:'User 8'},
    {id: 9,name:'User 9'},
    {id: 10,name:'User 10'},
    {id: 11,name:'User 11'},
    {id: 12,name:'User 12'},
    {id: 13,name:'User 13'},
    {id: 14,name:'User 14'},
    {id: 15,name:'User 15'},
    {id: 16,name:'User 16'},
    {id: 17,name:'User 17'},
    {id: 18,name:'User 18'},
    {id: 19,name:'User 19'},
    {id: 20,name:'User 20'},
]
const posts = [
    {id: 1,name:'Post 1'},
    {id: 2,name:'Post 2'},
    {id: 3,name:'Post 3'},
    {id: 4,name:'Post 4'},
    {id: 5,name:'Post 5'},
    {id: 6,name:'Post 6'},
    {id: 7,name:'Post 7'},
    {id: 8,name:'Post 8'},
    {id: 9,name:'Post 9'},
    {id: 10,name:'Post 10'},
    {id: 11,name:'Post 11'},
    {id: 12,name:'Post 12'},
    {id: 13,name:'Post 13'},
    {id: 14,name:'Post 14'},
    {id: 15,name:'Post 15'},
    {id: 16,name:'Post 16'},
    {id: 17,name:'Post 17'},
    {id: 18,name:'Post 18'},
    {id: 19,name:'Post 19'},
    {id: 20,name:'Post 20'},
]
//connect to db
mongoose.connect("mongodb://localhost:27017/UserPaginatedDB", (err,success)=>{
    if(err) throw err;
    console.log("Mongodb connected!");
});
const db = mongoose.connection;
//runs when we open the database
db.once('open', async () => {
    if(await User.countDocuments().exec() > 0) return;
    Promise.all([
        User.create({ name: 'User 1' }),
        User.create({ name: 'User 2' }),
        User.create({ name: 'User 3' }),
        User.create({ name: 'User 4' }),
        User.create({ name: 'User 5' }),
        User.create({ name: 'User 6' }),
        User.create({ name: 'User 7' }),
        User.create({ name: 'User 8' }),
        User.create({ name: 'User 9' }),
        User.create({ name: 'User 10' }),
        User.create({ name: 'User 11' }),
        User.create({ name: 'User 12' }),
        User.create({ name: 'User 13' }),
        User.create({ name: 'User 14' }),
        User.create({ name: 'User 15' }),
        User.create({ name: 'User 16' }),
        User.create({ name: 'User 17' }),
        User.create({ name: 'User 18' }),
        User.create({ name: 'User 19' }),
        User.create({ name: 'User 20' }),
    ]).then(() => console.log("Added Users")).catch((err) => console.log(err));
});

app.get('/posts',paginatedResults(posts), (req,res) => {
    res.json(res.paginatedResults);
});

app.get('/users', paginatedResults(User), (req,res) => {
    res.json(res.paginatedResults);
});

function paginatedResults(model){
    return async (req,res,next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const results = {};

        if(endIndex < await model.countDocuments().exec()){
            results.next = {
                page:page+1,
                limit: limit
            }
        }
    
        if(startIndex > 0){
            results.previous = {
                page:page-1,
                limit: limit
            }
        } 

        // results.results = model.slice(startIndex,endIndex);
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec() 
            res.paginatedResults = results;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}




app.listen(3002, (err,success) =>{
    if (err) throw err;
    console.log("Server up and running!");
});