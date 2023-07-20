import { Birdhouse } from '../entities';
import { Mapper } from './base.mapper';

export interface BirdhouseMapper<Model> extends Mapper<Birdhouse, Model> {}

export const BirdhouseMapper = Symbol('BirdhouseMapper');
