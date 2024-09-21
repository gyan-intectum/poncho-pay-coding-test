import * as express from 'express';

import * as products from '../core/products';
import { Product, Request } from '../core/models';
import validation from './middleware/validation';
import transaction from './middleware/transaction';
import * as openApi from './open-api';
import { addPagingHeaders, getAllQueryParams, toInclude, toSortOrder } from './util';

const tag = 'Products';
const middleware = [ validation, transaction ];

export default function(app: express.Express): void
{
  app.get(
    '/products',
    openApi.register(
      tag,
      'get',
      '/products',
      'Retrieves Products',
      undefined,
      {
        queryParams: getAllQueryParams(undefined, products.queryAttributes, [])
      },
      { code: '200', type: 'product[]' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      addPagingHeaders(req, res, await products.count(req.context, undefined, req.query.q));

      res.send(await products.getAll(
        req.context,
        req.query.page,
        req.query.pageSize,
        toSortOrder(req.query.sort),
        undefined,
        req.query.q,
        toInclude(req.query.embed)
      ));
    }
  );

  app.post(
    '/products',
    openApi.register(
      tag,
      'post',
      '/products',
      'Creates a Product',
      undefined,
      { bodyType: 'product' },
      { code: '201', type: 'product' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      const theProduct = req.body as Product;

      res.send(await products.create(req.context, theProduct));
    }
  );

  app.get(
    '/products/:productId',
    openApi.register(
      tag,
      'get',
      '/products/:productId',
      'Retrieves a Product',
      undefined,
      {
        params: [ { name: 'productId', description: 'The ID of the Product', type: 'string' } ]
      },
      { code: '200', type: 'product' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      res.send(await products.get(req.context, req.params.productId, toInclude(req.query.embed)));
    }
  );

  app.put(
    '/products/:productId',
    openApi.register(
      tag,
      'put',
      '/products/:productId',
      'Updates a Product',
      undefined,
      {
        params: [ { name: 'productId', description: 'The ID of the Product', type: 'string' } ],
        bodyType: 'product',
      },
      { code: '200', type: 'product' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      const theProduct = req.body as Product;
      theProduct.id = req.params.productId;

      res.send(await products.update(req.context, theProduct, toInclude(req.query.embed)));
    }
  );

  app.delete(
    '/products/:productId',
    openApi.register(
      tag,
      'delete',
      '/products/:productId',
      'Deletes a Product',
      undefined,
      {
        params: [ { name: 'productId', description: 'The ID of the Product', type: 'string' } ]
      },
      { code: '204' }
    ),
    ...middleware,
    async (req: Request, res: express.Response) =>
    {
      await products.destroy(req.context, req.params.productId);
      res.end();
    }
  );
}
