import { useState } from "react";
import TaskModal from "./TaskModal";

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);

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
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-2">🚀 To Do</h2>
            <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-md p-2"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-2">⏳ In Progress</h2>
            <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-md p-2"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-2">✅ Done</h2>
            <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-md p-2"></div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
