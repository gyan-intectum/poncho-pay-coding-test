import * as sequelize from '../data/sequelize';
import * as commonActions from './common-actions';
import { ValidationError } from './errors';
import { Context, Payment, PaymentMethod } from './models';

export const queryAttributes = [];
const sequelizeModel = sequelize.Payment;

const common = commonActions.resolve<Payment>(queryAttributes, sequelizeModel);
export const get = common.get;
export const getAll = common.getAll;
export const count = common.count;
export const create = common.create;

export async function completedSum(context: Context)
{
  const payments = await getAll(context, undefined, undefined, undefined, { status: 'complete' });

  return payments.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);
}

export async function setUser(context: Context, id: string, user: string)
{
  const payment = await get(context, id);

  if (payment.status !== 'initialised')
  {
    throw new ValidationError([ 'status must be: initialised' ]);
  }

  return common.update(context, { ...payment, status: 'user-set', user });
}

export async function takePayment(context: Context, id: string, paymentMethod: PaymentMethod)
{
  const payment = await get(context, id);

  if (payment.status !== 'user-set')
  {
    throw new ValidationError([ 'status must be: user-set' ]);
  }

  return common.update(context, { ...payment, status: 'payment-taken', paymentMethod });
}

export async function complete(context: Context, id: string)
{
  const payment = await get(context, id);

  if (payment.status !== 'payment-taken')
  {
    throw new ValidationError([ 'status must be: payment-taken' ]);
  }

  return common.update(context, { ...payment, status: 'complete' });
}
