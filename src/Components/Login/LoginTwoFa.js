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
      if (response.data.status === "SendedLoginCodeToEmail") {
        console.log("Success:", response.data);
        setId(response.data.id);
        setVerify(true)
      }
      if (response.data.status === "SendedLoginCodeToPhoneNumber") {
        console.log("Success:", response.data);
        setId(response.data.id);
        setVerify(true)
      }
      if (response.data.status === "UserNotFound") {
        setError("Пользователь не найден. Проверьте введённые данные.");
        setVerify(false);
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
