import type express from 'express';
import fs from 'fs';

class TestController {
    testResponses = ['test1', 'test2', 'test3'];
    lastRequestDate: Date | undefined;
    lastRequestResponse: number | undefined;

    timeoutBetweenRequests = 120 * 1000; // 2 minutes

    async test(_: express.Request, res: express.Response) {
        let currDate = new Date();
        var currResponseIdx: number;
        var data: any;

        if (
            this.lastRequestDate == null ||
            this.lastRequestResponse == null ||
            currDate.getTime() - this.lastRequestDate.getTime() > this.timeoutBetweenRequests
        ) {
            // Start with 1st response.
            currResponseIdx = 0;
        } else {
            // Get next response.
            currResponseIdx = (this.lastRequestResponse + 1) % this.testResponses.length;
        }

        data = JSON.parse(fs.readFileSync(`./bin/${this.testResponses[currResponseIdx]}.response.json`, 'utf-8'));
        this.lastRequestDate = currDate;
        this.lastRequestResponse = currResponseIdx;

        res.status(200).send(data);
    }
}

export default new TestController();
