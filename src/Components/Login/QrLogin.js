import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@mui/material";


export default function QrLogin({ setIsAuth }) {
    const [sessionId, setSessionId] = useState(null);
    const [token, setToken] = useState(null);
    const [hubConnection, setHubConnection] = useState(null);
    const handleVerifySuccess = () => {
        setIsAuth(true);
    };
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/hub/qr-login`, { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("Connected to QR Hub"))
            .catch(err => console.error(err));

        connection.on("ReceiveSessionId", sessionId => {
            console.log("SessionId received:", sessionId);
            setSessionId(sessionId);
        });

        connection.on("QrScaned", async token => {
            console.log("QR scanned, token:", token);
            setToken(token);

            if (!token) return;

            try {
                const response = await axios.post(
                    `/api/Authorization/QrSignIn`,
                    {}, // тело запроса пустое, токен будет в заголовке
                    {
                        headers: {
                            "Authorization": `Bearer ${token.token}`,
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    }
                );
                if (response.data.status === "Success") {
                    handleVerifySuccess();
                }
            } catch (err) {
                console.error("Error during QR sign-in:", err);
            }
        });

        setHubConnection(connection);

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <Card className="w-full">
            <CardHeader>
                <h1>QR Login</h1>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                {sessionId ? <QRCode value={sessionId} /> : <p>Connecting to server...</p>}
                {token && <p>Logging in...</p>}
            </CardContent>
        </Card>
    );
}
