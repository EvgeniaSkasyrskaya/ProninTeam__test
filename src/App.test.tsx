import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('feather-icons-react', () => ({
  Share2: () => <div data-testid="icon-share" />,
  Edit: () => <div data-testid="icon-edit" />,
  Trash2: () => <div data-testid="icon-trash" />,
  MoreVertical: () => <button data-testid="more-icon">Icon</button>,
}));

describe('App Integration Tests', () => {
  test('меню должно открываться при клике триггер', async () => {
    render(<App />);
    const triggers = screen.getAllByTestId('trigger');
    fireEvent.click(triggers[0]);
    await waitFor(() => {
      expect(screen.getByText(/Поделиться в социальных сетях/i)).toBeInTheDocument();
    });
  });

  test('меню должно закрываться при повторном клике на триггер', async () => {
    render(<App />);
    const triggers = screen.getAllByTestId('trigger');
    fireEvent.click(triggers[0]);
    await waitFor(() => {
      expect(screen.getByText(/Поделиться в социальных сетях/i)).toBeInTheDocument();
    });

    fireEvent.click(triggers[0]);
    await waitFor(() => {
      expect(screen.queryByText(/Поделиться в социальных сетях/i)).not.toBeInTheDocument();
    });
  });

  test('меню должно закрываться при клике на пустую область страницы', async () => {
    render(<App />);
    const triggers = screen.getAllByTestId('trigger');
    fireEvent.click(triggers[0]);
    await waitFor(() => {
      expect(screen.getByText(/Поделиться в социальных сетях/i)).toBeInTheDocument();
    });

    fireEvent.click(triggers[0]);
    await waitFor(() => {
      expect(screen.queryByText(/Поделиться в социальных сетях/i)).not.toBeInTheDocument();
    });
  });

  test('меню должно закрываться при нажатии клавиши Escape', async () => {
    render(<App />);
    const triggers = screen.getAllByTestId('trigger');
    fireEvent.click(triggers[0]);
    expect(screen.getByText(/Редактировать страницу/i)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText(/Редактировать страницу/i)).not.toBeInTheDocument();
  });

  test('клик по триггеру другого дропдауна должно закрывать первый', async () => {
    render(<App />);
    const triggers = screen.getAllByTestId('trigger');
    const [leftTrigger, centerTrigger, rightTrigger] = triggers;
    fireEvent.click(leftTrigger);
    await waitFor(() => {
      expect(screen.getByText(/Поделиться в социальных сетях/i)).toBeInTheDocument();
    });

    fireEvent.click(centerTrigger);
    const menuItems1 = screen.getAllByText(/Поделиться в социальных сетях/i);
    await waitFor(() => {
      expect(menuItems1).toHaveLength(1);
    });

    fireEvent.click(rightTrigger);
    const menuItems2 = screen.getAllByText(/Поделиться в социальных сетях/i);
    await waitFor(() => {
      expect(menuItems2).toHaveLength(1);
    });
  });

  test('должен открывать меню, выполнять действие и закрываться при клике на пункт', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<App />);
    const triggers = screen.getAllByTestId('trigger');
    fireEvent.click(triggers[0]);
    const menuItem1 = screen.getByText(/Поделиться/i);
    await waitFor(() => {
      expect(menuItem1).toBeInTheDocument();
    });
    fireEvent.click(menuItem1);
    expect(consoleSpy).toHaveBeenCalledWith('ссылка на контент отправлена!');
    expect(screen.queryByText(/Поделиться/i)).not.toBeInTheDocument();

    fireEvent.click(triggers[0]);
    const menuItem2 = screen.getByText(/Редактировать/i);
    await waitFor(() => {
      expect(menuItem2).toBeInTheDocument();
    });
    fireEvent.click(menuItem2);
    expect(consoleSpy).toHaveBeenCalledWith('страница редактирована!');
    expect(screen.queryByText(/Редактировать страницу/i)).not.toBeInTheDocument();

    fireEvent.click(triggers[0]);
    const menuItem3 = screen.getByText(/Удалить/i);
    await waitFor(() => {
      expect(menuItem3).toBeInTheDocument();
    });
    fireEvent.click(menuItem3);
    expect(consoleSpy).toHaveBeenCalledWith('страница удалена!');
    expect(screen.queryByText(/Удалить/i)).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
