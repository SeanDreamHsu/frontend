import { render, screen } from '@testing-library/react';

jest.mock('firebase/app', () => ({
  __esModule: true,
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  __esModule: true,
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return () => {};
  }),
  signOut: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

const App = require('./App').default;

test('renders app title', async () => {
  render(<App />);
  const heading = await screen.findByText(/Shipping Label Creator/i);
  expect(heading).toBeInTheDocument();
});
