const User = require('../models/users-model')
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var moment = require("moment")
const config = require("./auth.config");

createUser = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must enter user details',
        })
    }

    const user = new User(body)
    user.password = bcrypt.hashSync(req.body.password, 8)
    user.status = "active"

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
}

updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: body.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        user.first_name = body.first_name;
        user.last_name = body.last_name;
        user.email = body.email;
        user.password = bcrypt.hashSync(req.body.password, 8);
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

updateUserStatus = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: body.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        user.status = body.status;
        var date_now = moment().local().format('YYYY-MM-DD HH:mm:ss');
        user.last_logged_date = date_now;
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })

    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

loginUser = (req, res) => {
    console.log("REQ BODY ++++++++++ ", req.body.email)
    try {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err || !user) {
                return res.status(404).json({
                    err,
                    message: 'User not found!',
                })
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).json({
                    accessToken: null,
                    message: "Invalid Password!"
                })
            }

            if (user.status == "inactive") {
                return res.status(403).json({
                    accessToken: null,
                    message: "Your account is temporarily disabled due to inactivity! Please contact the administrator to reactivate your account"
                })
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var date_now = moment().local().format('YYYY-MM-DD HH:mm:ss');
            user.last_logged_date = date_now;
            user
                .save()
                .then(() => {
                    return res.status(200).json({
                        id: user._id,
                        type: user.user_type,
                        accessToken: token
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'There was an error when logging in!',
                    })
                })
        })
    }
    catch(error){
        return res.status(404).json({
            err,
            message: 'User not found!',
        })
    }
}

getInactiveUsers =  async (req, res) => {
    var minutes = req.params.minutes;
    var date = moment().subtract(minutes, 'minutes');
    console.log("date ++++++++++" , date)

    await User.find({
        status : 'active',
        last_logged_date: {
            $lt: date
        }
    }, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        users.forEach(user => {
            user.status = 'inactive'
            user.save();
        });

        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

module.exports = {
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    getUsers,
    getUserById,
    loginUser,
    getInactiveUsers,
}