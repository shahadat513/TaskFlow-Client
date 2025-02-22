import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const TaskModal = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    // Mutation to add a task
    const addTaskMutation = useMutation({
        mutationFn: async (taskData) => {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]); // Refetch tasks after adding
            Swal.fire({
                title: "Success!",
                text: "Task added successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });
            onClose();
        },
        onError: (error) => {
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to add task",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const form = event.target;
        const title = form.title.value.trim();
        const description = form.description.value.trim();
        const status = form.status.value;

        if (!title) {
            Swal.fire("Error", "Title is required!", "error");
            setLoading(false);
            return;
        }

        const taskData = { 
            title, 
            description, 
            status,
            timestamp: new Date().toISOString() // Adding the timestamp field
        };

        // Call mutation to add task
        addTaskMutation.mutate(taskData, {
            onSettled: () => setLoading(false),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">New Task</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">
                        ✖
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" className="w-full border p-2 rounded-md mb-2" required />

                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" className="w-full border p-2 rounded-md mb-2"></textarea>

                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" className="w-full border p-2 rounded-md mb-4">
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" disabled={loading}>
                            {loading ? "Adding..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
