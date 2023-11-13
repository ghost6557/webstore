import PageLink from './PageLink';

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
  return (
    <ul
      style={{
        display: 'flex',
        gap: '2em',
        listStyle: 'none',
        justifyContent: 'center',
      }}
    >
      {liArray}
      {/* <p>{'totalPages ' + totalPages}</p>
      <p>{'curPage ' + curPage}</p> */}
    </ul>
  );
};

export default Pagination;
