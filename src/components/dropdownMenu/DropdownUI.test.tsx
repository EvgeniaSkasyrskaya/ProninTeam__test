import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DropdownUI } from './DropdownUI';

const setupMockBounds = (t: number, l: number, vh = 1000, vw = 1000) => {
  HTMLElement.prototype.getBoundingClientRect = jest.fn(function (this: HTMLElement) {
    if (this.id === 'trig' || this.classList.contains('trigger')) {
      return {
        top: t,
        left: l,
        width: 50,
        height: 50,
        bottom: t + 50,
        right: l + 50,
      } as DOMRect;
    }
    if (this.classList.contains('dropdown')) {
      return {
        width: 200,
        height: 200,
        top: 0,
        left: 0,
        bottom: 200,
        right: 200,
      } as DOMRect;
    }
    return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 } as DOMRect;
  });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: vh });
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: vw });
};

describe('DropdownUI Component', () => {
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    jest.restoreAllMocks();
  });

  const positionCases = [
    { name: 'bottom-right', triggerTop: 10, triggerLeft: 10, expTop: '50px', expLeft: '0px' },
    { name: 'bottom-left', triggerTop: 10, triggerLeft: 900, expTop: '50px', expLeft: '-150px' },
    { name: 'top-right', triggerTop: 900, triggerLeft: 10, expTop: '-200px', expLeft: '0px' },
    { name: 'top-left', triggerTop: 900, triggerLeft: 900, expTop: '-200px', expLeft: '-150px' },
  ];

  test.each(positionCases)(
    'корректное вычисление позиции дропдауна $name относительно триггера',
    async ({ triggerTop, triggerLeft, expTop, expLeft }) => {
      setupMockBounds(triggerTop, triggerLeft);
      render(
        <DropdownUI isDropdownOpen={true} trigger={<div>T</div>} onClick={() => {}}>
          <div>Menu</div>
        </DropdownUI>
      );
      const dropdown = screen.getByTestId('dropdown');
      fireEvent.scroll(window);
      await waitFor(() => {
        expect(dropdown).toHaveStyle({
          top: expTop,
          left: expLeft,
        });
      });
    }
  );

  test('контент должен скрываться при уходе триггера за границу вьюпорта при скролле и отображаться после возвращения триггера во вьюпорт', async () => {
    setupMockBounds(100, 100);
    render(
      <DropdownUI isDropdownOpen={true} trigger={<div>T</div>} onClick={() => {}}>
        <div>Content</div>
      </DropdownUI>
    );
    const dropdown = screen.getByTestId('dropdown');
    fireEvent.scroll(window);
    await waitFor(() => {
      expect(dropdown).toHaveStyle('visibility: visible');
    });

    setupMockBounds(-100, 100);

    fireEvent.scroll(window);
    await waitFor(() => {
      expect(dropdown).toHaveStyle('visibility: hidden');
    });

    setupMockBounds(100, 100);
    fireEvent.scroll(window);
    await waitFor(() => {
      expect(dropdown).toHaveStyle('visibility: visible');
    });
  });

  test('контент должен скрываться при уходе триггера за границу вьюпорта при ресайзе и отображаться после возвращения триггера во вьюпорт', async () => {
    setupMockBounds(100, 100);
    render(
      <DropdownUI isDropdownOpen={true} trigger={<div>T</div>} onClick={() => {}}>
        <div>Content</div>
      </DropdownUI>
    );
    const dropdown = screen.getByTestId('dropdown');
    fireEvent.resize(window);
    await waitFor(() => {
      expect(dropdown).toHaveStyle('visibility: visible');
    });

    setupMockBounds(100, 1500);
    fireEvent.resize(window);
    await waitFor(() => {
      expect(dropdown).toHaveStyle('visibility: hidden');
    });

    setupMockBounds(100, 100);
    fireEvent.resize(window);
    await waitFor(() => {
      expect(dropdown).toHaveStyle('visibility: visible');
    });
  });

  test('EventListeners должны удаляться при размонтировании', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <DropdownUI isDropdownOpen={true} trigger={<div>T</div>} onClick={() => {}}>
        <div>Content</div>
      </DropdownUI>
    );
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });
});
