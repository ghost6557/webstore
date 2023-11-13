import { useEffect, useState } from 'react';

const useFetchData = (route: string) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/${route}`);
      const fetchedData = await res.json();
      setData(fetchedData);
    };
    fetchData();
  }, [route]);
  return data;
};

export default useFetchData;
