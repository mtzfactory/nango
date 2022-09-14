import db from '../database.js';
import type { Project } from '../models/project.model.js';

class ProjectsService {
    async readByToken(token: string): Promise<Project | null> {
        let result = await db.knex<Project>('projects').where({ token: token });

        if (result == null || result.length != 1 || result[0] == null) {
            return null;
        } else {
            return result[0];
        }
    }
}

export default new ProjectsService();
