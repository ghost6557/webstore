'use client';

import { useParams } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import ModelDetails from '@/components/ModelDetails';

export default function Page() {
  const params = useParams();
  const { brand, id } = params;
  console.log(params);
  const data: any[] | any = useFetchData(`${brand}/phones/${id}`);
  console.log(data);
  return (
    <>
      {!data && <h2>Loading...</h2>}
      {data && <ModelDetails modelData={...data[0]} />}
    </>
  );
}
