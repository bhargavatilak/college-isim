import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, Clock, AlertCircle, RefreshCw, Users } from 'lucide-react';
import api from '../../services/api';

export const SmartAttendance: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
    const [activeLecture, setActiveLecture] = useState<any>(null);

    // Mock active lecture
    useEffect(() => {
        setActiveLecture({
            subject: 'Data Structures',
            course: 'B.Tech CSE',
            year: 2,
            section: 'A',
            startTime: '10:00 AM',
            endTime: '11:00 AM',
            type: 'Theory'
        });
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access webcam. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraActive(false);
            setScanning(false);
        }
    };

    const captureFace = () => {
        if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

        setScanning(true);
        const context = canvasRef.current.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, 320, 240);
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            
            // In a real app, send imageData to backend AI for matching
            simulateFaceMatch();
        }
    };

    const simulateFaceMatch = () => {
        setTimeout(() => {
            const mockStudent = {
                id: Math.random().toString(36).substring(7),
                name: "Test Student " + Math.floor(Math.random() * 100),
                rollNo: "CS210" + Math.floor(Math.random() * 99),
                status: 'Present',
                time: new Date().toLocaleTimeString()
            };
            setRecentAttendance(prev => [mockStudent, ...prev]);
            setScanning(false);
        }, 1500);
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Camera className="text-indigo-600" /> Smart Face Attendance
                </h1>
                <p className="text-sm text-gray-500 mt-1">Live AI-driven attendance capture mapped to the active timetable.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col: Camera & Lecture Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Lecture Banner */}
                    {activeLecture && (
                        <div className="bg-indigo-600 rounded-xl p-5 text-white shadow-md flex justify-between items-center">
                            <div>
                                <span className="bg-indigo-500 text-indigo-100 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
                                    Active Timetable Slot
                                </span>
                                <h2 className="text-xl font-bold">{activeLecture.subject} ({activeLecture.type})</h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    {activeLecture.course} • Year {activeLecture.year} • Section {activeLecture.section}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 justify-end mb-1">
                                    <Clock size={16} className="text-indigo-200" />
                                    <span className="font-semibold">{activeLecture.startTime} - {activeLecture.endTime}</span>
                                </div>
                                <span className="flex items-center gap-1 text-xs text-indigo-200 justify-end">
                                    <AlertCircle size={14} /> Rule #5 Active
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Camera Window */}
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                            {isCameraActive ? (
                                <>
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    {scanning && (
                                        <div className="absolute inset-0 border-4 border-emerald-500 border-dashed m-12 rounded-lg opacity-50 animate-pulse">
                                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded font-bold">Scanning...</div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Camera size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>Camera is currently inactive</p>
                                </div>
                            )}
                            <canvas ref={canvasRef} width="320" height="240" className="hidden" />
                        </div>
                        
                        <div className="flex justify-center gap-4 mt-6">
                            {!isCameraActive ? (
                                <button onClick={startCamera} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-all flex items-center gap-2">
                                    <Camera size={18} /> Enable Camera
                                </button>
                            ) : (
                                <>
                                    <button onClick={stopCamera} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full font-medium transition-all">
                                        Stop Camera
                                    </button>
                                    <button 
                                        onClick={captureFace} 
                                        disabled={scanning}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-full font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {scanning ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                        Scan Face
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Live Log */}
                <div className="bg-white rounded-xl shadow-sm border flex flex-col h-[500px]">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center rounded-t-xl">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Users size={18} className="text-indigo-600" /> Session Log
                        </h3>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                            {recentAttendance.length} Present
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {recentAttendance.length === 0 ? (
                            <div className="text-center text-gray-400 mt-12">
                                <p className="text-sm">No scans recorded yet.</p>
                                <p className="text-xs mt-1">Start the camera to begin.</p>
                            </div>
                        ) : (
                            recentAttendance.map((student, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.rollNo}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100">
                                            <CheckCircle2 size={12} /> {student.status}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-1">{student.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
