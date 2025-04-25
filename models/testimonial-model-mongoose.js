const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: [50, 'Name must be 50 or less characters.']
    },
    title: {
        type: String,
        required: true,
        maxLength: [100, 'Title must be 100 or less characters.']
    },
    image: {
        type: String,
        required: true,
        validate:{
            validator: (value) => /\.(jpe?g|png)$/i.test(value),
            message: 'Image must be a .jpg, .jpeg, or .png file'
        }
    },
    testimonial: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
})

module.exports = mongoose.model('Testimonial', testimonialSchema);
