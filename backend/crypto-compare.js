const axios = require('axios');
const TIME_DIFF = -1 *4 * 60 * 60 * 1000;

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
    let utc = gmt.getTime() + TIME_DIFF;
    let est = new Date(utc);
    return {
        price_data: {
            BTC_USD: result.data['USD'],
            ETH_USD: result.data['USD'] / result.data['ETH'],
            LTC_USD: result.data['USD'] / result.data['LTC'],
        },
        date: result['headers']['date']};
}

module.exports.get_crypto_prices = get_crypto_prices;

