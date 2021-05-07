const express = require('express');
const app = express();
const db = require('./db');
const whale = require('./Whale-Alert');

const is_deploy = true;
const origin_cors = is_deploy? "https://mac-stark.github.io/*": "http://localhost:3001/";
const cors = require('cors');
app.use(cors()); 

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', function(req, res) {
    console.log('Received a main page request');
    res.send('<!DOCTYPE html> <html> <head><title>LAN network experiment</title></head><body>Hey Dad. <img src="https://i.guim.co.uk/img/media/02088fb2247b13df646907d47f552dc69a236bc7/0_748_3235_1940/master/3235.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=172ccbaa7535c9e16d0455138d20a07c" alt="monke"></body></html>');
});
app.get('/currentprices', (req, res) => {
    console.log('Received a request for latest prices');
    db.get_latest_prices().then((response) => res.send(response)).catch((error) => console.log('/currentprices' + error));
});
app.get('/portfolio/:id', (req, res) => {
    db.get_portfolio_by_id(req.params.id).then((response) => res.send(res.json(response))).catch((error) => console.log('/portfolio/:id' + error));
});
app.get('/portfolio_value/:id', (req, res) => {
    db.get_portfolio_value(req.params.id).then((response) => res.send(res.json(response))).catch((error) => console.log('/portfolio_value/:id' + error));
});
app.get('/login/:user/:pass' , (req, res) => {
    db.login(req.params.user, req.params.pass).then((response) => {
        let resp_obj = {response:response,username:req.params.user};
        res.send(resp_obj);
    }).catch((error) => {
        console.log(error);
        if (error == 'Incorrect Password') {
            res.status(400);
            res.send(res.json('Username recognized, Incorrect Password'));
        }
        res.status(400);
        res.send(res.json('Login Error: Unknown Username'));
        console.log('/login/user/pass' + error)
    });
});
app.get('/createuser/:user/:pass', (req,res) => {
    console.log('New user creation');
    db.create_user(req.params.user, req.params.pass).then((response) => {
        console.log(response);
        res.send(res.json(response));
    }).catch((error) => {
        res.status(400);
        res.send(error);
        console.log('/createuser/user/pass' + error)
    });
})
app.post('/transaction/:id/:ticker/:amt/:isbuy', (req, res) => {
    let t_o = {ticker: req.params.ticker, amt: req.params.amt, is_buy: req.params.isbuy};
    console.log(t_o);
    db.make_transaction(req.params.id, t_o).then((response) => {
        if (response == undefined) {
            res.status(400);
            res.send('Invalid Transaction-Insufficient Funds');
            console.log('This error was sent');
            return;
        }
        res.send(response);
    }).catch((error) => {
            console.log('sending back error');
            res.status(400);
            res.send('Invalid Transaction');
            console.log('make_transaction' + error);
    });
});

app.get('/transactions/whales/btc', (req, res) => {
    console.log('Received a Whale request');
    db.get_whale_list().then((response) => {
        console.log(response);
        res.send(response);
    }).catch((error) => console.log(error));
});


const port = process.env.PORT || 3000;

app.listen(port, () => {console.log('Example app running on Port ' + port)});



