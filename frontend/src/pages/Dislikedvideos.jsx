import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDislikedVideos } from "../store/Slices/dislikeSlices";  // Action for fetching disliked videos
import HomeSkeleton from "../skeleton/HomeSkeleton";  // Skeleton loader for the loading state
import { Container, NoVideosFound, VideoList } from "../components";  // Components for layout
import { makeVideosNull } from "../store/Slices/videoSlice";  // Action to clear videos when the component unmounts

function DislikedVideos() {
    const dispatch = useDispatch();
    const dislikedVideos = useSelector((state) => state.dislike?.dislikedVideos); // Access the disliked videos from Redux store
    const loading = useSelector((state) => state.dislike.loading); // Access loading state

    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);

    useEffect(() => {
        // Fetch disliked videos when the component mounts
        dispatch(getDislikedVideos());

        // Cleanup function to reset videos when the component unmounts
        return () => dispatch(makeVideosNull());
    }, [dispatch]);

    // If loading, show skeleton loader
    if (loading) {
        return <HomeSkeleton />;
    }

    // If no disliked videos, show "No Videos Found" component
    if (dislikedVideos?.length === 0) {
        return <NoVideosFound />;
    }

    return (
        <Container>
            <div className="grid max-h-screen overflow-y-scroll lg:grid-cols-3 sm:grid-cols-2 text-white mb-20 sm:mb-0">
                {/* Map through the disliked videos and render each */}
                {dislikedVideos?.map((video) => (
                    <VideoList
                        key={video.dislikedVideo._id}  // Ensure this is correctly structured in your API response
                        avatar={video.dislikedVideo.ownerDetails?.avatar?.url}
                        duration={video.dislikedVideo.duration}
                        title={video.dislikedVideo.title}
                        thumbnail={video.dislikedVideo.thumbnail?.url}
                        createdAt={video.dislikedVideo.createdAt}
                        views={video.dislikedVideo.views}
                        channelName={video.dislikedVideo.ownerDetails?.username}
                        videoId={video.dislikedVideo._id}
                    />
                ))}
            </div>
        </Container>
    );
}

export default DislikedVideos;
