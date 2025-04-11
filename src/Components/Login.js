import { Button } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import LoginTwoFa from "./LoginTwoFa";
import { Base64UrlDecode } from "../Services/Helper";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Login() {
    const navigate = useNavigate();
    const query = useQuery();
    let params = query.get("params");
    if (!params)
        params = localStorage.getItem("params");

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const hasAuthCookie = cookies.some((cookie) =>
            cookie.startsWith(".AspNetCore.Identity.Application=")
        );
        if (hasAuthCookie && params) {
            localStorage.removeItem("params");
            window.location.href = `${process.env.REACT_APP_BASE_URI}/connect/authorize/?${Base64UrlDecode(params)}`;
        }
        else if (params) {
            localStorage.setItem("params", params);
        }
        else if (hasAuthCookie) {
            navigate("/Profile");
        }
    }, [navigate, params]);


    return (
        <Card className="w-96 mx-auto mt-10 p-4 shadow-lg">
            <CardHeader>
                <Button>2FA Login</Button>
            </CardHeader>
            <CardContent>
                <LoginTwoFa />
            </CardContent>
        </Card>
    );
}