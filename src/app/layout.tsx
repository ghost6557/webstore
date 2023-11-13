import type { Metadata } from 'next';
import NextAuthProvider from '@/components/providers/providers';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/Modal';
import { StoreProvider } from '@/store/StoreProvider';

import styles from './PageLayout.module.scss';
// import resetStyles from '@/components/main.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GadgetGallery',
};

function RootLayout(props: {
  children: React.ReactNode;
  login: React.ReactNode;
  register: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <StoreProvider>
        <html lang="en">
          <body className={`${styles.body} ${inter.className}`}>
            <Modal />

            <header>
              <Navbar />
            </header>

            <main>
              <div className={styles.content}>
                <Sidebar />
                <div className={styles['main-content']}>
                  {props.children}
                  {props.login}
                  {props.register}
                </div>
              </div>
            </main>
          </body>
        </html>
      </StoreProvider>
    </NextAuthProvider>
  );
}

export default RootLayout;
