'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';
import { useDispatch } from 'react-redux';

import styles from '@/components/PhoneCard.module.scss';

const PhoneCard = ({
  imgUrl,
  model,
  modelId,
  price,
  rom,
  msp_id,
  brand,
}: {
  imgUrl: string;
  model: string;
  modelId: string;
  price: number;
  rom: string;
  msp_id: string;
  brand: string;
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(session);
    console.log(userId);
    e.preventDefault();
    e.stopPropagation();

    const cartDetails = [
      {
        userId,
        product: { modelVariantId: +msp_id!, amount: 1 },
        cartAction: 'ADD',
      },
    ];
    const res = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify(cartDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (userId) {
      dispatch(fetchCartItemsCountByUserId(userId));
    }
    console.log('REQ SUCCESS');
  };

  // console.log(pathname);
  return (
    <div className={styles['phone-card']}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Link className={styles['link']} href={`/${brand}/phones/${modelId}`}>
          <div>
            <Image src={imgUrl} width={250} height={250} alt="iPhone image" />
            <h4 className={styles['phone_card_header']}>{`${
              brand[0].toUpperCase() + brand.slice(1)
            } ${model} ${rom}`}</h4>
          </div>
        </Link>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        <div
          style={{
            fontWeight: '800',
            fontSize: '1.5em',
          }}
        >{`${new Intl.NumberFormat('ru').format(price)} ₽`}</div>
        <div>
          <button
            className={styles['btn-add-to-cart']}
            onClick={handleAddToCart}
          >
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 5L19 12H7.37671M20 16H8L6 3H3M16 5.5H13.5M13.5 5.5H11M13.5 5.5V8M13.5 5.5V3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {/* <svg
              fill="#000000"
              width="22px"
              height="22px"
              viewBox="0 0 32 32"
              id="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>shopping--cart</title>
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
            </svg> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
