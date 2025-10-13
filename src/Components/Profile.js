import React, { useEffect, useState } from 'react';
import { registerPasskey } from '../Services/PassKeyService';
import UserManagerServices from '../Services/UserManagerServices';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../Services/AuthorizationServices';
import { motion } from 'framer-motion';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await UserManagerServices.userInfo();
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setError("Не удалось загрузить данные пользователя");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleLogOut = async () => {
        try {
            await logOut();
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleRegisterPasskey = async () => {
        try {
            setRegistering(true);
            await registerPasskey();
        } catch (err) {
            console.error("Ошибка регистрации passkey:", err);
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-lg font-medium text-gray-500 animate-pulse">
                    Загружаем данные профиля...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-semibold mb-4">
                        {userInfo?.firstName?.[0] || '?'}
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {userInfo?.firstName} {userInfo?.lastName}
                    </h1>
                    <p className="text-gray-500">{userInfo?.email}</p>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="space-y-4">
                    <button
                        onClick={handleRegisterPasskey}
                        disabled={registering}
                        className={`w-full py-3 rounded-xl text-white font-medium transition ${
                            registering
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {registering ? 'Регистрация...' : 'Зарегистрировать Passkey'}
                    </button>

                    <button
                        onClick={handleLogOut}
                        className="w-full py-3 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 transition"
                    >
                        Выйти
                    </button>
                </div>
            </motion.div>

            <motion.footer 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-400 text-sm"
            >
                © {new Date().getFullYear()} ID. Все права защищены.
            </motion.footer>
        </div>
    );
};

export default Profile;
