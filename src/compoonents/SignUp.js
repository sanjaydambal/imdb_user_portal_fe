import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:4001";
const [showErrorModal,setShowErrorModal] = useState(false)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/signup`, formData);
            console.log('Signup successful', response.data);
        } catch (error) {
            console.error('Error signing up:', error.response.data.error);
            setShowErrorModal(true)
        }
    };
const handleCancel = () => {
    setShowErrorModal(false)
}
    return (
        <div className="signup-container">
            <h2 className="signup-title">Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Error</h2>
                            </div>
                            <div className="modal-body">
                                <p>Error during signup . Please try again</p>
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

export default SignUp;
