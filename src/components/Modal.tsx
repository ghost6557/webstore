'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
// import { getShowCartModal, toggleCartModal } from '@/store/slices/cartSlice';
// import { getShowAuthModal, toggleAuthModal } from '@/store/slices/authSlice';
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

// const Modal = ({ children }: { children: React.ReactNode }) => {

const Modal = () => {
  const { data: session } = useSession();
  const showModalCart = useSelector(getShowCartModal);
  const showModalAuth = useSelector(getShowAuthModal);
  const showModalOrders = useSelector(getShowOrdersModal);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'scroll';
  //   };
  // }, []);

  // console.log(showModalAuth, showModalCart);
  session && showModalAuth && dispatch(toggleAuthModal());

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    document.body.style.overflow = 'unset';
    // switch (true) {
    //   case showModalAuth:
    //     dispatch(toggleAuthModal());
    //     break;
    //   case showModalCart:
    //     dispatch(toggleCartModal());
    //     break;
    //   case showModalOrders:
    //     dispatch(toggleOrderModal());
    //     break;
    // }

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
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles['close-btn']}
                >
                  <path
                    fill="currentColor"
                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                  />
                </svg>
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
