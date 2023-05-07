const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        required: true,
        type: String
    },
    lname: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
})

//static signup method
userSchema.statics.signup = async function (fname,lname,email,password,confirmPassword) {

    //validation
    if (!email || !password || !fname || !lname || !password || !confirmPassword) {
        throw Error("All fields must be filled!");
    }

    if(password !== confirmPassword) {
        throw Error("Passwords do not match!");
    }

    if(!validator.isEmail(email)){
        throw Error("Invalid email!");
    }

    if(!validator.isStrongPassword(password)){
        throw Error("Password not strong enough!");
    }

    const exists = await this.findOne({email});
    if(exists) {
        throw Error("Email already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    const user = await this.create({fname,lname,email,password: hash});

    return user;
}

//static login method
userSchema.statics.login = async function (email,password) {

    const user = await this.findOne({email})

    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    if(!user) {
        throw Error("Incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
        throw Error("Incorrect email or password");
    }

    return user;
}


module.exports = mongoose.model('User', userSchema);