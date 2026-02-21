import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer back camera on mobile
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsStreaming(false);
        }
    };

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured-product.jpg", { type: "image/jpeg" });
                        onCapture(file);
                        setCapturedImage(URL.createObjectURL(blob));
                        stopCamera();
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    }, [onCapture]);

    const retake = () => {
        setCapturedImage(null);
        startCamera();
    };

    return (
        <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">

            {!isStreaming && !capturedImage && (
                <div className="text-center p-6">
                    <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-4">Live photo required for verification.</p>
                    <button onClick={startCamera} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Open Camera
                    </button>
                </div>
            )}

            {isStreaming && (
                <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg border-4 border-gray-200"
                    >
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    </button>
                </>
            )}

            {capturedImage && (
                <>
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    <button
                        onClick={retake}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/70"
                    >
                        <RefreshCw size={16} />
                    </button>
                </>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
