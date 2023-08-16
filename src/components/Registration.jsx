import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = (props) => {
    const { setSessionId } = props; 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        user_language: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous error on form submission

        fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        user_language: '',
                        password: '',
                        confirm_password: ''
                    });
                    console.log("success");
                    setSessionId(data.user_id);
                    navigate("/dashboard/" + data.user_id)
                } else {
                    console.log("Errors:", data);
                    setErrors(data);
                }
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    };


    return (
        <div className="container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(errors).length > 0 ? (
                    <div className="alert alert-danger">
                        {Object.values(errors).map((error, index) => (
                            <p key={index} className="text-danger">{error}</p>
                        ))}
                    </div>
                ) : null}

                <div className="mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">User Language:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="user_language"
                        value={formData.user_language}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>

        </div>
    );
};

export default Registration;