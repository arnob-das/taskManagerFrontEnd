import {
  SquaresPlusIcon,
  UserCircleIcon,
  ArchiveBoxIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

import logo from '../../assets/image/logo.png';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/features/theme/themeSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.themeSlice);

  return (
    <aside className="w-full md:w-[80px] h-16 md:h-screen fixed md:sticky bottom-0 md:top-0 z-50 border-t md:border-t-0 md:border-r-2 border-secondary/20 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex md:flex-col items-center justify-around md:justify-start gap-4 md:gap-6 h-full py-2 md:py-5 px-4 md:px-0">
        <img src={logo} alt="logo" className="hidden md:block w-10 h-10 object-contain" />
        
        <NavLink
          to="/"
          title="Tasks"
          className={({ isActive }) =>
            isActive
              ? 'p-2 rounded-2xl bg-primary text-white cursor-pointer'
              : 'p-2 rounded-2xl group hover:bg-primary text-secondary/40 dark:text-slate-400 cursor-pointer transition-all'
          }
        >
          <SquaresPlusIcon className="h-6 w-6 md:h-7 md:w-7 group-hover:text-white" />
        </NavLink>

        <NavLink
          to="/archive"
          title="Archive"
          className={({ isActive }) =>
            isActive
              ? 'p-2 rounded-2xl bg-primary text-white cursor-pointer'
              : 'p-2 rounded-2xl group hover:bg-primary text-secondary/40 dark:text-slate-400 cursor-pointer transition-all'
          }
        >
          <ArchiveBoxIcon className="h-6 w-6 md:h-7 md:w-7 group-hover:text-white" />
        </NavLink>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-2xl group hover:bg-primary text-secondary/40 dark:text-slate-400 cursor-pointer transition-all"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <MoonIcon className="h-6 w-6 md:h-7 md:w-7 group-hover:text-white text-secondary/60 dark:text-slate-300" />
          ) : (
            <SunIcon className="h-6 w-6 md:h-7 md:w-7 group-hover:text-white text-amber-400" />
          )}
        </button>

        <NavLink
          to="/profile"
          title="Profile"
          className={({ isActive }) =>
            isActive
              ? 'p-2 rounded-2xl bg-primary text-white cursor-pointer md:mt-auto'
              : 'p-2 rounded-2xl group hover:bg-primary text-secondary/40 dark:text-slate-400 cursor-pointer transition-all md:mt-auto'
          }
        >
          <UserCircleIcon className="h-6 w-6 md:h-7 md:w-7 group-hover:text-white" />
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
