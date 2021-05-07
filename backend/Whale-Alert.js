const axios = require('axios');

const API_KEY = 'p6UxMp3lXXAS0IQrvojjzEJZrsQ3XJsI';

const base_url = 'https://api.whale-alert.io/v1/transactions/';


Date.prototype.getUnixTime = function() {return Math.floor(this.getTime()/1000);}
if (!Date.now) Date.now = function() {return new Date();}
Date.time = function() {return Date.now().getUnixTime();}

get_whale_transactions = async function(currency, min_value) {
    let end = Math.floor(Date.now() / 1000) ;
    let start = end - 3000;
    let limit = 100;
    let go_url = base_url + '?api_key='+API_KEY+'&min_value='+min_value+'&start='+start+'&currency='+currency+'&limit='+limit;


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
            let sorted = transaction_list.sort(function(ele1,ele2) {
                return ele2.amount-ele1.amount;
            });
            let whale_objs = sorted.map((element) => {
                let date_time = new Date(0);
                date_time.setUTCSeconds(element.timestamp);
                let str = `0${date_time.getMonth() + 1}:${date_time.toString().split(' ')[2]}:${date_time.getFullYear()} ` + `${date_time.toString().split(' ')[4]}`;
                return {
                    btc_amt: element.amount,
                    usd_amt: element.amount_usd,
                    date_time : str,
                    date: `0${date_time.getMonth() + 1}:${date_time.toString().split(' ')[2]}:${date_time.getFullYear()}`,
                    time:`${date_time.toString().split(' ')[4]}`,
                };
            });

            return resolve(whale_objs.slice(0,5));
        }).catch((error) => console.log(error));
    });
}

module.exports.get_top_ten = get_top_ten;