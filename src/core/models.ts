import * as express from 'express';
import { Moment } from 'moment';
import { Transaction } from 'sequelize';

import { paymentMethods, paymentStatuses } from '../data/sequelize';

export interface CommonModel
{
  id?: string;
  createdAt?: Moment;
  updatedAt?: Moment;
}

export interface Config
{
  environment: 'dev' | 'production' | 'test';
  databases: { [key: string]: string };
  version: string;
}

export interface Context
{
  transaction: Transaction;
}

export interface Payment extends CommonModel
{
  amount: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  user?: string;
  product?: Product;
}

export type PaymentMethod = typeof paymentMethods[number];

export type PaymentStatus = typeof paymentStatuses[number];

export interface Product extends CommonModel
{
  name: string;
  description: string;
  price: number;
  stockLevel: number;
}

export interface Request extends express.Request
{
  context: Context;
  query: any;
}

export interface SortOrder
{
  attribute: string;
  descending?: boolean;
}
