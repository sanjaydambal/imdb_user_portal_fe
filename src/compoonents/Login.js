import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [formData, setFormData] = useState({
        usernameOremail: '',
        password: ''
    });
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:4001";
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/login`, formData);
            console.log('Login successful', response.data);
            // Handle successful login (e.g., redirect to dashboard)
        } catch (error) {
            console.error('Error logging in:', error.response.data.error);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email/Name</label>
                    <input type="text" id="email" name="usernameOremail" value={formData.usernameOremail} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;