import React from 'react';
import logoImg from '../../assets/LogoSmall.png';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* left side - logo of Modulo Sanitario */}
      <div className={styles.logoContainer}>
        <img src={logoImg} alt="Modulo Sanitario Logo" className={styles.logo} />
      </div>

      {/* right side - user name + avatar */}
      <div className={styles.userContainer}>
        <span className={styles.userName}>Pedro Lopez</span>
        <div className={styles.avatar}>
          <span>PL</span>
        </div>
      </div>
    </header>
  );
};
