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
      // setContainersState(state =>
    };
    fetchData();
  }, [session?.user?.id]);

  const handleContainerToggle = (id: string): void => {
    console.log(id);
    // const NumId: string = id;
    setContainersState((state) => ({
      ...state,
      [id]: !state[id],
    }));
  };

  ordersData && console.log(ordersData);
  console.log(containersState);

  return (
    <>
      {ordersData && (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: '0 0 2em 2em',
            // overflow: 'scroll',
          }}
        >
          <div className={styles.order_history_header}>
            <h1>Заказы</h1>
          </div>
          <div className={styles['order_history']}>
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
                  {ordersData
                    .filter((ordItem) => ordItem['id'] === item['id'])
                    .map((ordItem) => (
                      <OrderItem
                        key={ordItem['msp_id']}
                        data={ordItem}
                      ></OrderItem>
                    ))}
                </CollapsibleWrapper>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
export default OrdersHistory;
