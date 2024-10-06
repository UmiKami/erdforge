import { useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDetails, login, setInvalidCredentials } from '../store/auth/authSlice'


const Login = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const isLoggedIn = useSelector((state: RootState) => state.auth.isValidSession)

    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/")
        };
    }, [isLoggedIn])

    const invalidCredentials = useSelector((state: RootState) => state.auth.authErrorType.invalidCredentials)


    const handleLogin = (e: any) => {
        e.preventDefault()

        const crendentials = {
            username: user,
            password: password,
        }

        dispatch(login(crendentials))
            .unwrap()
            .then((result) => {
    

                if (result.status == 401 || result.status == 400) {
                    dispatch(setInvalidCredentials(true))

                    return;
                }


                dispatch(getDetails())
            })
    }

    return (
        <div>Login</div>
    )
}

export default Login

