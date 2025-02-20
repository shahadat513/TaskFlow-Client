const TaskModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const form = event.target;
      const title = form.title.value.trim();
      const description = form.description.value.trim();
      const status = form.status.value;
  
      if (!title) {
        alert("Title is required!");
        return;
      }
  
      const taskData = { title, description, status };
      console.log("New Task Created:", taskData);
  
      onClose(); // Close modal after submission
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Task</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✖</button>
          </div>
  
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <label className="block text-sm font-medium text-gray-700">Title (max 50 characters)</label>
            <input 
            type="text"
            name="title" 
            className="w-full border p-2 rounded-md mb-1" maxLength={50} required />
  
            {/* Description Input */}
            <label className="block text-sm font-medium text-gray-700">Description (max 200 characters)</label>
            <textarea 
            name="description" 
            className="w-full border p-2 rounded-md mb-1" maxLength={200}></textarea>
  
            {/* Status Dropdown */}
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select 
            name="status" 
            className="w-full border p-2 rounded-md mb-4">
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
  
            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default TaskModal;
  