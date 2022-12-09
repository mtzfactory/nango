import type express from 'express';
import parser from 'cron-parser';
import ms from 'ms';

class SyncsMiddleware {
    async validateCreateSyncRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        let url = req.body['url'];
        let method = req.body['method'];
        let cron = req.body['cron'];
        let frequency = req.body['frequency'];

        if (url == null) {
            res.status(404).send({ error: `Missing 'url' parameter.` });
            return;
        }

        try {
            new URL(url);
        } catch (err) {
            res.status(404).send({ error: `Invalid 'url' parameter ${url}.` });
            return;
        }

        if (method != null && !['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
            res.status(404).send({ error: `Invalid 'method' parameter ${method} (shoud be 'get', 'post', 'put', 'patch' or 'delete').` });
            return;
        }

        if (cron != null) {
            try {
                parser.parseExpression(cron);
                req.body['frequency'] = undefined; // Cron scheduling takes precedence over unaligned frequency.
            } catch (err) {
                res.status(404).send({ error: `Invalid 'cron' parameter ${cron}.` });
                return;
            }
        }

        if (frequency != null) {
            if (typeof frequency !== 'string' && !(frequency instanceof String)) {
                res.status(404).send({ error: `'frequency' param should be a natural language string like '2 minutes' (cf. github.com/vercel/ms).` });
                return;
            }

            try {
                let frequencyInMs = ms(frequency as string);

                if (frequencyInMs == null) {
                    throw Error(`Invalid 'frequency' parameter.`);
                }

                let frequencyInMins = frequencyInMs / 1000 / 60;
                req.body['frequency'] = Math.max(frequencyInMins, 1); // Minimum 1 minute frequency (field is in minutes).
            } catch (error) {
                res.status(404).send({ error: `'frequency' param ${frequency} could not be parsed. Check out valid formats at github.com/vercel/ms.` });
                return;
            }
        }

        if (cron == null && frequency == null) {
            req.body['frequency'] = 60; // If no scheduling info at all, default to unaligned 1h frequency.
        }

        next();
    }
}

export default new SyncsMiddleware();
