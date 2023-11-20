import PageLink from './PageLink';
import styles from './Pagination.module.scss';

interface PaginationData<T> {
  path: T;
  totalPages: T;
  curPage: T;
}

const Pagination = ({ path, totalPages, curPage }: PaginationData<any>) => {
  let liArray = [];
  for (let i = 1; i <= +totalPages; i++) {
    liArray.push(
      <li key={i}>
        <PageLink path={path} pageNum={i} curPage={curPage === i || false} />
      </li>
    );
  }
  return <ul className={styles['pages-links']}>{liArray}</ul>;
};

export default Pagination;
