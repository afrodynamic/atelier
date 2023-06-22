import { FC, useEffect } from 'react';

import { useGetRelatedProductsQuery, useGetRelatedProductsStylesQuery } from '../../../api/api';
import { useAppSelector } from '../../../app/hooks';
import { CardCarousel } from '../../../components/common/CardCarousel';

export const RelatedItemsAndOutfitCreation: FC = () => {
  const productId = useAppSelector((state) => state.productDetail.selectedProductId);

  const { data: relatedProducts, isFetching: isFetchingRelatedProducts } = useGetRelatedProductsQuery(productId);

  const { data: relatedProductsStyles, isFetching: isFetchingRelatedProductsStyles } = useGetRelatedProductsStylesQuery(
    relatedProducts,
    {
      skip: !(relatedProducts && !isFetchingRelatedProducts),
    }
  );

  useEffect(() => {
    if (!relatedProductsStyles || isFetchingRelatedProducts || isFetchingRelatedProductsStyles) {
      return;
    }

  }, [relatedProductsStyles, isFetchingRelatedProducts, isFetchingRelatedProductsStyles]);

  const outfitProducts = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1612837017391-0e3b5b5b0b0a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
      name: 'Product 1',
      category: 'Shoes',
      price: 40,
      salePrice: 15,
      rating: 4.5,
      reviewCount: 10
    },
    {
      id: 2,
      primaryImage: 'https://images.unsplash.com/photo-1612837017391-0e3b5b5b0b0a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
      imageUrl: 'Product 1',
      category: 'Shoes',
      price: 100,
      salePrice: 80,
      rating: 4.7,
      reviewCount: 2
    },
    {
      id: 3,
      primaryImage: 'https://images.unsplash.com/photo-1612837017391-0e3b5b5b0b0a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
      imageUrl: 'Product 1',
      category: 'Shoes',
      price: 120,
      salePrice: 105,
      rating: 4.2,
      reviewCount: 9
    }
  ];

  return (
    <div data-testid='related-items-and-outfit-creation' className="dark:bg-gray-800 my-4">
      <div className="related-products">
        <div className="text-center">
          <h2 className="text-3xl py-4">Related Products</h2>
          <CardCarousel cardData={relatedProductsStyles} />
        </div>
      </div>

      <div className="your-outfit">
        <div className="text-center">
          <h2 className="text-3xl py-4">Your Outfits</h2>
          <CardCarousel cardData={relatedProductsStyles} />
        </div>
      </div>
    </div>
  );
};
