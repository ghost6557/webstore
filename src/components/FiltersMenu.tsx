import { Dispatch, SetStateAction } from 'react';
import styles from './FiltersMenu.module.scss';
import FilterItem from './FilterItem';

interface filter {
  brand: any[];
  rom: any[];
  display: any[];
  battery: any[];
}

const filters = [
  {
    dispName: 'Бренд',
    values: {
      Apple: 'apple',
      Samsung: 'samsung',
      Google: 'google',
      OnePlus: 'oneplus',
    },
    name: 'brand',
  },
  {
    dispName: 'Встроенная память',
    values: {
      '128 GB': '128GB',
      '256 GB': '256GB',
      '512 GB': '512GB',
      '1 TB': '1TB',
    },
    name: 'rom',
  },
  {
    dispName: 'Диагональ экрана',
    values: {
      'от 6.1" до 6.2"': '6.1,6.2',
      'от 6.3" до 6.5"': '6.3,6.5',
      'от 6.6"': '6.6,8',
    },
    name: 'display',
  },
  {
    dispName: 'Ёмкость батареи',
    values: {
      'от 3000 до 3999 мАч': '3000,3999',
      'от 4000 до 4499 мАч': '4000,4499',
      'от 4500 мАч': '4500,6000',
    },
    name: 'battery',
  },
];

const FiltersMenu = ({
  setFilters,
  notShowBrandFilter,
}: {
  setFilters: Dispatch<SetStateAction<filter>>;
  notShowBrandFilter: boolean;
}) => {
  let displayedFilters = filters;
  if (notShowBrandFilter) {
    displayedFilters = filters.filter((el) => el.name !== 'brand');
  }

  return (
    <div className={styles['filters-container']}>
      {displayedFilters.map((el, idx) => (
        <FilterItem key={idx} data={{ ...el, setFilters }} />
      ))}
    </div>
  );
};

export default FiltersMenu;

/* <div>
      <div>
        <span>Бренд</span>
        <div className={styles.item}>
          <label
            // htmlFor={`c_item_${data['msp_id']}`}
            htmlFor="apple"
            className={styles.label}
          >
            <input
              // onChange={(e) => {
              //   e.stopPropagation();
              //   const target = e?.target;
              //   // as HTMLInputElement;
              //   handleCheckboxChange(!isChecked, target.id);
              // }}
              // checked={isChecked}
              data-val="apple"
              className={styles.std_checkbox}
              // style={{ display: 'block' }}
              // data-msp_id={data['msp_id']}
              type="checkbox"
              // name="c_item"
              id="apple"
              // id={`c_item_${data['msp_id']}`}
            ></input>
            Apple
          </label>
          <label htmlFor="samsung" className={styles.label}>
            <input
              data-val="samsung"
              className={styles.std_checkbox}
              type="checkbox"
              // name="c_item"
              id="samsung"
            ></input>
            Samsung
          </label>
        </div>
      </div>

      <div>
        <span>Встроенная память</span>
        <label htmlFor="128GB" className={styles.label}>
          <input
            data-val="128"
            className={styles.std_checkbox}
            type="checkbox"
            // name="c_item"
            id="128GB"
          ></input>
          128 ГБ
        </label>
        <label htmlFor="256GB" className={styles.label}>
          <input
            data-val="256"
            className={styles.std_checkbox}
            type="checkbox"
            // name="c_item"
            id="256GB"
          ></input>
          256 ГБ
        </label>
        <label htmlFor="512GB" className={styles.label}>
          <input
            data-val="512"
            className={styles.std_checkbox}
            type="checkbox"
            // name="c_item"
            id="512GB"
          ></input>
          512 ГБ
        </label>
        <label htmlFor="1TB" className={styles.label}>
          <input
            data-val="1"
            className={styles.std_checkbox}
            type="checkbox"
            // name="c_item"
            id="1TB"
          ></input>
          1 ТБ
        </label>
      </div>
    </div> */
