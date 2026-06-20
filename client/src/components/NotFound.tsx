import type { FC } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound: FC = () => {
    return (
        <div className="min-h-screen bg-[#0d3782] flex flex-col items-center justify-center text-white px-4 py-8">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center">

                {/* Render Lottie Animation (Constrained to fit screen height) */}
                <div className="w-full max-w-[85vw] max-h-[80vh] aspect-square flex items-center justify-center overflow-hidden">
                    <DotLottieReact
                        src="/404%20error%20page%20with%20cat.lottie"
                        loop
                        autoplay
                        className="w-full h-full object-contain"
                        renderConfig={{
                            devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1
                        }}
                    />
                </div>

            </div>
        </div>
    );
};

export default NotFound;