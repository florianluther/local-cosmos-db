import { AppConfiguration } from './configuration'
import { EntityRepository } from './entity/entity.repository'
import { Logger } from './logger'

export async function run(): Promise<void> {
    const logger = Logger.make()
    const configuration = AppConfiguration.read()

    const repository: EntityRepository = EntityRepository.make({
        connection: { endpoint: configuration.endpoint, key: configuration.key },
        databaseName: configuration.database,
        pageSize: 100,
    })

    const keys = {
        id: '1',
        partition: 'A',
    }

    const result = await repository.get(keys.id, keys.partition)

    if (result.kind === 'not-found') {
        logger.log(`The entity with id '${keys.id}' and partition key '${keys.partition}' was not found.`)
    } else {
        logger.log(`The entity with id '${result.value.id}' was successfully loaded: '${result.value.data}'`)
    }
}

run()
