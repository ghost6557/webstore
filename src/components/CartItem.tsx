import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { toggleCartModal } from '@/store/slices/modalsSlice';
import styles from '@/components/CartItem.module.scss';
import {
  updateItemsList,
  getCheckedItems,
  updateItemsListOnDelete,
} from '@/store/slices/checkedItemsSlice';
import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';

interface Item<T> {
  img_url: T;
  model_name: T;
  amount: number;
  product_id: T;
  user_id: T;
  m_id: T;
  msp_id: T;
  price: number;
  storage: T;
  brand: T;
}

interface Actions<T> {
  [index: string]: T;
  remove_item_btn: T;
  add_item_btn: T;
}

const CartItem = ({
  data,
  children,
  reload,
  selectAll,
  setSelectAll,
}: {
  data: Item<string>;
  children?: React.ReactNode;
  reload: Dispatch<SetStateAction<boolean>>;
  selectAll: boolean | undefined;
  setSelectAll: Dispatch<SetStateAction<boolean | undefined>>;
}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [isChecked, setIsChecked] = useState<boolean | undefined>(false);
  const checkboxList = useSelector(getCheckedItems);
  const msp_id = data.msp_id;
  const amount = data['amount'];
  const { data: session } = useSession();

  const handleCheckboxChange = useCallback(
    (checkboxVal: boolean, checkboxId: string) => {
      setSelectAll(undefined);
      setIsChecked(checkboxVal);
      dispatch(updateItemsList({ val: checkboxVal, id: checkboxId }));
    },
    [dispatch, setSelectAll]
  );

  useEffect(() => {
    const existCbx = checkboxList.find((el) => el.id === msp_id);
    existCbx && setIsChecked(existCbx.val);
  }, [checkboxList, msp_id]);

  useEffect(() => {
    if (selectAll === true) {
      handleCheckboxChange(true, msp_id);
    } else if (selectAll === false) {
      handleCheckboxChange(false, msp_id);
    }
  }, [selectAll, msp_id, handleCheckboxChange]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    dispatch(toggleCartModal());
    document.body.style.overflow = 'unset';
  };

  const handleChangeQuantity = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const actions: Actions<string> = {
      remove_item_btn: 'REMOVE',
      add_item_btn: 'ADD',
      delete_item_btn: 'DELETE',
    };

    if (
      target.id === 'delete_item_btn' ||
      (target.id === 'remove_item_btn' && amount === 1)
    ) {
      const newList = checkboxList.filter((cbx: any) => cbx.id !== msp_id);
      dispatch(updateItemsListOnDelete(newList));
    }

    const cartDetails = [
      {
        userId: data['user_id'],
        product: {
          modelVariantId: +data.msp_id,
          ...(actions[target.id] === 'ADD' && { amount: 1 }),
        },
        cartAction: actions[target.id],
      },
    ];

    const res = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify(cartDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      if (session?.user?.id) {
        dispatch(fetchCartItemsCountByUserId(session.user.id));
      }
      reload(true);
    }
  };

  return (
    <div>
      <div className={styles.item}>
        <label htmlFor={data['msp_id']} className={styles['label-container']}>
          <input
            onChange={(e) => {
              e.stopPropagation();
              const target = e?.target;
              handleCheckboxChange(!isChecked, target.id);
            }}
            checked={isChecked}
            className={styles.std_checkbox}
            type="checkbox"
            id={data['msp_id']}
          ></input>

          <Link
            onClick={handleClick}
            href={`/${data.brand}/phones/${data['m_id']}`}
            scroll={true}
            className={styles.item_name}
          >
            <div className={styles['link-container']}>
              <div>
                <Image
                  src={data['img_url']}
                  width={100}
                  height={100}
                  alt="iPhone image"
                />
              </div>
              <div>{`${data.brand[0].toUpperCase() + data.brand.slice(1)} ${
                data['model_name']
              } ${data['storage']}`}</div>
            </div>
          </Link>
        </label>

        <div className={styles.change_quantity}>
          <Image
            className={styles['btn-qty-change']}
            id="remove_item_btn"
            onClick={handleChangeQuantity}
            priority
            src="/minus-square.svg"
            height={30}
            width={30}
            alt="decrease qty"
          />
          <div>
            <span>{data['amount']}</span>
          </div>
          <Image
            className={styles['btn-qty-change']}
            id="add_item_btn"
            onClick={handleChangeQuantity}
            priority
            src="/plus-square.svg"
            height={30}
            width={30}
            alt="increase qty"
          />
        </div>

        <div className={styles['price-container']}>
          {`${new Intl.NumberFormat('ru').format(data['price'])} ₽`}
        </div>
        <div className={styles['btn-delete-item']}>
          <Image
            id="delete_item_btn"
            className={styles['btn-qty-change']}
            onClick={handleChangeQuantity}
            priority
            src="/trash.svg"
            height={25}
            width={25}
            alt="decrease qty"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default CartItem;
