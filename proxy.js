var httpProxy = require('http-proxy');

var server = httpProxy.createServer(function (req, res, proxy) {
  var buffer = httpProxy.buffer(req);

  proxy.proxyRequest(req, res, {
    host: 'vg.no',
    port: 9000,
    buffer: buffer
  });
});

server.proxy.on('end', function() {
  console.log("The request was proxied.");
});

server.listen(8000);