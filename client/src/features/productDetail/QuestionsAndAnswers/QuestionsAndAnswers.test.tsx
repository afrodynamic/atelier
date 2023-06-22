import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { rest } from 'msw';

import { server } from '../../../../../jest-setup';
import { productQuestionsWithLessThanFourQuestionsData, productQuestionsWithMoreThanFourQuestionsData } from '../../../utils/test-data';
import { renderWithProviders } from '../../../utils/test-utils';
import { QuestionsAndAnswers } from './QuestionsAndAnswers';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '37325' }),
  useLocation: () => ({
    pathname: '/products/37325',
    search: '',
    hash: '',
    state: null,
    key: 'test',
  }),
}));

describe('QuestionsAndAnswers', () => {
  test('renders QuestionsAndAnswers component', async() => {
    await act(async() => {
      renderWithProviders(
        <QuestionsAndAnswers />
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('questions-and-answers')).toBeInTheDocument();
    });
  });

  test('renders questions/answers', async() => {
    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      expect(screen.getByText('where can I find this product?')).toBeInTheDocument();
      expect(screen.getByText('(by Mustard Fancy, May 18, 2022)')).toBeInTheDocument();

      expect(screen.getByText('blahblah test')).toBeInTheDocument();
      expect(screen.getByText('(by Seller, July 21, 2022)')).toBeInTheDocument();
    });
  });

  test('limits the number of questions displayed by default to 4', async() => {
    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId('question').length).toBeLessThanOrEqual(4);
    });
  });

  test('limits the number of answers displayed by default to 2', async() => {
    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      const questionElements = screen.queryAllByTestId('question');
      questionElements.forEach((questionElement) => {
        const answerElements = within(questionElement).queryAllByTestId('answer');
        expect(answerElements.length).toBeLessThanOrEqual(2);
      });
    });
  });

  test('renders a "More Answered Questions" button', async() => {
    server.use(
      rest.get('/api/qa/questions', (request, response, context) => {
        return response(context.json(productQuestionsWithMoreThanFourQuestionsData));
      })
    );

    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      expect(screen.getByText('More Answered Questions')).toBeInTheDocument();
    });
  });

  test('does not render a "More Answered Questions" button if there are less than 4 questions', async() => {
    server.use(
      rest.get('/api/qa/questions', (request, response, context) => {
        return response(context.json(productQuestionsWithLessThanFourQuestionsData));
      })
    );

    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      expect(screen.queryByText('More Answered Questions')).not.toBeInTheDocument();
    });
  });

  test('handles loading more questions when "More Answered Questions" button is clicked', async() => {
    server.use(
      rest.get('/api/qa/questions', (request, response, context) => {
        return response(context.json(productQuestionsWithMoreThanFourQuestionsData));
      })
    );

    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      expect(screen.getByText('More Answered Questions')).toBeInTheDocument();
    });

    const moreQuestionsButton = screen.getByText('More Answered Questions');
    fireEvent.click(moreQuestionsButton);

    await waitFor(() => {
      expect(screen.queryAllByTestId('question').length).toBeGreaterThan(4);
    });
  });

  test('sorts questions by helpfulness', async() => {
    const questionsData = {
      'product_id': '37312',
      'results': [
        {
          'question_id': 640799,
          'question_body': 'where can I find this product?',
          'question_date': '2022-05-19T00:00:00.000Z',
          'asker_name': 'Mustard Fancy',
          'question_helpfulness': 60,
          'reported': false,
          'answers': {}
        },
        {
          'question_id': 645658,
          'question_body': 'ok what do they look like tho',
          'question_date': '2023-03-30T00:00:00.000Z',
          'asker_name': 'Fatboy Slim',
          'question_helpfulness': 16,
          'reported': false,
          'answers': {}
        },
        {
          'question_id': 645659,
          'question_body': 'this is a test question?',
          'question_date': '2023-03-31T00:00:00.000Z',
          'asker_name': 'eddie murphy',
          'question_helpfulness': 19,
          'reported': false,
          'answers': {}
        },
        {
          'question_id': 645650,
          'question_body': 'this is a test question@@@@@@@?',
          'question_date': '2023-03-31T00:00:00.000Z',
          'asker_name': 'eddie murphy',
          'question_helpfulness': 21,
          'reported': false,
          'answers': {}
        }
      ]
    };

    server.use(
      rest.get('/api/qa/questions', (request, response, context) => {
        return response(context.json(questionsData));
      })
    );

    await act(async() => {
      renderWithProviders(<QuestionsAndAnswers />);
    });

    await waitFor(() => {
      const questionElements = screen.getAllByTestId('question');

      const sortedQuestions = questionsData.results.sort(
        (a, b) => b.question_helpfulness - a.question_helpfulness
      );

      sortedQuestions.forEach((question, index) => {
        expect(questionElements[index].textContent).toContain(question.question_body);
      });
    });
  });
});
