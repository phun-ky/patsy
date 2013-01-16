var http = require('http'),
    httpProxy = require('http-proxy');


//
// Create a proxy server with custom application logic
//
httpProxy.createServer(function (req, res, proxy) {
  //
  // Put your custom server logic here
  //
  var proxyOpts = {};

  if (req.url.match('/api/open/prognosis')) {
    req.url = req.url.replace('/api/open/prognosis', '/prognosis-rest-api/open/prognosis');
    proxyOpts = {
      host: 'alt-stb-002.stb.local',
      port: 12010
    };

  } else if ( req.url.match('/sb-js')){

    proxyOpts = {
      host: 'www2.storebrand.no',
        port: 443,
        target : {
          https: true
        }

    };
  } else {
    proxyOpts = {
      host: 'localhost',
      port: 8094
    };
  }



  proxy.proxyRequest(req, res, proxyOpts);


}).listen(8000);
