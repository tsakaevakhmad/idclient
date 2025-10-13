import { Button, ButtonGroup } from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginTwoFa from "./LoginTwoFa";
import { useEffect, useState } from "react";
import PassKeyLogin from "./PassKeyLogin";
import { lsAuthorized, getExternalProviders } from "../../Services/AuthorizationServices";
import { LoginPasskey } from "../../Services/PassKeyService";
import QrLogin from "./QrLogin";

export default function Login() {
    const navigate = useNavigate();
    let loginComponent;
    const [authMethod, setAuthMethod] = useState("2FA");
    const [isAuth, setIsAuth] = useState(false);
    const [providers, setProviders] = useState([]); // список провайдеров`

    let params = window.location.search.slice(1); // убираем '?'

    useEffect(() => {
        (async () => {
            handleIsAuthenticated();
            handleExternalLoginProvidersLinks(params);
        })();

        if (isAuth && params) {
            console.log(localStorage.getItem("params"));
            localStorage.removeItem("params");
            window.location.href = `${process.env.REACT_APP_BASE_URI}/connect/authorize/?${params}`;
        }
        else if (isAuth && !params) {
            navigate("/Profile");
        }
    }, [isAuth, navigate, setIsAuth]);

    switch (authMethod) {
        case 'PassKey':
            loginComponent = <PassKeyLogin setIsAuth={setIsAuth} />;
            break;
        case 'QR':
            loginComponent = <QrLogin setIsAuth={setIsAuth} />;
            break;
        default:
            loginComponent = <LoginTwoFa setIsAuth={setIsAuth} />;
    }

    const handleIsAuthenticated = async () => {
        try {
            const result = await lsAuthorized();
            if (result.data.status === "Success")
                setIsAuth(true);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleExternalLoginProvidersLinks = async (params) => {
        try {
            const prov = await getExternalProviders(params);
            if (prov?.data) {
                setProviders(prov.data); // сохраняем список провайдеров
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handlePKLogin = async () => {
        try {
            const response = await LoginPasskey();
            if (response.status === 200) {
                setIsAuth(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 w-full">
                <h1 className="text-2xl font-bold">ID</h1>

                <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    {/* Переключатели */}
                    <ButtonGroup>
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
                            //disabled={true} // пока выключено
                        >
                            QR
                        </Button>
                    </ButtonGroup>

                    {/* Отрисовка выбранного компонента */}
                    <div className="mt-5 w-full">
                        {loginComponent}
                    </div>

                    {/* Кнопки внешних провайдеров */}
                    {providers.length > 0 && (
                        <div className="mt-6 w-full flex flex-col gap-3">
                            <h2 className="text-lg font-semibold text-center">Войти через</h2>
                            {providers.map((p) => (
                                <Button
                                    key={p.name}
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => window.location.href = p.url}
                                >
                                    {p.displayName ?? p.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
