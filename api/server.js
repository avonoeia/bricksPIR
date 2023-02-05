require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const reportRoutes = require('./routes/reports')
const projectRoutes = require('./routes/project')
const userRoutes = require('./routes/user')

// express app 
app = express()

// middleware
app.use(express.json())

// routes
app.use('/api/users', userRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/projects', projectRoutes)


// Connecting to MongoDB database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to db at port:", process.env.PORT)
        })
    })
    .catch(err => console.log(err))
