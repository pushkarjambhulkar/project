import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BiSolidLike, BiSolidDislike } from "../components/icons";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
} from "../store/Slices/likeSlice";
import {
    toggleCommentDislike,
    toggleTweetDislike,
    toggleVideoDislike,
} from "../store/Slices/dislikeSlices"; // Import necessary actions for dislike

function Like({
    isLiked,
    isDisliked,
    likesCount = 0,
    dislikesCount = 0,
    tweetId,
    commentId,
    videoId,
    size,
}) {
    const dispatch = useDispatch();
    const [localIsLiked, setLocalIsLiked] = useState(isLiked);
    const [localLikesCount, setLocalLikesCount] = useState(likesCount);
    const [localIsDisliked, setLocalIsDisliked] = useState(isDisliked);
    const [localDislikesCount, setLocalDislikesCount] = useState(dislikesCount);

    const handleLikeToggle = () => {
        if (localIsLiked) {
            setLocalLikesCount((prev) => prev - 1);
        } else {
            setLocalLikesCount((prev) => prev + 1);
            if (localIsDisliked) {
                setLocalDislikesCount((prev) => prev - 1); // Remove dislike
                setLocalIsDisliked(false);
            }
        }
        setLocalIsLiked((prev) => !prev);

        if (tweetId) dispatch(toggleTweetLike(tweetId));
        if (commentId) dispatch(toggleCommentLike(commentId));
        if (videoId) dispatch(toggleVideoLike(videoId));

        // Remove dislike when liking
        if (localIsDisliked) {
            if (tweetId) dispatch(toggleTweetDislike(tweetId));
            if (commentId) dispatch(toggleCommentDislike(commentId));
            if (videoId) dispatch(toggleVideoDislike(videoId));
        }
    };

    const handleDislikeToggle = () => {
        if (localIsDisliked) {
            setLocalDislikesCount((prev) => prev - 1);
        } else {
            setLocalDislikesCount((prev) => prev + 1);
            if (localIsLiked) {
                setLocalLikesCount((prev) => prev - 1); // Remove like
                setLocalIsLiked(false);
            }
        }
        setLocalIsDisliked((prev) => !prev);

        if (tweetId) dispatch(toggleTweetDislike(tweetId));
        if (commentId) dispatch(toggleCommentDislike(commentId));
        if (videoId) dispatch(toggleVideoDislike(videoId));

        // Remove like when disliking
        if (localIsLiked) {
            if (tweetId) dispatch(toggleTweetLike(tweetId));
            if (commentId) dispatch(toggleCommentLike(commentId));
            if (videoId) dispatch(toggleVideoLike(videoId));
        }
    };

    useEffect(() => {
        setLocalIsLiked(isLiked);
        setLocalLikesCount(likesCount);
        setLocalIsDisliked(isDisliked);
        setLocalDislikesCount(dislikesCount);
    }, [isLiked, likesCount, isDisliked, dislikesCount]);

    return (
        <div className="flex items-center gap-1">
            <BiSolidLike
                size={size}
                onClick={handleLikeToggle}
                className={`cursor-pointer ${localIsLiked ? "text-purple-500" : ""}`}
            />
            <span className="text-xs">{localLikesCount}</span>

            <BiSolidDislike
                size={size}
                onClick={handleDislikeToggle}
                className={`cursor-pointer ${localIsDisliked ? "text-red-500" : ""}`}
            />
            <span className="text-xs">{localDislikesCount}</span>
        </div>
    );
}

export default Like;
