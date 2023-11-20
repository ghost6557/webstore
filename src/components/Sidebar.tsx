'use client';

import Link from 'next/link';
import styles from '@/components/SideBar.module.scss';
import { useState } from 'react';

const menuItems = [
  {
    mainHref: '/all',
    title: 'Смартфоны и планшеты',
    subMenu: [
      { href: '/all/phones', title: 'Смартфоны' },
      { href: '/all/tablets', title: 'Планшеты' },
    ],
  },
  {
    mainHref: '/apple',
    title: 'Apple',
    subMenu: [
      { href: '/apple/phones', title: 'Apple iPhone' },
      { href: '/apple/tablets', title: 'Apple iPad' },
    ],
  },
  {
    mainHref: '/samsung',
    title: 'Samsung',
    subMenu: [
      { href: '/samsung/phones', title: 'Смартфоны Samsung' },
      { href: '/samsung/tablets', title: 'Планшеты Samsung' },
    ],
  },
  {
    mainHref: '/google',
    title: 'Google',
    subMenu: [
      { href: '/google/phones', title: 'Смартфоны Google' },
      { href: '/google/tablets', title: 'Планшеты Google' },
    ],
  },
  {
    mainHref: '/oneplus',
    title: 'Oneplus',
    subMenu: [
      { href: '/oneplus/phones', title: 'Смартфоны Oneplus' },
      { href: '/oneplus/tablets', title: 'Планшеты Oneplus' },
    ],
  },
];

const Sidebar = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [categoryId, setCategoryId] = useState(0);

  const handleMouseMove = ({
    event,
    categoryId = 0,
  }: {
    event: React.MouseEvent<HTMLLIElement | HTMLDivElement, MouseEvent>;
    categoryId?: number;
  }): void => {
    event.preventDefault();
    if (event.type === 'mouseenter') {
      setCategoryId(categoryId);
      setShowSubmenu(true);
    } else if (event.type === 'mouseleave') {
      setShowSubmenu(false);
    }
  };

  return (
    <div className={styles['sidebar-container']}>
      <div
        className={styles['container-menu']}
        onMouseLeave={(e) => handleMouseMove({ event: e })}
      >
        <ul className={styles['main-menu']}>
          {menuItems.map((el, id) => (
            <li
              className={styles['menu-item__container']}
              key={id}
              onMouseEnter={(e) =>
                handleMouseMove({ event: e, categoryId: id })
              }
            >
              <div className={styles['menu-item__label']}>{el.title}</div>
            </li>
          ))}
        </ul>

        {showSubmenu && (
          <ul className={styles['sub-menu']}>
            {menuItems[categoryId].subMenu.map((val, idx) => (
              <li className={styles['menu-item__container']} key={idx}>
                <Link
                  className={styles['menu-item__label']}
                  href={`${val.href}?page=1`}
                >
                  {val.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles['space-filler']}></div>
    </div>
  );
};

export default Sidebar;
