import { Button, ButtonGroup, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import LoginTwoFa from "./LoginTwoFa";
import { useEffect, useState } from "react";
import PassKeyLogin from "./PassKeyLogin";
import { lsAuthorized, getExternalProviders } from "../../Services/AuthorizationServices";
import { LoginPasskey } from "../../Services/PassKeyService";
import QrLogin from "./QrLogin";
import { motion } from "framer-motion";

export default function Login() {
    const navigate = useNavigate();
    const [authMethod, setAuthMethod] = useState("2FA");
    const [isAuth, setIsAuth] = useState(false);
    const [providers, setProviders] = useState([]);
    const params = window.location.search.slice(1);

    let loginComponent;
    switch (authMethod) {
        case "PassKey":
            loginComponent = <PassKeyLogin setIsAuth={setIsAuth} />;
            break;
        case "QR":
            loginComponent = <QrLogin setIsAuth={setIsAuth} />;
            break;
        default:
            loginComponent = <LoginTwoFa setIsAuth={setIsAuth} />;
    }

    useEffect(() => {
        (async () => {
            await handleIsAuthenticated();
            await handleExternalLoginProvidersLinks(params);
        })();

        if (isAuth && params) {
            localStorage.removeItem("params");
            window.location.href = `${process.env.REACT_APP_BASE_URI}/connect/authorize/?${params}`;
        } else if (isAuth && !params) {
            navigate("/Profile");
        }
    }, [isAuth]);

    const handleIsAuthenticated = async () => {
        try {
            const result = await lsAuthorized();
            if (result.data.status === "Success") setIsAuth(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExternalLoginProvidersLinks = async (params) => {
        try {
            const prov = await getExternalProviders(params);
            if (prov?.data) setProviders(prov.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePKLogin = async () => {
        try {
            const response = await LoginPasskey();
            if (response.status === 200) setIsAuth(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center min-h-screen bg-gray-50"
        >
            <Card className="shadow-xl rounded-2xl w-full max-w-md">
                <CardContent className="flex flex-col items-center p-8 gap-6">
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Вход в систему
                    </Typography>

                    <Typography variant="body2" color="text.secondary" align="center">
                        Выберите удобный способ аутентификации
                    </Typography>

                    {/* Переключатели методов входа */}
                    <ButtonGroup
                        fullWidth
                        variant="outlined"
                        sx={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            '& .MuiButton-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                padding: '10px 0',
                            }
                        }}
                    >
                        <Button
                            variant={authMethod === "2FA" ? "contained" : "outlined"}
                            onClick={() => setAuthMethod("2FA")}
                        >
                            2FA
                        </Button>
                        <Button
                            variant={authMethod === "PassKey" ? "contained" : "outlined"}
                            onClick={handlePKLogin}
                        >
                            PassKey
                        </Button>
                        <Button
                            variant={authMethod === "QR" ? "contained" : "outlined"}
                            onClick={() => setAuthMethod("QR")}
                        >
                            QR
                        </Button>
                    </ButtonGroup>

                    {/* Выбранный метод аутентификации */}
                    <div className="w-full mt-4">
                        {loginComponent}
                    </div>

                    {/* Внешние провайдеры */}
                    {providers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="w-full mt-6"
                        >
                            <div >
                                <Typography
                                    variant="subtitle1"
                                    align="center"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Войти через
                                </Typography>
                                <div className="flex flex-col gap-3">
                                    {providers.map((p) => (
                                        <Button
                                            key={p.name}
                                            variant="outlined"
                                            fullWidth
                                            onClick={() => (window.location.href = p.url)}
                                            sx={{
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {p.displayName ?? p.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
