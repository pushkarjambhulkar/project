import mongoose, { isValidObjectId } from "mongoose";
import { Dislike } from "../models/dislike.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    console.log("Received videoId:", videoId);  // Check if videoId is correctly received

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const dislikedAlready = await Dislike.findOne({
        video: videoId,
        dislikedBy: req.user?._id,
    });

    if (dislikedAlready) {
        await Dislike.findByIdAndDelete(dislikedAlready._id);
        return res.status(200).json(new ApiResponse(200, { isDisliked: false }));
    }

    await Dislike.create({
        video: videoId,
        dislikedBy: req.user?._id,
    });

    return res.status(200).json(new ApiResponse(200, { isDisliked: true }));
});

const toggleCommentDislike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const dislikedAlready = await Dislike.findOne({
        comment: commentId,
        dislikedBy: req.user?._id,
    });

    if (dislikedAlready) {
        await Dislike.findByIdAndDelete(dislikedAlready?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isDisliked: false }));
    }

    await Dislike.create({
        comment: commentId,
        dislikedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isDisliked: true }));
});

const toggleTweetDislike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const dislikedAlready = await Dislike.findOne({
        tweet: tweetId,
        dislikedBy: req.user?._id,
    });

    if (dislikedAlready) {
        await Dislike.findByIdAndDelete(dislikedAlready?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { tweetId, isDisliked: false }));
    }

    await Dislike.create({
        tweet: tweetId,
        dislikedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isDisliked: true }));
});

const getDislikedVideos = asyncHandler(async (req, res) => {
    const dislikedVideosAggregate = await Dislike.aggregate([
        {
            $match: {
                dislikedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "dislikedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                        },
                    },
                    {
                        $unwind: "$ownerDetails",
                    },
                ],
            },
        },
        {
            $unwind: "$dislikedVideo",
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: 0,
                dislikedVideo: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        "avatar.url": 1,
                    },
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                dislikedVideosAggregate,
                "Disliked videos fetched successfully"
            )
        );
});

export { toggleVideoDislike, toggleCommentDislike, toggleTweetDislike, getDislikedVideos };
