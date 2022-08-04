const express = require('express');
const cors = require('cors');

const ipfsClient = require('ipfs-http-client');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const { getScript } = require('./controllers/sketches.js');
const { saveImage } = require('./controllers/images.js');


const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});
const app = express();
const port = process.env.PORT || 8000;


const handleBars = handlebars.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'index',
});

app.engine('hbs', handleBars.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use(express.static('public'));

const tokenImages = {}

app.get('/token/:tokenId', async (req, res) => {
  const hash = await getScript(req.params.tokenId);
  
  if(!tokenImages[`img_${req.params.tokenId}`]){
    const buf = saveImage(hash, req.params.tokenId);
    const abc = await client.add(buf);

    tokenImages[`img_${req.params.tokenId}`] = `https://ipfs.infura.io/ipfs/${abc.cid}`;
  }

  res.render('piece', {
    scriptName: `mySketch.js`,
  });
});

app.get('/metadata/:tokenId', async (req, res) => {

  res.json({
    name: "MyGenerativeArt",
    description: "some description",
    image: tokenImages[`img_${req.params.tokenId}`],
    external_url: `https://gen-art-api.herokuapp.com/token/${req.params.tokenId}`,
    animation_url: `https://gen-art-api.herokuapp.com/token/${req.params.tokenId}`,
  });
});

app.get('*', (req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
