const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: [50, 'Title must be 50 or less characters.']
    },
    image: {
        type: String,
        required: true,
        validate:{
            validator: (value) =>  /\.(jpe?g|png)$/i.test(value),
            message: 'Image must be a .jpg, .jpeg, or .png file'
        }
    },
    summary: {
        type: String,
        required: true,
        maxLength: [350, 'Title must be 350 or less characters.']
    },
    date: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Event', eventSchema);
