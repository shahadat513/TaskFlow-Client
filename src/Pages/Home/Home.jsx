import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import TaskModal from "./TaskModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// Fetch tasks from the backend
const fetchTasks = async () => {
  const response = await fetch("http://localhost:5000/tasks");
  return response.json();
};

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const queryClient = useQueryClient();

  // Fetch tasks using react-query
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

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
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Task Added!", "Your task has been added successfully.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong!", "error");
    },
  });

  // Mutation to edit an existing task
  const editTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const response = await fetch(`http://localhost:5000/tasks/${taskData._id}`, {
        method: "PATCH",  // Use PATCH for updating task status
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Task Updated!", "Your task has been updated.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong while updating the task.", "error");
    },
  });

  // Mutation to delete a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire("Task Deleted!", "Your task has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong while deleting the task.", "error");
    },
  });

  // Handle task deletion
  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  // Handle task edit
  const handleEdit = (task) => {
    setTaskToEdit(task); // Prefill task data in modal
    setModalOpen(true);   // Open modal for editing
  };

  // Handle add or update task
  const handleAddTask = (taskData) => {
    if (taskData._id) {
      editTaskMutation.mutate(taskData);  // Edit existing task
    } else {
      addTaskMutation.mutate(taskData);  // Add new task
    }
    setModalOpen(false); // Close modal after adding/editing task
    setTaskToEdit(null); // Reset task data
  };

  // Categorize tasks by status
  const tasksByStatus = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Done": tasks.filter((task) => task.status === "Done"),
  };

  if (isLoading) {
    return <p className="text-center text-lg font-semibold">Loading tasks...</p>;
  }

  if (isError) {
    return <p className="text-center text-lg font-semibold text-red-500">Error fetching tasks. Please try again later.</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Task Management</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            + Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div key={status} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-semibold mb-2 text-lg">
                {status === "To Do" ? "🚀" : status === "In Progress" ? "⏳" : "✅"} {status}
              </h2>
              <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-md p-2">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task._id} className="p-2 border rounded-md mb-2 bg-gray-100 shadow-sm">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-yellow-500 hover:text-yellow-600 p-2 rounded-md"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-md"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        addTask={handleAddTask}
        taskToEdit={taskToEdit}  // Pass task data to the modal for editing
      />
    </div>
  );
};

export default Home;
