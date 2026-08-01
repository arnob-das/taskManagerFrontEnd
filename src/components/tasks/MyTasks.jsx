import {
  CheckIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";

import { useSelector } from "react-redux";
import TaskDetailsModal from "./TaskDetailsModal";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "../../redux/features/tasks/taskApi";
import toast from "react-hot-toast";

const MyTasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const { name, email } = useSelector((state) => state.userSlice);
  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateTaskStatus, { isLoading: isUpdating }] =
    useUpdateTaskStatusMutation();

  const userSpecificTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((item) => {
      const isAssignedByName =
        name && item.assignedTo?.toLowerCase() === name.toLowerCase();
      const isAssignedByEmail =
        email && item.assignedToEmail?.toLowerCase() === email.toLowerCase();
      const isAssignedToMuntasir =
        email === "muntasir@gmail.com" &&
        item.assignedTo?.toLowerCase() === "muntasir";

      return (
        (isAssignedByName || isAssignedByEmail || isAssignedToMuntasir) &&
        (item.status === "pending" || item.status === "running")
      );
    });
  }, [tasks, name, email]);

  const handleDetails = (id) => {
    setTaskId(id);
    setIsOpen(!isOpen);
  };

  const handleTaskDone = async (id) => {
    try {
      await updateTaskStatus({
        id: id,
        data: { status: "done" },
      }).unwrap();
      toast.success("Task marked as completed!");
    } catch (err) {
      toast.error(err?.data?.error || err?.message || "Failed to update task!");
    }
  };

  return (
    <div>
      <TaskDetailsModal isOpen={isOpen} setIsOpen={setIsOpen} taskId={taskId} />
      <h1 className="text-xl my-3 font-semibold">My Tasks</h1>
      <div className="max-h-[350px] xl:max-h-[750px] overflow-y-auto space-y-3 no-scrollbar">
        {isLoading && (
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Loading your tasks...
          </p>
        )}
        {!isLoading && !isError && userSpecificTasks?.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-slate-400">
            No active tasks assigned to you.
          </p>
        )}
        {userSpecificTasks?.map((item) => (
          <div
            key={item._id || item.id}
            className="bg-secondary/10 rounded-md p-3 flex justify-between dark:bg-slate-800/80"
          >
            <h1>{item.title}</h1>
            <div className="flex gap-3">
              <button
                onClick={() => handleDetails(item._id || item.id)}
                className="grid place-content-center"
                title="Details"
              >
                <DocumentMagnifyingGlassIcon className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={() => handleTaskDone(item._id || item.id)}
                disabled={isUpdating}
                className="grid place-content-center disabled:opacity-40"
                title="Done"
              >
                <CheckIcon className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
