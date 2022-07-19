import Nango from '../dist/nango.js';

/** -------------------- Utils -------------------- */

function logResponse(integration, action, userId, response) {
  console.log(
    `${integration}.${action} response (userId: ${userId}): ${response.status} - ${response.statusText}`
  );
}

function closeConnection() {
  setTimeout(function () {
    nango.close();
    process.exit(0);
  }, 1000);
}

/** -------------------- Triger Actions -------------------- */

async function slack() {
  var integration = 'slack';
  var action = 'notify';
  var userId = '1';
  var authToken = 'xoxb-2710526930471-3758349823251-Y8sw1nYPOpzI5yNOCtu6GbCc';
  var channelId = 'C02MPPQC8FK';
  var msg =
    'Hello @channel, this is your friendly chat bot post to you through Nango :wave:';

  let registerConnectionPromise = nango.registerConnection(
    integration,
    userId,
    authToken
  );
  registerConnectionPromise.catch((errorMsg) => {
    console.log(`Uh oh, got error message on registerConnection: ${errorMsg}`);
  });

  let result = await nango.trigger(integration, action, userId, {
    channelId: channelId,
    msg: msg
  });

  logResponse(integration, action, userId, result);
}

// Internal blueprint docs: https://www.notion.so/nangohq/Github-Blueprint-ec92750f43804677a44e92d1cda1db5f
async function github() {
  var integration = 'github';
  var action = 'star';
  var userId = '1';
  var authToken = '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';
  var owner = 'nodejs';
  var repo = 'node';

  let registerConnectionPromise = nango.registerConnection(
    integration,
    userId,
    authToken
  );
  registerConnectionPromise.catch((errorMsg) => {
    console.log(`Uh oh, got error message on registerConnection: ${errorMsg}`);
  });

  let result = await nango.trigger(integration, action, userId, {
    owner: owner,
    repo: repo
  });

  logResponse(integration, action, userId, result);
}

async function asana() {
  var integration = 'asana';
  var action = 'users';
  var userId = '1';
  var authToken = '1/1191314943604817:be1e3305fda920917fbd5a85240f578c';

  let registerConnectionPromise = nango.registerConnection(
    integration,
    userId,
    authToken
  );
  registerConnectionPromise.catch((errorMsg) => {
    console.log(`Uh oh, got error message on registerConnection: ${errorMsg}`);
  });

  let result = await nango.trigger(integration, action, userId, {});

  logResponse(integration, action, userId, result);
}

async function hubspot() {
  var integration = 'hubspot';
  var action = 'contacts';
  var userId = '1';
  var authToken = 'pat-na1-c8dfe9b2-1bdc-449a-a2c6-fda036a2c030';

  let registerConnectionPromise = nango.registerConnection(
    integration,
    userId,
    authToken
  );
  registerConnectionPromise.catch((errorMsg) => {
    console.log(`Uh oh, got error message on registerConnection: ${errorMsg}`);
  });

  let result = await nango.trigger(integration, action, userId, { limit: 5 });

  logResponse(integration, action, userId, result);
}

/** -------------------- Execution -------------------- */

const nango = new Nango('localhost');
await nango.connect();

const fn = process.argv[2];

if (typeof fn !== 'string') {
  console.log(
    'Provided parameter does not correspond to sample test function. Please call: node run sample <sample-test-function-name>'
  );
} else {
  eval(fn)();
}

closeConnection();
