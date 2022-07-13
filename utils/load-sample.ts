import Nango from "../nango-node.js";

const nango: Nango = new Nango("./nango-integrations/nango-config.yaml");
await nango.connect();

// nango.registerConnection("slack", "1", "xoxb-XXXXXXXXXXXXXXXXXXXXXXXX", {});
// nango.trigger("slack", "nofify", "1", {});

setTimeout(function() {
    nango.close();
    process.exit(0)
}, 500);
