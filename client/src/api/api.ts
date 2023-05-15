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
    'Style',
    'Review',
    'Question',
    'Answer',
    'ReviewsMetadata',
    'Cart',
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
      providesTags: ['Product'],
    }),

    getProductDetails: builder.query<Product, number>({
      query: (productId) => `products/${productId}`,
      providesTags: ['Product'],
    }),

    getProductStyles: builder.query<Style[], number>({
      query: (productId) => `products/${productId}/styles`,
      providesTags: ['Style'],
    }),

    getRelatedProducts: builder.query<number[], number>({
      query: (productId) => `/products/${productId}/related`,
      providesTags: ['Product'],
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
      providesTags: ['Review'],
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
      providesTags: ['Question'],
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

      providesTags: ['Answer'],
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
          body,
          name,
          email,
          product_id,
        },
      }),
      invalidatesTags: ['Question'],
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
      invalidatesTags: ['Answer'],
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
      invalidatesTags: ['Review'],
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
      invalidatesTags: ['Question'],
    }),

    reportQuestion: builder.mutation<void, number>({
      query: (questionId) => ({
        url: `/qa/questions/${questionId}/report`,
        method: 'PUT',
      }),
      invalidatesTags: ['Question'],
    }),

    markAnswerHelpful: builder.mutation<void, number>({
      query: (answerId) => ({
        url: `/qa/answers/${answerId}/helpful`,
        method: 'PUT',
      }),
      invalidatesTags: ['Answer'],
    }),

    reportAnswer: builder.mutation<void, number>({
      query: (answerId) => ({
        url: `/qa/answers/${answerId}/report`,
        method: 'PUT',
      }),
      invalidatesTags: ['Answer'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductStylesQuery,
  useGetRelatedProductsQuery,
  useGetReviewsQuery,
  useGetReviewsMetadataQuery,
  useGetQuestionsQuery,
  useGetAnswersQuery,
  useGetCartQuery,
  useAddQuestionMutation,
  useAddAnswerMutation,
  useMarkQuestionHelpfulMutation,
  useMarkAnswerHelpfulMutation,
  useReportQuestionMutation,
  useReportAnswerMutation,
  useAddReviewMutation,
  useAddToCartMutation,
} = api;
