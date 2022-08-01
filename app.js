const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const { getScript } = require('./controllers/sketches.js');

const app = express();
const port = process.env.PORT || 8000;

const handleBars = handlebars.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: __dirname + '/views/partials/',
});

app.engine('hbs', handleBars.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/token/:route', async (req, res) => {
  await getScript(req.params.route);
  res.render('piece', {
    scriptName: `mySketch.js`
  });
});

app.get('/img/:route', async (req, res) => {
  res.sendFile("./images/one.jpeg", { root: __dirname });
});

app.get('/metadata/:route', async (req, res) => {

  res.json({
    name: "ABC",
    description: "cksjdncksdnckjsnc",
    animation_url: `https://gen-art-api.herokuapp.com/token/${req.params.route}`,
  });
});

app.get('*', (req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
