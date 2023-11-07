import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SendOtpp.scss'; // Import the CSS file
import { sendOtp } from '../../utils/api';


function SendOtp() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendOtp1 = async () => {
    console.log(email);
    // Perform OTP sending logic here. You can use a service or API.
    const resp = await sendOtp(email);
    console.log(resp)
    // After sending OTP, navigate to the signup form page
    navigate('/signupform');
  };

  return (
    <div className="container"> {/* Apply the container class */}
      <div className="form-container"> {/* Apply the form-container class */}
        <h3>Enter your email to receive OTP</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <button onClick={sendOtp1}>Send OTP</button>
      </div>
    </div>
  );
}

export default SendOtp;
