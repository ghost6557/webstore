import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import OrderItem from './OrderItem';
import CollapsibleWrapper from './CollapsibleWrapper';
import styles from './OrdersHistory.module.scss';

interface ContainersIds {
  [key: string]: boolean;
}

const OrdersHistory = () => {
  const { data: session } = useSession();
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [containersState, setContainersState] = useState({} as ContainersIds);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/ordering/${session?.user?.id}`);
      const fetchedData = await res.json();
      const Ids = fetchedData.reduce(
        (accumulator: any, currentValue: any) => ({
          ...accumulator,
          [currentValue['id']]: false,
        }),
        {}
      );
      setOrdersData(fetchedData);
      setContainersState(Ids);
    };
    fetchData();
  }, [session?.user?.id]);

  const handleContainerToggle = (id: string): void => {
    setContainersState((state) => ({
      ...state,
      [id]: !state[id],
    }));
  };

  return (
    <>
      {ordersData && (
        <div className={styles['orders-history-container']}>
          <div className={styles['order-history-header']}>
            <h1>Заказы</h1>
          </div>
          <div className={styles['order-history']}>
            {ordersData
              .filter(
                (item: any, idx: any) =>
                  idx === ordersData.findIndex((el) => el['id'] === item['id'])
              )
              .map((item: any) => (
                <CollapsibleWrapper
                  key={item['id']}
                  containerLabel={`Заказ № ${item['id']}`}
                  visibilityChanger={handleContainerToggle}
                  visibleState={containersState[item['id']]}
                  id={item['id']}
                  totalPrice={new Intl.NumberFormat('ru').format(
                    ordersData
                      .filter((ordItem) => ordItem['id'] === item['id'])
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          Number(currentValue['price']) *
                            currentValue['amount'],
                        0
                      )
                  )}
                >
                  <div className={styles['order-container']}>
                    {ordersData
                      .filter((ordItem) => ordItem['id'] === item['id'])
                      .map((ordItem) => (
                        <OrderItem
                          key={ordItem['msp_id']}
                          data={ordItem}
                        ></OrderItem>
                      ))}
                  </div>
                </CollapsibleWrapper>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
export default OrdersHistory;
