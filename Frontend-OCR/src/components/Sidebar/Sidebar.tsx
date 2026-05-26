import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiFileText, FiUsers, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/encuestas', label: 'Encuestas', icon: <FiFileText className={styles.icon} /> },
    { path: '/familias', label: 'Familias', icon: <FiUsers className={styles.icon} /> },
    { path: '/reportes', label: 'Reportes', icon: <FiBarChart2 className={styles.icon} /> },
    { path: '/configuracion', label: 'Configuracion', icon: <FiSettings className={styles.icon} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* menu buttons */}
      <div className={styles.menuContainer}>
        {menuItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.menuButton} ${isActive ? styles.activeButton : styles.inactiveButton}`
              }
            >
              {item.icon}
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* user avatar + info */}
      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          <span>PL</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Pedro Lopez</span>
          <span className={styles.userRole}>Coordinador</span>
        </div>
        <button className={styles.logoutButton} aria-label="Logout">
          <FiLogOut className={styles.logoutIcon} />
        </button>
      </div>
    </aside>
  );
};
