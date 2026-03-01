import {
  useState,
  //   useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';
import type { DropdownSide, DropdownPosition, ElementSize } from '../components/dropdownMenu/types';

interface UseDropdownPositionProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  dropdownRef: React.RefObject<HTMLElement | null>;
  isDropdownOpen: boolean;
  contentWidth?: number;
  viewportMargin?: number;
}

export const useDropdownPosition = ({
  triggerRef,
  dropdownRef,
  isDropdownOpen,
}: UseDropdownPositionProps) => {
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });
  const [isTriggerVisible, setIsTriggerVisible] = useState<boolean>(true);
  const [isPositioned, setIsPositioned] = useState<boolean>(false);
  const rafRef = useRef<number>(undefined);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !isDropdownOpen) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    // console.log('положение триггера', trigger);

    const viewport: ElementSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const triggerVisibility: boolean =
      trigger.top >= 0 &&
      trigger.left >= 0 &&
      trigger.bottom <= viewport.height &&
      trigger.right <= viewport.width;

    setIsTriggerVisible(triggerVisibility);
    if (!triggerVisibility) return;

    const dropdown: ElementSize = {
      width: dropdownRef.current?.getBoundingClientRect().width ?? 0,
      height: dropdownRef.current?.getBoundingClientRect().height ?? 0,
    };

    const spaceBottom = viewport.height - trigger.bottom;
    const spaceTop = trigger.top;
    const spaceRight = viewport.width - trigger.right;
    const spaceLeft = trigger.left;
    // console.log('пространство внизу - ', spaceBottom);
    // console.log('пространство вверху - ', spaceTop);
    // console.log('пространство справа - ', spaceRight);
    // console.log('пространство слева - ', spaceLeft);

    let bestSide: DropdownSide = 'bottom-right';

    if (spaceRight >= spaceLeft && spaceBottom >= spaceTop) {
      bestSide = 'bottom-right';
    } else if (spaceLeft > spaceRight && spaceBottom >= spaceTop) {
      bestSide = 'bottom-left';
    } else if (spaceRight >= spaceLeft && spaceTop > spaceBottom) {
      bestSide = 'top-right';
    } else if (spaceLeft > spaceRight && spaceTop > spaceBottom) {
      bestSide = 'top-left';
    }
    // console.log('лучшая сторона - ', bestSide);

    let top = 0;
    let left = 0;

    switch (bestSide) {
      case 'bottom-right':
        top = trigger.height;
        left = 0;
        break;
      case 'bottom-left':
        top = trigger.height;
        left = trigger.width - dropdown.width;
        break;
      case 'top-right':
        top = -dropdown.height;
        left = 0;
        break;
      case 'top-left':
        top = -dropdown.height;
        left = trigger.width - dropdown.width;
        break;
    }

    setPosition((prev) => {
      if (prev.top === top && prev.left === left) return prev;
      return { top, left };
    });

    // console.log('позиция для дропдауна - ', top, left);
    // console.log(
    //   'реальное положение дропдауна - ',
    //   dropdownRef.current?.getBoundingClientRect()
    // );
    setIsPositioned(true);
  }, [dropdownRef, triggerRef, isDropdownOpen]);

  useLayoutEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculatePosition);
    };

    rafRef.current = requestAnimationFrame(calculatePosition);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      setIsPositioned(false);
    };
  }, [isDropdownOpen, calculatePosition]);

  return { position, isTriggerVisible, isPositioned };
};
