import * as sequelize from '../data/sequelize';
import * as commonActions from './common-actions';
import { Product } from './models';

export const queryAttributes = [ 'name', 'description' ];
const sequelizeModel = sequelize.Product;

const common = commonActions.resolve<Product>(queryAttributes, sequelizeModel);
export const get = common.get;
export const getAll = common.getAll;
export const count = common.count;
export const create = common.create;
export const update = common.update;
export const destroy = common.destroy;
