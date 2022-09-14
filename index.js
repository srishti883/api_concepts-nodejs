const express = require('express');
const students = require('./studentData');
const mongoose = require('mongoose');
const Model = require('./mongoClient');

const uri = "mongodb+srv://toDoAppUser:todo123@cluster1.krcjd3a.mongodb.net/test?retryWrites=true&w=majority"

const connectWithDb = async () =>{
    try{
        await mongoose.connect(uri)
        console.log("database connected");
    } catch{
        console.log("error while connectiong");
    }
}
connectWithDb();
//when we dont use middleware it gives undefined because it cant json request which send in req.body.
// app.use(express.json())
const app = express()
app.use(express.json())

app.listen(8000, () => {
    console.log('listening on port 8000');
})

app.get('/', (req, res) => {
    res.json("message:api is working")
})

app.get('/api/students/:id',async(req,res)=>{
    try{
        console.log(req.params);
        const {id} = req.params;
        const result = await Model.findById(id);

        if(result){
            res.status(200).send({
                status: true,
                message: "task fetched successfully",
                data:result
            });
        }
        else{
            res.status(400).send({
                status: false,
                message: "record not found"
            });
        }
    }catch(e){
        res.status(400).send({
            status: false,
            message: "error:" + e.message,
        });
    }

})

// app.get('/api/students', (req, res) => {

//     const records = Model.find();
//     res.json(students)
//     res.status(200).send({
//         status: true,
//         message: "task fetched successfully",
//         students: students,
//         dbRecords: records
//     });
// })

app.post('/api/students', async(req, res) => {
    // console.log(req.body);
    //Handling errors
    if (!req.body.email) {
        res.status(400)
        res.send({
            status: false,
            message: "email is required"
        })

    };
    //create object for students
    const { name, email, description } = req.body;
    const user = {
        id: students.length + 1,
        name,
        email,
        description,
    };
    students.push(user)

//logic to add to database
   const record = new Model(user);
   await record.save();

    // res.json(user)
    res.status(200).send({
        status: true,
        message: "task created successfully",
        students: students,
    });
});

// app.put('/api/students/:id', (req, res) => {
//     const {id} = req.params
   
//     const { name, email, description } = req.body;
//     const user = {
//         id: students.length + 1,
//         name,
//         email,
//         description,
//     };




//     students.push(user)
//     //Seaching using findIndex for element.

//     const index = students.findIndex((student) => {
//         return (student.id == Number.parseInt (id))
//     })

//     if (index > 0) {
//         const std = students[index]
//         std. name = name
//         std. email = email
//         std. description = description
//         res.json(std)
//     } else {
//         res.status(404)
//     }
//     console.log(id);
//     // res.json(id)
// })

app.put('/api/students/:id',async(req,res)=>{
    try{
        const { id } = req.params;
        const { name, email, description } = req.body;

        const result = await Model.updateOne({ _id: id }, { name, description, email });

        res.status(200).send({
            status: true,
            message: "task updated",
            data: result
        });

    }catch (e) {
        res.status(400).send({
            status: false,
            message: "error:" + e.message,
        });
    }
});

// app.delete('/api/students/:id',(req,res)=>{
//     const {id} = req.params;

//     //Seaching using findIndex for element.

//     const index = students.findIndex((student) => {
//         return (student.id == Number.parseInt(id))
//     })

//     console.log(id,req.body,index);

//     if (index > 0) {
//        const std = students[index]
//        students.splice(index,1)
//         res.json(std)
//     } else {
//         res.status(404)
//         res.end()
//     }
//     console.log(id);
//     // res.json(id)
// })

app.delete('/api/students/:id',async(req,res)=>{
    try{
        const { id } = req.params;

        const taskdeleted=await Model.deleteOne({ _id: id });

        res.status(200).send({
            status: true,
            message: "record deleted successfully",
            data: taskdeleted
        });

    } catch (e) {
        res.status(400).send({
            status: false,
            message: "error:" + e.message,
        });
    }
   
});

