/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class MSTeamsListChannelsAction extends NangoAction {
    // Two step process:
    // 1. List all teams for the user
    // 2. For every team list all the channels (the user can see)
    override async executeAction(input: any) {
        // List all the teams of the user
        // See: https://docs.microsoft.com/en-us/graph/api/user-list-joinedteams?view=graph-rest-1.0&tabs=http
        const teamsResponse = await this.httpRequest('/me/joinedTeams', 'GET');
        let teams = [];
        if (teamsResponse.status === 200) {
            teams = teamsResponse.json.value;
        } else {
            throw new Error(`There was a problem fetching the user's teams: ${teamsResponse.data}`);
        }

        // For every team the user is part of let's get all the channels
        let channels = [];
        for (const team of teams) {
            // Fetch the channels
            // See: https://docs.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0&tabs=http
            const channelsResponse = await this.httpRequest(`/teams/${team.id}/channels`, 'GET');

            if (channelsResponse.status === 200) {
                const teamInfo = {
                    teamId: team.id,
                    teamDisplayName: team.displayName,
                    teamDescription: team.description,
                    teamChannels: []
                };
                for (const channel of channelsResponse.json.value) {
                    const channelInfo = {
                        channelId: channel.id,
                        channelDisplayName: channel.displayName,
                        channelDescription: channel.description,
                        channelType: channel.membershipType, // "private" for private channels or "standard" for public channels
                        channelCreationDate: channel.createdDateTime
                    };
                    teamInfo.teamChannels.push(channelInfo);
                }
                channels.push(teamInfo);
            } else {
                throw new Error(`There was a problem fetching the user's channels team with id "${team.id}": ${channelsResponse.data}`);
            }
        }

        return channels;
    }
}

export { MSTeamsListChannelsAction };
