export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
}
