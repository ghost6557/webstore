import styles from '@/components/PhonesWrapper.module.scss';

const PhonesWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles['phones-wrapper']}>{children}</div>;
};

export default PhonesWrapper;
