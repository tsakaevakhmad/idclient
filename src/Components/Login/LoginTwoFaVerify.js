import { useState } from "react";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader} from "@mui/material";
import { loginTwoFaVerifyAsync } from '../../Services/AuthorizationServices'

export default function LoginTwoFaVerify({id, onSuccess}) {
  //const { id }= useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginTwoFaVerifyAsync(id, code)
      console.log("Success:", response.data);
      if (response.data.status === "Success") {
        onSuccess()
      }
    } catch (err) {
      setError("Error during verification. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h1>Verify</h1>
      </CardHeader>
      <CardContent className="flex flex-col items-center ">
        <Input
          className="w-full mb-5 text-center"
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
        <Button onClick={handleVerify} disabled={loading} >
          {loading ?  "Loading..." : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}