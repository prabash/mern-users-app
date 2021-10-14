const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        first_name: { type: String, required: "First Name is not provided" },
        last_name: { type: String, required: "Last Name is not provided" },
        email: { type: String, required: "Email is not provided" },
        password: { type: String, required: "Password is not provided" },
        user_type: { type: String, required: "User type is not provided" },
        status: { type: String },
        last_logged_date: { type: Date },
    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User)