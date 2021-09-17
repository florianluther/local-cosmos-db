import { IRepositoryConfiguration } from "../cosmos-db/configuration";
import { CosmosDbRepository } from "../cosmos-db/cosmos-db-repository";
import { IEntity } from "./types";

export class EntityRepository extends CosmosDbRepository<IEntity<string>> {
  private static instance: EntityRepository;

  protected get containerName(): string {
    return "entities";
  }

  private constructor(configuration: IRepositoryConfiguration) {
    super(configuration);
  }

  static make(configuration: IRepositoryConfiguration): EntityRepository {
    if (!!this.instance) {
      return this.instance;
    }

    this.instance = new EntityRepository(configuration);

    return this.instance;
  }
}
