import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SearchModal from './SearchModal';
import Toast from './Toast';

const Layout = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      <Toast />
    </div>
  );
};

export default Layout;
