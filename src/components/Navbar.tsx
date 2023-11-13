'use client';

// import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  toggleCartModal,
  toggleAuthModal,
  toggleOrdersModal,
} from '@/store/slices/modalsSlice';
import useFetchData from '@/hooks/useFetchData';
import { getCartItemsCount } from '@/store/slices/cartItemsCountSlice';
import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';

import styles from '@/components/Navbar.module.scss';

const Navbar = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { data: session } = useSession();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const userId = session?.user?.id;
  console.log(session);
  const cartItemsCount = useSelector(getCartItemsCount);

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
    // e.preventDefault();
    // e.stopPropagation();

    document.body.style.overflow = 'hidden';
    const target = e.currentTarget as
      | HTMLButtonElement
      | HTMLUListElement
      | HTMLDivElement;
    // console.log(target.id);

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
      // setCategoryId(categoryId);
      setShowSubmenu(true);
    } else if (event.type === 'mouseleave') {
      setShowSubmenu(false);
    }
  };

  return (
    <>
      {/* {session && <pre>{JSON.stringify(session)}</pre>} */}
      <nav className={styles['nav-links']}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '15.657em',
            // width: '250.5px',
            backgroundColor: '#171717;',
            padding: '1em 0 1em 0',
          }}
        >
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
        <ul className={styles.menu}>
          <li
            className={styles['nav-links__item']}
            id="cart_trigger"
            onClick={(e) => {
              session && handleModalClick(e);
            }}
          >
            <svg
              fill="#000000"
              width="30px"
              height="30px"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="28" r="2" />
              <circle cx="24" cy="28" r="2" />
              <path d="M28,7H5.82L5,2.8A1,1,0,0,0,4,2H0V4H3.18L7,23.2A1,1,0,0,0,8,24H26V22H8.82L8,18H26a1,1,0,0,0,1-.78l2-9A1,1,0,0,0,28,7Zm-2.8,9H7.62L6.22,9H26.75Z" />
              <rect
                id="_Transparent_Rectangle_"
                data-name="&lt;Transparent Rectangle&gt;"
                fill="none"
                width="32"
                height="32"
              />
            </svg>
            <div className={styles['cart-counter']}>{cartItemsCount}</div>
          </li>
          <li className={styles['nav-links__item']}>
            {!session && (
              <div className={styles['user-info']}>
                <button id="login_trigger" onClick={handleModalClick}>
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
                  <svg
                    width="15px"
                    height="15px"
                    viewBox="0 0 20 20"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g
                      id="Page-1"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="Dribbble-Light-Preview"
                        transform="translate(-140.000000, -2159.000000)"
                        fill="#000000"
                      >
                        <g
                          id="icons"
                          transform="translate(56.000000, 160.000000)"
                        >
                          <path
                            d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598"
                            id="profile_round-[#1342]"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
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
      </nav>
    </>
  );
};

export default Navbar;
