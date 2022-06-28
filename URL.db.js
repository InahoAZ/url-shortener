let mongoose = require('mongoose');

let URLSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
})

let URL = mongoose.model('URL', URLSchema);
module.exports = {URL: URL};