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
