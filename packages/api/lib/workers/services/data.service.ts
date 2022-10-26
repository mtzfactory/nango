import db from '../../shared/database.js';
import type { RawObject } from '../models/raw_object.model.js';

class DataService {
    async upsertFromList(objects: RawObject[]): Promise<void | number[]> {
        return db
            .knex<RawObject>(`_nango_raw`)
            .insert(objects)
            .onConflict('id')
            .merge()
            .catch((err) => {
                console.error(`There was an error upserting objects by id:`, err);
            });
    }
}

export default new DataService();
