import Nango from "../nango-node.js";

const nango: Nango = new Nango("./nango-integrations/nango-config.yaml");
await nango.connect();

// nango.registerConnection('slack', "1", {
// 	oAuthToken: "xoxb-XXXXXXXXXXXXXXXXXXXXXXXX"
// });

// nango.trigger('slack.notify', "1", {
// 	channelId: "XXXXXXX",
// 	msg: `Hello fellow Nangoer, this is a notification triggered by Nango :tada: Congrats!`
// });

setTimeout(function() {
    nango.close();
    process.exit(0)
}, 500);
