import { Model, Document, ObjectId, FilterQuery } from "mongoose";

class BaseRepository<T extends Document> {
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async create(data: Partial<T>): Promise<T> {
    const newItem = new this.model(data);
    return await newItem.save();
  }
  async findById(id: ObjectId): Promise<T | null> {
    return await this.model.findById(id);
  }
  async findOne(condition: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(condition).lean<T>().exec();
  }
  async update(id: ObjectId, updateData: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default BaseRepository;
