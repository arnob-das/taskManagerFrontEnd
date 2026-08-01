import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import MyTasks from "../components/tasks/MyTasks";
import TaskCard from "../components/tasks/TaskCard";
import AddTaskModal from "../components/tasks/AddTaskModal";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import MenuDropdown from "../components/ui/MenuDropdown";
import { useGetTasksQuery } from "../redux/features/tasks/taskApi";

const formatPhotoURL = (url) => {
  if (!url) return "";
  let cleanUrl = url.trim();

  // Convert Google Drive view link to direct CDN image link
  const driveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${driveMatch[1]}`;
  }

  const driveUcMatch = cleanUrl.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
  if (driveUcMatch && driveUcMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${driveUcMatch[1]}`;
  }

  // Convert tmpfiles.org page link to direct download link
  if (cleanUrl.includes("tmpfiles.org/") && !cleanUrl.includes("tmpfiles.org/dl/")) {
    cleanUrl = cleanUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  }

  // Convert Dropbox view link to raw image stream
  if (cleanUrl.includes("dropbox.com") && cleanUrl.includes("dl=0")) {
    cleanUrl = cleanUrl.replace("dl=0", "raw=1");
  }

  return cleanUrl;
};

const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { photoURL } = useSelector((state) => state.userSlice);
  const userPhoto = formatPhotoURL(photoURL);

  const { data: tasks, isLoading, isError } = useGetTasksQuery();

  const { pendingTasks, runningTasks, doneTasks } = useMemo(() => {
    if (!tasks) return { pendingTasks: [], runningTasks: [], doneTasks: [] };

    const query = searchQuery.toLowerCase().trim();
    const filtered = tasks.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );

    return {
      pendingTasks: filtered.filter((item) => item.status === "pending"),
      runningTasks: filtered.filter((item) => item.status === "running"),
      doneTasks: filtered.filter((item) => item.status === "done"),
    };
  }, [tasks, searchQuery]);

  return (
    <>
      <AddTaskModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
        {/* Main Tasks Board Area */}
        <div className="xl:col-span-9 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl text-gray-800 dark:text-slate-100">Tasks</h1>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 items-center w-full sm:w-auto">
              <div className="relative flex items-center flex-1 sm:flex-initial w-full sm:w-auto">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 text-secondary dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-secondary/20 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:border-primary transition-all text-sm w-full sm:w-48 focus:sm:w-60 shadow-sm"
                />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-primary whitespace-nowrap"
              >
                Add Task
              </button>
              <MenuDropdown>
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-primary/30 shrink-0">
                  <img
                    src={
                      userPhoto ||
                      "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=644&q=80"
                    }
                    alt="User avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=644&q=80";
                    }}
                    className="object-cover h-full w-full"
                  />
                </div>
              </MenuDropdown>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            {/* Up Next Column */}
            <div className="flex flex-col h-auto md:h-[calc(100vh-180px)] min-h-[250px]">
              <div className="flex justify-between items-center bg-[#D3DDF9] dark:bg-slate-800 dark:text-slate-100 p-4 rounded-xl mb-3 shadow-sm">
                <h2 className="font-semibold text-sm sm:text-base">Up Next</h2>
                <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-xs font-bold min-w-[24px] text-center">
                  {pendingTasks.length}
                </span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[420px] md:max-h-none flex-1 pr-1 no-scrollbar">
                {pendingTasks.map((item) => (
                  <TaskCard key={item._id} task={item} />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col h-auto md:h-[calc(100vh-180px)] min-h-[250px]">
              <div className="flex justify-between items-center bg-[#D3DDF9] dark:bg-slate-800 dark:text-slate-100 p-4 rounded-xl mb-3 shadow-sm">
                <h2 className="font-semibold text-sm sm:text-base">In Progress</h2>
                <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-xs font-bold min-w-[24px] text-center">
                  {runningTasks.length}
                </span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[420px] md:max-h-none flex-1 pr-1 no-scrollbar">
                {runningTasks.map((item) => (
                  <TaskCard key={item._id} task={item} />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="flex flex-col h-auto md:h-[calc(100vh-180px)] min-h-[250px] md:col-span-2 lg:col-span-1">
              <div className="flex justify-between items-center bg-[#D3DDF9] dark:bg-slate-800 dark:text-slate-100 p-4 rounded-xl mb-3 shadow-sm">
                <h2 className="font-semibold text-sm sm:text-base">Completed</h2>
                <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-xs font-bold min-w-[24px] text-center">
                  {doneTasks.length}
                </span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[420px] md:max-h-none flex-1 pr-1 no-scrollbar">
                {doneTasks.map((item) => (
                  <TaskCard key={item._id} task={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: My Tasks */}
        <div className="xl:col-span-3 border-t xl:border-t-0 xl:border-l border-secondary/20 dark:border-slate-700 pt-6 xl:pt-0 xl:pl-6">
          <MyTasks />
        </div>
      </div>
    </>
  );
};

export default Tasks;
