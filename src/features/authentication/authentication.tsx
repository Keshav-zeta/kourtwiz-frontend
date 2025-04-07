import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useSendImage } from '../../hooks/useSendImage';
import { useLocation } from "react-router-dom";

const WebcamCapture: React.FC = () => {
    const location = useLocation();
    const clubName = location.state?.clubName || "Unknown Club";
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [lowLightDetected, setLowLightDetected] = useState<boolean | null>(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);
    const [responseData, setResponseData] = useState<any>(null); 
    const [pauseDetection, setPauseDetection] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showWebcam, setShowWebcam] = useState(true);
    
    const { mutate: sendImage, isPending } = useSendImage({
        onCompleteCallback: (data) => {
            console.log('📩 Response received:', data);
            setResponseData(data);
        },
    });

    const isPendingRef = useRef(isPending);
    useEffect(() => {
        isPendingRef.current = isPending;
    }, [isPending]);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                console.log('✅ Models loaded');
                setModelsLoaded(true);
            } catch (error) {
                console.error('❌ Failed to load models:', error);
            }
        };

        loadModels();
    }, []);

    const detectFaceAndLight = async () => {
        if (!webcamRef.current || !canvasRef.current || isPendingRef.current || !modelsLoaded) return;

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!video || !ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })
        );

        setFaceDetected(detections.length > 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let totalBrightness = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            totalBrightness += 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        }

        const avgBrightness = totalBrightness / pixelCount;
        setLowLightDetected(avgBrightness < 50);

        if (detections.length > 0 && avgBrightness >= 50 && !isPendingRef.current) {
            captureAndSendFromCanvas();
        }
    };

    useEffect(() => {
        if (!modelsLoaded || pauseDetection) return;
    
        const interval = setInterval(() => {
            detectFaceAndLight();
        }, 750); 
    
        return () => clearInterval(interval);
    }, [modelsLoaded, pauseDetection]);

    useEffect(() => {
        if (responseData) {
            setProcessing(false);
            setShowWebcam(false);

            if (responseData?.message?.includes("Authenticated:")) {
                setTimeout(() => {
                    setResponseData(null);
                    setShowWebcam(true);
                }, 5000);
            } else {
                setTimeout(() => {
                    setShowWebcam(true);
                }, 5000);
            }
        }
    }, [responseData]);
    
    const captureAndSendFromCanvas = useCallback(() => {
        if (!canvasRef.current) return;
    
        setProcessing(true);
        setShowWebcam(false);
        
        const canvas = canvasRef.current;
        const imageDataUrl = canvas.toDataURL('image/jpeg');
    
        setLastCapturedImage(imageDataUrl);
    
        if (imageDataUrl && !isPendingRef.current) {
            console.log('📤 Sending image to backend...');
            sendImage({ image: imageDataUrl, clubName }); 
        }
    }, [sendImage, clubName]);

    return (
        <div style={{ textAlign: 'center' }}>
            {processing ? (
                <h3>PROCESSING...</h3>
            ) : responseData ? (
                <div>
                    <h4>🔍 Detection Results:</h4>
                    <p>{responseData.message}</p>
                    {responseData.message.includes("Authenticated:") && (
                        <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
                            ✅ You can now walk into the gate!
                        </div>
                    )}
                </div>
            ) : showWebcam ? (
                <div>
                    <h3>Align Your Face Inside the Box</h3>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            style={{
                                borderRadius: '10px',
                                border: '2px solid gray',
                                width: '400px',
                            }}
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                    <p>{faceDetected ? '✅ Face Detected' : '❌ No Face Detected'}</p>
                    <p>{lowLightDetected ? '⚠️ Low Light Detected' : '✅ Good Lighting'}</p>
                </div>
            ) : null}
        </div>
    );
};

export default WebcamCapture;
