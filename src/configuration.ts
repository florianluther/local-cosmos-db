require('dotenv').config()

export interface IConfiguration {
    database: string
    endpoint: string
    key: string
}

export class AppConfiguration {
    private static instance: IConfiguration

    private constructor() {}

    static read(): IConfiguration {
        if (this.instance) {
            return this.instance
        }

        const endpoint = process.env['ENDPOINT']
        const key = process.env['KEY']
        const database = process.env['DATABASE']

        if (!endpoint || !key || !database) {
            throw new Error(`One or more configuration variables are undefined.`)
        }

        this.instance = {
            endpoint,
            key,
            database,
        }

        return this.instance
    }
}
