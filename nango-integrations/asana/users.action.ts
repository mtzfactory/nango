import { NangoAction } from '@nangohq/utils';

class AsanaUsersAction extends NangoAction {
  override async executeAction(input: { workspace?: string; team?: string }) {
    this.logger.info(
      `AsanaUsersAction has been called with input:\n${JSON.stringify(input)}`
    );

    // Execute our Asana API call to post the message
    // using the builtin Nango httpRequest method
    const headers = {
      Accept: 'application/json'
    };
    var response = await this.httpRequest(
      '1.0/users',
      'GET',
      undefined,
      undefined,
      headers
    );

    return { status: response.status, statusText: response.statusText };
  }
}

export { AsanaUsersAction };
