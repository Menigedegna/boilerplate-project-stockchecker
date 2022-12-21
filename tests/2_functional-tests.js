const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = process.env.SERVER;
const https = require('https');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let stock = 'GOOG';
  let url = "https://stock-price-checker.freecodecamp.rocks";
  let route = `/api/stock-prices?stock=${stock}`;
  let routeMSFT = route + "&stock=MSFT";
  let likes = 0;
  test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
    getDataFromFCC(url + route)
      .then(fccResult => {
        chai.
          request(server)
          .get(route)
          .end(function(err, res) {
            likes = fccResult.stockData.likes;
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, fccResult);
            done();
          });
      });
  });
  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
    getDataFromFCC(url + route)
      .then(fccResult => {
        chai.
          request(server)
          .get(route + "&like=true")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, fccResult);
            assert.equal(res.body.stockData.likes, likes);
            done();
          });
      });
  });
  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
    getDataFromFCC(url + route)
      .then(fccResult => {
        chai.
          request(server)
          .get(route + "&like=true")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, fccResult);
            assert.equal(res.body.stockData.likes, likes);
            done();
          });
      });
  });
  test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
    getDataFromFCC(url + routeMSFT)
      .then(fccResult => {
        var result = fccResult.stockData;
        var expectedGOOG = result.filter((item) => Object.values(item).indexOf("GOOG") > -1);
        var expectedMSFT = result.filter((item) => Object.values(item).indexOf("MSFT") > -1);
        chai.
          request(server)
          .get(routeMSFT)
          .end(function(err, res) {
            var actualResult = res.body.stockData;
            var actualGOOG = actualResult.filter((item) => Object.values(item).indexOf("GOOG") > -1);
            var actualMSFT = actualResult.filter((item) => Object.values(item).indexOf("MSFT") > -1);
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(actualGOOG, expectedGOOG);
            assert.deepEqual(actualMSFT, expectedMSFT);
            done();
          });
      });
  });
  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
    getDataFromFCC(url + routeMSFT)
      .then(fccResult => {
        var result = fccResult.stockData;
        var expectedGOOG = result.filter((item) => Object.values(item).indexOf("GOOG") > -1);
        var expectedMSFT = result.filter((item) => Object.values(item).indexOf("MSFT") > -1);
        chai.
          request(server)
          .get(routeMSFT + "&like=true")
          .end(function(err, res) {
            var actualResult = res.body.stockData;
            var actualGOOG = actualResult.filter((item) => Object.values(item).indexOf("GOOG") > -1);
            var actualMSFT = actualResult.filter((item) => Object.values(item).indexOf("MSFT") > -1);
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(actualGOOG, expectedGOOG);
            assert.deepEqual(actualMSFT, expectedMSFT);
            done();
          });
      });
  });
});

function getDataFromFCC(url) {
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
