import Image from 'next/image';
import styles from './CollapsibleWrapper.module.scss';

const CollapsibleWrapper = ({
  children,
  containerLabel,
  isOpen,
  id,
  visibilityChanger,
  visibleState,
  totalPrice,
}: {
  children: React.ReactNode;
  containerLabel: string;
  isOpen?: boolean;
  id: string;
  visibilityChanger: (id: string) => void;
  visibleState: boolean;
  totalPrice?: string;
}) => {
  return (
    <div className={styles['wrapper']} id={id}>
      <div
        onClick={() => visibilityChanger(id)}
        className={styles['container-info']}
      >
        <div className={styles['container-info__name']}>
          <div className={visibleState ? styles['container-info__arrow'] : ''}>
            <Image
              priority
              src="/arrow-down.svg"
              height={15}
              width={15}
              alt="User icon"
            />
          </div>
          <div>{containerLabel}</div>
        </div>
        {totalPrice && <div>{`${totalPrice} ₽`}</div>}
      </div>

      <div
        className={
          visibleState
            ? styles['content-parent__visible']
            : styles['content-parent__hidden']
        }
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleWrapper;
