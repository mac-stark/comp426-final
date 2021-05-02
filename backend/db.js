const my_sql = require('mysql');
const crypto_compare = require('./crypto-compare');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
let con = my_sql.createConnection({
    host: "localhost",
    user: "root",
    password: 'Bengals12@#$',
    insecureAuth: true
});

con.connect(function (err) {
    if (err) { throw err };
    console.log('Connected to mysql database');
    setInterval(minute_update, 15 * 1000);
});

minute_update = async function () {
    con.query('USE crypto_schema;');
    crypto_compare.get_crypto_prices().then((result) => {
        let date_obj = result.date.split(' ');
        let month = date_obj[2] == 'Apr' ? '04' : '05';
        let finale_date = date_obj[3] + ':' + month + ':' + date_obj[1];
        let seconds = Math.floor(parseFloat(date_obj[4].split(':')[2]) / 15) * 15;
        let time = date_obj[4].split(':')[0] + ':' + date_obj[4].split(':')[1] + ':' + seconds;
        let final_date_time = finale_date + ' ' + time;
        let values = '(' + "'" + final_date_time + "'" + ',' + "'" + finale_date + "'" + ',' + "'" + time + "'" + ',' + result.price_data.BTC_USD + ',' + result.price_data.ETH_USD + ',' + result.price_data.LTC_USD + ')';
        let insert = "INSERT INTO coin_prices (date_time, date, time, btc_usd, eth_usd, ltc_usd) VALUES " + values;
        con.query(insert, function (err, result) {
            if (err) throw err;
            console.log("Latest price record inserted");
        });
        con.on('error', function(err) {
            console.log('Error - duplicate price entry into coin prices');
        });
    }).catch((error) => console.log(error));
}

get_latest_prices = async function () {
    console.log('Getting latest record in crypto_prices');
    con.query('USE crypto_schema;');
    return new Promise(function (resolve, reject) {
        let sql_query = "SELECT * FROM coin_prices ORDER BY id DESC LIMIT 120;";
        con.query(sql_query, function (err, rows, fields) {
            if (err) return reject(err);
            resolve(rows);
        });
        con.on('error', function(err) {
            reject('Database connection error');
        });
    });
}

get_portfolio_by_id = async function (portfolio_id) {
    console.log('Getting latest portfolio record');
    con.query('USE crypto_schema;');
    return new Promise(function (resolve, reject) {
        let sql_query = `SELECT * FROM portfolios WHERE portfolio_id = ${portfolio_id};`;
        con.query(sql_query, function (err, rows, fields) {
            if (err) return reject(err);
            resolve(rows);
        })
    });
}

get_portfolio_value = async function (portfolio_id) {
    console.log(`Getting latest portfolio value for portfolio ${portfolio_id}`);
    get_latest_prices().then((latest_prices) => {
        get_portfolio_by_id(portfolio_id).then((current_portfolio) => {
            latest_prices = latest_prices[0];
            current_portfolio = current_portfolio[0];
            let btc_total = current_portfolio['btc_amt'] * latest_prices['btc_usd'];
            let eth_total = current_portfolio['eth_amt'] * latest_prices['eth_usd'];
            let ltc_total = current_portfolio['ltc_amt'] * latest_prices['ltc_usd'];
            let total = current_portfolio['usd_amt'] + btc_total + eth_total + ltc_total;
            return new Promise(function (resolve, reject) {
                resolve(total);
            });
        }).catch((error) => console.log(error));
    }).catch((error) => console.log(error));
}

