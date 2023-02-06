import express, { Express, Request, response, Response } from 'express'
import { IncomingMessage } from 'http';
import path from 'path';
import { Schema, Document } from 'mongoose';
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const date = require(__dirname + '/date.js');
const bodyParser = require('body-parser')
const https = require('https');

dotenv.config()

mongoose.set('strictQuery', true) 
const app = express()
const port = process.env.PORT
const password = process.env.MONGOOB_PASSWORD
const mongoob_url = `mongodb+srv://phoorinrat:${password}@cluster0.ba28syw.mongodb.net/TodoApp?retryWrites=true&w=majority`;
mongoose.connect(mongoob_url);
interface ITodo extends Document{ 
    task: String,
    isDone: Boolean,
    taskTitle: String,
    date: Date
}
const todoSchema = new Schema({ 
    task: String,
    isDone: Boolean,
    taskTitle: String,
    date: { type: Date, default: Date.now }
})
const Todo = mongoose.model('Todo', todoSchema)
// const todo = new Todo({
//     task: "test",
//     isDone: false
    
// })
// todo.save()
// const gotoSchool = new Todo({
//     task: "goto School",
//     isDone: true
// })
// const buyMilk = new Todo({
//     task: "buy Milk",
//     isDone: false
// })
// Todo.insertMany({gotoSchool,buyMilk},(err:string)=>{
//     if(err)
//         console.log(err)
//     else
//         console.log('data saved.')
// })
// Todo.uodateOne({task:'test'},{task:'test example'}, (err:string) => {
//     if(err)
//         console.log(err)
//     else{
//         console.log('succesfully updated.')
//     }
// })
// Todo.deleteOne({task:'test'}, (err:string) => {
//     if(err)
//         console.log(err)
//     else{
//         console.log('delere test example succesfully')
//     }
// })

// Todo.find(function(err:string,todos:ITodo[]){
//     if(err)
//         console.log(err)
//     else{
//         todos.forEach((item)=>{
//             console.log(`${item.task}: ${item.isDone}`)
//         })
            
//     }
        
// })


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs');


const today = date.getDateNow()
// const todoHome = new Set()
const todoSchool = new Set()
app.get('/', (req: Request, res: Response) => {
    Todo.find({taskTitle:'Home'},(err:string, todoHome:ITodo[])=>{
        if(err)
            response.send(err)
        else
            res.render('index', { today: today, tasks: todoHome,taskTitle : "Home" });
    })
    
})
app.get('/School', (req: Request, res: Response) => {
    Todo.find({taskTitle:'school'},(err:string, todoHome:ITodo[])=>{
        if(err)
            response.send(err)
        else
            res.render('index', { today: today, tasks: todoHome,taskTitle : "school" });
    })
})

app.post('/', (req: Request, res: Response) => {

    let path = '/'
     const newTask = req.body.newTask
     const tasktype = req.body.type
    if (req.body.type == 'School'){
        path = 'school'
    }
    if (req.body.isDone !== '' && newTask === '' && req.body.delete === undefined) {
        const update_id = req.body.isDone
        Todo.findOneAndUpdate({ _id: update_id }, [{ $set: { isDone: { $not: "$isDone" } } }], () => {
            response.redirect(path)
        })
    }
    if(newTask !== ''){
        const task = new Todo({
            task: newTask,
            isDone: false,
            taskTitle: tasktype
        })
        task.save()
    }
    if (req.body.delete !== undefined) {
        const delete_id = req.body.delete
        Todo.deleteOne({delete_id},(err:string)=>{
            if(err){
                res.send(err)
            }else{
                res.redirect(path)
            }
        })
    }

})

app.listen(port, () => {
    console.log(`⚡️[SERVER]: Server is running at https://localhost:${port}`)
})