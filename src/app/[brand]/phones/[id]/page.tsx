'use client';

import { useParams } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import ModelDetails from '@/components/ModelDetails';
import { useEffect } from 'react';

export default function Page() {
  const params = useParams();
  const { brand, id } = params;
  console.log(params);
  const data: any[] | any = useFetchData(`${brand}/phones/${id}`);
  console.log(data);

  // useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), []);

  return (
    <>
      {!data && <h2>Загрузка...</h2>}
      {data && <ModelDetails modelData={...data[0]} />}
    </>
  );
}
