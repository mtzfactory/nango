import Nango from '../nango-node.js';

const nango: Nango = new Nango('localhost');
await nango.connect();

nango.registerConnection(
  'slack',
  '1',
  'xoxb-2710526930471-3758349823251-Y8sw1nYPOpzI5yNOCtu6GbCc',
  { key1: 'value1', complexKey: { subkey1: 'value1' } }
);
nango.trigger('slack', 'notify', '1', {
  channelId: 'C02MPPQC8FK',
  msg: 'Hello @channel, this is your friendly chat bot post to you through Nango :wave:'
});

setTimeout(function () {
  nango.close();
  process.exit(0);
}, 500);
