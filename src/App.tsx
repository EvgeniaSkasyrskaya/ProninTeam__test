import { useState, useRef, useEffect } from 'react';
import { Share2, Edit, Trash2, MoreVertical } from 'feather-icons-react';
import './App.css';
import { DropdownUI } from './components/dropdownMenu/DropdownUI';
import type { MenuItemUIProps } from './components/menuItemUI';
import { MenuItemsList } from './components/menuItemsList';

const menuItems: MenuItemUIProps[] = [
  {
    label: 'Поделиться в социальных сетях',
    icon: <Share2 />,
    onClick: () => {
      console.log('ссылка на контент отправлена!');
    },
  },
  {
    label: 'Редактировать страницу',
    icon: <Edit />,
    onClick: () => {
      console.log('страница редактирована!');
    },
  },
  {
    label: 'Удалить страницу',
    icon: <Trash2 />,
    onClick: () => {
      console.log('страница удалена!');
    },
  },
];

function App() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleDropdownToggle = (dropdownId: string) => {
    setActiveDropdown((current) => (current === dropdownId ? null : dropdownId));
  };

  const handleItemClick = (originalOnClick: () => void) => {
    originalOnClick();
    setActiveDropdown(null);
  };

  const menuItemsForDropdown = menuItems.map((item) => ({
    ...item,
    onClick: () => handleItemClick(item.onClick),
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown === null) return;
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeDropdown) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [activeDropdown]);

  return (
    <main>
      <section ref={sectionRef}>
        <DropdownUI
          className={'left-dropdown'}
          trigger={<MoreVertical />}
          children={<MenuItemsList items={menuItemsForDropdown} />}
          id={'left-dropdown'}
          isDropdownOpen={activeDropdown === 'left-dropdown'}
          onClick={() => handleDropdownToggle('left-dropdown')}
        />
        <DropdownUI
          className={'center-dropdown'}
          trigger={<MoreVertical />}
          children={<MenuItemsList items={menuItemsForDropdown} />}
          id={'center-dropdown'}
          isDropdownOpen={activeDropdown === 'center-dropdown'}
          onClick={() => handleDropdownToggle('center-dropdown')}
        />
        <DropdownUI
          className={'right-dropdown'}
          trigger={<MoreVertical />}
          children={<MenuItemsList items={menuItemsForDropdown} />}
          id={'right-dropdown'}
          isDropdownOpen={activeDropdown === 'right-dropdown'}
          onClick={() => handleDropdownToggle('right-dropdown')}
        />
      </section>
    </main>
  );
}

export default App;
