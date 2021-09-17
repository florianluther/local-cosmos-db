export interface ILogger {
    log(message: string): void
}

export class Logger implements ILogger {
    private static logger: ILogger

    private constructor() {}

    static make(): ILogger {
        if (this.logger) {
            return this.logger
        }

        this.logger = new Logger()

        return this.logger
    }

    log(message: string): void {
        console.log(message)
    }
}
