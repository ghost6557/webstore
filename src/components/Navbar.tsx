import Link from 'next/link';
import styles from '@/components/Navbar.module.scss';

const menuItems = [
  {
    href: '/about',
    title: 'About',
  },
  {
    href: '/contact',
    title: 'Contact',
  },
];

const Navbar = () => {
  return (
    <nav>
      <ul className={styles.menu}>
        {menuItems.map((el, id) => (
          <li key={id}>
            <Link href={el.href}>{el.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
