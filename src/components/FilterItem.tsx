import { Dispatch, SetStateAction } from 'react';
import styles from './FilterItem.module.scss';
import { ChangeEvent } from 'react';

interface FItem<T> {
  data: {
    dispName: T;
    values: {};
    name: T;
    setFilters: Dispatch<SetStateAction<any>>;
  };
}
const FilterItem = ({
  data: { dispName, values, name, setFilters },
}: FItem<string>) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, id } = e.target;
    // console.log(name, id);
    setFilters((state: any) => {
      let updatedFilter;
      const matchedFilter = state[name].find((el: any) => el === id);
      if (matchedFilter) {
        updatedFilter = state[name].filter((el: any) => el !== id);
      } else {
        updatedFilter = [...state[name], id];
      }
      return { ...state, [name]: updatedFilter };
    });
  };

  return (
    <div className={styles['container-filter-variants']}>
      <div>{dispName}</div>
      <div className={styles.item}>
        {Object.entries(values).map(([k, v], idx) => (
          <label key={idx} htmlFor={v as any} className={styles.label}>
            <input
              onChange={handleChange}
              name={name}
              // data-val={v as any}
              className={styles.std_checkbox}
              type="checkbox"
              id={v as any}
            ></input>
            {k}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterItem;
