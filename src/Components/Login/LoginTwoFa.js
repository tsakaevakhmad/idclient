import { useState } from "react";
import { Card, CardContent, CardHeader, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Services from "../../Services/AuthorizationServices";
import LoginTwoFaVerify from "./LoginTwoFaVerify";
import { motion } from "framer-motion";


export default function LoginTwoFa({ setIsAuth }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verify, setVerify] = useState(false);
  const [id, setId] = useState(null);

  const handleVerifySuccess = () => {
    console.log("✅ Successful verification!");
    setIsAuth(true);
  };

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError("Введите номер телефона или email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await Services.loginTwoFaAsync(identifier);

      switch (response.data.status) {
        case "SendedLoginCodeToEmail":
        case "SendedLoginCodeToPhoneNumber":
          setId(response.data.id);
          setVerify(true);
          break;

        case "UserNotFound":
          setError("Пользователь не найден. Проверьте введённые данные.");
          break;

        case "UserMailNotConfirmed":
          setError("Ваша почта не подтверждена. Проверьте email для подтверждения.");
          break;

        case "UserPhoneNotConfirmed":
          setError("Ваш номер телефона не подтверждён. Подтвердите номер перед входом.");
          break;

        case "UserAlreadyExists":
          setError("Пользователь уже существует. Попробуйте войти.");
          break;

        case "UserMailAlreadyExists":
          setError("Аккаунт с такой почтой уже существует.");
          break;

        case "UserPhoneAlreadyExists":
          setError("Аккаунт с таким номером телефона уже существует.");
          break;

        case "InvalidToken":
          setError("Недействительный токен. Повторите попытку входа.");
          break;

        default:
          setError("Произошла неизвестная ошибка. Попробуйте ещё раз.");
          break;
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка авторизации. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (verify) {
    return <LoginTwoFaVerify id={id} onSuccess={handleVerifySuccess} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      <Card sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 2, borderRadius: 3, boxShadow: 4 }}>
        <CardHeader
          title={
            <Typography variant="h6" align="center">
              Двухфакторная аутентификация
            </Typography>
          }
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <TextField
            label="Телефон или Почта"
            variant="standard"
            fullWidth
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            InputProps={{ sx: { textAlign: "center" } }}
          />

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={loading}
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Войти"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
