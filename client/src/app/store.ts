import { Action, AnyAction, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { api } from '../api/api';

import { productDetailInitialState, productDetailSlice } from '../features/productDetail/productDetailSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('productDetailState');

    if (serializedState === null) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);

    if (!parsedState.productDetail) {
      localStorage.removeItem('productDetailState');
      return productDetailInitialState;
    }

    return {
      ...productDetailInitialState,
      ...parsedState.productDetail
    };
  } catch (error) {
    console.log('Error loading state from localStorage: ', error);
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state.productDetail);
    localStorage.setItem('productDetailState', serializedState);
  } catch (error) {
    console.log('Error saving state to localStorage: ', error);
  }
};

const persistedState = loadState();

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export const store = configureStore({
  preloadedState: { productDetail: persistedState },
  reducer: {
    productDetail: productDetailSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  saveState(store.getState());
});
