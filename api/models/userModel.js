const validator = require('validator')
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    password: {
        type: String, 
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }, 
    access: {
        type: Array,
        required: true
    }
})

userSchema.statics.signup = async function (email, password, name, position, access) {

    if (!email || !password) {
        throw Error('All fields are required.')
    }
    console.log(email)
    if (!validator.isEmail(email)) {
        throw Error('Invalid email')
    }

    if (password.length < 6) {
        throw Error('Password must be 7 characters or greater')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash, name, position, access })
    return user
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields are required')
    }

    if (!validator.isEmail(email)) {
        throw Error('Invalid email')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Account with email does not exist')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)