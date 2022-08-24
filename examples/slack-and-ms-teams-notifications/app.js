/**
 * Nango example: Slack and MS Teams notifications
 * 
 * This is a small sample application that demonstrates
 * how Nango can be used to send notifications to Slack and/or MS Teams
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

// Is the slack/ms-teams integration setup?
// Setup happens through the builtin OAuth server of Nango
// You can trigger it in the frontend, see code there
app.get('/integrationStatus', async (req, res) => {
    const { integration } = req.query; 

    // Let's ask Nango if the user with id 1 has setup Hubspot
    const connections = await nango.getConnectionsForUserId('1');

    let integrationConnection = null;
    for (const connection of connections) {
        if (connection.integration === integration) {
            integrationConnection = connection;
        }
    }

    if (integrationConnection) {
        return res.status(200).json(integrationConnection);
    } else {
        return res.sendStatus(404);
    }
});

/* ---------------- API methods: Loading channels & saving favorite channel ---------------- */

// Pulls the channels from Slack/MS Teams in realtime
app.get('/listChannels', async (req, res) => {
    const { integration } = req.query;

    // Tell Nango to fetch all the channels from Slack/teams
    const channels = await nango.triggerAction(integration, 'list-channels', '1');

    return res.status(200).json(channels);
});

// Save the user's favorite channel for Slack/MS Teams
app.post('/saveChannel', async (req, res) => {
    const { integration } = req.query;

    // What we store depends on the integration
    let config = {};
    if (integration === 'slack') {
        config['channelId'] = req.body.channelId;
    } else {
        config['teamId'] = req.body.teamId;
        config['channelId'] = req.body.channelId;
    }

    // Store the configuration on the user's connection
    // This way we can access it later on from the action when we send the notification
    nango.updateConnectionConfig(integration, '1', config);

    return res.sendStatus(200);
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