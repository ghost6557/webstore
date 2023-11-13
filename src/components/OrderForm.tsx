import { useSelector, useDispatch } from 'react-redux';
import {
  toggleAuthModal,
  toggleCartModal,
  toggleOrdersModal,
  getShowAuthModal,
  getShowCartModal,
  getShowOrdersModal,
} from '@/store/slices/modalsSlice';
import {
  updateItemsList,
  getCheckedItems,
} from '@/store/slices/checkedItemsSlice';

const OrderForm = () => {
  const dispatch = useDispatch();
  const checkboxListStore = useSelector(getCheckedItems);
  return (
    <div>
      <p>TEST4534554</p>
      <button
        onClick={() => {
          dispatch(toggleOrdersModal());
          dispatch(toggleCartModal());
        }}
      >
        Вернуться в корзину
      </button>
      <pre>
        {checkboxListStore.map((el, id) => (
          <li key={id}>{`${el.id}, ${el.val}`}</li>
        ))}
      </pre>
    </div>
  );
};

export default OrderForm;
