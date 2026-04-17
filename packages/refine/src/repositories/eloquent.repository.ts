/**
 * @fileoverview Eloquent repository implementing BaseRepository via rxdb-eloquent.
 *
 * Bridges local-first RxDB data with the refine service layer by
 * translating CRUD operations to rxdb-eloquent Model calls.
 *
 * @module @abdokouta/react-refine
 * @category Repositories
 */

import { Injectable } from '@abdokouta/ts-container';
import { BaseRepository } from './base.repository';
import type { GetListParams } from '@/interfaces/get-list-params.interface';
import type { GetListResult } from '@/interfaces/get-list-result.interface';
import type { CustomParams } from '@/interfaces/custom-params.interface';

/**
 * Repository that implements CRUD operations via rxdb-eloquent Model.
 *
 * @typeParam TData - The entity/model type.
 * @typeParam TId - The identifier type (defaults to `string` for RxDB).
 */
@Injectable()
export class EloquentRepository<TData, TId = string> extends BaseRepository<TData, TId> {
  /**
   * @param modelClass - The rxdb-eloquent Model class reference.
   */
  constructor(private readonly modelClass: any) {
    super();
  }

  /** @inheritdoc */
  async getOne(id: TId): Promise<TData> {
    // Model.find(id)
    return this.modelClass.find(id);
  }

  /** @inheritdoc */
  async getList(params: GetListParams): Promise<GetListResult<TData>> {
    // Build an rxdb-eloquent query from GetListParams
    let query = this.modelClass.query();

    // Apply filters
    if (params.filters?.length) {
      for (const filter of params.filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }
    }

    // Apply sorting
    if (params.sorters?.length) {
      for (const sorter of params.sorters) {
        query = query.orderBy(sorter.field, sorter.order);
      }
    }

    // Get total count before pagination
    const total = await query.count();

    // Apply pagination
    if (params.pagination) {
      const { current, pageSize } = params.pagination;
      const skip = (current - 1) * pageSize;
      query = query.limit(pageSize).skip(skip);
    }

    const data = await query.get();
    return { data, total };
  }

  /** @inheritdoc */
  async getMany(ids: TId[]): Promise<TData[]> {
    return this.modelClass.query().whereIn('id', ids).get();
  }

  /** @inheritdoc */
  async create(data: Partial<TData>): Promise<TData> {
    return this.modelClass.create(data);
  }

  /** @inheritdoc */
  async update(id: TId, data: Partial<TData>): Promise<TData> {
    const model = await this.modelClass.find(id);
    return model.fill(data).save();
  }

  /** @inheritdoc */
  async deleteOne(id: TId): Promise<void> {
    const model = await this.modelClass.find(id);
    await model.delete();
  }

  /** @inheritdoc */
  async deleteMany(ids: TId[]): Promise<void> {
    for (const id of ids) {
      await this.deleteOne(id);
    }
  }

  /** @inheritdoc */
  async createMany(data: Partial<TData>[]): Promise<TData[]> {
    return Promise.all(data.map((d) => this.modelClass.create(d)));
  }

  /** @inheritdoc */
  async updateMany(ids: TId[], data: Partial<TData>): Promise<TData[]> {
    return Promise.all(ids.map((id) => this.update(id, data)));
  }

  /** @inheritdoc */
  async custom(_params: CustomParams): Promise<any> {
    throw new Error('EloquentRepository does not support custom operations.');
  }

  /**
   * Returns a reactive observable for live data updates.
   * @returns An RxJS-compatible observable of the collection.
   */
  observe$(): any {
    return this.modelClass.query().observe$();
  }
}
