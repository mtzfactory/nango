import db from '../database.js';
import type { RawObject } from '../models/raw_object.model.js';

class RawObjectsService {
    public async createFromList(rawObjects: RawObject[]): Promise<{ id: number }[] | void> {
        return db.knex<RawObject>('raw_objects').insert(rawObjects, ['id']);
    }
}

export default new RawObjectsService();
