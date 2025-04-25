const mongoose = require('mongoose');
const Course = require('./course-model-mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        validate:{
            validator: (value) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);},
            message: (props) => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password should be at least 6 characters"]
    },
    roles: {
        type: [String],
        default: ["user"]
    },
    courses: {
        type: [Schema.Types.ObjectId],
        ref: 'Course'
    }
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
})

userSchema.methods.validatePassword = function (passwordEntered) {
    return bcrypt.compare(passwordEntered, this.password);
}

module.exports = mongoose.model('User', userSchema);
