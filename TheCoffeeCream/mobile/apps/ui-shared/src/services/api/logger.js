import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const LOG_FILE = 'api_logs.txt';

/**
 * Mobile Logger - Writes logs to a local file using Capacitor Filesystem
 */
export const Logger = {
    /**
     * Append a log entry to the file
     * @param {string} message - Log message
     * @param {string} level - Log level (INFO, WARN, ERROR)
     */
    log: async (message, level = 'INFO') => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;

        // Always log to console as well
        if (level === 'ERROR') console.error(logEntry);
        else if (level === 'WARN') console.warn(logEntry);
        else console.log(logEntry);

        try {
            await Filesystem.appendFile({
                path: LOG_FILE,
                data: logEntry,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
        } catch (e) {
            console.error('Failed to write to log file', e);

            // If file doesn't exist, create it
            if (e.message?.includes('does not exist')) {
                try {
                    await Filesystem.writeFile({
                        path: LOG_FILE,
                        data: logEntry,
                        directory: Directory.Documents,
                        encoding: Encoding.UTF8,
                    });
                } catch (writeErr) {
                    console.error('Failed to create log file', writeErr);
                }
            }
        }
    },

    info: (msg) => Logger.log(msg, 'INFO'),
    warn: (msg) => Logger.log(msg, 'WARN'),
    error: (msg) => Logger.log(msg, 'ERROR'),

    /**
     * Read the entire log file
     * @returns {Promise<string>}
     */
    readLogs: async () => {
        try {
            const contents = await Filesystem.readFile({
                path: LOG_FILE,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            return contents.data;
        } catch (e) {
            return '';
        }
    },

    /**
     * Clear the log file
     */
    clearLogs: async () => {
        try {
            await Filesystem.deleteFile({
                path: LOG_FILE,
                directory: Directory.Documents
            });
        } catch (e) {
            // Ignore if file doesn't exist
        }
    }
};
