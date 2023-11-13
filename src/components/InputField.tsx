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
        styles['TextField'] +
        ' ' +
        (isEmpty ? styles['TextField--isEmpty'] : styles['TextField--isFilled'])
      }`}

      //   className={[
      //     'TextField',
      //     isEmpty ? 'TextField--isEmpty' : '',
      //     !isEmpty ? 'TextField--isFilled' : '',
      //   ].join(' ')}

      //   style={style}
    >
      <label className={styles['TextField-label']} htmlFor={id}>
        {label}
      </label>
      <input
        // {...rest}
        required={required}
        className={styles['TextField-input']}
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
