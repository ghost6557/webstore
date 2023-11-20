'use client';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import InputField from './InputField';
import { deliveryForm } from '@/components/CartForm';

const DeliveryInfoForm = ({
  formValues,
  onChangeFormValues,
  formRef,
  onMakeOrder,
}: {
  formValues: deliveryForm<string>;
  onChangeFormValues: Dispatch<SetStateAction<deliveryForm<string>>>;
  formRef: any;
  onMakeOrder: any;
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChangeFormValues({ ...formValues, [name]: value });
  };

  return (
    <form ref={formRef} onSubmit={onMakeOrder}>
      <InputField
        name="deliveryAddress"
        value={formValues['deliveryAddress']}
        onChange={handleChange}
        id="deliveryAddress"
        label="Адрес доставки"
        required={true}
      />
      <InputField
        name="apartment"
        value={formValues['apartment']}
        onChange={handleChange}
        id="apartment"
        label="Квартира/офис"
        type="number"
        required={true}
      />
      <InputField
        name="entrance"
        value={formValues['entrance']}
        onChange={handleChange}
        id="entrance"
        label="Подъезд"
        type="number"
        required={true}
      />
      <InputField
        name="floor"
        value={formValues['floor']}
        onChange={handleChange}
        id="floor"
        label="Этаж"
        type="number"
        required={true}
      />
      <InputField
        name="comment"
        value={formValues['comment']}
        onChange={handleChange}
        id="comment"
        label="Комментарий"
        required={true}
      />
    </form>
  );
};

export default DeliveryInfoForm;
