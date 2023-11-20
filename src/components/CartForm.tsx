import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import { toggleCartModal } from '@/store/slices/modalsSlice';
import {
  updateItemsListOnDelete,
  getCheckedItems,
} from '@/store/slices/checkedItemsSlice';
import {
  fetchCartItemsCountByUserId,
  getCartItemsCount,
} from '@/store/slices/cartItemsCountSlice';
import CollapsibleWrapper from './CollapsibleWrapper';
import CartItem from './CartItem';
import DeliveryInfoForm from './DeliveryInfoForm';
import styles from '@/components/CartForm.module.scss';

export interface deliveryForm<T> {
  deliveryAddress: T;
  apartment: T;
  entrance: T;
  floor: T;
  comment: T;
}

const initialForm: deliveryForm<string> = {
  deliveryAddress: '',
  apartment: '',
  entrance: '',
  floor: '',
  comment: '',
};

const CartForm = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [reload, setReload] = useState(false);
  const [cartData, setCartData] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState<boolean | undefined>(undefined);
  const checkboxList = useSelector(getCheckedItems);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [containersState, setContainersState] = useState({
    isCartOpen: true,
    isDeliveryOpen: false,
  });
  const [formValues, setFormValues] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsCount = useSelector(getCartItemsCount);
  const formRef = useRef<any>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/cart/${userId}`);
      const fetchedData = await res.json();
      setCartData(fetchedData);
      setReload(false);
    };
    fetchData();
  }, [userId, reload]);

  const handleContainerToggle = (id: string): void => {
    if (id === 'cart') {
      setContainersState((state) => ({
        ...state,
        ...(state.isDeliveryOpen && { isDeliveryOpen: !state.isDeliveryOpen }),
        isCartOpen: !state.isCartOpen,
      }));
    } else if (id === 'deliveryInfo') {
      setContainersState((state) => ({
        ...state,
        ...(state.isCartOpen && { isCartOpen: !state.isCartOpen }),
        isDeliveryOpen: !state.isDeliveryOpen,
      }));
    }
  };

  const handleSelectAll = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (checkboxList.length === 0 || cartData.length !== checkboxList.length) {
      setSelectAll(true);
    } else if (cartData.length === checkboxList.length) {
      const sumChecked = checkboxList.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.val ? 1 : 0),
        0
      );

      switch (true) {
        case checkboxList.length === sumChecked:
          setSelectAll(false);
          break;
        case sumChecked === 0:
          setSelectAll(true);
          break;
        case sumChecked > 0:
          setSelectAll(true);
          break;
      }
    }
  };

  const handleDeleteChecked = async () => {
    if (checkboxList.length) {
      const checkedList = checkboxList.filter((cbx) => Boolean(cbx.val));
      const updatedCbxList = checkboxList.filter((cbx) => !Boolean(cbx.val));
      checkedList.forEach((el) => console.log(el));
      const cartDetails = checkedList.map((el) => ({
        userId,
        product: {
          modelVariantId: +el.id,
        },
        cartAction: 'DELETE',
      }));

      const res = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify(cartDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      dispatch(updateItemsListOnDelete(updatedCbxList));

      if (res.ok) {
        if (userId) {
          dispatch(fetchCartItemsCountByUserId(userId));
        }
        setReload(true);
      }
    }
  };

  const handleMakeOrder = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log(checkboxList);

    const filteredCartData = cartData.filter((item) => {
      const checkedList = checkboxList
        .filter((cbx) => Boolean(cbx.val))
        .map((cbx) => cbx.id);
      return checkedList.includes(item['msp_id']);
    });

    if (filteredCartData.length) {
      const totalSum = filteredCartData.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue['price']) * currentValue['amount'],
        0
      );

      const itemsDetails = filteredCartData.map((item) => ({
        msp_id: +item['msp_id'],
        amount: item['amount'],
      }));

      const orderDetails = {
        userId: session?.user?.id,
        itemsDetails,
        totalSum,
        deliveryInfo: formValues,
      };
      try {
        setLoading(true);

        const res = await fetch('/api/ordering', {
          method: 'POST',
          body: JSON.stringify(orderDetails),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        res.ok && (await handleDeleteChecked());

        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError(error);
      }

      dispatch(toggleCartModal());
      document.body.style.overflow = 'unset';
    } else {
      setError('Товары не выбраны');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <>
      {cartData && (
        <div className={styles['order-form']}>
          <div className={styles['cart-header']}>
            <h1>Оформление заказа</h1>
          </div>

          <div className={styles['cart-form-container']}>
            <div className={styles['cart-form']}>
              <CollapsibleWrapper
                visibleState={containersState.isCartOpen}
                visibilityChanger={handleContainerToggle}
                id="cart"
                containerLabel="Корзина"
              >
                <div className={styles['cart-content']}>
                  <div className={styles['global-cart-actions']}>
                    <div>
                      <button
                        className={styles['btn-check-all']}
                        onClick={handleSelectAll}
                      >
                        Выбрать все
                      </button>
                    </div>
                    <div>
                      <button
                        className={styles['btn-delete-all']}
                        onClick={handleDeleteChecked}
                      >
                        Удалить выбранные
                      </button>
                    </div>
                  </div>

                  <div className={styles['container-cart-products']}>
                    {!cartData ?? <div>Товары не выбраны</div>}
                    {cartData.map((item: any) => (
                      <CartItem
                        key={item['msp_id']}
                        data={item}
                        reload={setReload}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                      ></CartItem>
                    ))}
                  </div>
                </div>
              </CollapsibleWrapper>

              <CollapsibleWrapper
                visibleState={containersState.isDeliveryOpen}
                visibilityChanger={handleContainerToggle}
                id="deliveryInfo"
                containerLabel="Информация для доставки"
              >
                <DeliveryInfoForm
                  formRef={formRef}
                  formValues={formValues}
                  onChangeFormValues={setFormValues}
                  onMakeOrder={handleMakeOrder}
                />
              </CollapsibleWrapper>
            </div>

            <div className={styles['order-details']}>
              <div className={styles['itog']}>
                <div>Итого</div>
                <div>
                  {`${new Intl.NumberFormat('ru').format(
                    cartData
                      .filter((item) => {
                        const checkedList = checkboxList
                          .filter((cbx) => Boolean(cbx.val))
                          .map((cbx) => cbx.id);
                        return checkedList.includes(item['msp_id']);
                      })
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          Number(currentValue['price']) *
                            currentValue['amount'],
                        0
                      )
                  )} ₽`}
                </div>
              </div>
              <div className={styles['btn-next-container']}>
                {(containersState.isCartOpen ||
                  containersState.isDeliveryOpen) && (
                  <>
                    {containersState.isCartOpen ? (
                      <button
                        key="next"
                        className={styles['btn-next']}
                        onClick={() => handleContainerToggle('deliveryInfo')}
                      >
                        Далее
                      </button>
                    ) : (
                      <button
                        key="makeOrder"
                        className={styles['btn-next']}
                        onClick={() => formRef.current.requestSubmit()}
                      >
                        Подтвердить заказ
                      </button>
                    )}

                    {error && (
                      <div className={styles['error-msg']}>{error}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CartForm;
