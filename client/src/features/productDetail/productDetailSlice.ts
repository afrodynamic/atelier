import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Cart, CartItem } from './types';

export interface ProductDetailState {
  userCart: Cart;
  selectedProductId: number;
  selectedStyleId: number;
  selectedStyleSKU: number;
  selectedStyleImage: string;
  selectedQuantity: number;
  selectedSize: string;
  selectedProductRating: number;
  questionsMarkedHelpful: Record<number, boolean>;
  answersMarkedHelpful: Record<number, boolean>;
  reviewsMarkedHelpful: Record<number, boolean>;
  reviewAnswersMarkedHelpful: Record<number, boolean>;
}

export const productDetailInitialState: ProductDetailState = {
  userCart: {},
  selectedProductId: 0,
  selectedStyleId: 0,
  selectedStyleSKU: 0,
  selectedStyleImage: '',
  selectedQuantity: 0,
  selectedSize: '-',
  selectedProductRating: 0,
  questionsMarkedHelpful: {},
  answersMarkedHelpful: {},
  reviewsMarkedHelpful: {},
  reviewAnswersMarkedHelpful: {}
};

export const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState: productDetailInitialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const { skuId, quantity, size, productName, styleName, price, image } = action.payload;
      const productId = skuId.toString();

      if (!state.userCart[productId]) {
        state.userCart[productId] = [];
      }

      const existingCartItemIndex = state.userCart[productId].findIndex(item => item.skuId === skuId);

      if (existingCartItemIndex !== -1) {
        state.userCart[productId][existingCartItemIndex].quantity += quantity;
      } else {
        state.userCart[productId].push({
          skuId,
          quantity,
          size,
          productName,
          styleName,
          price,
          image,
        });
      }
    },

    setSelectedProductId: (state, action: PayloadAction<number>) => {
      state.selectedProductId = action.payload;
    },

    setSelectedStyleId: (state, action: PayloadAction<number>) => {
      state.selectedStyleId = action.payload;
    },

    setSelectedStyleSKU: (state, action: PayloadAction<number>) => {
      state.selectedStyleSKU = action.payload;
    },

    setSelectedStyleImage: (state, action: PayloadAction<string>) => {
      state.selectedStyleImage = action.payload;
    },

    setSelectedQuantity: (state, action: PayloadAction<number>) => {
      state.selectedQuantity = action.payload;
    },

    setSelectedSize: (state, action: PayloadAction<string>) => {
      state.selectedSize = action.payload;
    },

    setSelectedProductRating: (state, action: PayloadAction<number>) => {
      state.selectedProductRating = action.payload;
    },

    setMarkQuestionHelpful: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;

      state.questionsMarkedHelpful[questionId] = true;
    },

    setMarkAnswerHelpful: (state, action: PayloadAction<number>) => {
      const answerId = action.payload;

      state.answersMarkedHelpful[answerId] = true;
    },

    setMarkReviewHelpful: (state, action: PayloadAction<number>) => {
      const reviewId = action.payload;

      state.reviewsMarkedHelpful[reviewId] = true;
    },

    setMarkReviewAnswerHelpful: (state, action: PayloadAction<number>) => {
      const reviewAnswerId = action.payload;

      state.reviewAnswersMarkedHelpful[reviewAnswerId] = true;
    },

    resetUserCart: (state) => {
      state.userCart = {};
    }
  },
});

export const {
  addCartItem,
  setSelectedProductId,
  setSelectedStyleId,
  setSelectedStyleSKU,
  setSelectedStyleImage,
  setSelectedQuantity,
  setSelectedSize,
  setSelectedProductRating,
  setMarkQuestionHelpful,
  setMarkAnswerHelpful,
  setMarkReviewHelpful,
  setMarkReviewAnswerHelpful,
  resetUserCart
} = productDetailSlice.actions;
