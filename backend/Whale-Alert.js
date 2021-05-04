const axios = require('axios');

const API_KEY = 'p6UxMp3lXXAS0IQrvojjzEJZrsQ3XJsI';

const base_url = 'https://api.whale-alert.io/v1/transactions/';


Date.prototype.getUnixTime = function() {return Math.floor(this.getTime()/1000);}
if (!Date.now) Date.now = function() {return new Date();}
Date.time = function() {return Date.now().getUnixTime();}

get_whale_transactions = async function(currency, min_value) {
    let end = Math.floor(Date.now() / 1000) ;
    let start = end - 3600;
    let limit = 100;
    let go_url = base_url + '?api_key='+API_KEY+'&min_value='+min_value+'&start='+start+'&currency='+currency;


    return new Promise(function(resolve, reject) {
        axios({
            method:'get',
            url:go_url,
        }).then((response) => resolve(response)).catch((err) => {
            console.log(err);
            return reject(err);
        });
    })

}

get_top_ten = async function(currency, min_value) {
    return new Promise(function(resolve, reject) {
        get_whale_transactions(currency, min_value).then((response) => {
            if (response.data.count == 0) {
                reject('0');
            }
            let data = response.data;
            let transaction_list = data.transactions;
            let length = transaction_list.map((element) => 1).reduce((accumulator, sum) => sum+accumulator);
            if (length <= 100 && length >= 10) { 
                let sorted = transaction_list.sort((ele1, ele2) => ele2.amount_usd - ele1.amount_usd);
                let prices_sorted = sorted.map((element) => element.amount_usd);
                let top_ten = sorted.slice(0,10);
                return resolve(top_ten);
            }
        });
    })

}

module.exports.get_top_ten = get_top_ten;