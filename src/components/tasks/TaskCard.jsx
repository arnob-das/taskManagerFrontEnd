import { memo } from "react";
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDeleteTaskMutation, useUpdateTaskStatusMutation } from "../../redux/features/tasks/taskApi";
import toast from "react-hot-toast";

const TaskCard = memo(({ task }) => {
  const [updateTaskStatus, { isLoading: isUpdating }] = useUpdateTaskStatusMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  let updatedStatus;

  if (task.status === "pending") {
    updatedStatus = "running";
  } else if (task.status === "running") {
    updatedStatus = "done";
  } else {
    updatedStatus = "archive";
  }

  const handleStatusUpdate = async () => {
    try {
      await updateTaskStatus({
        id: task._id,
        data: { status: updatedStatus },
      }).unwrap();
      toast.success(`Task moved to ${updatedStatus}!`);
    } catch (err) {
      toast.error(err?.data?.error || err?.message || "Forbidden: Invalid or expired token");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task?._id).unwrap();
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.error || err?.message || "Forbidden: Invalid or expired token");
    }
  };

  return (
    <div className="bg-secondary/10 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-md p-5 text-gray-800 dark:text-slate-200">
      <h1
        className={`text-lg font-semibold mb-3 ${
          task.priority === "high" ? "text-red-500" : " "
        } ${task.priority === "medium" ? "text-yellow-500" : " "} ${
          task.priority === "low" ? "text-green-500" : " "
        }`}
      >
        {task?.title}
      </h1>
      <p className="mb-3">{task?.description}</p>
      <p className="text-sm">Assigned to - {task?.assignedTo}</p>
      <div className="flex justify-between mt-3">
        <p>{task?.date}</p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            title="Delete"
            className="disabled:opacity-40"
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating || isDeleting}
            title="Update Status"
            className="disabled:opacity-40"
          >
            <ArrowRightIcon className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = "TaskCard";
export default TaskCard;
