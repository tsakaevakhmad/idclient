import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Services from "../../Services/AuthorizationServices";
import { RegisterAsync } from "../../Services/AuthorizationServices";
import LoginTwoFaVerify from "./LoginTwoFaVerify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Registration({ setIsAuth }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    email: "",
    userName: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    middleName: "",
  });

  const handleVerifySuccess = () => {
    console.log("✅ Successful verification!");
    setIsAuth(true);
  };


  const handleRegister = async () => {
    const { email, userName, phoneNumber } = registerData;
    if (!email && !phoneNumber) {
      setError("Введите почту или телефон");
      return;
    }
    if (!userName.trim()) {
      setError("Введите имя пользователя");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await RegisterAsync(registerData);
      switch (response.data.status) {
        case "SendedMailConfirmationCode":
          navigate("/");
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
      setError("Ошибка при регистрации. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            maxWidth: 400,
            mx: "auto",
            mt: 8,
            p: 2,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" align="center">
                      Регистрация
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
                  {[
                    { label: "Email", name: "email" },
                    { label: "Телефон", name: "phoneNumber" },
                    { label: "Имя пользователя", name: "userName" },
                    { label: "Имя", name: "firstName" },
                    { label: "Фамилия", name: "lastName" },
                    { label: "Отчество", name: "middleName" },
                  ].map((field) => (
                    <TextField
                      key={field.name}
                      label={field.label}
                      variant="standard"
                      fullWidth
                      value={registerData[field.name]}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          [field.name]: e.target.value,
                        })
                      }
                    />
                  ))}

                  {error && (
                    <Typography color="error" variant="body2" align="center">
                      {error}
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRegister}
                    disabled={loading}
                    sx={{ width: "100%", borderRadius: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Зарегистрироваться"
                    )}
                  </Button>

                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      cursor: "pointer",
                      mt: 1,
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => navigate("/")}
                  >
                    Уже есть аккаунт? Войти
                  </Typography>
                </CardContent>
              </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
