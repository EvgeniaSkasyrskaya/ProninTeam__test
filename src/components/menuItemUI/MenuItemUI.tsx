import styles from './MenuItemUI.module.css';
import React, { type ReactNode } from 'react';

export type MenuItemUIProps = {
  className?: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

export const MenuItemUI: React.FC<MenuItemUIProps> = ({ label, icon, onClick, className }) => {
  return (
    <li
      className={
        className ? `${styles.menuItem__container} ${className}` : styles.menuItem__container
      }
    >
      <button className={styles.menuItem__button} onClick={onClick}>
        <p className={styles.menuItem__text}>{label}</p>
        <div className={styles.menuItem__icon}>{icon}</div>
        {icon}
      </button>
    </li>
  );
};
