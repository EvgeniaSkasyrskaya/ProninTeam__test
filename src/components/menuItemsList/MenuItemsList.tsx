import styles from './MenuItemsList.module.css';
import { MenuItemUI, type MenuItemUIProps } from '../menuItemUI';

export type MenuItemsListProps = {
  className?: string;
  items: MenuItemUIProps[];
};

export const MenuItemsList: React.FC<MenuItemsListProps> = ({
  className,
  items,
}: MenuItemsListProps) => {
  return (
    <ul
      className={className ? `${styles.menuList} ${className}` : styles.menuList}
      data-testid="menu-list"
    >
      {items.map((item) => (
        <MenuItemUI key={item.label} label={item.label} icon={item.icon} onClick={item.onClick} />
      ))}
    </ul>
  );
};
