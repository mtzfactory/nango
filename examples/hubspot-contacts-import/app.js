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

// Setup Nango SDK
const nango = new Nango();
nango.connect();

let currentContacts = [];

// Setup a minimal express app
const app = express();
app.use(express.json());
app.get('/', express.static('frontend'));


/* ---------------- API methods: Integration setup ---------------- */

// Is the Hubspot integration setup?
// Setup happens through the builtin OAuth server of Nango
// You can trigger it in the frontend, see code there
app.get('/integrationStatus', async (req, res) => {

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

/* ---------------- API methods: Fetching contacts ---------------- */

// Triggers a refresh of the contacts
app.get('/refreshContacts', async (req, res) => {

    // Tell Nango to fetch all the contacts from Hubspot
    const newContacts = await nango.triggerAction('hubspot', 'get-all-contacts', '1');

    // In a real application you would store the new contacts in your DB
    // and maybe merge them with existing ones or do other additional processing
    currentContacts = newContacts;

    return res.status(200).json(newContacts);
});

/* ---------------- API methods: Sending notes to Hubspot ---------------- */

// Update the owner preference
// In Hubspot notes can be associated with an owner (aka a Hubspot user)
// Here we allow the user to set the e-mail address of the owner Hubspot user we should use when sending notes to Hubspot
app.post('/setOwnerEmail', async (req, res) => {
    const ownerEmail = req.body.ownerEmail;

    // We use the "additionalConfig" feature of Nango to store the owner's email on the Connection
    // This data is then available for use in all actions (see "add-note.action.ts" for example usage)
    const newConfig = {
        ownerEmail: ownerEmail
    };

    // This will return an error if the integration has not been setup yet
    nango.updateConnectionConfig('hubspot', '1', newConfig)
        .then((result) => {
            res.status(200).json({result: 'ok'});
        })
        .catch((error) => {
            res.status(500).json(error);
        })
});


// Send a note to Hubspot!
app.post('/addNote', async (req, res) => {
    const input = {
        contactId: req.body.contactId,
        note: req.body.note,
        timestamp: new Date() // Hubspot requires a timestamp for every note
    }

    // Send the note!
    nango.triggerAction('hubspot', 'add-contact-note', '1', input)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((error) => {
        res.status(500).json(error);
    })

});


// Start the express app
app.listen(3000);