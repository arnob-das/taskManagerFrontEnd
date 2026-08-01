import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 min-h-screen transition-colors pb-16 md:pb-0">
      <Sidebar />
      <div className="flex-1 w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
