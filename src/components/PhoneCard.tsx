'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';
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
  };

  return (
    <div className={styles['phone-card']}>
      <div className={styles['phone-card__link-container']}>
        <Link className={styles['link']} href={`/${brand}/phones/${modelId}`}>
          <div>
            <Image src={imgUrl} width={250} height={250} alt="Phone image" />
            <h4>{`${
              brand[0].toUpperCase() + brand.slice(1)
            } ${model} ${rom}`}</h4>
          </div>
        </Link>
      </div>
      <div className={styles['phone-card-info']}>
        <div
          className={styles['phone-card-info__price']}
        >{`${new Intl.NumberFormat('ru').format(price)} ₽`}</div>
        <div>
          <button
            className={styles['btn-add-to-cart']}
            onClick={handleAddToCart}
          >
            <Image
              priority
              src="/cart-plus.svg"
              height={25}
              width={25}
              alt="Add to cart icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
