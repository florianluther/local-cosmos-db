import { CosmosClient } from '@azure/cosmos'
import { IConfiguration } from '../configuration'
import { ILogger } from '../logger'

export class InitialDatabaseSetup {
    private static instance: InitialDatabaseSetup

    static make(client: CosmosClient, configuration: IConfiguration, logger: ILogger): InitialDatabaseSetup {
        if (!!this.instance) {
            return this.instance
        }

        this.instance = new InitialDatabaseSetup(client, configuration, logger)

        return this.instance
    }

    private constructor(
        private readonly client: CosmosClient,
        private readonly configuration: IConfiguration,
        private readonly logger: ILogger
    ) {}

    async createDatabase(): Promise<void> {
        this.logger.log(`The database '${this.configuration.database}' will be created if it does not exist.`)

        await this.client.databases.createIfNotExists({
            id: this.configuration.database,
        })
    }

    async createContainer(name: string, partitionKey: string): Promise<void> {
        this.logger.log(`The container '${name}' will be created if it does not exist.`)

        await this.client
            .database(this.configuration.database)
            .containers.createIfNotExists({ id: name, partitionKey }, { offerThroughput: 400 })
    }
}
