require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const reportRoutes = require('./routes/reports')
const projectRoutes = require('./routes/project')
const userRoutes = require('./routes/user')
const equipmentsRoutes = require('./routes/equipments')

// express app 
app = express()

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/users', userRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/equipments', equipmentsRoutes)


// Connecting to MongoDB database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to db at port:", process.env.PORT)
        })
    })
    .catch(err => console.log(err))
