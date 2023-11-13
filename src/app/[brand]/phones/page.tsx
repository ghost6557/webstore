'use client';

import styles from './PageLayout.module.scss';
import useFetchData from '@/hooks/useFetchData';
import PhoneCard from '@/components/PhoneCard';
import PhonesWrapper from '@/components/PhonesWrapper';
import { useSession } from 'next-auth/react';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { fetchCartItemsCountByUserId } from '@/store/slices/cartItemsCountSlice';
import { useDispatch } from 'react-redux';
import {
  useParams,
  useSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import FiltersMenu from '@/components/FiltersMenu';

interface filter {
  brand: any[];
  rom: any[];
  display: any[];
  battery: any[];
}

interface actFilters {
  [key: string]: any[];
}

const initialFilters: filter = {
  brand: [],
  rom: [],
  display: [],
  battery: [],
};

export default function Page() {
  const params = useParams();
  // console.log(params);
  const { data: session } = useSession();
  const pathname = usePathname();
  console.log(pathname);
  const searchParams = useSearchParams()!;
  const page = parseInt(searchParams.get('page') as string);
  console.log(searchParams.get('page'));
  const userId = session?.user?.id;
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();
  const phoneCategory = pathname.split('/')[1];
  // const data: any = useFetchData(`${pathname}?page=${page}`);

  const [data, setData] = useState<any>();

  // if (data) {
  //   console.log(data);
  // }

  // const filtersString = '';

  const [filters, setFilters] = useState<filter>(initialFilters);
  console.log('filters', filters);

  useEffect(
    () => router.push(`${pathname}?page=1`),
    [filters, pathname, router]
  );

  useEffect(() => {
    let filtersString = '';
    // let actualFilters: actFilters = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value.length > 0) {
        // filtersString += `${key}=${encodeURIComponent(JSON.stringify(value))}`;
        // actualFilters[key] = value;
        filtersString += `&${key}=${value.join()}`;
      }
    }
    // console.log(actualFilters);

    const fetchData = async () => {
      const res = await fetch(
        `/api${pathname}?page=${page}${filtersString}`
        // filters: actualFilters,
      );
      const fetchedData = await res.json();
      setData(fetchedData);

      // setReload(false);
    };
    fetchData();
  }, [filters, page, pathname]);

  return (
    <div className={styles.page}>
      {/* <h1>Hello, Next.js!</h1> */}
      {!data && <h2>Загрузка...</h2>}
      {data && (
        <div>
          <h1>
            {phoneCategory === 'all'
              ? 'Смартфоны'
              : phoneCategory === 'apple'
              ? 'iPhones'
              : `Смартфоны ${
                  phoneCategory[0].toUpperCase() + phoneCategory.slice(1)
                }`}
          </h1>
          <div className={styles['content']}>
            <PhonesWrapper>
              {data.phones.map((phone: any) => (
                <PhoneCard
                  key={phone['msp_id']}
                  imgUrl={phone['img_url']}
                  model={phone['model_name']}
                  modelId={phone['m_id']}
                  price={phone['price']}
                  rom={phone['rom']}
                  msp_id={phone['msp_id']}
                  brand={phone['brand']}
                />
              ))}
            </PhonesWrapper>
            <FiltersMenu
              notShowBrandFilter={phoneCategory === 'all' ? false : true}
              setFilters={setFilters}
            />
            <Pagination
              path={pathname}
              totalPages={data.totalPages}
              curPage={page}
            />
          </div>
        </div>
      )}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}
