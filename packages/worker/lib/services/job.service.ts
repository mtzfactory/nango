import { knexDatabase as db } from '@nangohq/core';
import type { Job } from '../models/job.model.js';

class JobService {
    async createJob(job: Job): Promise<void | Pick<Job, 'id'>[]> {
        return db.knex<Job>(`_nango_jobs`).withSchema(db.schema()).insert(job, ['id']);
    }

    async updateJob(job: Job) {
        return db.knex<Job>(`_nango_jobs`).withSchema(db.schema()).insert(job).onConflict('id').merge();
    }
}

export default new JobService();
