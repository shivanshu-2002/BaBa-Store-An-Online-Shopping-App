import React, { useState , useContext } from 'react';
import './Login.scss'; // Import the SCSS file for styling
import { logIn } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Context } from "../../utils/context";


function Login() {
  const {setToken,setUser} = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await logIn(formData); 
    const {success , token , user , message } = response;
    if (success) {
       setToken(token)
       setUser(user)
       localStorage.setItem("token", JSON.stringify(token))
       localStorage.setItem("user", JSON.stringify(user))
      navigate('/'); 
    } else {
      // Authentication failed, show an error message to the user
      console.log('Login error:', message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
