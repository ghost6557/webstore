import { ChangeEventHandler } from 'react';

import styles from '@/components/InputField.module.scss';

const InputField = ({
  value,
  onChange,
  id,
  label,
  name,
  type = 'text',
  required,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) => {
  const isEmpty = String(value || '').length === 0;
  return (
    <div
      className={`${
        styles['textfield'] +
        ' ' +
        (isEmpty ? styles['textfield--isempty'] : styles['textfield--isfilled'])
      }`}
    >
      <label className={styles['textfield-label']} htmlFor={id}>
        {label}
      </label>
      <input
        required={required}
        className={styles['textfield-input']}
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        type={type}
      />
    </div>
  );
};

export default InputField;
