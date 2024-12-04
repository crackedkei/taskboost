import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 container mx-auto px-4 pb-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;