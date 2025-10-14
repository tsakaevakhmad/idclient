import { useState } from "react";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import { LoginPasskey } from "../../Services/PassKeyService";
import { motion } from "framer-motion";

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
      setError("Authorization error. Please try again.");
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
      <CardContent className="flex flex-col items-center ">
      {/* <Input
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
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>} */}
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}