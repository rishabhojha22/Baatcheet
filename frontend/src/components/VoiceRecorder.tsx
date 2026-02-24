import { useState, useRef, useEffect } from 'react';

interface ConversationFeedback {
  overall_score: number;
  strengths: string[];
  improvements: string[];
  conversation_quality: string;
  speaking_time: number;
  word_count: number;
}

interface VoiceRecorderProps {
  onFeedbackGenerated?: (feedback: ConversationFeedback) => void;
  isRecording?: boolean;
  onRecordingComplete?: (transcript: string) => void;
}

export const VoiceRecorder = ({ 
  onFeedbackGenerated, 
  isRecording, 
  onRecordingComplete 
}: VoiceRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<ConversationFeedback | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected');
        }
      };
    }
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionGranted(false);
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      alert('Please allow microphone access to use this feature.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
        
        // Start speech recognition if available
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Speech recognition start error:', error);
          }
        }
      };

      mediaRecorder.start();
      setRecording(true);
      
      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Speech recognition start error:', error);
        }
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const analyzeConversation = async () => {
    if (!transcript.trim()) {
      alert('No conversation to analyze. Please record some audio first.');
      return;
    }

    setAnalyzing(true);
    
    try {
      // Call your backend API that uses Gemini
      const response = await fetch('http://localhost:3000/api/analyze-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript,
          context: 'video_chat_conversation'
        }),
      });

      if (response.ok) {
        const feedbackData = await response.json();
        setFeedback(feedbackData);
        setShowFeedback(true);
        onFeedbackGenerated?.(feedbackData);
      } else {
        throw new Error('Failed to analyze conversation');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze conversation. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetRecording = () => {
    setTranscript('');
    setFeedback(null);
    setShowFeedback(false);
  };

  // Auto-start/stop based on isRecording prop
  useEffect(() => {
    if (isRecording && !recording) {
      startRecording();
    } else if (!isRecording && recording) {
      stopRecording();
    }
  }, [isRecording]);

  return (
    <div className="fixed bottom-20 left-4 z-40">
      {/* Recording Control */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-3">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={analyzing}
            className={`p-3 rounded-full transition-all ${
              recording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700'
            } disabled:opacity-50`}
          >
            {recording ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="6" />
              </svg>
            )}
          </button>
          
          <div className="text-white">
            <p className="text-sm font-medium">
              {recording ? 'Recording...' : 'Voice Analysis'}
            </p>
            {recording && (
              <p className="text-xs text-gray-300">
                Conversation is being transcribed
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!recording && transcript && (
          <div className="flex space-x-2">
            <button
              onClick={analyzeConversation}
              disabled={analyzing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : 'Get Feedback'}
            </button>
            <button
              onClick={resetRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-all"
            >
              Reset
            </button>
          </div>
        )}

        {/* Transcript Preview */}
        {transcript && (
          <div className="mt-3 p-2 bg-white/5 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs text-gray-300 line-clamp-3">
              {transcript}
            </p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && feedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Conversation Feedback</h3>
            
            {/* Overall Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Overall Score</span>
                <span className="text-2xl font-bold text-purple-400">
                  {feedback.overall_score}/10
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${(feedback.overall_score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Speaking Time</p>
                <p className="text-white font-medium">{feedback.speaking_time}s</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Word Count</p>
                <p className="text-white font-medium">{feedback.word_count}</p>
              </div>
            </div>

            {/* Strengths */}
            {feedback.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="text-green-400 font-medium mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-yellow-400 font-medium mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-yellow-400 mr-2">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quality Assessment */}
            <div className="mb-4">
              <h4 className="text-purple-400 font-medium mb-2">Conversation Quality</h4>
              <p className="text-gray-300 text-sm">{feedback.conversation_quality}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowFeedback(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
