import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncFairingQuestions [API-TOKEN]
// Endpoint docs: https://docs.fairing.co/reference/retrieve-questions
export let syncFairingQuestions = async (apiToken: string) => {
    let config = {
        friendly_name: 'Fairing Questions', // Give this Sync a name for prettier logs.
        mapped_table: 'fairing_questions', // Name of the destination SQL table.
        response_path: 'data', // For finding records in the API response.
        unique_key: 'id', // Provide response field path for deduping records.
        frequency: '1 minute', // How often sync jobs run in natural language.
        headers: { authorization: apiToken } // For auth.
    };

    return new Nango().sync('https://app.fairing.co/api/questions', config);
};
