import type { Metadata } from 'next';
import NextAuthProvider from '@/components/providers/providers';
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/store/StoreProvider';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/Modal';
import styles from './PageLayout.module.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GadgetGallery',
};

function RootLayout(props: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <StoreProvider>
        <html lang="en" style={{ width: '100%', height: '100%' }}>
          <body className={`${styles.body} ${inter.className}`}>
            <Modal />

            <header>
              <Navbar />
            </header>

            <main>
              <div className={styles.content}>
                <Sidebar />
                <div>{props.children}</div>
              </div>
            </main>
          </body>
        </html>
      </StoreProvider>
    </NextAuthProvider>
  );
}

export default RootLayout;
