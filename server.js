// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


const parseDate = ( req, res, next ) => {

  let regExp = /^[0-9]*$/

  const requestedDate = ( req.params.date ) ? req.params.date : 0

  let unix;
  let utc;
  let error;

  if( regExp.test( requestedDate ) && requestedDate !== 0 ) {
    let timestamp = parseInt(requestedDate)

    unix = timestamp
    let dateObj = new Date( timestamp )
    utc = dateObj.toUTCString()
    
  } else if( requestedDate !== 0 ) {

    unix = Date.parse( requestedDate )
    if( ! isNaN( unix ) ) {
      utc = new Date( requestedDate )
      utc = utc.toUTCString()
    } else {
      error = new Date( requestedDate )
    }

  } else {

    // console.log( Date.now() )
    unix = Date.now()
    utc = new Date()
  }

  req.unix = unix
  req.utc = utc
  req.invalidInput = error

  next()
}

// your first API endpoint... 
app.get("/api/:date?", parseDate, function (req, res) {
  // console.log( req.params.date )

  let output;

  if( req.invalidInput ) {
    output = Object.assign({}, {error: String(req.invalidInput)})
  } else {
    output = Object.assign({}, {unix: req.unix, utc: req.utc})
  }

  res.json( output );
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
