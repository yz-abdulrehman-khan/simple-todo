import { render } from '@testing-library/react';
import App from './App';

// Mock TodoPage to avoid complex integration testing
jest.mock('./pages/todo-page/todo-page', () => ({
  TodoPage: () => <div data-testid="todo-page">Todo Page</div>,
}));

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('should render TodoPage component', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('todo-page')).toBeInTheDocument();
  });
});
