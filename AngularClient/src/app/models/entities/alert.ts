export enum AlertType {
    Error = "error",
    Success = "success",
    General = "general"
}

export class Alert {

    message: string;
    type: AlertType;

    constructor(message: string, type: AlertType) {
        this.message = message;
        this.type = type;
    }
}