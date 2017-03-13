'use strict';

const Primus = require('primus');

const Socket = Primus.createSocket();
let client;
let open = false;

if (!client) {
  client = new Socket('ws://staging.bips.tech');

  client.on('open', () => {
    open = true;
  });

  client.on('error', (e) => {
    console.log(e);
    // Make sure is marked open, even on error
    // so it closes properly and doesn't timeout
    open = true;
  });
}

module.exports.log = (log) => {
  const key = process.env.apiKey;
  if (key) {
    client.write({ room: key, msg: log });
  }
};

module.exports.close = () => {
  if (open) {
    client.end();
    open = false;
    client = undefined;
  } else {
    setTimeout(module.exports.close, 1000);
  }
};