make_transaction = async function (portfolio_id, t_o) {
    console.log('Starting a new transaction');
    con.query('USE crypto_schema;');
    return new Promise(function (resolve, reject) {
        get_latest_prices().then((latest_prices) => {
            get_portfolio_by_id(portfolio_id).then((current_portfolio) => {
                latest_prices = latest_prices[0];
                current_portfolio = current_portfolio[0];
                let port_tick = t_o.ticker.toLowerCase() + '_amt';
                let price_tick = t_o.ticker.toLowerCase() + '_usd';
                let sql_query = '';
                if (t_o.is_buy == 'true') {
                    let cost = parseFloat(t_o.amt) * parseFloat(latest_prices[price_tick]);
                    if (parseFloat(current_portfolio.usd_amt) - parseFloat(cost) < 0) {
                        console.log('Throwing error')
                        throw new Error('Invalid transaction');
                    } else {
                        let new_ticker_amt = parseFloat(current_portfolio[port_tick]) + parseFloat(t_o.amt);
                        let new_usd_amt = parseFloat(current_portfolio['usd_amt']) - parseFloat(cost);
                        sql_query = `UPDATE portfolios SET usd_amt = ${new_usd_amt}, ${port_tick}=${new_ticker_amt}
                    WHERE portfolio_id=${portfolio_id};`;
                    }

                } else if (t_o.is_buy == 'false') {
                    let sale_amt = parseFloat(t_o.amt) * parseFloat(latest_prices[price_tick]);
                    if (parseFloat(current_portfolio[port_tick]) - parseFloat(t_o.amt) < 0) {
                        console.log('Throwing error');
                        throw new Error('Invalid transaction');
                    } else {
                        let new_ticker_amt = parseFloat(current_portfolio[port_tick]) - parseFloat(t_o.amt);
                        let new_usd_amt = parseFloat(current_portfolio['usd_amt']) + parseFloat(sale_amt);
                        sql_query = `UPDATE portfolios SET usd_amt = ${new_usd_amt}, ${port_tick}=${new_ticker_amt}
                        WHERE portfolio_id=${portfolio_id};`;
                    }
                }
                console.log(sql_query);
                con.query(sql_query, function (err, rows, fields) {
                    if (err) return reject(err);
                    con.query(`SELECT * FROM portfolios WHERE portfolio_id=${portfolio_id}`, function (err, new_rows, new_fields) {
                        if (err) return reject(err);
                        resolve(new_rows);
                    })
                });
                con.on('error', function(err) {
                    reject('Database Connection error');
                });
            });
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
}

login = async function (username, password) {
    con.query('USE crypto_schema;');
    let username_query = `SELECT * FROM users WHERE username = '${username}';`;
    return new Promise(function (resolve, reject) {
        con.query(username_query, function (err, rows) {
            if (err || rows == undefined) {
                return reject(err);
            } else {
                if (rows[0] == undefined) {
                    return reject(err);
                }
                console.log(rows[0].password);
                bcrypt.compare(password, rows[0].password, function (err, res) {
                    console.log(res);
                    if (!res) {
                        return reject('Incorrect Password');
                    } else {
                        con.query('USE crypto_schema;');
                        let portfolio_query = `SELECT * from portfolios WHERE portfolio_id=${rows[0]['id']}`;
                        con.query(portfolio_query, function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            } else {
                                console.log(rows);
                                resolve(rows);
                            }
                        })
                    }
                })

            }
        })
    })
}

create_user = async function (username, password) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                return reject(err);
            } else {
                bcrypt.hash(password, salt, (function (err, hash) {
                    if (err) {
                        return reject(err);
                    } else {
                        console.log(password);
                        console.log(hash);
                        let create_user_sql = `INSERT INTO users (username, password, salt) VALUES ('${username}', '${hash}', '${saltRounds}')`;
                        con.query('USE crypto_schema;');
                    
                        con.query(create_user_sql, function (err, result) {
                            if (err) {
                                return reject(err);
                            } else {
                                let user_portfolio_sql = `INSERT INTO user_portfolios (user_id, portfolio_id) VALUES (${result.insertId}, ${result.insertId}); `;
                                console.log(user_portfolio_sql);
                                con.query(user_portfolio_sql, function(err, rows, fields) {
                                    if (err) {
                                        return reject(err);
                                    } else {
                                        console.log(result);
                                        console.log(result.insertId);
                                        console.log(parseFloat(result.insertId));
                                        console.log(parseInt(result.insertId));
                                        let portfolio_sql = `INSERT INTO portfolios (portfolio_id, usd_amt, btc_amt, eth_amt, ltc_amt) VALUES (${result.insertId}, 100000, 0, 0, 0);`;
                                        console.log(portfolio_sql);
                                        con.query(portfolio_sql, function(err, result) {
                                            if (err) {
                                                return reject(err);
                                            } else {
                                                resolve(result);
                                            }
                                        })
                                    }
                                })
                            }
                        });
                        
                    }
                }));
            }
        })
    });
}
const first_pass = 'password123';


module.exports.make_transaction = make_transaction;
module.exports.get_portfolio_by_id = get_portfolio_by_id;
module.exports.get_latest_prices = get_latest_prices;
module.exports.get_portfolio_value = get_portfolio_value;
module.exports.minute_update = minute_update;
module.exports.create_user = create_user;
module.exports.login = login;