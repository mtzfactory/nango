import { NangoAction } from '@nangohq/utils';

class GithubStarAction extends NangoAction {
    override async executeAction(input: { owner: string; repo: string }) {
        this.logger.info(`GithubStarAction has been called with input:\n${JSON.stringify(input)}`);
        // Check that we have a channel id and a message in our input
        if (input.owner === undefined || input.repo === undefined) {
            throw new Error(
                `Missing arguments for Github - star action, must pass both an owner (passed in: ${input.owner} and a repo (passed in: ${input.repo}.`
            );
        }
        // Execute our Github API call to post the message
        // using the builtin Nango httpRequest method
        var response = await this.httpRequest(`/user/starred/${input.owner}/${input.repo}`, 'PUT');

        return { status: response.status, statusText: response.statusText };
    }
}

export { GithubStarAction };
