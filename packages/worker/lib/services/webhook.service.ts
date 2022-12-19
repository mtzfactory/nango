import { Sync, logger, isValidHttpUrl } from '@nangohq/core';
import type { Job } from '../models/job.model.js';
import axios from 'axios';

class WebhookService {
    notifySuccess(sync: Sync, job: Job, addedIds: number[], updatedIds: number[], deletedIds: number[]) {
        if (!this.checkWebhookUrl(sync, job)) {
            return;
        }

        let url = process.env['NANGO_WEBHOOK_URL']!;

        let body = {
            type: 'job_success',
            job: job,
            sync: sync,
            info: {
                added: addedIds,
                updated: updatedIds,
                deleted: deletedIds
            }
        };

        logger.debug(`'job_success' webhook payload (job ${job.id} Sync ${sync.id}): ${body}`);

        axios
            .post(url, body, { headers: this.headers() })
            .then(() => {
                logger.debug(`Webhook successfully sent to ${url} for job ${job.id} Sync ${sync.id}.`);
            })
            .catch((error: any) => {
                logger.error(`Webhook response error from ${url} for job ${job.id} Sync ${sync.id}: ${error.message} (check debug logs for details).`);
                logger.debug(`Webook response error details (job ${job.id} Sync ${sync.id}): ${error?.response?.data}`);
            });
    }

    notifyError(sync: Sync, job: Job) {
        if (!this.checkWebhookUrl(sync, job)) {
            return;
        }

        let url = process.env['NANGO_WEBHOOK_URL']!;

        let body = {
            type: 'job_failure',
            job: job,
            sync: sync
        };

        logger.debug(`'job_failure' webhook payload (job ${job.id} Sync ${sync.id}): ${body}`);

        axios
            .post(url, body, { headers: this.headers() })
            .then(() => {
                logger.debug(`Webhook successfully sent to ${url} for job ${job.id} Sync ${sync.id}.`);
            })
            .catch((error: any) => {
                logger.error(`Webhook response error from ${url} for job ${job.id} Sync ${sync.id}: ${error.message} (check debug logs for details).`);
                logger.debug(`Webook response error details (job ${job.id} Sync ${sync.id}): ${error?.response?.data}`);
            });
    }

    private checkWebhookUrl(sync: Sync, job: Job): boolean {
        let url = process.env['NANGO_WEBHOOK_URL'];

        if (url == null) {
            logger.debug(`No webhook URL for job ${job.id} Sync ${sync.id}.`);
            return false;
        }

        if (!isValidHttpUrl(url)) {
            logger.error(`Invalid webhook URL ${url} for job ${job.id} Sync ${sync.id}.`);
            return false;
        }

        return true;
    }

    private headers() {
        return { 'Content-Type': 'application/json' };
    }
}

export default new WebhookService();
