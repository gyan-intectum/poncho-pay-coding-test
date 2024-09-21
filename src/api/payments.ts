import * as express from 'express';

import { ValidationError } from '../core/errors';
import { Payment, PaymentMethod, Request } from '../core/models';
import * as payments from '../core/payments';
import { paymentMethods } from '../data/sequelize';
import validation from './middleware/validation';
import transaction from './middleware/transaction';
import * as openApi from './open-api';
import { addPagingHeaders, getAllQueryParams, getFilters, toInclude, toSortOrder } from './util';

const tag = 'Payments';
const middleware = [ validation, transaction ];
const filterAttributes = [ 'status' ];

export default function(app: express.Express): void
{
  app.get(
    '/payments',
    openApi.register(
      tag,
      'get',
      '/payments',
      'Retrieves Payments',
      undefined,
      {
        queryParams: getAllQueryParams(filterAttributes, payments.queryAttributes, undefined)
      },
      { code: '200', type: 'payment[]' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      addPagingHeaders(req, res, await payments.count(req.context, getFilters(req, filterAttributes), req.query.q));

      res.send(await payments.getAll(
        req.context,
        req.query.page,
        req.query.pageSize,
        toSortOrder(req.query.sort),
        getFilters(req, filterAttributes),
        req.query.q,
        toInclude(req.params.embed)
      ));
    }
  );

  app.post(
    '/payments',
    openApi.register(
      tag,
      'post',
      '/payments',
      'Creates a Payment',
      undefined,
      { bodyType: 'payment' },
      { code: '201', type: 'payment' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      const thePayment = req.body as Payment;

      res.send(await payments.create(req.context, thePayment));
    }
  );

  app.get(
    '/payments/completed-sum',
    openApi.register(
      tag,
      'get',
      '/payments/completed-sum',
      'Sums the amounts of all completed Payments',
      undefined,
      {},
      { code: '200', type: 'number' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      res.send((await payments.completedSum(req.context)).toString());
    }
  );

  app.get(
    '/payments/:paymentId',
    openApi.register(
      tag,
      'get',
      '/payments/:paymentId',
      'Retrieves a Payment',
      undefined,
      {
        params: [ { name: 'paymentId', description: 'The ID of the Payment', type: 'string' } ]
      },
      { code: '200', type: 'payment' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      res.send(await payments.get(req.context, req.params.paymentId, toInclude(req.params.embed)));
    }
  );

  app.post(
    '/payments/:paymentId/set-user',
    openApi.register(
      tag,
      'post',
      '/payments/:paymentId/set-user',
      'Sets the user of a Payment',
      undefined,
      {
        params: [ { name: 'paymentId', description: 'The ID of the Payment', type: 'string' } ],
        contentTypes: [ 'text/plain' ],
        bodyType: 'string'
      },
      { code: '200', type: 'payment' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      res.send(await payments.setUser(req.context, req.params.paymentId, req.body as string));
    }
  );

  app.post(
    '/payments/:paymentId/take-payment',
    openApi.register(
      tag,
      'post',
      '/payments/:paymentId/take-payment',
      'Takes payment for a Payment',
      undefined,
      {
        params: [ { name: 'paymentId', description: 'The ID of the Payment', type: 'string' } ],
        contentTypes: [ 'text/plain' ],
        bodyType: 'string'
      },
      { code: '200', type: 'payment' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      const paymentMethod = req.body as PaymentMethod;

      if (!paymentMethods.includes(paymentMethod))
      {
        throw new ValidationError([ `paymentMethod must be one of: ${paymentMethods}` ]);
      }

      res.send(await payments.takePayment(req.context, req.params.paymentId, paymentMethod));
    }
  );

  app.post(
    '/payments/:paymentId/complete',
    openApi.register(
      tag,
      'post',
      '/payments/:paymentId/complete',
      'Completes a Payment',
      undefined,
      {
        params: [ { name: 'paymentId', description: 'The ID of the Payment', type: 'string' } ]
      },
      { code: '200', type: 'payment' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      res.send(await payments.complete(req.context, req.params.paymentId));
    }
  );
}
