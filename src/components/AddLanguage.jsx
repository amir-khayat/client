import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddLanguage = (props) => {
  const { sessionId } = props;
  const [formData, setFormData] = useState({
    language: '',
    intensity: '',
    user_id: sessionId,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors on form submission
    fetch("http://127.0.0.1:5000/add_language", { // Corrected URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormData({ // Corrected call to setFormData
            language: '',
            intensity: '',
            user_id: sessionId,
          });
          console.log("Language added successfully");
          navigate("/dashboard/" + sessionId);
        } else {
          setErrors(data); // Display error message from the backend
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Add Language</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <input type="text" name="language" className="form-control" onChange={handleChange} value={formData.language} />
          <label htmlFor="intensity">Intensity</label>
          <select name="intensity" className="form-control" onChange={handleChange} value={formData.intensity}>
            <option value="">Select Intensity</option>
            <option value="Beginner">1 - Beginner</option>
            <option value="Intermediate">2 - Intermediate</option>
            <option value="Advanced">3 - Advanced</option>
          </select>
          <button type="submit" className="btn btn-primary mt-3">Add Language</button>
        </div>
      </form>
    </div>
  )
}

export default AddLanguage;
