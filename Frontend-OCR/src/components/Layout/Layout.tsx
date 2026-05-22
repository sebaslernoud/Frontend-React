import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  onSelectTab?: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onSelectTab }) => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar onSelectTab={onSelectTab} />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};
