import Image from 'next/image';

import styles from './OrderItem.module.scss';

interface Item<T> {
  img_url: T;
  model_name: T;
  amount: T;
  product_id: T;
  user_id: T;
  m_id: T;
  msp_id: T;
  price: number;
  storage: T;
  brand: T;
}

const OrderItem = ({ data }: { data: Item<string> }) => {
  return (
    <div className={styles['item_container']}>
      <div className={styles['item_desc']}>
        <Image
          className={styles.item_img}
          src={data['img_url']}
          alt="iPhone image"
          width={600}
          height={600}
        />
        <div className={styles.item_name}>{`${
          data.brand[0].toUpperCase() + data.brand.slice(1)
        } ${data['model_name']} ${data['storage']}`}</div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // margin: '2em',
        }}
      >
        <span>{data['amount']} шт</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2em',
        }}
      >
        <span>{`${new Intl.NumberFormat('ru').format(data['price'])} ₽`}</span>
      </div>
    </div>
  );
};

export default OrderItem;
