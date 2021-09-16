export interface IConfiguration {
  container: string;
  database: string;
  endpoint: string;
  key: string;
}

// TODO: use .env (dotenv)
export class AppConfiguration {
  static read(): IConfiguration {
    return {
      endpoint: "endpoint",
      key: "key",
      database: "db",
      container: "container",
    };
  }
}
