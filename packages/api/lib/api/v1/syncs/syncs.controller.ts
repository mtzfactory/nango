import type express from 'express';

class ContactsController {
    async listSyncs(_: express.Request, res: express.Response) {
        res.status(200).send({});
    }
}

export default new ContactsController();
