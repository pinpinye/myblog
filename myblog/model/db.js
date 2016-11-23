// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
// Create a schema
var articleSchema = new mongoose.Schema({
    tittle: String,
    author: String,
    summary: String,
    content: String,
    tag: [],
    updated: { type: Date, default: Date.now },
    favorite: { type: Number, default: 0 },
    comment: [{
        comment: String,
        date: Date,
        name: String,
        day: String
    }],
    day: String
});
// Create a model based on the schema
module.exports = mongoose.model('article', articleSchema);
