const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// set default port to env var PORT
// or use port 3000 as default
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
});

app.set('view engine', 'hbs');

// app.use middleware integration for writing req.method and req.originalUrl
// to server.log file.
// with the next() call, execution continue further.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.originalUrl}`

  console.log(``);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
})

// In the middleware func below, there is no next() funct
// => code execution stop here!
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// });

// Tells express where to start
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('home.hbs', { // inject partial home.hbs
    pageTitle: 'Home page',
    welcomeMsg: 'Welcome to the ExpressJS html page',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects'
  });
});

// bad request - send back json with error message
app.get('/oupps', (req, res) => {
  res.send({
    errorTxt: 'Data not found',
    errorNr: 204,
    isError: true
  });
});

// open the browser on port 3000 and display a msg to the console.
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
