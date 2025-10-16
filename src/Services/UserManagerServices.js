import axios, { all } from "axios";

export async function userInfo(){
    try{
        return await axios.get(
            `/api/user/getUserInfo`,
            { headers: { "Content-Type": "application/json" } }
        );
    }
    catch(error){
        console.error(error)
        throw error
    }
}

export async function sendPhoneConfirmationCode(){
    try{
        return await axios.get(
            `/api/user/sendPhoneConfirmationCode`,
            { headers: { "Content-Type": "application/json" } }
        );
    }
    catch(error){
        console.error(error)
        throw error
    }
}

export async function verifiPhoneConfirmationCode(confirmationCode){
    try{
        return await axios.get(
            `/api/user/verifiPhoneConfirmationCode?confirmationCode=${confirmationCode}`,
            { headers: { "Content-Type": "application/json" } }
        );
    }
    catch(error){
        console.error(error)
        throw error
    }
}

const UserManagerServices = {
    userInfo,
    sendPhoneConfirmationCode,
    verifiPhoneConfirmationCode
  };

export default UserManagerServices