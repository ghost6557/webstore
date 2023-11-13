import Image from 'next/image';
import styles from '@/components/ModelDetails.module.scss';
import { useState } from 'react';

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

interface DataPrice {
  price: number;
}

const ModelDetails = ({ modelData }: { modelData: Model<string> }) => {
  const firstElement = modelData['rom_price']
    .sort((a, b) => a.price - b.price)
    .at(0);
  const [price, setPrice] = useState(firstElement?.price!);
  const [modelVariantId, setModelVariantId] = useState(firstElement?.msp_id);
  // useState(modelData['rom_price'][0]['price']);

  const handleChangeRom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    const dataPrice: any = target.dataset?.price;
    const dataVariant: any = target.dataset?.variant;
    console.log(target.dataset);
    setPrice(dataPrice);
    setModelVariantId(dataVariant);
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

        <div className={styles.sub_wrapper}>
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

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '12em',
              height: '6em',
              gap: '1em',
            }}
          >
            <div
              style={{
                fontWeight: '800',
                fontSize: '1.5em',
              }}
            >{`${new Intl.NumberFormat('ru').format(price)} ₽`}</div>
            <button className={styles['btn-add-to-cart']}>
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

        {/* <div>
          
        </div> */}

        <div className={styles.desc}>
          <p style={{ width: '52%' }}>{modelData['desc']}</p>
        </div>
        {/* <pre>{JSON.stringify(modelData, null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default ModelDetails;
