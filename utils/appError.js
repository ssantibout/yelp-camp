class AppError extends Error {
    constructor(status, message, location ) {
        super();
        if(status) this.status = status;
        if(message) this.message = message;
        if(location) this.location = location;
    }
}

module.exports = AppError;
