import { FC, FormEvent, useState } from 'react';
import { api, useAddAnswerMutation } from '../../../api/api';
import { useAppSelector } from '../../../app/hooks';

export const AddAnswerModal: FC = ({ showAddAnswerModal, setShowAddAnswerModal }) => {
  const [question, setQuestion] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const productId = useAppSelector(
    (state) => state.productDetail.selectedProductId
  );

  const [
    addAnswer,
    { isLoading: isAddAnswerLoading, isSuccess: isAddAnswerSuccess },
  ] = useAddAnswerMutation();

  const handleSubmit = async(event: FormEvent) => {
    event.preventDefault();

    if (!question || !nickname || !email) {
      setErrorMessage('You must enter all mandatory fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addAnswer({
        body: question,
        name: nickname,
        email: email,
        photos: [],
        question_id: productId,
      });

      api.util.invalidateTags([{ type: 'Questions', id: productId }, { type: 'Answers', id: productId }]);

      setQuestion('');
      setNickname('');
      setEmail('');
      setErrorMessage('');
      setShowAddAnswerModal(false);
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <label htmlFor='questionModal' className='btn btn-neutral btn-xs text-warning'>
        Add Answer
      </label>
      <input type='checkbox' id='questionModal' className='modal-toggle' />

      <div className='modal'>
        <div className='modal-box relative bg-neutral'>
          <label
            htmlFor='questionModal'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            x
          </label>
          {/* Question Form */}
          <form
            onSubmit={handleSubmit}
            className='bg-neutral mx-auto form-control'
          >
            <div>
              <label
                htmlFor='question'
                className='block font-bold mb-1 label-text'
              >
                Your Answer<span className='text-red-500'>*</span>
              </label>
              <textarea
                id='question'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={6}
                className='textarea textarea-bordered textarea-md w-full focus:text-white focus:border-primary focus:outline-primary hover:border-secondary'
                placeholder='Enter your question here...'
              ></textarea>
            </div>

            <div className='mt-4'>
              <label
                htmlFor='nickname'
                className='block font-bold mb-1 label-text'
              >
                What is your nickname<span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='nickname'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder='Example: jackson11!'
                className='input input-bordered w-full focus:text-white focus:border-primary focus:outline-primary hover:border-secondary'
              />
              <p className='text-sm text-gray-500 mt-1'>
                For privacy reasons, do not use your full name or email address.
              </p>
            </div>

            <div className='mt-4'>
              <label htmlFor='email' className='block font-bold mb-1'>
                Your email<span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email: test@email.com'
                className='input input-bordered w-full focus:text-white focus:border-primary focus:outline-primary hover:border-secondary'
              />
              <p className='text-sm text-gray-500 mt-1'>
                For authentication reasons, you will not be emailed.
              </p>
            </div>

            {errorMessage && (
              <p className='text-red-500 mt-4'>{errorMessage}</p>
            )}

            <button
              type='submit'
              className='bg-blue-500 text-white py-2 px-4 rounded mt-4'
              disabled={isSubmitting}
            >
              Submit Answer
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
