const express = require('express');
const app = express();
const db = require('./db')

const cors = require('cors');
app.use(cors);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/currentprices', (req, res) => {
    db.get_latest_prices().then((response) => response);
});
//const port = process.env.PORT || 3000;

//app.listen(port, () => {console.log('Example app running on Port 3000')});

db.get_latest_prices().then((response) => console.log(response));

db.get_portfolio_by_id(1).then((response)=> console.log(response));

let transaction_object = {
    ticker: 'ETH',
    amt: 1.2,
    is_buy: true
};
let transaction_object_2 = {
    ticker: 'ETH',
    amt:1.2,
    is_buy:false
};

//db.make_transaction(1, transaction_object).then((response) => console.log(response))catch((error) => console.log(error));
db.make_transaction(1, transaction_object_2).then((response) => console.log(response)).catch((error) => console.log(error));