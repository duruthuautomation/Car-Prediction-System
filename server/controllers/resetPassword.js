const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Function to generate a unique reset password token
function generateResetPasswordToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Function to send a reset password link to the user's email
async function sendResetPasswordEmail(user) {
    // Generate a unique reset password token
    const resetPasswordToken = generateResetPasswordToken();

    // Update the user's reset password token and expiration time in the database
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save();

    // Create a nodemailer transporter object with your SMTP credentials
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gayashantrox@gmail.com',
            pass: 'uxujwdngbbfhzttv',
        }
    });

    // Set the email options
    const mailOptions = {
        from: 'gayashantrox@gmail.com',
        to: user.email,
        subject: 'Password Reset Request',
        text: `Hi ${user.fname},\n\nYou are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease click on the following link or paste it into your browser to reset your password:\n\nhttp://localhost:3000/reset/${resetPasswordToken}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nBest,\nYour Website Team`
    };

    // Send the email
    const response = await transporter.sendMail(mailOptions);
    console.log(response);
}

// Function to reset the user's password
async function resetPassword(resetPasswordToken, hash) {
    // Find the user with the matching reset password token and expiration time
    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
    });

    if (!user) {
        throw new Error('Password reset token is invalid or has expired');
    }

    // Update the user's password and reset password token and expiration time in the database
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return 'Password reset successful';
}

// Example usage
async function forgotPassword(req, res) {
    const { userEmail } = req.body;
    try {
        const user = await User.findOne({ email: userEmail });
        await sendResetPasswordEmail(user);
        res.status(200).json({ email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// When the user clicks on the reset password link in the email, they will be directed to a reset password page with a form that allows them to enter a new password. You can use the following code to handle the form submission:
async function changePassword(req, res) {

    try {
        const resetPasswordToken = req.params.resetPasswordToken;
        const newPassword = req.body.newPassword;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        const result = await resetPassword(resetPasswordToken, hash);
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { changePassword, forgotPassword }