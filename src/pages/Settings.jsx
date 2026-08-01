import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/features/theme/themeSlice";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Settings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.themeSlice);

  return (
    <div className="p-10 max-w-4xl">
      <h1 className="font-semibold text-3xl mb-8">Settings</h1>

      <div className="bg-primary/5 dark:bg-slate-800 p-6 rounded-2xl border border-secondary/10 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          Customize how Taskmaster looks on your device.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => dispatch(setTheme("light"))}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
              theme === "light"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary/50"
            }`}
          >
            <SunIcon className="h-6 w-6 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            onClick={() => dispatch(setTheme("dark"))}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
              theme === "dark"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary/50"
            }`}
          >
            <MoonIcon className="h-6 w-6 text-indigo-400" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
