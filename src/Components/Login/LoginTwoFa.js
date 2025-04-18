import { useState } from "react";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import Services from "../../Services/AuthorizationServices";
import LoginTwoFaVerify from "./LoginTwoFaVerify";

export default function LoginTwoFa({ setIsAuth }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verify, setVerify] = useState(false);
  const [id, setId] = useState(null);

  const handleVerifySuccess = () => {
    console.log("Successful verification!");
    setIsAuth(true);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Services.loginTwoFaAsync(identifier)
      console.log("Success:", response.data);
      setId(response.data.id);
      setVerify(true);
    } catch (err) {
      setError("Authorization error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!verify)
    return (
      <Card className="w-full">
        <CardHeader>
          <h1>Двухфакторная аутентификация</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Input
            className="w-full mb-5 text-center"
            type="text"
            placeholder="Enter Phone number or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            sx={{
              input: {
                textAlign: 'center',
                '&::placeholder': {
                  textAlign: 'center',
                },
              },
            }}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button onClick={handleLogin} disabled={loading}>
            {loading ?  "Loading..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    );
  return (<LoginTwoFaVerify id={id} onSuccess={handleVerifySuccess} />)
}