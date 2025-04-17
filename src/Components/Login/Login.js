import { Button, ButtonGroup } from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginTwoFa from "./LoginTwoFa";
import { Base64UrlDecode } from "../../Services/Helper";
import { useEffect, useState } from "react";
import PassKeyLogin from "./PassKeyLogin";



export default function Login() {
    const navigate = useNavigate();
    let loginComponent;
    const [queryParams] = useSearchParams()
    const [authMethod, setAuthMethod] = useState("2FA");
    const cookies = document.cookie.split("; ");
    const hasAuthCookie = cookies.some((cookie) =>
        cookie.startsWith(".AspNetCore.Identity.Application=")
    );
    const [isAuth, setIsAuth] = useState(!!hasAuthCookie);
    let params = queryParams.get("params");
    if (!params)
        params = localStorage.getItem("params");

    useEffect(() => {
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
            console.log("PassKey");

            loginComponent = <PassKeyLogin setIsAuth={setIsAuth} />;
            break;
        default:
            loginComponent = <LoginTwoFa setIsAuth={setIsAuth} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 w-full">
                <h1 className="text-2xl font-bold">ID</h1>

                <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button onClick={() => setAuthMethod("2FA")}>2FA</Button>
                        <Button onClick={() => setAuthMethod("PassKey")}>PassKey</Button>
                        <Button onClick={() => setAuthMethod("QR")}>QR</Button>
                    </ButtonGroup>

                    <div className="mt-5 w-full">
                        {loginComponent}
                    </div>
                </div>
            </div>
        </div>
    );
}