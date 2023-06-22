import { faker } from '@faker-js/faker';
import { ChangeEvent, FC, useMemo, useState } from 'react';

import {
  api,
  useAddReviewMutation,
  useGetReviewsMetadataQuery,
  useGetReviewsQuery,
  useMarkReviewHelpfulMutation,
  useReportReviewMutation,
} from '../../../api/api';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { formatDateTimestamp } from '../../../utils/formatTimestamp';
import { setMarkReviewHelpful } from '../productDetailSlice';

export const RatingsAndReviews: FC = () => {
  const productId = useAppSelector(
    (state) => state.productDetail.selectedProductId
  );
  const dispatch = useAppDispatch();
  const reviewsMarkedHelpful = useAppSelector(
    (state) => state.productDetail.reviewsMarkedHelpful
  );
  const reviewAnswersMarkedHelpful = useAppSelector(
    (state) => state.productDetail.reviewAnswersMarkedHelpful
  );

  const [
    markReviewHelpful,
    { isLoading: isMarkReviewHelpfulLoading },
  ] = useMarkReviewHelpfulMutation();
  const [
    reportReview,
    { isLoading: isReportReviewLoading },
  ] = useReportReviewMutation();
  const [addReview, { isLoading: isAddReviewLoading }] = useAddReviewMutation();

  const [shownReviewsIndex, setShownReviewsIndex] = useState(4);

  const {
    data: reviews,
    error: reviewsError,
    isLoading: isReviewsLoading,
    isSuccess: isReviewsSuccess,
  } = useGetReviewsQuery(
    { productId },
    {
      skip: !productId,
    }
  );

  const {
    data: reviewsMetadata,
    isLoading: isMetadataLoading,
  } = useGetReviewsMetadataQuery(productId, {
    skip: !productId,
  });

  const [searchTerm, setSearchTerm] = useState('');

  useMemo(() => {
    if (isReviewsSuccess && reviews) {
      setShownReviewsIndex(4);
    }
  }, [isReviewsSuccess, reviews]);

  const handleMarkHelpful = async(reviewId: number) => {
    if (!isMarkReviewHelpfulLoading && !(reviewId in reviewsMarkedHelpful)) {
      try {
        await markReviewHelpful(reviewId);
        dispatch(setMarkReviewHelpful(reviewId));
      } catch (error) {
        console.log('Failed to mark review helpful: ', error);
      }
    }
  };

  const handleReportClick = async(reviewId: number) => {
    if (!isReportReviewLoading) {
      try {
        await reportReview(reviewId);

        api.util.invalidateTags([{ type: 'Reviews', id: reviewId }]);
      } catch (error) {
        console.log('Failed to report review: ', error);
      }
    }
  };

  const handleAddReview = async() => {
    console.log('TODO: implement handleAddReview');
  };

  const handleLoadMoreReviews = () => {
    setShownReviewsIndex((prev) => prev + 4);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const renderFakeResponse = (response: string | null) => {
    let resultResponse;
    const randomChanceProbability = 0.4;

    if (!response) {

      const randomValue = new Uint32Array(1);

      window.crypto.getRandomValues(randomValue);

      const chance = randomValue[0] / (2 ** 32);

      if (chance < randomChanceProbability) {
        resultResponse = null;
      } else {
        resultResponse = faker.lorem.paragraph();
      }
    }

    const date = faker.date.past();
    const isoDate = date.toISOString();

    return resultResponse && (
      <div data-testid='response'>
        <div className="card w-fit my-4 bg-slate-800 text-neutral-content">
          <div className="card-body">
            <p className='items-start'>
              <strong>Response: </strong>
              <br />
              {resultResponse}
            </p>

            <div className="card-actions justify-end text-sm">
              <div className="flex w-full">
                <span className="italic text-white">
                  by Seller on {formatDateTimestamp(isoDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div data-testid='ratings-and-reviews' className='dark:bg-gray-800 my-4'>
      <div className='text-center'>
        <h2 className='text-4xl py-4'>Ratings & Reviews</h2>
      </div>

      {isReviewsLoading && <div>Loading...</div>}

      {isReviewsSuccess && reviews && reviews.length > 0 && (
        <div className='pb-4'>
          <div className='flex justify-center my-4'>
            <div className='w-full max-w-md'>
              <div className='flex'>
                <div className='flex-grow'>
                  <div className='form-control'>
                    <div className='input-group'>
                      <input
                        type='text'
                        placeholder='Search reviews...'
                        className='input input-bordered w-full focus:text-white focus:border-primary focus:outline-primary hover:border-secondary'
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                      />
                      <button className='btn btn-square hover:text-primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-6 w-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reviews
            .slice(0)
            .filter((review) => {
              if (searchTerm.length < 3) {
                return true;
              }

              return (
                review.summary
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                review.body.toLowerCase().includes(searchTerm.toLowerCase())
              );
            })
            .slice(0, shownReviewsIndex)
            .map((review, index) => (
              <div
                data-testid='review'
                key={`${index}-${review.review_id}`}
                className='card mx-4 my-4'
              >
                <div className='collapse collapse-arrow bg-primary'>
                  <input
                    type='checkbox'
                    className='peer'
                    defaultChecked={true}
                  />

                  <div className='collapse-title bg-secondary text-white peer-checked:bg-primary peer-checked:text-black'>
                    <div className='flex items-center justify-between mr-4'>
                      <h3>
                        {review.summary}
                        <br />
                        <span className='italic text-xs'>
                          (by {review.reviewer_name},{' '}
                          {formatDateTimestamp(review.date)})
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4 text-sm bg-secondary peer-checked:bg-primary justify-end pr-4 pb-4'>
                    <button
                      className='btn btn-xs text-success'
                      onClick={() => handleMarkHelpful(review.review_id)}
                    >
                      {review.review_id in reviewsMarkedHelpful ? (
                        `Helpful  (${review.helpfulness})`
                      ) : (
                        <>
                          <span className='mr-1'>Helpful? </span>
                          <span className='italic underline'>
                            Yes ({review.helpfulness})
                          </span>
                        </>
                      )}
                    </button>

                    <div className='h-4 border-l border-gray-300'></div>

                    <button
                      className='btn btn-xs text-error'
                      onClick={() => handleReportClick(review.review_id)}
                    >
                      {'Report'}
                    </button>
                  </div>

                  <div className="collapse-content bg-secondary text-white peer-checked:bg-primary peer-checked:text-black">

                    {review.body}

                    {/* Review Response */}
                    {renderFakeResponse(review.response)}

                  </div>
                </div>

                <hr />
              </div>
            ))}
          {reviews.length > shownReviewsIndex && (
            <div className='flex justify-center'>
              <button
                className='btn btn-outline btn-xs sm:btn-sm my-4'
                onClick={handleLoadMoreReviews}
              >
                More Reviews
              </button>
            </div>
          )}
        </div>
      )}

      <div className='flex justify-center'>
        <button
          className='btn btn-outline btn-warning btn-xs sm:btn-sm my-4'
          onClick={handleAddReview}
          disabled={isAddReviewLoading}
        >
          Add a Review +
        </button>
      </div>
    </div>
  );
};
