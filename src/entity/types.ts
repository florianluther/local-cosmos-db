export interface IEntity<T> {
  id: string;
  partition: string;
  data: T;
}
