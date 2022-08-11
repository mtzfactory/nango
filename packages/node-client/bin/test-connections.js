import Nango from '../dist/nango.js';

const nango = new Nango();
await nango.connect();

//////////////////
// Registering & updating connections
//////////////////

// Attempt to register a connection with bad credentials
nango
    .registerConnection('slack', '10001', { api_key: 'zzzzzzzzz' }, { channel: 'Zhxsk' })
    .then(() => {
        console.log('registerConnection succeeded');
    })
    .catch((e) => {
        console.log('Uh oh, got error on register Connection: ', e);
    });

// Attempt to register a good connection
nango
    .registerConnection('slack', '10001', { access_token: 'XXXXXXXXX' }, { channel: 'Zhxsk' })
    .then(() => {
        console.log('registerConnection succeeded');
    })
    .catch((e) => {
        console.log('Uh oh, got error on register Connection: ', e);
    });

// Attempt to do a bad update connection credentials
nango
    .updateConnectionCredentials('slack', '10001', { api_key: 'zzzzzzzzz' })
    .then(() => {
        console.log('updateConnectionCredentials connection succeeded');
    })
    .catch((e) => {
        console.log('Uh oh, got error on update Connection credentials: ', e);
    });

// Attempt to do a good update connection credentials
nango
    .updateConnectionCredentials('slack', '10001', { access_token: 'aaaaaaaa' })
    .then(() => {
        console.log('updateConnectionCredentials connection succeeded');
    })
    .catch((e) => {
        console.log('Uh oh, got error on update Connection credentials: ', e);
    });

// Attempt to do a good update connection config
nango
    .updateConnectionConfig('slack', '10001', { channel: 'I am new' })
    .catch((e) => {
        console.log('Uh oh, got error on update Connection config: ', e);
    })
    .then(() => {
        console.log('updateConnectionConfig connection succeeded');
    });

// Attempt to do a good update connection config to clear
nango
    .updateConnectionConfig('slack', '10001', {})
    .catch((e) => {
        console.log('Uh oh, got error on update Connection config: ', e);
    })
    .then(() => {
        console.log('updateConnectionConfig connection succeeded');
    });

//////////////////
// Retrieving connections
//////////////////

nango
    .getConnectionsForIntegration('slack')
    .catch((e) => {
        console.log('Uh oh, got error on getConnectionsForIntegration: ', e);
    })
    .then((connections) => {
        console.log('Got the connections for "slack":', connections);
    });

nango
    .getConnectionsForUserId('1')
    .catch((e) => {
        console.log('Uh oh, got error on getConnectionsForUserId("1"): ', e);
    })
    .then((connections) => {
        console.log('Got the connections for user id "1":', connections);
    });

nango
    .getConnectionsForUserId('10001')
    .catch((e) => {
        console.log('Uh oh, got error on getConnectionsForUserId("10001"): ', e);
    })
    .then((connections) => {
        console.log('Got the connections for user id "10001":', connections);
    });
