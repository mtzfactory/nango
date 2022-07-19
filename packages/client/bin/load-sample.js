import Nango from '../dist/nango.js';

const nango = new Nango('localhost');
await nango.connect();

nango.registerConnection(
  'slack',
  '1',
  'xoxb-2710526930471-3758349823251-Y8sw1nYPOpzI5yNOCtu6GbCc',
  { key1: 'value1', complexKey: { subkey1: 'value1' } }
);

nango.trigger(
  'slack',
  'notify',
  '1',
  {
    channelId: 'C02MPPQC8FK',
    msg: 'Hello @channel, this is your friendly chat bot post to you through Nango :wave:'
  },
  function (response) {
    console.log(
      'Client logging the server response for the trigger action: ' +
        response.content
    );
  }
);

setTimeout(function () {
  nango.close();
  process.exit(0);
}, 500);
