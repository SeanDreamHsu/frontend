import { render, screen } from '@testing-library/react';
import * as AppModule from './App';

const App = AppModule.default;
const { deriveRoleFromClaims, AdminRoute } = AppModule;

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

test('renders app title', async () => {
  render(<App />);
  const heading = await screen.findByText(/Shipping Label Creator/i);
  expect(heading).toBeInTheDocument();
});

test('derives and applies trimmed admin role', () => {
  const derivedRole = deriveRoleFromClaims({ role: '  Admin ' });

  const routeContent = AdminRoute({
    userRole: derivedRole,
    userToken: 'token',
    children: <div>Admin Area</div>,
  });

  expect(derivedRole).toBe('admin');
  expect(routeContent).toEqual(<div>Admin Area</div>);
});
