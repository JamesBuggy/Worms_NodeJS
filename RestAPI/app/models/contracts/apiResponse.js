module.exports = class ApiResponse {

    constructor(success, message, content) {
        this.success = success;
        this.message = message;
        this.content = content;
    }
}