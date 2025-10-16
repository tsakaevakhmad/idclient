import React, { useEffect, useState } from 'react';
import { registerPasskey } from '../Services/PassKeyService';
import UserManagerServices from '../Services/UserManagerServices';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../Services/AuthorizationServices';
import { motion, AnimatePresence } from 'framer-motion';
import OtpInput from "react-otp-input";
import { CheckCircle, Cancel } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [loadingPhone, setLoadingPhone] = useState(false);
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
    }, [navigate, open]);

    const handleLogOut = async () => {
        try {
            await logOut();
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handlePhoneConfirmation = async () => {
        try {
            await UserManagerServices.sendPhoneConfirmationCode();
            setOpen(true);
        } catch (error) {
            console.error("Error sending phone confirmation code:", error);
        }
    };

    const handleVerifyPhoneConfirmation = async () => {
        try {
            setLoadingPhone(true);
            await UserManagerServices.verifiPhoneConfirmationCode(otp); // <-- свой метод в API
            setOpen(false);
        } catch (error) {
            console.error("Verification failed:", error);
        } finally {
            setLoadingPhone(false);
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
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Введите код подтверждения</DialogTitle>
                <DialogContent>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputType="tel"
                        shouldAutoFocus
                        renderSeparator={<span style={{ width: "8px" }}></span>}
                        renderInput={(props) => (
                            <input
                                {...props}
                                style={{
                                    width: "40px",
                                    height: "50px",
                                    fontSize: "20px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    textAlign: "center",
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button onClick={handleVerifyPhoneConfirmation} variant="contained" color="primary" disabled={loadingPhone || otp.length !== 6}>
                        {loadingPhone ? <CircularProgress size={24} /> : "Подтвердить"}
                    </Button>
                </DialogActions>
            </Dialog>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
            >
                <div className="flex flex-col items-center mb-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-semibold mb-4 shadow-md"
                    >
                        {userInfo?.firstName?.[0] || '?'}
                    </motion.div>

                    <div
                        className="inline-block relative h-8 cursor-pointer"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <AnimatePresence mode="wait">
                            {!hovered ? (
                                <motion.h1
                                    key="fullname"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl font-semibold text-gray-800"
                                >
                                    {userInfo?.firstName} {userInfo?.lastName}
                                </motion.h1>
                            ) : (
                                <motion.h1
                                    key="username"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl font-semibold text-gray-800"
                                >
                                    {userInfo?.userName}
                                </motion.h1>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-2 flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-gray-600">
                            <span>{userInfo?.email}</span>
                            {userInfo?.emailConfirmed ? (
                                <CheckCircle sx={{ fontSize: 18 }} color="success" />
                            ) : (
                                <Cancel sx={{ fontSize: 18 }} color="error" />
                            )}
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                            <span>{userInfo?.phoneNumber}</span>
                            {userInfo?.phoneNumberConfirmed ? (
                                <CheckCircle sx={{ fontSize: 18 }} color="success" />
                            ) : (
                                <Cancel sx={{ fontSize: 18 }} color="error" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="space-y-4">
                    {!userInfo?.phoneNumberConfirmed && (
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handlePhoneConfirmation}
                            disabled={registering}
                            className={`w-full py-3 rounded-xl text-white font-medium transition ${registering
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? <CircularProgress size={24} /> : "Подтвердить"}
                        </motion.button>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleRegisterPasskey}
                        disabled={registering}
                        className={`w-full py-3 rounded-xl text-white font-medium transition ${registering
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {registering ? 'Регистрация...' : 'Зарегистрировать Passkey'}
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogOut}
                        className="w-full py-3 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 transition"
                    >
                        Выйти
                    </motion.button>
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
