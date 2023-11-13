import Link from 'next/link';
import styles from './PageLink.module.scss';

const PageLink = ({
  pageNum,
  path,
  curPage,
}: {
  pageNum: number;
  path: string;
  curPage: boolean;
}) => {
  return (
    <div>
      <Link
        className={
          curPage
            ? `${styles['current-page']} ${styles['regular-page']}`
            : styles['regular-page']
        }
        href={`${path}?page=${pageNum}`}
      >
        {pageNum}
      </Link>
    </div>
  );
};

export default PageLink;
