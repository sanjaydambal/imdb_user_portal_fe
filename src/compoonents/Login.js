import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [formData, setFormData] = useState({
        usernameOremail: '',
        password: ''
    });
    const [showErrorModal,setShowErrorModal] = useState(false)
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
            setShowErrorModal(true)
        }
    };
    const handleCancel = () => {
        setShowErrorModal(false)
    }
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
            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Email or password is not matching</h2>
                            </div>
                            <div className="modal-body">
                                <p>Please provide proper login credentials </p>
                            </div>
                            <div className="modal-footer">
                                
                                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;