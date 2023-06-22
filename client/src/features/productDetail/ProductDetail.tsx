import { FC } from 'react';

import { ProductOverview } from './ProductOverview/ProductOverview';
import { QuestionsAndAnswers } from './QuestionsAndAnswers/QuestionsAndAnswers';
import { RatingsAndReviews } from './RatingsAndReviews/RatingsAndReviews';
import { RelatedItemsAndOutfitCreation } from './RelatedItemsAndOutfitCreation/RelatedItemsAndOutfitCreation';

export const ProductDetail: FC = () => {
  return (
    <div className='container mx-auto my-8' data-testid='product-detail'>
      <ProductOverview />
      <RelatedItemsAndOutfitCreation />
      <QuestionsAndAnswers />
      <RatingsAndReviews />
    </div>
  );
};
