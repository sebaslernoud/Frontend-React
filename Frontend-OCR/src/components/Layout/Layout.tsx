import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
