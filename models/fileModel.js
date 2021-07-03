var mongoose = require('mongoose');//schema
var fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String
    },
    img: {
        type: Buffer,
        contentType: String
    }
});

mongoose.set('useCreateIndex', true);

// Compile model from schema
module.exports = mongoose.model('fileModel', fileSchema);

