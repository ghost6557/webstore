'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession, signOut } from 'next-auth/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import Image from 'next/image';
import Link from 'next/link';

import {
  toggleCartModal,
  toggleAuthModal,
  toggleOrdersModal,
} from '@/store/slices/modalsSlice';
import { getCartItemsCount } from '@/store/slices/cartItemsCountSlice';
import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';
import styles from '@/components/Navbar.module.scss';

const Navbar = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { data: session } = useSession();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const userId = session?.user?.id;
  const cartItemsCount = useSelector(getCartItemsCount);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItemsCountByUserId(userId));
    }
  }, [userId, dispatch]);

  const handleModalClick = (
    e: React.MouseEvent<
      HTMLLIElement | HTMLButtonElement | HTMLDivElement,
      MouseEvent
    >
  ) => {
    e.preventDefault();

    document.body.style.overflow = 'hidden';
    const target = e.currentTarget as
      | HTMLButtonElement
      | HTMLUListElement
      | HTMLDivElement;

    switch (target.id) {
      case 'cart_trigger': {
        session && dispatch(toggleCartModal());
        break;
      }
      case 'login_trigger': {
        dispatch(toggleAuthModal());
        break;
      }
      case 'orders_trigger': {
        dispatch(toggleOrdersModal());
        break;
      }
    }
  };

  const handleMouseMove = ({
    event,
  }: {
    event: React.MouseEvent<HTMLDivElement, MouseEvent>;
    categoryId?: number;
  }): void => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'mouseenter') {
      setShowSubmenu(true);
    } else if (event.type === 'mouseleave') {
      setShowSubmenu(false);
    }
  };

  return (
    <div>
      <nav className={styles['nav-links']}>
        <div className={styles['home-link']}>
          <Link href={'/'}>
            <Image
              style={{ borderRadius: '50%' }}
              src="/logo.jpeg"
              width={100}
              height={100}
              alt="iPhone image"
            />
          </Link>
        </div>
        <div className={styles['cart-and-error']}>
          {error && <div className={styles['error-msg']}>{error}</div>}
          <ul className={styles.menu}>
            <li
              className={styles['nav-links__item']}
              id="cart_trigger"
              onClick={(e) => {
                if (session) {
                  handleModalClick(e);
                } else {
                  setError('Необходимо авторизоваться');
                  setTimeout(() => setError(''), 5000);
                }
              }}
            >
              <Image
                priority
                src="/cart-shopping.svg"
                height={32}
                width={32}
                alt="Cart icon"
              />
              <div className={styles['cart-counter']}>
                {cartItemsCount ?? 0}
              </div>
            </li>
            <li className={styles['nav-links__item']}>
              {!session && (
                <div className={styles['user-info']}>
                  <button
                    className={styles['btn-login']}
                    id="login_trigger"
                    onClick={handleModalClick}
                  >
                    Войти
                  </button>
                </div>
              )}
              {session && (
                <div
                  onMouseLeave={(e) => handleMouseMove({ event: e })}
                  className={styles['user-info']}
                >
                  <div
                    className={styles['user-profile']}
                    onMouseEnter={(e) => handleMouseMove({ event: e })}
                  >
                    <Image
                      priority
                      src="/user-icon.svg"
                      height={24}
                      width={24}
                      alt="User icon"
                    />

                    <div>{session.user?.name}</div>
                  </div>
                  {showSubmenu && (
                    <div className={styles['user-info__actions']}>
                      <div
                        className={styles['user-info__action']}
                        id="orders_trigger"
                        onClick={handleModalClick}
                      >
                        История заказов
                      </div>
                      <div
                        className={styles['user-info__action']}
                        onClick={() => signOut()}
                      >
                        Выйти
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
