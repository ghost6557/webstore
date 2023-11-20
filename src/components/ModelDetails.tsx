import Image from 'next/image';
import styles from '@/components/ModelDetails.module.scss';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';
interface Model<T> {
  pd_id: T;
  m_id: number;
  desc: T;
  year: T;
  display: T;
  resolution: T;
  processor: T;
  main_camera: T;
  front_camera: T;
  battery: T;
  face_id: T;
  os: T;
  img_url: T;
  model_name: T;
  brand: T;
  rom_price: { rom: string; price: number; msp_id: number }[];
}

const ModelDetails = ({ modelData }: { modelData: Model<string> }) => {
  const firstElement = modelData['rom_price']
    .sort((a, b) => a.price - b.price)
    .at(0);
  const [price, setPrice] = useState(firstElement?.price!);
  const [modelVariantId, setModelVariantId] = useState(firstElement?.msp_id);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleChangeRom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    const dataPrice: any = target.dataset?.price;
    const dataVariant: any = target.dataset?.variant;

    setPrice(dataPrice);
    setModelVariantId(dataVariant);
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const cartDetails = [
      {
        userId,
        product: { modelVariantId: +modelVariantId!, amount: 1 },
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
    <div>
      <h1>{`${modelData.brand[0].toUpperCase() + modelData.brand.slice(1)} ${
        modelData['model_name']
      }`}</h1>

      <div className={styles.wrapper}>
        <div className={styles['model-desc']}>
          <Image
            src={modelData['img_url']}
            width={300}
            height={300}
            alt="iPhone image"
          />
        </div>

        <div className={styles['sub-wrapper']}>
          <ul className={styles['rom-price']}>
            {modelData['rom_price']
              .sort((a, b) => a.price - b.price)
              .map((variant) => (
                <div
                  data-price={variant.price}
                  data-variant={variant['msp_id']}
                  onClick={handleChangeRom}
                  className={`${styles['rom-variant']} ${
                    parseInt(modelVariantId as any) === variant.msp_id
                      ? styles['current-rom']
                      : ''
                  }`}
                  key={variant['msp_id']}
                >
                  <li>{variant.rom}</li>
                </div>
              ))}
          </ul>

          <div className={styles['container-add-to-cart']}>
            <div
              className={styles['container-add-to-cart__price']}
            >{`${new Intl.NumberFormat('ru').format(price)} ₽`}</div>
            <button
              onClick={handleAddToCart}
              className={styles['btn-add-to-cart']}
            >
              Добавить в корзину
            </button>
          </div>

          <ul className={styles['model-desc']}>
            <li>{`Бренд: ${
              modelData.brand[0].toUpperCase() + modelData.brand.slice(1)
            }`}</li>
            <li>{`Дисплей: ${modelData['display']} (${modelData['resolution']})`}</li>
            <li>{`Процессор: ${modelData['processor']}`}</li>
            <li>{`Основная камера: ${modelData['main_camera']}`}</li>
            <li>{`Фронтальная камера: ${modelData['front_camera']}`}</li>
            <li>{`Ёмкость батареи: ${modelData['battery']} мАч`}</li>
            <li>{`ОС: ${modelData['os']}`}</li>
            <li>{`Год релиза: ${modelData['year']}`}</li>
          </ul>
        </div>

        <div className={styles['desc-container']}>
          <p className={styles['desc-container__info']}>{modelData['desc']}</p>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
