export class Input {
    action: string
    data: any

    constructor(action: string, data?: any) {
        this.action = action;
        this.data = data;
    }
}