import { useState } from "react";
import OtpInput from "react-otp-input";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { loginTwoFaVerifyAsync } from "../../Services/AuthorizationServices";

export default function LoginTwoFaVerify({ id, onSuccess }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Введите 6-значный код");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await loginTwoFaVerifyAsync(id, code);
      if (response.data.status === "Success") {
        onSuccess();
      } else {
        setError("Неверный код. Попробуйте ещё раз.");
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка при проверке. Повторите попытку.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <CardHeader
        title={
          <Typography variant="h6" align="center">
            Подтверждение входа
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
        <OtpInput
          value={code}
          onChange={setCode}
          numInputs={6}
          regexCriteria={/^[0-9]$/}
          renderInput={(props) => <input {...props} />}
          containerStyle={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            color: "primary"
          }}
          inputStyle={{
            width: "45px",
            height: "50px",
            fontSize: "1.5rem",
            textAlign: "center",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          shouldAutoFocus
        />

        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleVerify}
          disabled={loading}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Подтвердить"}
        </Button>
      </CardContent>
    </Card>
  );
}
