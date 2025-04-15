import React from 'react';
import { registerPasskey } from '../Services/PassKeyService';

const Profile = () => {
    return (
        <div>
            Profile Page
            <h1>Welcome to your profile!</h1>
            <button onClick={registerPasskey}>
                Register Passkey
            </button>
        </div>
    );
};

export default Profile;