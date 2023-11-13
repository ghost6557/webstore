import { useSession } from 'next-auth/react';
// import useFetchData from '@/hooks/useFetchData';
import CartItem from './CartItem';
import DeliveryInfoForm from './DeliveryInfoForm';
import styles from '@/components/CartForm.module.scss';
import { useState, useEffect } from 'react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleAuthModal,
  toggleCartModal,
  toggleOrdersModal,
  getShowAuthModal,
  getShowCartModal,
  getShowOrdersModal,
} from '@/store/slices/modalsSlice';
import {
  updateItemsListOnDelete,
  getCheckedItems,
} from '@/store/slices/checkedItemsSlice';
import {
  fetchCartItemsCountByUserId,
  getCartItemsCount,
} from '@/store/slices/cartItemsCountSlice';
import CollapsibleWrapper from './CollapsibleWrapper';

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
  // const [checkboxList, setCheckboxList] = useState<any[]>([]);
  const checkboxList = useSelector(getCheckedItems);
  // const dispatch = useDispatch();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [containersState, setContainersState] = useState({
    isCartOpen: true,
    isDeliveryOpen: false,
  });
  const [formValues, setFormValues] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // console.log('CART323: ' + session?.user?.id);

  console.log(checkboxList);
  const itemsCount = useSelector(getCartItemsCount);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/cart/${userId}`);
      const fetchedData = await res.json();
      setCartData(fetchedData);
      setReload(false);
    };
    fetchData();
  }, [userId, reload]);

  // const cartData: any[] | any = useFetchData(
  //   `cart/${session?.user?.id}`,
  //   reload
  // );

  // console.log(cartData);

  // console.log(checkboxList);
  const handleContainerToggle = (id: string): void => {
    // isCartOpen: !state.isCartOpen,
    // isDeliveryOpen: !state.isDeliveryOpen,
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

      console.log('sumChecked ' + sumChecked);

      console.log(checkboxList.length);

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

  const handleMakeOrder = async () => {
    console.log('new order');
    if (checkboxList.length) {
      const filteredCartData = cartData.filter((item) => {
        const checkedList = checkboxList
          .filter((cbx) => Boolean(cbx.val))
          .map((cbx) => cbx.id);
        return checkedList.includes(item['msp_id']);
      });
      // .map((item) => item['msp_id']);
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

        await handleDeleteChecked();

        setLoading(false);
        //   if (!res.ok) {
        //     setError((await res.json()).message);
        //     return;
        //   }
      } catch (error: any) {
        setLoading(false);
        setError(error);
      }

      dispatch(toggleCartModal());
      console.log(orderDetails);
    }
  };

  // const allCheckboxVals = checkboxList.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue.x
  // );

  // const cntChecked = checkboxList.filter((cbx) => cbx.val === true).length;
  // if (checkboxList.length === cntChecked) {
  //   setSelectAll(false);
  // }

  // else {
  //   const unchecked = checkboxList.filter((checkbox) => checkbox === false);
  //   if (unchecked) {
  //     // || cartData.length !== checkboxList.length)

  //     setSelectAll(true);
  //   }
  // { userId: session?.user?.id });

  return (
    <>
      {/* <div style={{ display: 'flex', overflow: 'auto' }}> */}
      {/* <div>
        <CollapsibleWrapper>Test434563545</CollapsibleWrapper>
      </div> */}
      {cartData && (
        <div style={{ width: '100%', height: '100%', margin: '0 0 2em 1em' }}>
          <div className={styles.cart_header}>
            <h1>Оформление заказа</h1>
          </div>

          <div className={styles.cart_form}>
            <div
              style={{
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
                height: '100%',
                gap: '2em',
                marginLeft: '1em',
              }}
            >
              <CollapsibleWrapper
                visibleState={containersState.isCartOpen}
                visibilityChanger={handleContainerToggle}
                id="cart"
                containerLabel="Корзина"
              >
                {/* <div */}
                {/* style={{
                    flexGrow: '2',
                    //   overflow: 'auto',
                    //   display: 'flex',
                    //   flexDirection: 'column',
                    //   height: '100%',
                    //   gap: '2em',
                    //   marginLeft: '1em',
                  }}
                > */}
                <div className={styles.global_cart_actions}>
                  <div>
                    <button onClick={handleSelectAll}>Выбрать все</button>
                  </div>
                  <div>
                    <button onClick={handleDeleteChecked}>
                      Удалить выбранные
                    </button>
                  </div>
                </div>
                {/* <div> */}
                <div className={styles.container_cart_products}>
                  {cartData.map((item: any) => (
                    <CartItem
                      key={item['msp_id']}
                      data={item}
                      reload={setReload}
                      selectAll={selectAll}
                      // setCheckboxList={setCheckboxList}
                      setSelectAll={setSelectAll}
                    ></CartItem>
                  ))}
                </div>
                {/* </div> */}
                {/* </div> */}
              </CollapsibleWrapper>

              <CollapsibleWrapper
                visibleState={containersState.isDeliveryOpen}
                visibilityChanger={handleContainerToggle}
                id="deliveryInfo"
                containerLabel="Информация для доставки"
              >
                <DeliveryInfoForm
                  formValues={formValues}
                  onChangeFormValues={setFormValues}
                />
              </CollapsibleWrapper>
            </div>

            <div className={styles.order_details}>
              <div className={styles.itog}>
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
              <div>
                {(containersState.isCartOpen ||
                  containersState.isDeliveryOpen) && (
                  <button
                    onClick={() => {
                      containersState.isCartOpen
                        ? handleContainerToggle('deliveryInfo')
                        : containersState.isDeliveryOpen
                        ? handleMakeOrder()
                        : null;
                    }}
                  >
                    {containersState.isCartOpen
                      ? 'Далее'
                      : containersState.isDeliveryOpen
                      ? 'Подтвердить заказ'
                      : ''}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* </div> */}
    </>
  );
};
export default CartForm;

//   onClick={() => {
//     dispatch(toggleCartModal());
//     dispatch(toggleOrderModal());
//   }}
// >
//   Перейти к оформлению
