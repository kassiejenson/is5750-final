const slugify = require("slugify");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: [50, 'Title must be 50 or less characters.'],
        set: function(value) {
            this.slug = slugify(value, {lower: true, trim: true})
            return value;
        }
    },
    image: {
        type: String,
        required: true,
        validate:{
            validator: (value) => { return /\.(jpg|jpeg|png)$/i.test(value)},
            message: 'Image must be a .jpg, .jpeg, or .png file'
        }
    },
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    registrants: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0
    },
    trainer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer'
    },
    slug: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Course', courseSchema);