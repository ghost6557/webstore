import Link from 'next/link';

const PageLink = ({ pageNum, path }: { pageNum: number; path: string }) => {
  return (
    <div style={{ border: '0.1em solid black' }}>
      <Link href={`${path}?page=${pageNum}`}>{pageNum}</Link>
    </div>
  );
};

export default PageLink;
