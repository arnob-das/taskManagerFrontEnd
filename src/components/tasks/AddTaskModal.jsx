import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import { useAddTaskMutation } from "../../redux/features/tasks/taskApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddTaskModal = ({ isOpen, setIsOpen }) => {
  const { register, handleSubmit, reset } = useForm();
  const [addTask, { isLoading }] = useAddTaskMutation();
  const { name, email } = useSelector((state) => state.userSlice);

  const onCancel = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await addTask({
        ...data,
        assignedToEmail: data.assignedTo === name ? email : "",
        status: "pending",
      }).unwrap();
      toast.success("Task added successfully!");
      onCancel();
    } catch (err) {
      toast.error(err?.data?.error || err?.message || "Forbidden: Invalid or expired token");
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add New Task">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-5">
          <label htmlFor="title" className="mb-2 font-medium text-sm">
            Title
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 dark:text-white"
            type="text"
            id="title"
            placeholder="Enter task title"
            {...register("title", { required: true })}
          />
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="description" className="mb-2 font-medium text-sm">
            Description
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 dark:text-white"
            id="description"
            rows="3"
            placeholder="Enter task description"
            {...register("description", { required: true })}
          />
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="date" className="mb-2 font-medium text-sm">
            Deadline
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 dark:text-white"
            type="date"
            id="date"
            {...register("date", { required: true })}
          />
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="assignedTo" className="mb-2 font-medium text-sm">
            Assign to
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 dark:text-white"
            id="assignedTo"
            {...register("assignedTo")}
          >
            {name && <option value={name}>{name} ( You )</option>}
            <option value="Arnob Das">Arnob Das</option>
            <option value="Muntasir">Muntasir</option>
            <option value="Muhit">Muhit</option>
            <option value="Mir">Mir</option>
          </select>
        </div>
        <div className="flex flex-col mb-5">
          <label htmlFor="priority" className="mb-2 font-medium text-sm">
            Priority
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 dark:text-white"
            id="priority"
            defaultValue="high"
            {...register("priority")}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onCancel()}
            type="button"
            className="btn btn-danger"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
