import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseURL, getJwtToken } from "../globalValues";
import Cookies from 'js-cookie';

interface userModel {
    username: string;
    email: string;
}

interface userLoginCrendentials {
    username: string;
    password: string;
}

interface userRegisterCrendentials {
    username: string;
    email: string;
    password: string;
}

interface AuthErrorType {
    invalidCredentials: boolean;
}

interface AuthState {
    userDetails: userModel;
    isValidSession: boolean;
    authErrorType: AuthErrorType;
}

interface LoginSuccess {
    access_token: string;
}

const initialState: AuthState = {
    userDetails: {
        username: "N/A",
        email: "N/A",
    },
    isValidSession: false,
    authErrorType: {
        invalidCredentials: false,
    },
};

export const login = createAsyncThunk(
    "auth/login",
    async (payload: userLoginCrendentials, { rejectWithValue }) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: JSON.stringify({
                username: payload.username,
                password: payload.password,
            }),
        };

        const res = await fetch(baseURL + "/auth/login", options);

        if (!res.ok) {
            const errorBody = await res.json();
            if (res.status === 401) {
                return rejectWithValue({
                    type: "unauthorized",
                    message: errorBody.message,
                });
            } else if (res.status === 403) {
                return rejectWithValue({
                    type: "invalid otp",
                    message: errorBody.message,
                });
            } else if (res.status === 404) {
                return rejectWithValue({
                    type: "notFound",
                    message: errorBody.message,
                });
            } else {
                return rejectWithValue({
                    type: "unknown",
                    message: "An unknown error occurred.",
                });
            }
        }

        return await res.json();
    }
);
export const signup = createAsyncThunk(
    "auth/signup",
    async (payload: userRegisterCrendentials, { rejectWithValue }) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                username: payload.username,
                email: payload.email,
                password: payload.password,
            }),
        };

        const res = await fetch(baseURL + "/auth/register", options);

        if (!res.ok) {
            const errorBody = await res.json();
            if (res.status === 401) {
                return rejectWithValue({
                    type: "unauthorized",
                    code: 401,
                    message: errorBody.message,
                });
            } else if (res.status === 403) {
                return rejectWithValue({
                    type: "invalid otp",
                    code: 403,
                    message: errorBody.message,
                });
            } else if (res.status === 404) {
                return rejectWithValue({
                    type: "notFound",
                    code: 404,
                    message: errorBody.message,
                });
            } else if (res.status === 400) {
                return rejectWithValue({
                    type: "MissingCredentials",
                    code: 400,
                    message: errorBody.message,
                });
            } else {
                return rejectWithValue({
                    type: "unknown",
                    code: res.status,
                    message: "An unknown error occurred.",
                });
            }
        }

        return await res.json();
    }
);

export const getDetails = createAsyncThunk(
    "auth/getUserDetails",
    async (_undefined, { rejectWithValue }) => {
        const token = getJwtToken();

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const res = await fetch(baseURL + "/auth/user/details", options);

        if (!res.ok) {
            const errorBody = await res.json();
            if (res.status === 401) {
                return rejectWithValue({
                    type: "unauthorized",
                    message: errorBody.message,
                });
            } else if (res.status === 404) {
                return rejectWithValue({
                    type: "notFound",
                    message: errorBody.message,
                });
            } else {
                return rejectWithValue({
                    type: "unknown",
                    message: "An unknown error occurred.",
                });
            }
        }

        return await res.json();
    }
);

function logoutReducer(state: any) {
    Cookies.remove("jwtToken", { secure: true, sameSite: "strict" });

    state.isValidSession = false;
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: logoutReducer,
        setInvalidCredentials: (state, action: PayloadAction<boolean>) => {
            state.authErrorType.invalidCredentials = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                getDetails.fulfilled,
                (state, action: PayloadAction<userModel>) => {
                    state.userDetails = action.payload;
                    state.isValidSession = true;
                }
            )
            .addCase(getDetails.rejected, (state, action: any) => {
                console.log(action.payload);
                if (
                    action.payload.type == "unknown" ||
                    action.payload.type == "unauthorized"
                ) {
                    state.isValidSession = false;
                }
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<LoginSuccess>) => {
                    Cookies.set("jwtToken", action.payload.access_token, {
                        expires: 0.0416,
                        secure: true,
                        sameSite: "strict",
                    });

                    state.isValidSession = true;
                }
            )
            .addCase(login.rejected, (state, action: any) => {
                console.log(action.payload);
                if (
                    action.payload.type == "unknown" ||
                    action.payload.type == "unauthorized"
                ) {
                    state.authErrorType.invalidCredentials = true;
                }
            })
            .addMatcher(
                (action) =>
                    action.type.endsWith("/rejected") &&
                    action.payload?.type === "unauthorized",
                logoutReducer
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith("movies/") &&
                    action.type.endsWith("/fulfilled"),
                (state) => {
                    state.isValidSession = true;
                }
            );
    },
});

export const { logout, setInvalidCredentials } = authSlice.actions;

export default authSlice.reducer;
