const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const PORT = 3000;
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

// Handle email sending
app.post('/send-email', (req, res) => {
    const {recipient, subject, message} = req.body; // Destructuring

    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Environment variables EMAIL_USER and/or EMAIL_PASS are not set");
        return res.status(500).send('Email configuration error. Please check server logs.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: recipient, 
        subject: subject, 
        text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.error("Error occurred", error);
            res.status(500).send('Error in sending email. Please try again later.'); } else{
                console.log('Email sent:', info.response);
                res.send('Email sent successfully');
            }
    });
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
