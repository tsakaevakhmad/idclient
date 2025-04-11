import { useState } from "react";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader} from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { loginTwoFaVerifyAsync } from '../Services/AuthorizationServices'

export default function LoginTwoFaVerify() {
  const { id }= useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleVerify = async () => {

    setLoading(true);
    setError(null);
    try {
      const response = await loginTwoFaVerifyAsync(id, code)
      console.log("Success:", response.data);
      navigate("/");
    } catch (err) {
      setError("Ошибка при подтверждении. Попробуйте снова.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-96 mx-auto mt-10 p-4 shadow-lg">
      <CardHeader>
        <h1>Verify</h1>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Введите код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mb-4"
        />
        <Input
          hidden
          type="text"
          value={id}
          style={{ display: 'none' }} 
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button onClick={handleVerify} disabled={loading} className="w-full">
          {loading ? "Загрузка..." : "Подтвердить"}
        </Button>
      </CardContent>
    </Card>
  );
}