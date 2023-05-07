const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
}

//login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.login(email, password);
        const id = user._id;
        const token = createToken(id);
        const fname = user.fname;
        const lname = user.lname;
        res.status(200).json({ id, email, fname, lname, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

//signup user
const signupUser = async (req, res) => {

    const { fname, lname, email, password, confirmPassword } = req.body;

    try {
        const user = await User.signup(fname, lname, email, password, confirmPassword);
        const id = user._id;
        const token = createToken(id);
        res.status(200).json({ id, email, fname, lname, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

//update user
const updateUser = async (req, res) => {

    const id = req.params.id;

    const {fname, lname, email, password, confirmPassword } = req.body;

    if(email){
        
        if (!validator.isEmail(email)) {
            res.status(400).json({error: "Invalid email!"});
            return;
        }
    
        const exists = await User.findOne({ email });
        if (exists) {
            res.status(400).json({error: "Email already exists!"});
            return;
        }
    }
    
    var hash;

    if (password) {
        if(password !== confirmPassword){
            res.status(400).json({message: "Passwords do not match!"});
            return;
        }

        if (!validator.isStrongPassword(password)) {
            res.status(400).json({error: "Password not strong enough!"});
            return;
        }
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
    }

    try {
        const user = await User.findOneAndUpdate({ _id: id }, { fname, lname, email, password: hash });
        res.status(200).json({ fname, lname, email })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//get user
const getUser = async (req,res) => {

    const id = req.params.id;

    try {
        const user = await User.findOne({ _id: id });
        res.status(200).json({user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = { loginUser, signupUser, updateUser, getUser };