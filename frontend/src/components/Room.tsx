import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { AISuggestion } from "./AISuggestion";
import { VoiceRecorder } from "./VoiceRecorder";

declare global {
  interface Window {
    pcr?: RTCPeerConnection;
  }
}

const URL = import.meta.env.VITE_API_URL;

export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack,
    onLeaveChat
}: {
    name: string,
    localAudioTrack: MediaStreamTrack | null,
    localVideoTrack: MediaStreamTrack | null,
    onLeaveChat?: () => void,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lobby, setLobby] = useState(true);
    const [socket, setSocket] = useState<null | Socket>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);


    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const socket = io(URL);
        socket.on('send-offer', async ({roomId}) => {
            console.log("sending offer");
            setLobby(false);
            const pc = new RTCPeerConnection();

            setSendingPc(pc);
            if (localVideoTrack) {
                console.error("added tack");
                console.log(localVideoTrack)
                pc.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                console.error("added tack");
                console.log(localAudioTrack)
                pc.addTrack(localAudioTrack)
            }

            pc.onicecandidate = async (e) => {
                console.log("receiving ice candidate locally");
                if (e.candidate) {
                   socket.emit("add-ice-candidate", {
                    candidate: e.candidate,
                    type: "sender",
                    roomId
                   })
                }
            }

            pc.onnegotiationneeded = async () => {
                console.log("on negotiation neeeded, sending offer");
                const sdp = await pc.createOffer();
                //@ts-ignore
                pc.setLocalDescription(sdp)
                socket.emit("offer", {
                    sdp,
                    roomId
                })
            }
        });

        socket.on("offer", async ({roomId, sdp: remoteSdp}) => {
            console.log("received offer");
            setLobby(false);
            const pc = new RTCPeerConnection();
            pc.setRemoteDescription(remoteSdp)
            const sdp = await pc.createAnswer();
            //@ts-ignore
            pc.setLocalDescription(sdp)
            const stream = new MediaStream();
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }

            setRemoteMediaStream(stream);
            // trickle ice 
            setReceivingPc(pc);
            window.pcr = pc;
            pc.ontrack = (e) => {
                alert("ontrack");
                // console.error("inside ontrack");
                // const {track, type} = e;
                // if (type == 'audio') {
                //     // setRemoteAudioTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // } else {
                //     // setRemoteVideoTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // }
                // //@ts-ignore
                // remoteVideoRef.current.play();
            }

            pc.onicecandidate = async (e) => {
                if (!e.candidate) {
                    return;
                }
                console.log("omn ice candidate on receiving seide");
                if (e.candidate) {
                   socket.emit("add-ice-candidate", {
                    candidate: e.candidate,
                    type: "receiver",
                    roomId
                   })
                }
            }

            socket.emit("answer", {
                roomId,
                sdp: sdp
            });
            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track
                const track2 = pc.getTransceivers()[1].receiver.track
                console.log(track1);
                if (track1.kind === "video") {
                    setRemoteAudioTrack(track2)
                    setRemoteVideoTrack(track1)
                } else {
                    setRemoteAudioTrack(track1)
                    setRemoteVideoTrack(track2)
                }
                //@ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track1)
                //@ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track2)
                //@ts-ignore
                remoteVideoRef.current.play();
                // if (type == 'audio') {
                //     // setRemoteAudioTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // } else {
                //     // setRemoteVideoTrack(track);
                //     // @ts-ignore
                //     remoteVideoRef.current.srcObject.addTrack(track)
                // }
                // //@ts-ignore
            }, 5000)
        });

        socket.on("answer", ({roomId, sdp: remoteSdp}) => {
            setLobby(false);
            setSendingPc(pc => {
                pc?.setRemoteDescription(remoteSdp)
                return pc;
            });
            console.log("loop closed");
        })

        socket.on("lobby", () => {
            setLobby(true);
        })

        socket.on("add-ice-candidate", ({candidate, type}) => {
            console.log("add ice candidate from remote");
            console.log({candidate, type})
            if (type == "sender") {
                setReceivingPc(pc => {
                    if (!pc) {
                        console.error("receicng pc nout found")
                    } else {
                        console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            } else {
                setSendingPc(pc => {
                    if (!pc) {
                        console.error("sending pc nout found")
                    } else {
                        // console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            }
        })

        setSocket(socket)
    }, [name])

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
                localVideoRef.current.play();
            }
        }
    }, [localVideoRef])

    const toggleMute = () => {
        if (localAudioTrack) {
            localAudioTrack.enabled = !localAudioTrack.enabled;
            setIsMuted(!localAudioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        if (localVideoTrack) {
            localVideoTrack.enabled = !localVideoTrack.enabled;
            setIsVideoOff(!localVideoTrack.enabled);
        }
    };

    const nextChat = () => {
        // Implement next chat logic - return to dashboard instead of logging out
        if (onLeaveChat) {
            onLeaveChat();
        } else {
            window.location.reload();
        }
    };

    const handleQuestionSelect = (question: string) => {
        // In a real implementation, you might want to:
        // 1. Display the question in a chat overlay
        // 2. Send it to the other person via socket
        // 3. Show it as a suggestion bubble
        
        // For now, we'll just log it and could show it in UI
        console.log("Selected question:", question);
        
        // You could add this to a state to display in the UI
        // setSelectedQuestion(question);
        
        // Or send via socket if you have chat functionality
        // socket?.emit('chat-message', { text: question, sender: name });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-white">Video Chat</h1>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white text-sm">
                                    {lobby ? "Waiting to connect..." : "Connected"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-white">Hi, {name}</span>
                            <button 
                                onClick={nextChat}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Next Chat
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-4 sm:py-8">
                <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 max-w-7xl mx-auto">
                    {/* Remote Video */}
                    <div className="relative">
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
                            {lobby ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center px-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                        <p className="text-white text-lg sm:text-xl">Looking for someone to chat with...</p>
                                        <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
                                    </div>
                                </div>
                            ) : (
                                <video 
                                    autoPlay 
                                    ref={remoteVideoRef}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-white text-sm">Stranger</span>
                        </div>
                    </div>

                    {/* Local Video */}
                    <div className="relative">
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
                            <video 
                                autoPlay 
                                ref={localVideoRef}
                                className="w-full h-full object-cover"
                                muted
                            />
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-white text-sm">You</span>
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            {isMuted && (
                                <div className="bg-red-600 px-2 py-1 rounded-full">
                                    <span className="text-white text-xs">Muted</span>
                                </div>
                            )}
                            {isVideoOff && (
                                <div className="bg-red-600 px-2 py-1 rounded-full">
                                    <span className="text-white text-xs">Camera Off</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center mt-6 lg:mt-8">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 flex space-x-3 sm:space-x-4">
                        <button
                            onClick={toggleMute}
                            className={`p-3 sm:p-4 rounded-full transition-all ${
                                isMuted 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-white/20 hover:bg-white/30'
                            }`}
                        >
                            {isMuted ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>
                        
                        <button
                            onClick={toggleVideo}
                            className={`p-3 sm:p-4 rounded-full transition-all ${
                                isVideoOff 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-white/20 hover:bg-white/30'
                            }`}
                        >
                            {isVideoOff ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </button>
                        
                        <button
                            onClick={nextChat}
                            className="bg-red-600 hover:bg-red-700 p-3 sm:p-4 rounded-full transition-all"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
            
            {/* AI Features */}
            <AISuggestion onQuestionSelect={handleQuestionSelect} />
            <VoiceRecorder />
        </div>
    )
}

