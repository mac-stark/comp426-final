const express = require('express');
const app = express();
const db = require('./db');

const cors = require('cors');
app.use(cors({origin: "http://localhost:3000"}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', function(req, res) {
    console.log('Received a main page request');
    res.send('Hello World');
});
app.get('/currentprices', (req, res) => {
    console.log('Received a request for latest prices');
    db.get_latest_prices().then((response) => res.send(response)).catch((error) => console.log('/currentprices' + error));
});
app.get('/portfolio/:id', (req, res) => {
    db.get_portfolio_by_id(req.params.id).then((response) => res.send(res.json(response))).catch((error) => console.log('/portfolio/:id' + error));
});
app.get('/portfolio_value/:id', (req, res) => {
    db.get_portfolio_value(req.params.id).then((response) => res.json(response)).catch((error) => console.log('/portfolio_value/:id' + error));
});
app.put('/transaction/:id/:ticker/:amt/:isbuy', (req, res) => {
    let t_o = {ticker: req.params.ticker, amt: req.params.amt, is_buy: req.params.isbuy};
    db.make_transaction(req.params.id, t_o).then((response) => res.json(response)).catch((error) => console.log('make_transaction' + error));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log('Example app running on Port 3000')});




//db.get_latest_prices().then((response) => console.log(response));
//db.get_portfolio_by_id(1).then((response)=> console.log(response));
//let transaction_object = {ticker: 'ETH', amt: 1.2, is_buy: true};
//let transaction_object_2 = {ticker: 'ETH', amt:1.2, is_buy:false};
//db.make_transaction(1, transaction_object).then((response) => console.log(response))catch((error) => console.log(error));
//db.make_transaction(1, transaction_object_2).then((response) => console.log(response)).catch((error) => console.log(error));