import { useState, useRef } from 'react';
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
  // const toggle = () => {
  //   setOPen(!open);
  // };
  // const contentRef = useRef<null | HTMLDivElement>(null);
  // const [open, setOPen] = useState(isOpen);

  return (
    <div
      id={id}
      style={{
        display: 'flex',
        // overflow: 'auto',
        flexDirection: 'column',
        // height: '100%',
        width: '100%',
        gap: '2em',
        // marginLeft: '1em',
      }}
    >
      <div onClick={() => visibilityChanger(id)} className={styles['wrapper']}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              transform: visibleState ? 'rotate(180deg)' : 'rotate(270deg)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.03 7.97a.75.75 0 0 1 0 1.06L10 13.06 5.97 9.03a.75.75 0 0 1 1.06-1.06L10 10.94l2.97-2.97a.75.75 0 0 1 1.06 0z"
              ></path>
            </svg>
          </div>
          <div>{containerLabel}</div>
        </div>
        {totalPrice && <div>{`${totalPrice} ₽`}</div>}
      </div>

      <div
        className={styles['content-parent']}
        // ref={contentRef}
        style={
          visibleState
            ? {
                height: '100%',
                // overflow: 'scroll',
                // height: contentRef.current.scrollHeight + 'px',
              }
            : { height: '0px', overflow: 'hidden' }
        }
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleWrapper;
