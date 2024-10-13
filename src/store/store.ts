import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import erdToolsReducer from "./erdTools/erdToolsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        erdTools: erdToolsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
