import { useRef } from 'react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';
import type { DropdownUIProps } from './types';
import styles from './DropdownUI.module.css';

export const DropdownUI: React.FC<DropdownUIProps> = ({
  trigger,
  children,
  className,
  dropdownClassName,
  isDropdownOpen,
  onClick,
  maxWidth = 260,
}: DropdownUIProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { position, isTriggerVisible, isPositioned } = useDropdownPosition({
    triggerRef,
    dropdownRef,
    isDropdownOpen,
    contentWidth: maxWidth,
  });

  return (
    <div
      ref={containerRef}
      className={className ? `${styles.container} ${className}` : styles.container}
      data-testid="container"
    >
      <div className={styles.trigger} onClick={onClick} ref={triggerRef} data-testid="trigger">
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
          data-testid="dropdown"
        >
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </div>
  );
};
