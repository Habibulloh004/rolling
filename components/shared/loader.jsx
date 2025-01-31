"use client";
import Lottie from "lottie-react";
import animationData from "@/public/logoLottie.json"; // Ensure the JSON is placed in the public folder

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <Lottie animationData={animationData} className="w-80 h-80" />
        </div>
    );
};

export default Loading;