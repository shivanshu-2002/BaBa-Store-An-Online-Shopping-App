import React, { useContext } from 'react';
import './profile.scss'; // Create a CSS file for styling
import { Context } from '../../utils/context';

function Profile() {
    const { user } = useContext(Context);

    return (
        <div className="profile-container">
            <div className="sidebar">
                <div className="profile-picture">
                    <img src={user.image} alt="User Avatar" />
                </div>
                <ul className="sidebar-menu">
                    <li><a href="#">My Orders</a></li>
                    <li><a href="#">Wishlist</a></li>
                    <li><a href="#">Settings</a></li>
                    <li><a href="#">Address Book</a></li>
                    <li><a href="#">Logout</a></li>
                </ul>
            </div>
            <div className="main-section">
                <h1 style={{ color: 'purple' }}>Personal Information</h1>
                <div className="user-info">
                    <div className='part'>
                        <div className="user-info-item">
                            <label>Name:</label>
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="user-info-item">
                            <label>Email:</label>
                            <span>{user.email}</span>
                        </div>
                        <div className="user-info-item">
                            <label>Phone:</label>
                            <span>{user.additionalDetails.contactNumber == null ? "Please Fill the Detail" : user.additionalDetails.contactNumber}</span>
                        </div>
                    </div>
                    <div className='part'>
                        <div className="user-info-item">
                            <label>DOB:</label>
                            <span>{user.additionalDetails.dateOfBirth == null ? "Please Fill the Detail" : user.additionalDetails.dateOfBirth}</span>
                        </div>
                        <div className="user-info-item">
                            <label>Gender:</label>
                            <span>{user.additionalDetails.gender == null ? "Please Fill the Detail" : user.additionalDetails.gender}</span>
                        </div>
                        <div className="user-info-item">
                            <label>Account Type:</label>
                            <span>{user.accountType == null ? "Please Fill the Detail" : user.accountType}</span>
                        </div>
                    </div>
                    {/* Add more user information items here */}
                </div>
                <div className="user-info">
                    <label>About:</label>
                    <span>{user.additionalDetails.about == null ? "Please Fill the Detail" : user.additionalDetails.about}</span>
                </div>
                
            </div>
        </div>
    );
}

export default Profile;
