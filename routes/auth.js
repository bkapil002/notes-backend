const express = require('express');
const routes = express.Router();
const User = require('../modules/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../functiones/fetchuser')
const JWD_point = "hwlobtahm"

// route 1 -------------------------->

routes.post('/asink', [
    body('name', "enter your name").isLength({ min: 3 }),
    body('email', "enter your email").isEmail(),
    body('password', "enter 6 digits password").isLength({ min: 6 })
], async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ sucess:false , errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ sucess:false,  error: "this already exists" });
        }
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        const data = {
            user : {
               id : user.id
            }
        }
       
        const token = jwt.sign(data ,JWD_point )
        console.log(token)
        res.json( user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// router  2  ----------



routes.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password is required").exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email address, this is not a registered user" });
        }


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, error: "Incorrect password, please try again" });
        }

     
        const payload = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(payload, JWD_point);

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({  error: 'Internal Server Error' });
    }
});


// route 3 ------------------------

routes.post('/userdata', fetchuser, async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = routes;
