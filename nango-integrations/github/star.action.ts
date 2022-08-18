/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class GithubStarAction extends NangoAction {
    override async executeAction(input: { owner: string; repo: string }) {
        // Log inputs
        this.logger.info(`GithubStarAction has been called with input:\n${JSON.stringify(input)}`);

        // Check that we have a repo owner and a repo in our input
        if (input.owner === undefined || input.repo === undefined) {
            throw new Error(
                `Missing arguments for Github - star action, must pass both an owner (passed in: ${input.owner} and a repo (passed in: ${input.repo}.`
            );
        }

        // Let's star the repo on GitHub!
        var response = await this.httpRequest(`/user/starred/${input.owner}/${input.repo}`, 'PUT');

        // Last but not least, return the status code & text of the response
        return { status: response.status, statusText: response.statusText };
    }
}

export { GithubStarAction };
