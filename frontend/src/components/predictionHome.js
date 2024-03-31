import React, { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    total_budget_changes: "",
    total_schedule_changes: "",
    description: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setPrediction(data.prediction);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center border border-gray-300 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Budget Forecast for Construction Project
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6 w-full max-w-md"
        >
          {/* Input fields for project details */}

          <div className="flex flex-row gap-11">
            <label
              htmlFor="total_budget_changes"
              className="text-lg font-semibold mb-2 text-gray-700"
            >
              Total Budget Changes
            </label>
            <input
              type="text"
              name="total_budget_changes"
              value={formData.total_budget_changes}
              onChange={handleInputChange}
              id="total_budget_changes"
              className="input border-2 border-gray-400 rounded-lg pl-2"
            />
          </div>

          <div className="flex flex-row gap-7">
            <label
              htmlFor="total_schedule_changes"
              className="text-lg font-semibold mb-2 text-gray-700"
            >
              Total Schedule Changes
            </label>
            <input
              type="text"
              name="total_schedule_changes"
              value={formData.total_schedule_changes}
              onChange={handleInputChange}
              id="total_schedule_changes"
              className="input border-2 border-gray-400 rounded-lg pl-2"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-lg font-semibold mb-2 text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              id="description"
              className="input h-24 border-2 border-gray-400 rounded-lg p-2"
            />
          </div>

          {/* Add other input fields similarly */}
          <button
            type="submit"
            className="text-3xl rounded-xl bg-green-500 text-white w-max px-4 py-2 "
          >
            Predict
          </button>
        </form>
        {prediction && (
          <div className="text-2xl text-green-700 mt-4">
            Prediction: {prediction}
          </div>
        )}
        {error && <div className="text-lg text-red-700 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default App;
