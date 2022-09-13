import type express from 'express';
import usersService from '../../../../shared/services/contacts.service.js';

export interface ListContactsParams {
    account_id: string | undefined;
    external_id: string | undefined;
    include_raw: boolean | undefined;
    page_size: number | undefined;
    cursor: string | undefined;
    modified_after: Date | undefined;
    modified_before: Date | undefined;
    created_after: Date | undefined;
    created_before: Date | undefined;
}

class ContactsController {
    async listContacts(req: express.Request, res: express.Response) {
        let params: ListContactsParams = {
            account_id: typeof req.query['account_id'] === 'string' ? req.query['account_id'] : undefined,
            external_id: typeof req.query['external_id'] === 'string' ? req.query['external_id'] : undefined,
            include_raw: req.query['include_raw'] == null ? undefined : req.query['include_raw'] === 'true',
            page_size: req.query['page_size'] == null ? undefined : isNaN(+req.query['page_size']) ? undefined : +req.query['page_size'],
            cursor: typeof req.query['account_id'] === 'string' ? req.query['account_id'] : undefined,
            modified_after: typeof req.query['modified_after'] === 'string' ? new Date(req.query['modified_after']) : undefined,
            modified_before: typeof req.query['modified_before'] === 'string' ? new Date(req.query['modified_before']) : undefined,
            created_after: typeof req.query['created_after'] === 'string' ? new Date(req.query['created_after']) : undefined,
            created_before: typeof req.query['created_before'] === 'string' ? new Date(req.query['created_before']) : undefined
        };

        const contacts = await usersService.list(params);
        res.status(200).send(contacts);
    }
}

export default new ContactsController();
