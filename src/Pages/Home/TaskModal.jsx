import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProvider"; // Import AuthContext to get user email

const TaskModal = ({ isOpen, onClose, addTask, taskToEdit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("To Do");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext); // Get logged-in user's email

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setStatus(taskToEdit.status);
        } else {
            setTitle("");
            setDescription("");
            setStatus("To Do");
        }
    }, [taskToEdit]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        if (!title) {
            Swal.fire("Error", "Title is required!", "error");
            setLoading(false);
            return;
        }

        if (!user?.email) {
            Swal.fire("Error", "User email is missing!", "error");
            setLoading(false);
            return;
        }

        const taskData = {
            title,
            description,
            status,
            userEmail: user.email, // ✅ Add logged-in user's email
            _id: taskToEdit?._id,
        };

        addTask(taskData);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {taskToEdit ? "Edit Task" : "New Task"}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">
                        ✖
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full border p-2 rounded-md mb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        className="w-full border p-2 rounded-md mb-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        className="w-full border p-2 rounded-md mb-4"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : taskToEdit ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
