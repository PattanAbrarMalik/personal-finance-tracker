"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    formatMessage(entry) {
        const { level, message, timestamp, error, metadata } = entry;
        const parts = [`[${timestamp}] [${level.toUpperCase()}] ${message}`];
        if (error) {
            parts.push(`Error: ${error.name} - ${error.message}`);
            if (error.code)
                parts.push(`Code: ${error.code}`);
            if (error.statusCode)
                parts.push(`Status: ${error.statusCode}`);
            if (error.stack)
                parts.push(`Stack: ${error.stack}`);
        }
        if (metadata && Object.keys(metadata).length > 0) {
            parts.push(`Metadata: ${JSON.stringify(metadata)}`);
        }
        return parts.join(' | ');
    }
    log(level, message, error, metadata) {
        const entry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            metadata,
        };
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
            if ('code' in error && typeof error.code === 'string') {
                entry.error.code = error.code;
            }
            if ('statusCode' in error && typeof error.statusCode === 'number') {
                entry.error.statusCode = error.statusCode;
            }
        }
        const formattedMessage = this.formatMessage(entry);
        switch (level) {
            case 'error':
                console.error(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'info':
                console.info(formattedMessage);
                break;
            case 'debug':
                console.debug(formattedMessage);
                break;
        }
    }
    error(message, error, metadata) {
        this.log('error', message, error, metadata);
    }
    warn(message, error, metadata) {
        this.log('warn', message, error, metadata);
    }
    info(message, metadata) {
        this.log('info', message, undefined, metadata);
    }
    debug(message, metadata) {
        this.log('debug', message, undefined, metadata);
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map