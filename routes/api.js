'use strict';

const https = require('https');
const saltRounds = 12;
const bcrypt     = require('bcrypt');
let storedIps = [];

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      //if stock is provided
      if(req.query && req.query.stock){
        let url = "https://stock-price-checker.freecodecamp.rocks/api/stock-prices?";
        //for 'Get single price and total likes'
        if(typeof(req.query.stock) === "string"){
          url += `stock=${req.query.stock}`;
        }
        //for 'Compare and get relative likes'
        else if(typeof(req.query.stock) === "object"){
            url += `stock=${req.query.stock[0]}`;
            url += `&stock=${req.query.stock[1]}`;
        }
        //if like field is provided
        if(req.query.like){
          var clientip = bcrypt.hashSync(req.ip, saltRounds);
          if( storedIps.indexOf(clientip) == -1 ){
            storedIps.push(clientip);
            url += `&like=req.query.like`;        
          }
        }
        getDataFromFCC(url)
          .then(data => {
            res.send(data);
          });
      }
      // stock is not provided
      else{
        res.send({error: "Stock is not provided"})
      }
    });
    
};

function getDataFromFCC (url){
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = "";
  
      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          resolve(json);
        } catch (error) {
          console.error(error.message);
        };
      });

    }).on("error", (error) => {
      console.error(error.message);
    });
  })
}
