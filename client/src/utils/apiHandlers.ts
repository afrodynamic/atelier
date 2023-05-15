import { rest } from 'msw';

import { productAnswersCountData, productAnswersData, productAnswersPagedCountData, productAnswersPagedData, productCartData, productDetailsData, productQuestionsCountData, productQuestionsData, productQuestionsPagedCountData, productQuestionsPagedData, productRelatedData, productReviewMetadataData, productReviewsCountData, productReviewsData, productReviewsPagedCountData, productReviewsPagedData, productsCountData, productsData, productsPagedCountData, productsPagedData, productStylesData } from './test-data';

export const handlers = [
  rest.get('/api/products', (request, response, context) => {
    const params = new URLSearchParams(request.url.searchParams);
    const page = params.get('page');
    const count = params.get('count');

    if (page && count) {
      return response(context.json(productsPagedCountData));
    } else if (page) {
      return response(context.json(productsPagedData));
    } else if (count) {
      return response(context.json(productsCountData));
    } else {
      return response(context.json(productsData));
    }
  }),

  rest.get('/api/products/:productId', (request, response, context) => {
    return response(context.json(productDetailsData));
  }),

  rest.get('/api/products/:productId/styles', (request, response, context) => {
    return response(context.json(productStylesData));
  }),

  rest.get('/api/products/:productId/related', (request, response, context) => {
    return response(context.json(productRelatedData));
  }),

  rest.get('/api/reviews', (request, response, context) => {
    const params = new URLSearchParams(request.url.searchParams);
    const page = params.get('page');
    const count = params.get('count');

    if (page && count) {
      return response(context.json(productReviewsPagedCountData));
    } else if (page) {
      return response(context.json(productReviewsPagedData));
    } else if (count) {
      return response(context.json(productReviewsCountData));
    } else {
      return response(context.json(productReviewsData));
    }
  }),

  rest.get('/api/reviews/meta', (request, response, context) => {
    return response(context.json(productReviewMetadataData));
  }),

  rest.get('/api/qa/questions', (request, response, context) => {
    const params = new URLSearchParams(request.url.searchParams);
    const page = params.get('page');
    const count = params.get('count');

    if (page && count) {
      return response(context.json(productQuestionsPagedCountData));
    } else if (page) {
      return response(context.json(productQuestionsPagedData));
    } else if (count) {
      return response(context.json(productQuestionsCountData));
    } else {
      return response(context.json(productQuestionsData));
    }
  }),

  rest.get('/api/qa/questions/:questionId/answers', (request, response, context) => {
    const params = new URLSearchParams(request.url.searchParams);
    const page = params.get('page');
    const count = params.get('count');

    if (page && count) {
      return response(context.json(productAnswersPagedCountData));
    } else if (page) {
      return response(context.json(productAnswersPagedData));
    } else if (count) {
      return response(context.json(productAnswersCountData));
    } else {
      return response(context.json(productAnswersData));
    }
  }),

  rest.get('/api/cart', (request, response, context) => {
    return response(context.json(productCartData));
  }),

  rest.post('/api/qa/questions', (request, response, context) => {
    return response(context.status(201), context.json({ message: 'Created' }));
  }),

  rest.post('/api/qa/questions/:questionId/answers', (request, response, context) => {
    return response(context.status(201), context.json({ message: 'Created' }));
  }),

  rest.post('/api/reviews', (request, response, context) => {
    return response(context.status(201), context.json({ message: 'Created' }));
  }),

  rest.post('/api/cart', (requestuest, response, context) => {
    return response(context.status(201), context.json({ message: 'Created' }));
  }),

  rest.put('/api/qa/questions/:questionId/helpful', (request, response, context) => {
    return response(context.status(204));
  }),

  rest.put('/api/qa/questions/:questionId/report', (request, response, context) => {
    return response(context.status(204));
  }),

  rest.put('/api/qa/answers/:answerId/helpful', (request, response, context) => {
    return response(context.status(204));
  }),

  rest.put('/api/qa/answers/:answerId/report', (request, response, context) => {
    return response(context.status(204));
  }),
];
