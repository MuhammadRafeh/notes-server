var mongoose = require('mongoose');//schema
var authSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

mongoose.set('useCreateIndex', true);

// Compile model from schema
module.exports = mongoose.model('AuthModel', authSchema);

