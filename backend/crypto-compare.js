const axios = require('axios');
const TIME_DIFF = -1 * 4 * 60 * 60;

const api_key = '017e724e6a6b3da9861ae43054999fbb4675b766f25f7ece6608c847d7464323';
const base_url = 'https://min-api.cryptocompare.com/data/price'
const half_url = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,ETH,LTC';
const full_url = half_url + '&api_key=' + api_key;

get_crypto_prices =  async function () {
    const result = await axios({
        method: 'get',
        url :'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,ETH,LTC&api_key=017e724e6a6b3da9861ae43054999fbb4675b766f25f7ece6608c847d7464323',
    });
    let gmt = new Date(result['headers']['date']);
    let est_utc = Math.floor(gmt.getTime()/1000) + TIME_DIFF;
    var date = new Date(0);
    date.setUTCSeconds(Math.floor(gmt.getTime()/1000));
    console.log(date.toString());
    let date_string = date.toString();
    let  month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let full_date_string = year + ':' + ('0'+ month).slice(-2) + ':' + ('0' + day).slice(-2);
    let time_string = date_string.split(' ')[4];
    let seconds = Math.floor(parseFloat(time_string.split(':')[2]) / 15) * 15;
    time_string = time_string.split(':')[0] +':' + time_string.split(':')[1] + ':' + ('0' + seconds).slice(-2);
    //console.log(full_date_string);
    //console.log(time_string);
    let full_date_time = full_date_string + ' ' + time_string;
    return {
        price_data: {
            BTC_USD: result.data['USD'],
            ETH_USD: result.data['USD'] / result.data['ETH'],
            LTC_USD: result.data['USD'] / result.data['LTC'],
        },
        date: full_date_time};
}


module.exports.get_crypto_prices = get_crypto_prices;

