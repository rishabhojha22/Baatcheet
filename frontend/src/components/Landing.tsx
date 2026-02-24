import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";

interface User {
  id: string;
  username: string;
  email: string;
}

interface LandingProps {
  authenticatedUser?: User;
  token?: string;
}

export const Landing = ({ authenticatedUser, token }: LandingProps = {}) => {
  const [name, setName] = useState(authenticatedUser?.username || "");
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [joined, setJoined] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const getCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  useEffect(() => {
    getCam();

    return () => {
      localAudioTrack?.stop();
      localVideoTrack?.stop();
    };
  }, []);

  // 🔥 IMPORTANT: Check joined FIRST
  if (joined) {
    return (
      <Room
        name={name}
        localAudioTrack={localAudioTrack}
        localVideoTrack={localVideoTrack}
        onLeaveChat={() => setJoined(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            {authenticatedUser ? `Welcome back, ${authenticatedUser.username}!` : "Video Chat"}
          </h1>
          <p className="text-xl text-gray-300">
            {authenticatedUser
              ? "Ready to start video chatting?"
              : "Connect with strangers around the world"}
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Video Preview */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                ref={videoRef}
                className="w-full h-96 object-cover"
                muted
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-sm">Your camera preview</p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
              {authenticatedUser ? (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Start Chatting
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-gray-300 text-sm mb-2">Logged in as:</p>
                      <p className="text-white font-medium">
                        {authenticatedUser.email}
                      </p>
                    </div>

                    <button
                      onClick={() => setJoined(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transition"
                    >
                      Enter Video Chat
                    </button>

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.reload();
                      }}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Ready to chat?
                  </h2>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 mb-6 bg-white/20 border border-white/30 rounded-lg text-white"
                  />

                  <button
                    onClick={() => setJoined(true)}
                    disabled={!name.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
                  >
                    Start Chatting
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="text-3xl mb-4">🎥</div>
                <h3 className="text-lg font-semibold text-white mb-2">HD Video</h3>
                <p className="text-gray-300 text-sm">Crystal clear video quality</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
                <p className="text-gray-300 text-sm">Your privacy is protected</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast</h3>
                <p className="text-gray-300 text-sm">Instant connections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};