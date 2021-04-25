const my_sql = require('mysql');
const crypto_compare = require('./crypto-compare');

let con = my_sql.createConnection({
    host: "localhost",
    user: "root",
    password: 'Bengals12@#$',
    insecureAuth:true
});

con.connect(function(err) {
    if (err){ throw err}; 
    console.log('Connected to mysql database');
    setInterval(minute_update, 60*1000);
});

minute_update = async function() {
    con.query('USE crypto_prices;');
    crypto_compare.get_crypto_prices().then((result) => {
        let date_obj = result.date.split(' ');
        let day = date_obj[1] + '-' + date_obj[2] + '-' + date_obj[3];
        let time = date_obj[4].split(':')[0] + ':' + date_obj[4].split(':')[1];
        let final_date_time = day + '#' + time;
        let values = '(' + "'" + final_date_time + "'" + ',' + result.price_data.BTC_USD + ',' + result.price_data.ETH_USD + ',' + result.price_data.LTC_USD + ')';
        let insert = "INSERT INTO coin_prices_data (date_time, btc_usd, eth_usd, ltc_usd) VALUES " + values;
        con.query(insert, function(err, result) {
            if (err) throw err;
            console.log("Latest price record inserted");
        });
    }).catch((error) => {console.log(error)});
}

get_latest_prices = async function() {
    console.log('Getting latest record in crypto_prices');
    con.query('USE crypto_prices;');
    return new Promise(function(resolve, reject) {
        let sql_query = "SELECT * FROM coin_prices_data ORDER BY id DESC LIMIT 15;";
        con.query(sql_query, function(err, rows, fields) {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

get_portfolio_by_id = async function(portfolio_id) {
    console.log('Getting latest portfolio record');
    con.query('USE crypto_prices;');
    return new Promise(function(resolve, reject) {
        let sql_query = `SELECT * FROM portfolios WHERE portfolio_id = ${portfolio_id};`;
        con.query(sql_query, function(err, rows, fields) {
            if (err) return reject(err);
            resolve(rows);
        })
    });
}

get_portfolio_value = async function(portfolio_id) {
    console.log(`Getting latest portfolio value for portfolio ${portfolio_id}`);
    get_latest_prices().then((latest_prices) => {
        get_portfolio_by_id(portfolio_id).then((current_portfolio) => {
            latest_prices = latest_prices[0];
            current_portfolio = current_portfolio[0];
            let btc_total = current_portfolio['btc_amt'] * latest_prices['btc_usd'];
            let eth_total = current_portfolio['eth_amt'] * latest_prices['eth_usd'];
            let ltc_total = current_portfolio['ltc_amt'] * latest_prices['ltc_usd'];
            let total = current_portfolio['usd_amt'] + btc_total + eth_total + ltc_total;
            return new Promise(function(resolve, reject) {
                resolve(total);
            });
        }).catch((error) => console.log(error));
    }).catch((error) => console.log(error));
}

make_transaction = async function(portfolio_id, t_o) {
    console.log('Starting a new transaction');
    con.query('USE crypto_prices;');
    get_latest_prices().then((latest_prices) => {
        get_portfolio_by_id(portfolio_id).then((current_portfolio) => {
            latest_prices = latest_prices[0];
            current_portfolio = current_portfolio[0];
            let port_tick = t_o.ticker.toLowerCase() + '_amt';
            let price_tick = t_o.ticker.toLowerCase() + '_usd';
            let sql_query = '';
            if (t_o.is_buy) {
                let cost = t_o.amt * latest_prices[price_tick];
                if (current_portfolio.usd_amt - cost < 0) {
                    throw 'Invalid Transaction';
                } else {
                let new_ticker_amt = current_portfolio[port_tick] + t_o.amt;
                let new_usd_amt = current_portfolio['usd_amt'] - cost;
                sql_query =  `UPDATE portfolios SET usd_amt = ${new_usd_amt}, ${port_tick}=${new_ticker_amt}
                    WHERE portfolio_id=${portfolio_id};`;
                }
                
            } else {
                let sale_amt = t_o.amt * latest_prices[price_tick];
                if (current_portfolio[port_tick] - t_o.amt < 0){
                    throw 'Invalid transaction';
                } else {
                    let new_ticker_amt = current_portfolio[port_tick] - t_o.amt;
                    let new_usd_amt = current_portfolio['usd_amt'] + sale_amt;
                    sql_query = `UPDATE portfolios SET usd_amt = ${new_usd_amt}, ${port_tick}=${new_ticker_amt}
                        WHERE portfolio_id=${portfolio_id};`;
                }
            }
            console.log(sql_query);
            return new Promise(function(resolve, reject) {
                con.query(sql_query, function(err, rows, fields) {
                if (err) return reject(err);
                    resolve(rows);
                });
            });
        }).catch((err) => console.log(error));
    }).catch((err) => console.log(error));
}
module.exports.make_transaction = make_transaction;
module.exports.get_portfolio_by_id = get_portfolio_by_id;
module.exports.get_latest_prices = get_latest_prices;
module.exports.get_portfolio_value = get_portfolio_value;
module.exports.minute_update = minute_update;