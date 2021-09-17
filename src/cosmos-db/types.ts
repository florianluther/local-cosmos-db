import { Resource, SqlQuerySpec } from "@azure/cosmos";

export interface ICosmosDbOptions {
  endpoint: string;
  key: string;
}

export interface ICosmosDbQueryOptions {
  query: string | SqlQuerySpec;
  continuationToken?: string;
  maxItemCount?: number;
}

export type CosmosDbDocument<T> = T & Resource;
