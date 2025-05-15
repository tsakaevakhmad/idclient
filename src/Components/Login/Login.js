import { Button, ButtonGroup } from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginTwoFa from "./LoginTwoFa";
import { Base64UrlDecode } from "../../Services/Helper";
import { useEffect, useState } from "react";
import PassKeyLogin from "./PassKeyLogin";
import { lsAuthorized } from "../../Services/AuthorizationServices";
import { LoginPasskey } from "../../Services/PassKeyService";



export default function Login() {
    const navigate = useNavigate();
    let loginComponent;
    const [queryParams] = useSearchParams()
    const [authMethod, setAuthMethod] = useState("2FA");
    const [isAuth, setIsAuth] = useState(false);


    let params = queryParams.get("params");
    if (!params)
        params = localStorage.getItem("params");

    useEffect(() => {
        (async () => {
            const result = await lsAuthorized();
            if (result.data.status === "Success")
                setIsAuth(true);
        })();
        if (isAuth && params) {
            localStorage.removeItem("params");
            window.location.href = `${process.env.REACT_APP_BASE_URI}/connect/authorize/?${Base64UrlDecode(params)}`;
        }
        else if (params && !isAuth) {
            localStorage.setItem("params", params);
        }
        else if (isAuth && !params) {
            navigate("/Profile");
        }
    }, [isAuth, params, navigate, setIsAuth]);

    switch (authMethod) {
        case 'PassKey':
            loginComponent = <PassKeyLogin setIsAuth={setIsAuth} />;
            break;
        default:
            loginComponent = <LoginTwoFa setIsAuth={setIsAuth} />;
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
                            disabled={true} // Disable QR option for now
                        >
                            QR
                        </Button>
                    </ButtonGroup>
                    <div className="mt-5 w-full">
                        {loginComponent}
                    </div>
                </div>
            </div>
        </div>
    );
}