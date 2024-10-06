import { useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDetails, login, setInvalidCredentials, signup } from '../store/auth/authSlice'


const Signup = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const isLoggedIn = useSelector((state: RootState) => state.auth.isValidSession)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/")
        };
    }, [isLoggedIn])



    const handleSignup = (e: any) => {
        e.preventDefault()

        const crendentials = {
            username: username,
            email: email,
            password: password,
        }

        dispatch(signup(crendentials))
            .unwrap()
            .then((result) => {


                if (result.status == 401 || result.status == 400) {
                    // dispatch(setInvalidCredentials(true))

                    return;
                }

                navigate("/login")
                // dispatch(getDetails())
            })
    }

    return (
        <div>Login</div>
    )
}

export default Signup

