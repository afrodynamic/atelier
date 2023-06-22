import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  Answer,
  CartItem,
  Product,
  Question,
  Review,
  ReviewsMetadata,
  Style,
} from '../features/productDetail/types';

const baseQuery = fetchBaseQuery({ baseUrl: '/api' });

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Product',
    'RelatedProducts',
    'Styles',
    'Reviews',
    'Questions',
    'Answers',
    'ReviewsMetadata',
    'Cart',
    'ProductsPaginatedList',
    'QuestionsPaginatedList',
    'AnswersPaginatedList',
    'ReviewsPaginatedList'
  ],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { page?: number; count?: number }>({
      query: ({ page, count }) => {
        let url = '/products';

        if (page && count) {
          url += `?page=${page}&count=${count}`;
        } else if (page) {
          url += `?page=${page}`;
        } else if (count) {
          url += `?count=${count}`;
        }

        return url;
      },
      providesTags: (result, error, { page, count }) =>
        result ? [{ type: 'ProductsPaginatedList', page, count }] : [],
    }),

    getProductDetails: builder.query<Product, number>({
      query: (productId) => `products/${productId}`,
      providesTags: ['Product'],
    }),

    getProductStyles: builder.query<Style[], number>({
      query: (productId) => `products/${productId}/styles`,
      transformResponse: (response: { results: Style[] }) => response.results,
      providesTags: ['Styles'],
    }),

    getRelatedProductsStyles: builder.query<Style[], number[]>({
      queryFn: async(productIds, api, options, fetchWithBQ) => {
        const styles: Style[] = [];

        for (const productId of productIds) {
          const result = await fetchWithBQ(`products/${productId}/styles`);
          if (result.data) {
            const productStyles: Style[] = result.data.results;
            const defaultStyle = productStyles.find((style) => style['default?']);

            if (defaultStyle) {
              styles.push(defaultStyle);
            } else if (productStyles.length > 0) {
              styles.push(productStyles[0]);
            }
          } else {
            console.error(result.error);
          }
        }

        return { data: styles };
      },
      providesTags: ['RelatedProducts'],
    }),


    getRelatedProducts: builder.query<number[], number>({
      query: (productId) => `/products/${productId}/related`,
      providesTags: ['RelatedProducts'],
    }),

    getReviews: builder.query<
      Review[],
      { productId: number; page?: number; count?: number }
    >({
      query: ({ productId, page, count }) => {
        let url = `/reviews?product_id=${productId}`;

        if (page && count) {
          url += `&page=${page}&count=${count}`;
        } else if (page) {
          url += `&page=${page}`;
        } else if (count) {
          url += `&count=${count}`;
        }

        return url;
      },
      transformResponse: (response: { results: Review[] }) => response.results,
      providesTags: (result, error, { productId, page, count }) =>
        result ? [{ type: 'Reviews', productId }, { type: 'ReviewsPaginatedList', page, count }] : [],
    }),

    getReviewsMetadata: builder.query<ReviewsMetadata, number>({
      query: (productId) => `/reviews/meta?product_id=${productId}`,
      providesTags: ['ReviewsMetadata'],
    }),

    getQuestions: builder.query<
      Question[],
      { productId: number; page?: number; count?: number }
    >({
      query: ({ productId, page, count }) => {
        let url = `/qa/questions?product_id=${productId}`;

        if (page && count) {
          url += `&page=${page}&count=${count}`;
        } else if (page) {
          url += `&page=${page}`;
        } else if (count) {
          url += `&count=${count}`;
        }

        return url;
      },
      transformResponse: (response: { results: Question[] }) => response.results,
      providesTags: (result, error, { productId, page, count }) =>
        result ? [{ type: 'Questions', productId }, { type: 'QuestionsPaginatedList', page, count }] : [],
    }),

    getAnswers: builder.query<
      Answer[],
      { questionId: number; page?: number; count?: number }
    >({
      query: ({ questionId, page, count }) => {
        let url = `/qa/questions/${questionId}/answers`;

        if (page && count) {
          url += `?page=${page}&count=${count}`;
        } else if (page) {
          url += `?page=${page}`;
        } else if (count) {
          url += `?count=${count}`;
        }

        return url;
      },
      providesTags: (result, error, { questionId, page, count }) =>
        result ? [{ type: 'Answers', questionId }, { type: 'AnswersPaginatedList', questionId, page, count }] : [],
    }),

    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    addQuestion: builder.mutation<
      Question,
      { body: string; name: string; email: string; product_id: number }
    >({
      query: ({ body, name, email, product_id }) => ({
        url: '/qa/questions',
        method: 'POST',
        body: {
          body: body,
          name: name,
          email: email,
          product_id: Number(product_id),
        }
      }),
      invalidatesTags: ['Questions'],
    }),

    addAnswer: builder.mutation<
      string,
      {
        question_id: number;
        body: string;
        name: string;
        email: string;
        photos: string[];
      }
    >({
      query: ({ question_id, body, name, email, photos }) => ({
        url: `/qa/questions/${question_id}/answers`,
        method: 'POST',
        body: {
          body,
          name,
          email,
          photos,
        },
      }),
      invalidatesTags: ['Answers'],
    }),

    addReview: builder.mutation<
      Review,
      {
        product_id: number;
        rating: number;
        summary: string;
        body: string;
        recommend: boolean;
        name: string;
        email: string;
        photos: string[];
        characteristics: { [characteristic_id: string]: number };
      }
    >({
      query: (review) => ({
        url: '/reviews',
        method: 'POST',
        body: review,
      }),
      invalidatesTags: ['Reviews'],
    }),

    addToCart: builder.mutation<void, number>({
      query: (skuId) => ({
        url: '/cart',
        method: 'POST',
        body: { sku_id: skuId },
      }),
      invalidatesTags: ['Cart'],
    }),

    markQuestionHelpful: builder.mutation<void, number>({
      query: (questionId) => ({
        url: `/qa/questions/${questionId}/helpful`,
        method: 'PUT',
      }),
      invalidatesTags: ['Questions'],
    }),

    reportQuestion: builder.mutation<void, number>({
      query: (questionId) => ({
        url: `/qa/questions/${questionId}/report`,
        method: 'PUT',
      }),
      invalidatesTags: ['Questions'],
    }),

    markAnswerHelpful: builder.mutation<void, number>({
      query: (answerId) => ({
        url: `/qa/answers/${answerId}/helpful`,
        method: 'PUT',
      }),
      invalidatesTags: ['Questions', 'Answers'],
    }),

    reportAnswer: builder.mutation<void, number>({
      query: (answerId) => ({
        url: `/qa/answers/${answerId}/report`,
        method: 'PUT',
      }),
      invalidatesTags: ['Questions', 'Answers'],
    }),

    markReviewHelpful: builder.mutation<void, number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpful`,
        method: 'PUT',
      }),
      invalidatesTags: ['Reviews'],
    }),

    reportReview: builder.mutation<void, number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/report`,
        method: 'PUT',
      }),
      invalidatesTags: ['Reviews'],
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductStylesQuery,
  useGetRelatedProductsStylesQuery,
  useGetRelatedProductsQuery,
  useGetReviewsQuery,
  useGetReviewsMetadataQuery,
  useGetQuestionsQuery,
  useGetAnswersQuery,
  useGetCartQuery,
  useAddQuestionMutation,
  useAddAnswerMutation,
  useAddReviewMutation,
  useAddToCartMutation,
  useMarkQuestionHelpfulMutation,
  useReportQuestionMutation,
  useMarkAnswerHelpfulMutation,
  useReportAnswerMutation,
  useMarkReviewHelpfulMutation,
  useReportReviewMutation,
} = api;
