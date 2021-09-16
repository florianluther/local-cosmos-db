import { CosmosClient } from "@azure/cosmos";
import { AppConfiguration } from "./configuration";

export async function run(): Promise<void> {
  const configuration = AppConfiguration.read();
  const client = new CosmosClient({
    endpoint: configuration.endpoint,
    key: configuration.key,
  });
  const result = await readDatabaseDefinition(client);

  console.log(JSON.stringify(result));
}

export async function readDatabaseDefinition(
  cosmosDbClient: CosmosClient
): Promise<string> {
  const configuration = AppConfiguration.read();
  const { resource: definition } = await cosmosDbClient
    .database(configuration.database)
    .read();

  if (!definition) {
    return "<empty>";
  }

  return definition.id;
}

run();
