const whale = require('./Whale-Alert');

whale.get_top_ten('btc', 1000000).then((response) => {
    console.log(response);
});
