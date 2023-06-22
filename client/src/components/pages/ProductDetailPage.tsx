import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useGetProductDetailsQuery } from '../../api/api';
import { useAppDispatch } from '../../app/hooks';
import { ProductDetail } from '../../features/productDetail/ProductDetail';
import { setSelectedProductId } from '../../features/productDetail/productDetailSlice';
import { Navbar } from '../layout/Navbar';

export const ProductDetailPage: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const { data: selectedProduct, isLoading } = useGetProductDetailsQuery(Number(productId));

  useEffect(() => {
    if (productId) {
      dispatch(setSelectedProductId(Number(productId)));
    }
  }, [productId, dispatch]);

  return (
    <div>
      { isLoading ? (
        <div>Loading...</div>
      ) : selectedProduct ? (
        <>
          <Navbar />
          <ProductDetail />
        </>
      ) : (
        <div>Product not found</div>
      )}
    </div>
  );
};
