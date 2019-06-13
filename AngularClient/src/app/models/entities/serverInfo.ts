import { ServerAddr } from './serverAddr'

export class ServerInfo {
    serverAddr: ServerAddr;
    serverName: string;
    latency: number;
    game: {
        level: string,
        state: number,
        players: {
            current: number,
            max: number
        }
    };
}