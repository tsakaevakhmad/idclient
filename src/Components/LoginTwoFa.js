import { useState } from "react";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function LoginTwoFa() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://localhost:7253/api/Authorization/LoginTwoFa",
        { identifier },
        { headers: { "Content-Type": "application/json-patch+json" } }
      );
      console.log("Success:", response.data);
      const { id } = response.data; // Предположим, что API возвращает объект с полем id
      navigate(`/LoginTwoFaVerify/${id}`);
    } catch (err) {
      setError("Ошибка авторизации. Попробуйте снова.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-96 mx-auto mt-10 p-4 shadow-lg">
      <CardHeader>
        <h1>Авторизация</h1>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Введите номер телефона или почту"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? "Загрузка..." : "Войти"}
        </Button>
      </CardContent>
    </Card>
  );
}