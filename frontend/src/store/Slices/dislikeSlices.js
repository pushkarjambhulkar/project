import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    dislikedVideos: [],
};

export const toggleVideoDislike = createAsyncThunk(
    "dislike/getDislikedVideos",
    async (videoId) => {
        try {
            const response = await axiosInstance.post(
                `/dislike/toggle/v/${videoId}`
            );
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const toggleTweetDislike = createAsyncThunk(
    "toggleTweetDislike",
    async (tweetId) => {
        try {
            const response = await axiosInstance.post(
                `/dislike/toggle/t/${tweetId}`
            );
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const toggleCommentDislike = createAsyncThunk(
    "toggleCommentDislike",
    async (commentId) => {
        try {
            const response = await axiosInstance.post(
                `/dislike/toggle/c/${commentId}`
            );
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const getDislikedVideos = createAsyncThunk(
    "getDislikedVideos",
    async () => {
        try {
            const response = await axiosInstance.get("/dislike/videos");
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

const dislikeSlice = createSlice({
    name: "dislike",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDislikedVideos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getDislikedVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.dislikedVideos = action.payload;
        });
    },
});

export default dislikeSlice.reducer;
