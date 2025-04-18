import { useState } from "react";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import { LoginPasskey } from "../../Services/PassKeyService";

export default function PassKeyLogin({ setIsAuth }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifySuccess = () => {
    setIsAuth(true);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginPasskey(identifier);
      console.log(response);

      if (response.status === 200) {
        handleVerifySuccess(true);
      }
    } catch (err) {
      setError("Ошибка авторизации. Попробуйте снова.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h1>PassKey</h1>
      </CardHeader>
      <CardContent>
        <Input
          className="w-full"
          type="text"
          placeholder="Введите номер телефона или почту"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button style={{ marginTop: "20px" }} onClick={handleLogin} disabled={loading}>
          {loading ? "Загрузка..." : "Начать"}
        </Button>
      </CardContent>
    </Card>
  );
}