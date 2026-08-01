import Modal from "../ui/Modal";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "../../redux/features/tasks/taskApi";
import toast from "react-hot-toast";

const TaskDetailsModal = ({ isOpen, setIsOpen, taskId }) => {
  const { data: tasks } = useGetTasksQuery();
  const [updateTaskStatus, { isLoading }] = useUpdateTaskStatusMutation();

  const task = tasks?.find((item) => (item._id || item.id) === taskId);
  const { handleSubmit, reset } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        description: task.description || "",
        date: task.date || "",
        assignedTo: task.assignedTo || "",
        priority: task.priority || "high",
      });
    }
  }, [task, taskId, reset]);

  const onSubmit = async () => {
    if (task) {
      try {
        await updateTaskStatus({
          id: task._id || task.id,
          data: { status: "done" },
        }).unwrap();
        toast.success("Task marked as completed!");
      } catch (err) {
        toast.error(err?.data?.error || err?.message || "Failed to update task!");
      }
    }
    reset();
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={task?.title || "Task Details"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-5">
          <label htmlFor="description" className="mb-2 font-medium text-sm">
            Description
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
            id="description"
            defaultValue={task?.description || ""}
            readOnly
            disabled
          />
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="date" className="mb-2 font-medium text-sm">
            Deadline
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
            type="date"
            id="date"
            defaultValue={task?.date || ""}
            readOnly
            disabled
          />
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="assignedTo" className="mb-2 font-medium text-sm">
            Assign to
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white px-4 py-2"
            type="text"
            id="assignedTo"
            defaultValue={task?.assignedTo || ""}
            readOnly
            disabled
          />
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="priority" className="mb-2 font-medium text-sm">
            Priority
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white px-4 py-2 capitalize"
            type="text"
            id="priority"
            defaultValue={task?.priority || "high"}
            readOnly
            disabled
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Done"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskDetailsModal;
