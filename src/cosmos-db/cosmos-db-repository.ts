import {
  Container,
  CosmosClient,
  Database,
  StoredProcedure,
} from "@azure/cosmos";
import { Conflict, Created, NoContent, NotFound, Ok } from "../result";
import { IRepositoryConfiguration } from "./configuration";
import {
  IQuery,
  IRepository,
  IRepositoryQueryResult,
  IStoredProcedure,
} from "./repository";
import {
  CosmosDbDocument,
  ICosmosDbOptions,
  ICosmosDbQueryOptions,
} from "./types";

/**
 * This abstract repository provides functionality to access a Cosmos DB.
 * It must be derived from this class in order to use a particular entity `T`.
 *
 * @export
 * @abstract
 * @class CosmosDbRepository
 * @implements {IRepository<T>}
 * @implements {IQuery<ICosmosDbQueryOptions, T>}
 * @template T
 */
export abstract class CosmosDbRepository<T>
  implements IRepository<T>, IQuery<ICosmosDbQueryOptions, T>, IStoredProcedure
{
  private readonly databaseName: string;

  /**
   * Gets the name of the specified container.
   *
   * @readonly
   * @protected
   * @abstract
   * @type {string}
   * @memberof CosmosDbRepository
   */
  protected abstract get containerName(): string;
  protected client: CosmosClient;

  constructor(configuration: IRepositoryConfiguration) {
    if (typeof configuration.connection === "string") {
      this.client = new CosmosClient(configuration.connection);
    } else {
      const options: ICosmosDbOptions = {
        endpoint: configuration.connection.endpoint,
        key: configuration.connection.key,
      };

      this.client = new CosmosClient(options);
    }

    this.databaseName = configuration.databaseName;
  }

  async delete(
    id: string,
    partitionKey: string
  ): Promise<NoContent | NotFound> {
    try {
      const database: Database = this.client.database(this.databaseName);
      const container: Container = database.container(this.containerName);
      await container.item(id, partitionKey).delete<T>();

      return new NoContent();
    } catch (error) {
      // @ts-ignore
      if (error.code === 404) {
        return new NotFound();
      }

      throw error;
    }
  }

  async get(id: string, partitionKey: string): Promise<Ok<T> | NotFound> {
    const database: Database = this.client.database(this.databaseName);
    const container: Container = database.container(this.containerName);
    const result = await container.item(id, partitionKey).read<T>();

    if (result.statusCode === 404 || !result.resource) {
      return new NotFound();
    }

    return new Ok(result.resource);
  }

  async insert(entity: T): Promise<Created<T> | Conflict> {
    try {
      const database: Database = this.client.database(this.databaseName);
      const container: Container = database.container(this.containerName);
      await container.items.create(entity);

      return new Created(entity);
    } catch (error) {
      // @ts-ignore
      if (error.code === 409) {
        return new Conflict();
      }

      throw error;
    }
  }

  async update(
    entity: T,
    id: string,
    partitionKey: string
  ): Promise<Ok<T> | NotFound> {
    try {
      const database: Database = this.client.database(this.databaseName);
      const container: Container = database.container(this.containerName);
      await container.item(id, partitionKey).replace(entity);

      return new Ok(entity);
    } catch (error) {
      // @ts-ignore
      if (error.code === 404) {
        return new NotFound();
      }

      throw error;
    }
  }

  async upsert(entity: T): Promise<Ok<T>> {
    const database: Database = this.client.database(this.databaseName);
    const container: Container = database.container(this.containerName);
    await container.items.upsert(entity);

    return new Ok(entity);
  }

  /**
   * Queries entities of `T` from the database. In order to query with continuation token follow the example below.
   *
   * const options: ICosmosDbQueryOptions = {
   *     query: 'SELECT * FROM c'
   * }
   *
   * let values: T[] = []
   * let continuationToken
   *
   * do {
   *     const result = await repository.query(options)
   *
   *     continuationToken = result.value.continuationToken
   *     options.continuationToken = continuationToken
   *
   *     values = values.concat(result.value.values)
   * } while (!!continuationToken)
   *
   * @param {ICosmosDbQueryOptions} options
   * @returns {Promise<Ok<IRepositoryQueryResult<T>>>}
   * @memberof CosmosDbRepository
   */
  async query(
    options: ICosmosDbQueryOptions
  ): Promise<Ok<IRepositoryQueryResult<T>>> {
    const database: Database = this.client.database(this.databaseName);
    const container: Container = database.container(this.containerName);

    const iterator = container.items.query<CosmosDbDocument<T>>(options.query, {
      continuationToken: options.continuationToken,
      maxItemCount: options.maxItemCount,
    });

    const response = await iterator.fetchNext();

    return new Ok({
      values: response.resources,
      continuationToken: response.continuationToken,
    });
  }

  async execute<TResult>(
    name: string,
    partitionKey: string,
    params?: any[]
  ): Promise<Ok<TResult> | NotFound> {
    const database: Database = this.client.database(this.databaseName);
    const container: Container = database.container(this.containerName);
    const procedure: StoredProcedure = container.scripts.storedProcedure(name);

    const result = await procedure.execute(partitionKey, params);

    if (result.statusCode === 404 || !result.resource) {
      return new NotFound();
    }

    return new Ok(result.resource);
  }
}
