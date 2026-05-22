import React, { useState } from 'react';
import { FiFileText, FiUsers, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onSelectTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState('Encuestas');

  const menuItems = [
    { id: 'Encuestas', label: 'Encuestas', icon: <FiFileText className={styles.icon} /> },
    { id: 'Familias', label: 'Familias', icon: <FiUsers className={styles.icon} /> },
    { id: 'Reportes', label: 'Reportes', icon: <FiBarChart2 className={styles.icon} /> },
    { id: 'Configuracion', label: 'Configuracion', icon: <FiSettings className={styles.icon} /> },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <aside className={styles.sidebar}>
      {/* menu buttons */}
      <div className={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`${styles.menuButton} ${isActive ? styles.activeButton : styles.inactiveButton}`}
              onClick={() => handleTabClick(item.id)}
            >
              {item.icon}
              <span className={styles.label}>{item.label}</span>
            </button>
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
