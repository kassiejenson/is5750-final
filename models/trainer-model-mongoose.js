const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainerSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: [50, 'Name must be 50 or less characters.']
    },
    image: {
        type: String,
        required: true,
        validate:{
            validator: (value) => /\.(jpe?g|png)$/i.test(value),
            message: 'Image must be a .jpg, .jpeg, or .png file'
        }
    },
    bio: {
        type: String,
        required: true
    },
    expertise: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Trainer', trainerSchema);
