import { createSlice } from "@reduxjs/toolkit";

interface ToolsState {
    singleSelect: boolean;
    multiSelect: boolean;
}

const initialState: ToolsState = {
    singleSelect: true,
    multiSelect: false,
};

function setSingleSelectReducer(state: ToolsState) {
    state.singleSelect = true;
    state.multiSelect = false;
}

function setMultiSelectReducer(state: ToolsState) {
    state.singleSelect = !state.singleSelect;
    state.multiSelect = !state.multiSelect;
}

const erdToolsSlice = createSlice({
    name: "erdTools",
    initialState,
    reducers: {
        singleSelect: setSingleSelectReducer,
        multiSelect: setMultiSelectReducer,
    },
});

export const { singleSelect, multiSelect } = erdToolsSlice.actions;

export default erdToolsSlice.reducer;
