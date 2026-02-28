import type { ReactNode } from 'react';

export type DropdownPosition = {
  top: number;
  left: number;
};

export type DropdownSide = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';

export type PlacementType = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export type ElementSize = {
  width: number;
  height: number;
};

export interface DropdownUIProps {
  trigger: ReactNode;
  children: ReactNode;
  initialStateOpen?: boolean;
  onClick?: () => void;
  className?: string;
  dropdownClassName?: string;
  maxWidth?: number;
}
