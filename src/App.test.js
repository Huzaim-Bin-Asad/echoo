import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom since it's used in App.js
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep actual implementations
  BrowserRouter: ({ children }) => <div>{children}</div>, // Simplified mock
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
}));

test('renders landing page by default', () => {
  render(<App />);
  
  // Check for something that should exist on your landing page
  // Replace "Welcome" with actual text/content from your Landing component
  const landingElement = screen.getByText(/Welcome/i); 
  expect(landingElement).toBeInTheDocument();
});