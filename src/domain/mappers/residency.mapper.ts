import { Residency } from '../entities';
import { Mapper } from './base.mapper';

export interface ResidencyMapper<Model> extends Mapper<Residency, Model> {}

export const ResidencyMapper = Symbol('ResidencyMapper');
