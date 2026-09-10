import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState, type ReactNode} from "react";
import api from "../api";
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants";


interface DecodedToken {
    exp: number;
}
interface refreshResponse {
    access: string;
}

function ProtectedRoutes({children}: {children: ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    const auth = async () => {
        
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }
        const decodedToken = jwtDecode<DecodedToken>(accessToken);
        const tokenExp = decodedToken.exp;
        const currentTime = Date.now()/1000;

        if(tokenExp < currentTime) {
            await refreshToken();
        }else{
            setIsAuthenticated(true);
        }
    }

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const response = await api.post<refreshResponse>("/api/token/refresh", {refresh : refreshToken});

            if(response.status === 200){
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
            }else{
                setIsAuthenticated(false);
            }


        }catch(error){
            console.log(error);
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        auth().catch(() => setIsAuthenticated(false));

    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/Login" />;
}


export default ProtectedRoutes;