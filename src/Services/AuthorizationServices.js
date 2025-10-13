import axios, { all } from "axios";

export async function loginTwoFaAsync(identifier){
    try{
        return await axios.post(
            `/api/Authorization/LoginTwoFa`,
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
            `/api/Authorization/VerifyLoginTwoFa`,
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
            `/api/Authorization/IsAuthorized`,
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
    }
    catch(error){
        console.error(error)
    }
}

export async function logOut(){
    try{
        console.log("Logging out...");
        return await axios.get(
            `/api/Authorization/LogOut`,
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
    }
    catch(error){
        console.error(error)
    }
}

export async function getExternalProviders(params) { 
    try {
        console.log(params);
        const queryParams = params ? { queryParams: params } : {};
        return await axios.get(
            `/api/Authorization/GetProvidersLink`,
            { 
                headers: { "Content-Type": "application/json" }, 
                withCredentials: true,
                params: queryParams // сюда axios автоматически сериализует query string
            }
        );
    } catch (error) {
        console.error("Ошибка при получении провайдеров:", error);
        throw error; 
    }
}

const AuthorizationServices = {
    loginTwoFaAsync,
    loginTwoFaVerifyAsync,
    getExternalProviders,
    lsAuthorized,
    logOut
  };

export default AuthorizationServices