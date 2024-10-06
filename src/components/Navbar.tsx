import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { getJwtToken } from "../store/globalValues";
import { getDetails, logout } from "../store/auth/authSlice";

const Navbar = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const isLogin = getJwtToken()

    const isValidSession = useSelector((state: RootState) => state.auth.isValidSession)


    useEffect(() => {
  
        dispatch(getDetails())

    }, [isValidSession])


    return (
        <div>Navbar</div>
    )
}

export default Navbar