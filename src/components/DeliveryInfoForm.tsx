'use client';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import InputField from './InputField';
import { deliveryForm } from '@/components/CartForm';

// interface deliveryForm {
//   deliveryAddress: string;
//   apartment: string;
//   entrance: string;
//   floor: string;
//   comment: string;
// }

// const initialForm: deliveryForm = {
//   deliveryAddress: '',
//   apartment: '',
//   entrance: '',
//   floor: '',
//   comment: '',
// };

const DeliveryInfoForm = ({
  formValues,
  onChangeFormValues,
}: {
  formValues: deliveryForm<string>;
  onChangeFormValues: Dispatch<SetStateAction<deliveryForm<string>>>;
}) => {
  //   const [loading, setLoading] = useState(false);
  //   const [formValues, setFormValues] = useState(initialForm);
  //   const [error, setError] = useState('');

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     try {
  //       setLoading(true);
  //       setFormValues(initialForm);

  //       //   const res = await fetch('/api/register', {
  //       //     method: 'POST',
  //       //     body: JSON.stringify(formValues),
  //       //     headers: {
  //       //       'Content-Type': 'application/json',
  //       //     },
  //       //   });

  //       setLoading(false);
  //       //   if (!res.ok) {
  //       //     setError((await res.json()).message);
  //       //     return;
  //       //   }
  //     } catch (error: any) {
  //       setLoading(false);
  //       setError(error);
  //     }
  //   };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // event.preventDefault();
    const { name, value } = event.target;
    onChangeFormValues({ ...formValues, [name]: value });
  };

  return (
    <form>
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
