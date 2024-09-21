import * as Sequelize from 'sequelize';

import config from '../core/config';

export type ModelClass = { new (): Sequelize.Model } & typeof Sequelize.Model;

export const sequelize = new Sequelize.Sequelize(config.databases.default,
{
  define:
  {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  logging: false,
  pool:
  {
    max: 25
  }
});

export const paymentMethods = [ 'credit-card', 'voucher' ] as const;
export const paymentStatuses = [ 'initialised', 'user-set', 'payment-taken', 'complete' ] as const;

export class Payment extends Sequelize.Model {}
Payment.init(
  {
    id:
    {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    amount:
    {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate:
      {
        notEmpty: { msg: 'payment.amount cannot be empty' }
      }
    },
    status:
    {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'initialised',
      validate:
      {
        isIn: { args: [ [ ...paymentStatuses ] ], msg: `payment.status must be one of: ${paymentStatuses}` }
      }
    },
    paymentMethod:
    {
      type: Sequelize.STRING,
      validate:
      {
        isIn: { args: [ [ ...paymentMethods ] ], msg: `payment.paymentMethod must be one of: ${paymentMethods}` }
      }
    },
    user:
    {
      type: Sequelize.STRING,
      validate:
      {
        notEmpty: { msg: 'payment.user cannot be empty' }
      }
    }
  },
  {
    sequelize,
    modelName: 'payment',
    scopes:
    {
      publicWrite: { attributes: { exclude: [ 'status', 'paymentMethod', 'user' ] } }
    }
  }
);

export class Product extends Sequelize.Model {}
Product.init(
  {
    id:
    {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    name:
    {
      type: Sequelize.STRING,
      allowNull: false,
      validate:
      {
        notEmpty: { msg: 'product.name cannot be empty' }
      }
    },
    description:
    {
      type: Sequelize.STRING,
      allowNull: false,
      validate:
      {
        notEmpty: { msg: 'product.description cannot be empty' }
      }
    },
    price:
    {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate:
      {
        notEmpty: { msg: 'product.price cannot be empty' }
      }
    },
    stockLevel:
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate:
      {
        notEmpty: { msg: 'product.stockLevel cannot be empty' }
      }
    }
  },
  {
    sequelize,
    modelName: 'product'
  }
);

// Associations are duplicated with *Filter aliases to support including and filtering by an association at the same time

Product.hasMany(Payment, { foreignKey: 'productId' });
Product.hasMany(Payment, { foreignKey: 'productId', as: 'paymentsFilter' });
