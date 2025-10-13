import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    CircularProgress,
} from "@mui/material";

export default function QrLogin({ setIsAuth }) {
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [status, setStatus] = useState("Подключение к серверу...");

    const handleVerifySuccess = () => {
        setIsAuth(true);
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/hub/qr-login`, { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        const startConnection = async () => {
            try {
                await connection.start();
                console.log("✅ Connected to QR Hub");
                setStatus("Ожидание QR-кода...");
                setLoading(false);
            } catch (err) {
                console.error("Ошибка подключения:", err);
                setStatus("Ошибка подключения. Повторите попытку.");
                setLoading(false);
            }
        };

        connection.on("ReceiveSessionId", (sessionId) => {
            console.log("📦 SessionId received:", sessionId);
            setSessionId(sessionId);
            setStatus("Отсканируйте QR-код в приложении");
        });

        connection.on("QrScaned", async (token) => {
            console.log("📲 QR scanned, token:", token);
            setToken(token);
            setStatus("Авторизация...");

            if (!token) return;

            try {
                const response = await axios.post(
                    `/api/Authorization/QrSignIn`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token.token}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (response.data.status === "Success") {
                    setStatus("Успешный вход ✅");
                    handleVerifySuccess();
                } else {
                    setStatus("Ошибка авторизации. Попробуйте снова.");
                }
            } catch (err) {
                console.error("Ошибка входа через QR:", err);
                setStatus("Ошибка входа через QR-код.");
            }
        });

        startConnection();

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <Card
            sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 8,
                p: 2,
                borderRadius: 3,
                boxShadow: 4,
                textAlign: "center",
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h6" align="center">
                        Вход по QR-коду
                    </Typography>
                }
            />

            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {loading ? (
                    <CircularProgress />
                ) : sessionId ? (
                    <>
                        <QRCode
                            value={sessionId}
                            size={200}
                            style={{ borderRadius: "8px" }}
                            fgColor="#007bff" // синий
                            bgColor="transparent"
                        />
                        <Typography variant="body2" color="text.secondary">
                            {status}
                        </Typography>
                    </>
                ) : (
                    <Typography color="text.secondary">{status}</Typography>
                )}

                {token && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Проверка данных...
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
