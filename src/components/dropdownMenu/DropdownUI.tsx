import { useRef } from 'react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';
import type { DropdownUIProps } from './types';
import styles from './DropdownUI.module.css';

export const DropdownUI: React.FC<DropdownUIProps> = ({
  trigger,
  children,
  // initialStateOpen = false,
  className,
  dropdownClassName,
  isDropdownOpen,
  onClick,
  maxWidth = 260,
}: DropdownUIProps) => {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(initialStateOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { position, isTriggerVisible, isPositioned } = useDropdownPosition({
    triggerRef,
    dropdownRef,
    isDropdownOpen,
    contentWidth: maxWidth,
  });

  // const handleTriggerClick = () => {
  //   console.log('trigger is clicked!');
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  // useEffect(() => {
  // const handleClickOutside = (event: MouseEvent) => {
  //   if (!isDropdownOpen) return;
  //   if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
  //     setIsDropdownOpen(false);
  //   }
  // };
  // const handleEscKey = (event: KeyboardEvent) => {
  //   if (event.key === 'Escape' && isDropdownOpen) {
  //     setIsDropdownOpen(false);
  //   }
  // };
  // document.addEventListener('click', handleClickOutside);
  // document.addEventListener('keydown', handleEscKey);
  // return () => {
  // document.addEventListener('click', handleClickOutside);
  // document.removeEventListener('keydown', handleEscKey);
  //   };
  // }, [isDropdownOpen]);

  return (
    <div
      ref={containerRef}
      className={className ? `${styles.container} ${className}` : styles.container}
      // data-testid="base-dropdown-container"
    >
      <div
        className={styles.trigger}
        onClick={onClick}
        ref={triggerRef}
        // role="button"
        // aria-haspopup="true"
        // aria-expanded={isOpen}
        // aria-label={ariaLabel}
        // data-testid="base-dropdown-trigger"
      >
        {trigger}
      </div>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={
            dropdownClassName ? `${styles.dropdown} ${dropdownClassName}` : `${styles.dropdown}`
          }
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            visibility: isTriggerVisible && isPositioned ? 'visible' : 'hidden',
          }}
          // role="menu"
          // aria-hidden={!isOpen}
          // data-testid="base-dropdown-content"
        >
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </div>
  );
};
