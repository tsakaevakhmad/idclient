import axios, { all } from "axios";

export async function loginTwoFaAsync(identifier){
    try{
        return await axios.post(
            `${process.env.REACT_APP_BASE_URI}/api/Authorization/LoginTwoFa`,
            { identifier },
            { headers: { "Content-Type": "application/json" } 
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
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
    }
    catch(error){
        console.error(error)
        throw error
    }
}

export async function lsAuthorized(){
    try{
        return await axios.get(
            `${process.env.REACT_APP_BASE_URI}/api/Authorization/IsAuthorized`,
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
    }
    catch(error){
        console.error(error)
    }
}

const AuthorizationServices = {
    loginTwoFaAsync,
    loginTwoFaVerifyAsync
  };

export default AuthorizationServices