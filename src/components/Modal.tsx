'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import {
  toggleAuthModal,
  toggleCartModal,
  toggleOrdersModal,
  getShowAuthModal,
  getShowCartModal,
  getShowOrdersModal,
} from '@/store/slices/modalsSlice';
import LoginForm from './LoginForm';
import CartForm from './CartForm';
import OrdersHistory from './OrdersHistory';
import styles from '@/components/Modal.module.scss';

const Modal = () => {
  const { data: session } = useSession();
  const showModalCart = useSelector(getShowCartModal);
  const showModalAuth = useSelector(getShowAuthModal);
  const showModalOrders = useSelector(getShowOrdersModal);
  const dispatch = useDispatch();
  session && showModalAuth && dispatch(toggleAuthModal());

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    document.body.style.overflow = 'unset';

    if (showModalCart) {
      dispatch(toggleCartModal());
    } else if (showModalAuth) {
      dispatch(toggleAuthModal());
    } else if (showModalOrders) {
      dispatch(toggleOrdersModal());
    }
  };

  return (
    <>
      {((session && (showModalCart || showModalOrders)) ||
        (!session && showModalAuth)) && (
        <div
          className={styles.modal_backdrop}
          id="backdrop"
          onClick={handleClick}
        >
          <div
            className={`${styles['modal']} ${
              showModalAuth ? styles['modal-login'] : styles['modal-main']
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles['close-btn-container']}>
              <span onClick={handleClick}>
                <Image
                  priority
                  className={styles['close-btn']}
                  src="/close.svg"
                  height={22}
                  width={22}
                  alt="Close icon"
                />
              </span>
            </div>
            {!session && showModalAuth && <LoginForm />}
            {session && showModalCart && <CartForm />}
            {session && showModalOrders && <OrdersHistory />}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
