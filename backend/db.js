const connect = {host: "us-cdbr-east-03.cleardb.com", port: 3306, user: "bd043dd882d422", password: '11767509', database: 'heroku_b91f95b8d32efda',};





const my_sql = require('mysql');
const crypto_compare = require('./crypto-compare');
const bcrypt = require('bcryptjs');
const { get_top_ten } = require('./Whale-Alert');
const saltRounds = 10;
const whale = require('./Whale-Alert');

const is_deploy = true;




console.log(connect);
let con = my_sql.createConnection(connect);

con.connect(function (err) {
    if (err) { throw err };
    console.log('Connected to mysql database');
    
    setInterval(() => {
        minute_update().then((response) => {

        }).catch((err) =>console.log(err));
    }, 15 * 1000);

    setInterval(() => {
        whale_update().then((response) => {
            console.log('Latest Whale records inserted');
        }).catch((error) => console.log(error));
    }, 5 * 60 * 1000);
}); 


whale_update = async function() {
    return new Promise(function(resolve, reject) {
        con.query('USE heroku_b91f95b8d32efda;');
        //con.query('USE crypto_schema;');
        get_top_ten('btc',5000000).then((response) => {
            let values = response.map((element) => `('${element.date_time}', ${element.btc_amt}, ${element.usd_amt}, '${element.date}', '${element.time}')`);
            let total_query = values.join(',')
            let insert_sql = `INSERT IGNORE INTO whales (date_time, btc_amt, usd_amt, date, time) VALUES ${total_query};`;
            console.log(insert_sql);
            con.query(insert_sql, function(err, rows, fields) {
                if (err) {
                    console.log('duplicate');
                    return reject(err);
                } else {
                    console.log('Latest Whale records inserted');
                }
            })
            con.on('error', function(err) {
                console.log('Error - duplicate entry in whales');
            });
        }).catch((error) => {console.log('duplicate2');return reject(error)});
    }) 
}

minute_update = async function () {
    return new Promise(function(resolve, reject) {
        con.query('USE heroku_b91f95b8d32efda;');
        //con.query('USE crypto_schema;');
        crypto_compare.get_crypto_prices().then((result) => {
            let date = result.date.split(' ')[0];
            let time = result.date.split(' ')[1];
            let final_date_time = result.date;
            let values = '(' + "'" + final_date_time + "'" + ',' + "'" + date + "'" + ',' + "'" + time + "'" + ',' + result.price_data.BTC_USD + ',' + result.price_data.ETH_USD + ',' + result.price_data.LTC_USD + ')';
            let insert = "INSERT INTO coin_prices (date_time, date, time, btc_usd, eth_usd, ltc_usd) VALUES " + values;
            
        con.query(insert, function (err, result) {
            if (err) {
                console.log('duplicate');
                return reject(err);
            } else {
                console.log('Latest Price Record Inserted');
                return resolve (result);
            }
        });
        con.on('error', function(err) {
            console.log('Error - duplicate price entry into coin prices');
        });
    }).catch((error) => {console.log('duplicate2');return reject(error)});
    });
}

get_latest_prices = async function () {
    console.log('Getting latest record in crypto_prices');
    con.query('USE heroku_b91f95b8d32efda;');
    //con.query('USE crypto_schema;');
    return new Promise(function (resolve, reject) {
        let sql_query = "SELECT * FROM coin_prices ORDER BY id DESC LIMIT 480;";
        con.query(sql_query, function (err, rows, fields) {
            if (err) return reject(err);
            return resolve(rows);
        });
        // con.on('error', function(err) {
        //     reject('Database connection error');
        // });
    });
}

get_portfolio_by_id = async function (portfolio_id) {
    console.log('Getting latest portfolio record');
    con.query('USE heroku_b91f95b8d32efda;');
    //con.query('USE crypto_schema;');
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
    con.query('USE heroku_b91f95b8d32efda;');
    //con.query('USE crypto_schema;');
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
    con.query('USE heroku_b91f95b8d32efda;');
    //con.query('USE crypto_schema;');
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
                        return reject(new Error('Invalid transaction'));
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
                        return reject(new Error('Invalid transaction'));
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
                        if (err) {
                            return reject(err);
                        }
                        return resolve(new_rows);
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
    con.query('USE heroku_b91f95b8d32efda;');
    //con.query('USE crypto_schema;');
    console.log('LOGIN');
    let username_query = `SELECT * FROM users WHERE username = '${username}';`;
    console.log(username_query);
    return new Promise(function (resolve, reject) {
        console.log('inside promise');
        con.query(username_query, function (err, rows) {
            console.log(rows);
            if (err || rows == undefined) {
                return reject(err);
            } else {
                if (rows[0] == undefined) {
                    console.log('rows[0] undefined');
                    return reject(err);
                }
                console.log(rows);
                console.log(rows[0].password);
                bcrypt.compare(password, rows[0].password, function (err, res) {
                    console.log(res);
                    if (!res) {
                        return reject('Incorrect Password');
                    } else {
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
                        let create_user_sql = `INSERT INTO users (username, password, salt) VALUES ('${username}', '${hash}', '${10}')`;
                        console.log(create_user_sql);
                        con.query('USE heroku_b91f95b8d32efda;');
                        //con.query('USE crypto_schema;');
                    
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


get_whale_list = async function() {
    console.log("Getting top Whales of the last hour");
    con.query('USE heroku_b91f95b8d32efda;');
    //con.query('USE crypto_schema;');
    return new Promise(function(resolve, reject) {
        let whale_sql = 'SELECT * FROM whales WHERE hour(whales.time) = hour(now())-1 OR hour(whales.time)=hour(now()) ORDER BY btc_amt DESC LIMIT 5;';
        con.query(whale_sql, function(err, rows, fields) {
            if (err) {
                return reject(err);
            } else {
                if (rows == undefined) {
                    return reject('Whale error');
                } else {
                    return resolve(rows);
                }
            }
        })
    });
}


module.exports.make_transaction = make_transaction;
module.exports.get_portfolio_by_id = get_portfolio_by_id;
module.exports.get_latest_prices = get_latest_prices;
module.exports.get_portfolio_value = get_portfolio_value;
module.exports.minute_update = minute_update;
module.exports.create_user = create_user;
module.exports.login = login;
module.exports.whale_update = whale_update;
module.exports.get_whale_list = get_whale_list;


