import { useMemo } from "react";
import TaskCard from "../components/tasks/TaskCard";
import { useGetTasksQuery } from "../redux/features/tasks/taskApi";

const Archive = () => {
  const { data: tasks, isLoading, isError } = useGetTasksQuery();

  const archiveTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((item) => item.status === "archive");
  }, [tasks]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-slate-100">
          Archive Board
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          View all completed and archived tasks.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 dark:text-slate-400 font-medium">Loading archived tasks...</p>
        </div>
      )}

      {!isLoading && !isError && archiveTasks.length === 0 && (
        <div className="text-center py-16 bg-secondary/5 dark:bg-slate-800/40 rounded-2xl border border-dashed border-secondary/20 dark:border-slate-700">
          <p className="text-gray-500 dark:text-slate-400 font-medium text-sm sm:text-base">
            No archived tasks found.
          </p>
        </div>
      )}

      {!isLoading && !isError && archiveTasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {archiveTasks.map((item) => (
            <div key={item._id || item.id} className="w-full">
              <TaskCard task={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;
