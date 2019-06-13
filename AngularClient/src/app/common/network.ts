export module Network {

    let protocol = 'http';
    let host = 'localhost';
    let masterServerHost = host;
    let masterSeverPort = 3001;
    let masterServerApiVersion = 1;
    let restApiHost = host;
    let restApiPort = 3000;
    let restApiVersion = 1;
    let gameApiVersion = 1;

    export function getMasterServerEndpoint(): string {
        return `${protocol}://${masterServerHost}:${masterSeverPort}/api/v${masterServerApiVersion}/`
    }

    export function getRestApiEndpoint(): string {
        return `${protocol}://${restApiHost}:${restApiPort}/api/v${restApiVersion}/`
    }

    export function getRestApiRoot(): string {
        return `${protocol}://${restApiHost}:${restApiPort}`
    }

    export function getGameApiEndpoint(host: string, port: number): string {
        return `${protocol}://${host}:${port}/api/v${gameApiVersion}/`
    }

    export function getGameRoot(host: string, port: number): string {
        return `${protocol}://${host}:${port}`
    }
}