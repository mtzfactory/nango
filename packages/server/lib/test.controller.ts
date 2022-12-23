import type express from 'express';

class TestController {
    testResponses = ['test1', 'test2', 'test3'];
    lastRequestDate: Date | undefined;
    lastRequestResponse: number | undefined;

    timeoutBetweenRequests = 120 * 1000; // 2 minutes

    async test(_: express.Request, res: express.Response) {
        let currDate = new Date();
        var currResponseIdx: number;

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

        this.lastRequestDate = currDate;
        this.lastRequestResponse = currResponseIdx;

        let responseKey = this.testResponses[currResponseIdx]!;
        res.status(200).send(this.data()[responseKey]);
    }

    data() {
        return {
            test1: {
                results: [
                    {
                        unique_key: 'unique_key1',
                        string_field: 'string1',
                        number_field: 1,
                        json_field: { string_field: 'nested_string1' },
                        date_field: '19/12/2022 09:54',
                        boolean_field: true
                    },
                    {
                        unique_key: 'unique_key2',
                        string_field: 'string2',
                        number_field: 2,
                        json_field: { string_field: 'nested_string2' },
                        date_field: '19/12/2022 09:55',
                        boolean_field: false
                    },
                    {
                        unique_key: 'unique_key3',
                        string_field: 'string3',
                        number_field: 3,
                        json_field: { string_field: 'nested_string3' },
                        date_field: '19/12/2022 09:56',
                        boolean_field: true
                    }
                ]
            },
            test2: {
                results: [
                    {
                        unique_key: 'unique_key2',
                        string_field: 'string2-modified',
                        number_field: -2,
                        json_field: { string_field: 'nested_string2-modified' },
                        date_field: '19/12/2022 09:00',
                        boolean_field: false
                    },
                    {
                        unique_key: 'unique_key4',
                        string_field: 'string4',
                        number_field: 4,
                        json_field: { string_field: 'nested_string4' },
                        date_field: '19/12/2022 09:57',
                        boolean_field: true
                    }
                ]
            },
            test3: {
                results: [
                    {
                        unique_key: 'unique_key2',
                        string_field: 'string2-modified',
                        number_field: -2,
                        json_field: { string_field: 'nested_string2-modified' },
                        date_field: '19/12/2022 09:00',
                        boolean_field: false
                    },
                    {
                        unique_key: 'unique_key4',
                        string_field: 'string4',
                        number_field: 4,
                        json_field: { string_field: 'nested_string4' },
                        date_field: '19/12/2022 09:57',
                        boolean_field: true
                    },
                    {
                        unique_key: 'unique_key1',
                        string_field: 'string1-modified',
                        number_field: -1,
                        json_field: { string_field: 'nested_string1-modified' },
                        date_field: '19/12/2022 09:00',
                        boolean_field: false
                    }
                ]
            }
        };
    }
}

export default new TestController();
