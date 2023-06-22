import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

import { handlers } from './client/src/utils/apiHandlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
