require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid')
let urlx = require('./URL.db.js');
let URLModel = urlx.URL;

mongoose.connect(process.env.MONGO_URI, {userNewUrlParser: true, useUnifiedTopology:true});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const isValidUrl = urlString=> {
      try { 
        let regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
      	return regex.test(urlString);
      }
      catch(e){ 
      	return false; 
      }
  }

app.post('/api/shorturl', async (req, res) => {
  const long_url = req.body.url;
  
  if (!isValidUrl(long_url)){
    return res.json({error:"invalid url"})
  }
  
  try {
    let url = await URLModel.findOne({
    long_url
  });

  if (url) {
    res.json(url);
  } else {
    url = new URLModel(
      {original_url: req.body.url,                               short_url: shortid.generate()
      });
    await url.save();
    }
    res.json(url);
  }
  catch(e){
    res.json({error:e});
  }
  
  
})

app.get('/api/shorturl/:url', async (req, res) => {
  url_param = req.params.url;
  let url = await URLModel.findOne({short_url: url_param});
  if(url){
    res.redirect(url.original_url);
  } else {
    res.json({error: 'No url founded'})
  }

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


