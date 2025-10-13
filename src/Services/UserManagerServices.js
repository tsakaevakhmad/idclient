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

const UserManagerServices = {
    userInfo,
  };

export default UserManagerServices