import { render, screen } from '@testing-library/react';
import App from './App';

test('renders frontend heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/Frontend is running/i);
  expect(linkElement).toBeInTheDocument();
});