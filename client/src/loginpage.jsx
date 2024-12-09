import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "./utils/useContext"; 
import { useNavigate } from "react-router-dom";

export default function LoginPage(){

    //Auth context that also contains users information
    const {user, error, dispatch} = useContext(AuthContext);

    const [userCridentials, setUserCridentials] = useState({
        name: "",
        password: ""
    });

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setUserCridentials((userCridentials) => ({
            ...userCridentials,
            [name] : value
        }));
    }

    const navigate = useNavigate();

    const handleLogin = async() => {
        dispatch({type: "LOGIN_START"});
        try{    
            const response = await axios.post("http://localhost:3000/api/login", userCridentials);
            console.log(response.data);
            dispatch({type: "LOGIN_SUCCESS", payload:response.data});
            navigate("/");
        }catch(error){
            dispatch({type: "LOGIN_FAILURE", payload: error.response});
            console.log(error);
        }
    }


    return(
        <>  
            <div>
                <input onChange={handleChange} name="name" type="text" placeholder="User name"/>
                <input onChange={handleChange} name="password" type="password" placeholder="User Password"/>
                <button onClick={() => handleLogin()}>Login</button>
                <p>{error && error.data.message}</p>
            </div>
        </>
    )
}