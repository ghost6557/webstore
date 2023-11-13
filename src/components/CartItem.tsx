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
  // setCheckboxList,
  setSelectAll,
}: {
  data: Item<string>;
  children?: React.ReactNode;
  reload: Dispatch<SetStateAction<boolean>>;
  selectAll: boolean | undefined;
  // setCheckboxList: Dispatch<SetStateAction<any[]>>;
  setSelectAll: Dispatch<SetStateAction<boolean | undefined>>;
}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [isChecked, setIsChecked] = useState<boolean | undefined>(false);
  const checkboxList = useSelector(getCheckedItems);
  const msp_id = data.msp_id;
  const amount = data['amount'];
  const { data: session } = useSession();

  // if (checkboxList.length) {

  // existCbx && setIsChecked(existCbx.val);

  // }
  // console.log(checkboxList);

  const handleCheckboxChange = useCallback(
    (checkboxVal: boolean, checkboxId: string) => {
      // const checkboxList = [...checkboxList];
      setSelectAll(undefined);
      setIsChecked(checkboxVal);
      dispatch(updateItemsList({ val: checkboxVal, id: checkboxId }));

      // let updatedList: any[] = [];
      // if (checkboxList.length) {
      //   const matchedCheckbox = checkboxList.find(
      //     (cbx: any) => cbx.id === checkboxId
      //   );

      //   if (matchedCheckbox) {
      //     const cbxListWithoutMatched = checkboxList.filter(
      //       (cbx) => cbx.id !== checkboxId
      //     );
      //     // matchedCheckbox.val = checkboxVal;
      //     updatedList = [
      //       ...cbxListWithoutMatched,
      //       { id: matchedCheckbox.id, val: !matchedCheckbox.val },
      //     ];
      //   } else {
      //     updatedList = [...checkboxList, { id: checkboxId, val: checkboxVal }];
      //   }
      // } else if (!checkboxList.length) {
      //   updatedList = [...checkboxList, { id: checkboxId, val: checkboxVal }];
      // }
      // console.log(updatedList);
      // // return updatedList;
      // dispatch(updateItemsList(updatedList));

      // setCheckboxList((list: any[]): any[] => {
      //   let updatedList: any[] = [];
      //   if (list.length) {
      //     const matchedCheckbox = list.find(
      //       (cbx: any) => cbx.id === checkboxId
      //     );
      //     if (matchedCheckbox) {
      //       matchedCheckbox.val = checkboxVal;
      //       updatedList = list;
      //     } else {
      //       updatedList = [...list, { id: checkboxId, val: checkboxVal }];
      //     }
      //   } else if (!list.length) {
      //     updatedList = [...list, { id: checkboxId, val: checkboxVal }];
      //   }
      //   console.log(updatedList);
      //   return updatedList;
      // });
    },
    [dispatch, setSelectAll]
  );

  useEffect(() => {
    const existCbx = checkboxList.find((el) => el.id === msp_id);
    existCbx && setIsChecked(existCbx.val);
  }, [checkboxList, msp_id]);

  useEffect(() => {
    // const checkBoxId = `c_item_${msp_id}`;
    if (selectAll === true) {
      handleCheckboxChange(true, msp_id);
      // setIsChecked(true);
    } else if (selectAll === false) {
      handleCheckboxChange(false, msp_id);
      // setIsChecked(false);
    }
  }, [selectAll, msp_id, handleCheckboxChange]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // e.preventDefault();
    // e.stopPropagation;
    dispatch(toggleCartModal());
    document.body.style.overflow = 'unset';
  };

  // e,
  // }: // checkboxVal,
  // checkboxId,
  // {
  // e?: React.ChangeEvent<HTMLInputElement>;
  // checkboxVal?: boolean;
  // checkboxId?: string;

  // const handleCheckboxChangeByClick = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   // e.preventDefault();
  //   const target = e?.target as HTMLInputElement;

  //   console.log(target.id);

  //   // if (selectAll !== undefined) {
  //   //   setIsChecked((isChecked) => selectAll);
  //   // } else {
  //   handleCheckboxChange(!isChecked, target.id);

  //   // setSelectAll(undefined);
  //   // setIsChecked((isChecked) => !isChecked);
  //   // setCheckboxList((list: any[]): any[] => {
  //   //   let updatedList: any[] = [];
  //   //   if (list.length) {
  //   //     const matchedCheckbox = list.find((cbx: any) => cbx.id === target.id);
  //   //     if (matchedCheckbox) {
  //   //       matchedCheckbox.val = !matchedCheckbox.val;
  //   //       updatedList = list;
  //   //     } else {
  //   //       updatedList = [...list, { id: target.id, val: !isChecked }];
  //   //     }
  //   //   } else if (!list.length) {
  //   //     updatedList = [...list, { id: target.id, val: !isChecked }];
  //   //   }
  //   //   console.log(updatedList);
  //   //   return updatedList;
  //   // });
  // };

  // const cbxListWithoutMatched = list.filter(
  //   (cbx: any) => cbx.id !== target.id
  // );

  // updatedList = [
  //   ...cbxListWithoutMatched,
  //   { id: matchedCheckbox.id, val: !matchedCheckbox.val },
  // ];

  const handleChangeQuantity = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
      console.log('AMOUNT TYPE');
      console.log(typeof amount);
      const newList = checkboxList.filter((cbx: any) => cbx.id !== msp_id);
      dispatch(updateItemsListOnDelete(newList));
      // setCheckboxList();
      // const updatedCbxList = checkboxList.filter((cbx) => !Boolean(cbx.val));
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
        <label
          // htmlFor={`c_item_${data['msp_id']}`}
          htmlFor={data['msp_id']}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            gap: '0.5em',
          }}
        >
          <input
            onChange={(e) => {
              e.stopPropagation();
              const target = e?.target;
              // as HTMLInputElement;
              handleCheckboxChange(!isChecked, target.id);
            }}
            checked={isChecked}
            className={styles.std_checkbox}
            // style={{ display: 'block' }}
            // data-msp_id={data['msp_id']}
            type="checkbox"
            // name="c_item"
            id={data['msp_id']}
            // id={`c_item_${data['msp_id']}`}
          ></input>

          <Link
            style={{ flexGrow: '2' }}
            onClick={handleClick}
            href={`/${data.brand}/phones/${data['m_id']}`}
            // className={styles.item_name}
          >
            <div
              style={{
                display: 'flex',
                gap: '5%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
              }}
            >
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
          <div>
            <button id="remove_item_btn" onClick={handleChangeQuantity}>
              -
            </button>
          </div>
          <div>
            <span>{data['amount']}</span>
          </div>
          <div>
            <button id="add_item_btn" onClick={handleChangeQuantity}>
              +
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // margin: '2em',
            width: '100%',
          }}
        >
          <span>{`${new Intl.NumberFormat('ru').format(
            data['price']
          )} ₽`}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // margin: '2em',
          }}
        >
          <button id="delete_item_btn" onClick={handleChangeQuantity}>
            X
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CartItem;
