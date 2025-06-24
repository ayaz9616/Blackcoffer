import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <TopNav />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export default DashboardLayout; 