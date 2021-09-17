import { Conflict, Created, NoContent, NotFound, Ok } from '../result'

/**
 * This repository implements functionality to execute CRUD operations on the specified type `T`.
 *
 * @export
 * @interface IRepository
 * @template T The specified entity.
 */
export interface IRepository<T> {
    /**
     * Deletes an entity of `T` from the database and returns a proper result.
     *
     * @param {string} id The specified id of `T` which should be deleted.
     * @param {string} partitionKey The specified partition key of `T`.
     * @returns {(Promise<NoContent | NotFound>)}
     * @memberof IRepository
     */
    delete(id: string, partitionKey: string): Promise<NoContent | NotFound>

    /**
     * Retrieves an entity of `T` from the database and returns a proper result.
     *
     * @param {string} id The specified id of `T` which should be retrieved.
     * @param {string} partitionKey The specified partition key of `T`.
     * @returns {(Promise<Ok<T> | NotFound>)}
     * @memberof IRepository
     */
    get(id: string, partitionKey: string): Promise<Ok<T> | NotFound>

    /**
     * Inserts an entity of `T` to the database and returns a proper result.
     *
     * @param {T} entity The specified entity of `T` which should be stored.
     * @returns {(Promise<Created<T> | Conflict>)}
     * @memberof IRepository
     */
    insert(entity: T): Promise<Created<T> | Conflict>

    /**
     * Updates an entity of `T` in the database and returns a proper result.
     *
     * @param {T} entity The specified entity of `T` which should be updated.
     * @param {string} id The specified id of `T` which should be updated.
     * @param {string} partitionKey The specified partition key of `T`.
     * @returns {(Promise<Ok<T> | NotFound>)}
     * @memberof IRepository
     */
    update(entity: T, id: string, partitionKey: string): Promise<Ok<T> | NotFound>

    /**
     * Upserts an entity of `T` in the database and returns a proper result.
     *
     * @param {T} entity The specified entity of `T` which should be upserted.
     * @returns {(Promise<Ok<T>>)}
     * @memberof IRepository
     */
    upsert(entity: T): Promise<Ok<T>>
}

export interface IQuery<TQueryOptions, T> {
    /**
     * Queries entities of `T` from the database.
     *
     * @param {TQueryOptions} options The specified `TQueryOptions` to filter the results.
     * @returns {(Promise<Ok<T[]>>)}
     * @memberof IRepository
     */
    query(options: TQueryOptions): Promise<Ok<IRepositoryQueryResult<T>>>
}

export interface IRepositoryQueryResult<T> {
    values: Array<T>
    continuationToken?: string
}

export interface IStoredProcedure {
    /**
     * Executes a stored procedure of a database and returns a proper result.
     *
     * @param {string} name The specified name of the stored procedure.
     * @param {string} partitionKey The specified value of the partition key.
     * @param {(any[] | undefined)} [params] An array of parameters to pass as arguments to the given stored procedure.
     * @returns {(Promise<Ok<TResult> | NotFound>)}
     * @memberof IStoredProcedure
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    execute<TResult>(name: string, partitionKey: string, params?: any[] | undefined): Promise<Ok<TResult> | NotFound>
}
