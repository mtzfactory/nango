export function getServerPort() {
    return process.env['SERVER_PORT'] != null ? +process.env['SERVER_PORT'] : 3003;
}

export function getServerHost() {
    return process.env['SERVER_HOST'] || 'http://localhost';
}

export function getServerBaseUrl() {
    return getServerHost() + `:${getServerPort()}`;
}