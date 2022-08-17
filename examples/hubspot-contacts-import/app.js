/**
 * Nango example: Hubspot contacts importer
 * 
 * This is a small sample application that demonstrates
 * how Nango can be used to import data from an external
 * system and cache a copy locally.
 * 
 * Feel free to copy & use parts of this example for your
 * own usage!
 * 
 * In case of any questions feel free to reach out to us on the
 * Slack community: https://nango.dev/slack
 * 
 * Check the Readme in this directory for running instructions.
 * 
 */

import Nango from '@nangohq/node-client'
import express from 'express'

// Setup Nango instance
const nango = new Nango();
nango.connect();

let currentContacts = [];

// Setup a minimal express app
const app = express();
// Returns the index.html frontend
app.get('/', express.static('frontend'));

// Is the Hubspot integration setup?
// Setup happens through the builtin OAuth server of Nango
// You can trigger it in the frontend, see code there
app.get('/integrationStatus', async function (req, res) {

    // Let's ask Nango if the user with id 1 has setup Hubspot
    const connections = await nango.getConnectionsForUserId('1');

    let hubspotConnection = null;
    for (const connection of connections) {
        if (connection.integration === 'hubspot') {
            hubspotConnection = connection;
        }
    }

    if (hubspotConnection) {
        return res.status(200).json(hubspotConnection);
    } else {
        return res.sendStatus(404);
    }
});


// Triggers a refresh of the contacts
app.get('/refreshContacts', async function (req, res) {

    // Tell Nango to fetch all the contacts from Hubspot
    const newContacts = await nango.triggerAction('hubspot', 'get-all-contacts', '1');

    // In a real application you would store the new contacts in your DB
    // and maybe merge them with existing ones or do other additional processing
    currentContacts = newContacts;

    return res.status(200).json(newContacts);
})

// Start the express app
app.listen(3000);