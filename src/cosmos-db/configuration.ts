/**
 * The `IRepositoryConfiguration` provides relevant information to connect to the database layer.
 *
 * @export
 * @interface IRepositoryConfiguration
 */
export interface IRepositoryConfiguration {
  /**
   * Gets or sets the `connection` of the database. This can be either a connection string
   * or an `IConnectionOptions` object which contains information about the `endpoint`.
   *
   * @type {(string | IConnectionOptions)}
   * @memberof IRepositoryConfiguration
   */
  connection: string | IConnectionOptions;

  /**
   * Gets or sets the name of the database.
   *
   * @type {string}
   * @memberof IRepositoryConfiguration
   */
  databaseName: string;

  /**
   * Gets or sets the default page size.
   *
   * @type {number}
   * @memberof IRepositoryConfiguration
   */
  pageSize: number;
}

/**
 * The `IConnectionOptions` specify relevant information to connect to the database.
 *
 * @export
 * @interface IConnectionOptions
 */
export interface IConnectionOptions {
  /**
   * Gets or sets the `endpoint` of the database.
   *
   * @type {string}
   * @memberof IConnectionOptions
   */
  endpoint: string;

  /**
   * Gets or sets the secret `key` to access the database.
   *
   * @type {string}
   * @memberof IConnectionOptions
   */
  key: string;
}
