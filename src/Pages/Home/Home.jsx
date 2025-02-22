import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import TaskModal from "./TaskModal";

const fetchTasks = async () => {
  const response = await fetch("http://localhost:5000/tasks");
  return response.json();
};

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch tasks from backend
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Add task mutation
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
      queryClient.invalidateQueries(["tasks"]); // Refresh task list
      Swal.fire("Task Added!", "Your task has been added successfully.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong!", "error");
    },
  });

  // Function to add task
  const handleAddTask = (taskData) => {
    addTaskMutation.mutate(taskData);
    setModalOpen(false); // Close modal after adding task
  };

  // Categorize tasks by status
  const tasksByStatus = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Done": tasks.filter((task) => task.status === "Done"),
  };

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

        {isLoading ? (
          <p className="text-center text-lg font-semibold">Loading tasks...</p>
        ) : (
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
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} addTask={handleAddTask} />
    </div>
  );
};

export default Home;
