import axios, { all } from "axios";

export async function loginTwoFaAsync(identifier){
    try{
        return await axios.post(
            `${process.env.REACT_APP_BASE_URI}/api/Authorization/LoginTwoFa`,
            { identifier },
            { headers: { "Content-Type": "application/json-patch+json" } 
        });
    }
    catch(error){
        console.error(error)
        throw error
    }
}

export async function loginTwoFaVerifyAsync(id, code){
    try{
        return await axios.post(
            `${process.env.REACT_APP_BASE_URI}/api/Authorization/VerifyLoginTwoFa`,
            { id, code },
            { headers: { "Content-Type": "application/json-patch+json" }, withCredentials: true }
        );
    }
    catch(error){
        console.error(error)
        throw error
    }
}

const AuthorizationServices = {
    loginTwoFaAsync,
    loginTwoFaVerifyAsync
  };

export default AuthorizationServices