import { Button, ButtonGroup } from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginTwoFa from "./LoginTwoFa";
import { Base64UrlDecode } from "../Services/Helper";
import { useEffect, useState } from "react";



export default function Login() {
    const navigate = useNavigate();

    const cookies = document.cookie.split("; ");
    const hasAuthCookie = cookies.some((cookie) =>
        cookie.startsWith(".AspNetCore.Identity.Application=")
    );

    const [isAuth, setIsAuth] = useState(!!hasAuthCookie);
    const [queryParams] = useSearchParams()
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
    }, [isAuth, params, navigate]);


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 w-full">
                <h1 className="text-2xl font-bold">ID</h1>

                <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button>2FA</Button>
                        <Button>PassKey</Button>
                        <Button>QR</Button>
                    </ButtonGroup>

                    <div className="mt-5 w-full">
                        <LoginTwoFa setIsAuth={setIsAuth} />
                    </div>
                </div>
            </div>
        </div>
    );
}