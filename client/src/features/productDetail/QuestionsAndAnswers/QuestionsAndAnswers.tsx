import { ChangeEvent, FC, useMemo, useState } from 'react';

import { api, useGetQuestionsQuery, useMarkAnswerHelpfulMutation, useMarkQuestionHelpfulMutation, useReportAnswerMutation, useReportQuestionMutation, } from '../../../api/api';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ImageCarousel } from '../../../components/common/ImageCarousel';
import { formatDateTimestamp } from '../../../utils/formatTimestamp';
import { setMarkAnswerHelpful, setMarkQuestionHelpful } from '../productDetailSlice';
import { AddAnswerModal } from './AddAnswerModal';
import { AddQuestionModal } from './AddQuestionModal';

export const QuestionsAndAnswers: FC = () => {
  const productId = useAppSelector((state) => state.productDetail.selectedProductId);
  const questionsMarkedHelpful = useAppSelector((state) => state.productDetail.questionsMarkedHelpful);
  const answersMarkedHelpful = useAppSelector((state) => state.productDetail.answersMarkedHelpful);

  const dispatch = useAppDispatch();

  const [markQuestionHelpful, { isLoading: isMarkQuestionHelpfulLoading }] = useMarkQuestionHelpfulMutation();
  const [markAnswerHelpful, { isLoading: isMarkAnswerHelpfulLoading }] = useMarkAnswerHelpfulMutation();
  const [reportQuestion, { isLoading: isReportQuestionLoading }] = useReportQuestionMutation();
  const [reportAnswer, { isLoading: isReportAnswerLoading }] = useReportAnswerMutation();

  const [questionsPage, setQuestionsPage] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(5);

  const {
    data: questions,
    error: questionsError,
    isLoading: isQuestionsLoading,
    isSuccess: isQuestionsSuccess,
    refetch
  } = useGetQuestionsQuery({ productId, page: questionsPage, count: questionsCount }, {
    refetchOnMountOrArgChange: true,
    skip: !productId
  });

  const [shownQuestionsIndex, setShownQuestionsIndex] = useState(4);
  const [shownAnswersIndices, setShownAnswersIndices] = useState<{ [questionId: number]: number }>(() => {
    const initialIndices: { [questionId: number]: number } = {};

    if (isQuestionsSuccess && questions) {
      questions.forEach((question) => {
        initialIndices[question.question_id] = 2;
      });
    }

    return initialIndices;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAddAnswerModal, setShowAddAnswerModal] = useState(false);

  useMemo(() => {
    if (isQuestionsSuccess && questions) {
      const initialIndices: { [questionId: number]: number; } = {};

      questions.forEach((question) => {
        initialIndices[question.question_id] = 2;
      });

      setShownAnswersIndices(initialIndices);
    }
  }, [isQuestionsSuccess, questions]);

  const handleMarkHelpful = async(id: number, isQuestion: boolean) => {
    if (isQuestion && !isMarkQuestionHelpfulLoading && !(id in questionsMarkedHelpful)) {
      try {
        await markQuestionHelpful(id);
        dispatch(setMarkQuestionHelpful(id));

        api.util.invalidateTags([{ type: 'Questions', id}]);
      } catch (error) {
        console.log('Failed to mark question helpful: ', error);
      }
    } else if (!isQuestion && !isMarkAnswerHelpfulLoading && !(id in answersMarkedHelpful)) {
      try {
        await markAnswerHelpful(id);
        dispatch(setMarkAnswerHelpful(id));

        api.util.invalidateTags([{ type: 'Answers', id}]);
      } catch (error) {
        console.log('Failed to mark answer helpful: ', error);
      }
    }
  };

  const handleReportClick = async(id: number, isQuestion: boolean) => {
    if (isQuestion && !isReportQuestionLoading) {
      try {
        await reportQuestion(id);

        api.util.invalidateTags([{ type: 'Questions', id }]);
      } catch (error) {
        console.log('Failed to report question: ', error);
      }
    } else if (!isQuestion && !isReportAnswerLoading) {
      try {
        await reportAnswer(id);

        api.util.invalidateTags([{ type: 'Answers', id }]);
      } catch (error) {
        console.log('Failed to report answer: ', error);
      }
    }
  };

  const handleAddQuestion = () => {
    setShowAddQuestionModal(true);
  };

  const handleAddAnswer = (questionId: number) => {
    setShowAddAnswerModal(true);
  };

  const handlePageChange = async(page: number) => {
    setQuestionsPage(page);
    setShownQuestionsIndex(4);

    api.util.invalidateTags([{ type: 'Questions', id: productId }]);

    const { data } = await refetch();
    if (!data || data.length === 0) {
      setQuestionsPage(questionsPage + 1);
    }
  };

  const handleLoadMoreQuestions = () => {
    setShownQuestionsIndex((prev) => prev + 2);

    api.util.invalidateTags([{ type: 'Questions', id: productId }]);
  };

  const handleLoadMoreAnswers = (questionId: number) => {
    setShownAnswersIndices((prev) => {
      return {
        ...prev,
        [questionId]: (prev[questionId] || 0) + 2,
      };
    });

    api.util.invalidateTags([{ type: 'Answers', id: questionId }]);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div data-testid='questions-and-answers' className="dark:bg-gray-800 my-4 flex flex-col">
      <div className="text-center">
        <h2 className="text-4xl py-4">Questions & Answers</h2>
      </div>

      {isQuestionsLoading && <div>Loading...</div>}

      {isQuestionsSuccess && questions && questions.length > 0 && !showAddQuestionModal && (
        <div className="pb-4 min-h-[1024px] flex flex-grow flex-col">
          <div className="flex justify-center my-4">
            <div className="w-full max-w-md">
              <div className="flex">
                <div className="flex-grow">
                  <div className="form-control">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Have a question? Search for answers…"
                        className="input input-bordered w-full focus:text-white focus:border-primary focus:outline-primary"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                      />
                      <button className="btn btn-square hover:text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-[1024px] overflow-y-auto">
            {questions.slice(0)
              .filter((question) => {
                if (searchTerm.length < 3) {
                  return true;
                }

                return question.question_body.toLowerCase().includes(searchTerm.toLowerCase());
              })
              .sort((a, b) => {
                return b.question_helpfulness - a.question_helpfulness;
              })
              .slice(0, shownQuestionsIndex)
              .map((question, index) => (
                <div data-testid='question' key={`${index}-${question.question_id}`} className='card mx-4 my-4'>
                  <div className="collapse collapse-arrow bg-primary">
                    <input type="checkbox" className="peer" defaultChecked={true} />

                    <div className="collapse-title bg-primary text-black peer-checked:bg-secondary peer-checked:text-white">
                      <div className="flex items-center justify-between mr-4">
                        <h3>
                          <strong>Q:</strong> {question.question_body}
                          <br />
                          <span className="italic text-xs">
                          (by {question.asker_name}, {formatDateTimestamp(question.question_date)})
                          </span>
                        </h3>

                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm peer-checked:bg-secondary justify-end pr-4 pb-4">
                      <button
                        className="btn btn-xs text-success"
                        onClick={() => handleMarkHelpful(question.question_id, true)}
                      >
                        {question.question_id in questionsMarkedHelpful ? `Helpful  (${question.question_helpfulness})` : (
                          <>
                            <span className="mr-1">Helpful? </span>
                            <span className="italic underline">Yes ({question.question_helpfulness})</span>
                          </>
                        )}
                      </button>

                      <div className="h-4 border-l border-gray-300"></div>

                      <AddAnswerModal />

                      <div className="h-4 border-l border-gray-300"></div>

                      <button
                        className="btn btn-xs text-error"
                        onClick={() => handleReportClick(question.question_id, true)}
                      >
                        {question.reported ? 'Reported' : 'Report'}
                      </button>
                    </div>

                    <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                      <div>
                        {Object.values(question.answers)
                          .sort((a, b) => {
                            if (a.answerer_name === 'Seller') {
                              return -1;
                            }

                            return b.helpfulness - a.helpfulness;
                          })
                          .slice(0, shownAnswersIndices[question.question_id] || 2)
                          .map((answer, answerIndex) => (
                            <div data-testid='answer' key={`${answerIndex}-${answer.id}`}>
                              <div className="card mb-4 bg-neutral text-neutral-content">
                                <div className="card-body">
                                  <p className='items-start'>
                                    <strong>A:</strong> {answer.body}
                                  </p>

                                  <ImageCarousel images={answer.photos} />

                                  <div className="card-actions text-sm">
                                    <div className="flex w-full">
                                      <span className="italic text-white">
                                          (by {answer.answerer_name}, {formatDateTimestamp(answer.date)})
                                      </span>
                                      <div className="divider divider-horizontal"></div>
                                      <button
                                        className="btn btn-xs text-success"
                                        onClick={() => handleMarkHelpful(answer.id, false)}
                                      >
                                        {answer.id in answersMarkedHelpful ? `Helpful  (${answer.helpfulness})` : (
                                          <>
                                            <span className="mr-1">Helpful? </span>
                                            <span className="italic underline">Yes ({answer.helpfulness})</span>
                                          </>
                                        )}
                                      </button>

                                      <button
                                        className="btn btn-xs text-error"
                                        onClick={() => handleReportClick(answer.id, false)}
                                      >
                                        {answer.reported ? 'Reported' : 'Report'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {Object.values(question.answers).length > shownAnswersIndices[question.question_id] && (
                        <button className="btn btn-ghost btn-xs sm:btn-sm" onClick={() => handleLoadMoreAnswers(question.question_id)}>
                        Load More Answers
                        </button>
                      )}
                    </div>
                  </div>

                  <hr />
                </div>
              ))
            }

            <div className="flex justify-center">

              <button className={`btn btn-outline btn-xs sm:btn-sm my-4 ${questions.length > shownQuestionsIndex ? '' : 'hidden'}`} onClick={handleLoadMoreQuestions}>
                    More Answered Questions
              </button>

            </div>
          </div>
          <div className="flex justify-center my-4">
            <AddQuestionModal showAddQuestionModal={showAddQuestionModal} setShowAddQuestionModal={setShowAddQuestionModal} />
          </div>

          <div className="flex justify-center mt-4">
            <div className="btn-group">
              <button className="btn" onClick={() => handlePageChange(questionsPage - 1)} disabled={questionsPage === 1}>
                «
              </button>
              <button className="btn" onClick={() => handlePageChange(questionsPage)}>
                {questionsPage}
              </button>
              <button className="btn" onClick={() => handlePageChange(questionsPage + 1)}>
                »
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
