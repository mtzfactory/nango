import type express from 'express';
import usersService from './contacts.service.js';

class ContactsController {
    async listContacts(_: express.Request, res: express.Response) {
        const contacts = await usersService.list();
        res.status(200).send(contacts);
    }
}

export default new ContactsController();
