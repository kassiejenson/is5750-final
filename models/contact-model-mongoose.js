const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        maxLength: [50, 'Name must be 50 or less characters.']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        validate:{
            validator: (value) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);},
            message: (props) => `${props.value} is not a valid email address!`
        }
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject.']
    },
    message: {
        type: String,
        required: [true, 'Please add a message.']
    },
    postDate:{
        type: Date,
        default: Date.now
    },
    response: {
        type: String,
        default: null
    },
    responseDate: {
        type: Date,
        default: null
    } 
})

module.exports = mongoose.model('Contact', contactSchema);
