import Link from 'next/link';
import styles from '@/components/SideBar.module.scss';

const menuItems = [
  {
    href: '/apple',
    title: 'Apple',
  },
  {
    href: '/samsung',
    title: 'Samsung',
  },
];

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          {menuItems.map((el, id) => (
            <li key={id}>
              <Link href={el.href}>{el.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
