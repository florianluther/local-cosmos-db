export interface ILogger {
    log(message: string): void
}

export class Logger implements ILogger {
    private static logger: ILogger

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    private constructor() {}

    static make(): ILogger {
        if (this.logger) {
            return this.logger
        }

        this.logger = new Logger()

        return this.logger
    }

    log(message: string): void {
        /* eslint-disable-next-line no-console */
        console.log(message)
    }
}
