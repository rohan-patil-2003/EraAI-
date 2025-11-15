import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Menu, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Smile,
  Image,
  Mic,
  Check,
  CheckCheck
} from 'lucide-react';
function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How can I help you today?",
      sender: "incoming",
      time: "10:30 AM",
      status: "read"
    },
    {
      id: 2,
      text: "Hi! I need help with my project",
      sender: "outgoing",
      time: "10:31 AM",
      status: "read"
    },
    {
      id: 3,
      text: "Of course! What kind of project are you working on?",
      sender: "incoming",
      time: "10:31 AM",
      status: "read"
    },
    {
      id: 4,
      text: "I'm building a chat application with React and need some design inspiration",
      sender: "outgoing",
      time: "10:32 AM",
      status: "delivered"
    },
    {
      id: 5,
      text: "That's great! I can definitely help you with that. What specific aspects are you looking for?",
      sender: "incoming",
      time: "10:33 AM",
      status: "read"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👏', '🎉', '❤️', '🔥', '✨', '💯', '🙌', '👋', '😊', '😢', '😭', '😡', '🤗', '😜', '🤩', '😇', '🥳', '😴'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "outgoing",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate incoming response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm processing your request...",
        sender: "incoming",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: "read"
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMessage = {
        id: messages.length + 1,
        text: `📎 ${file.name}`,
        sender: "outgoing",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        isAttachment: true
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage = {
          id: messages.length + 1,
          text: '🖼️ Image',
          sender: "outgoing",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: "sent",
          isImage: true,
          imageUrl: event.target.result,
          imageName: file.name
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const duration = recordingTime;
        
        const newMessage = {
          id: messages.length + 1,
          text: `🎤 Voice message (${duration}s)`,
          sender: "outgoing",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: "sent",
          isAudio: true
        };
        setMessages(prev => [...prev, newMessage]);
        
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      alert('Microphone access denied. Please allow microphone access to record audio.');
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="lg:hidden">
              <Menu size={24} />
            </button>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-xl flex-shrink-0">
              EA
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg truncate">EraAI Assistant</h1>
              <p className="text-xs sm:text-sm text-indigo-100">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition hidden sm:block">
              <Search size={20} />
            </button>
            <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition hidden sm:block">
              <Phone size={20} />
            </button>
            <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition hidden sm:block">
              <Video size={20} />
            </button>
            <button className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Date Divider */}
          <div className="flex items-center justify-center">
            <div className="bg-white px-4 py-1.5 rounded-full shadow-sm text-xs sm:text-sm text-gray-600">
              Today
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'outgoing' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${message.sender === 'outgoing' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.sender === 'incoming' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    EA
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl shadow-md ${
                      message.sender === 'outgoing'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md'
                    } ${message.isImage ? 'p-1' : 'px-4 py-2.5 sm:px-5 sm:py-3'}`}
                  >
                    {message.isImage ? (
                      <div className="space-y-2">
                        <img 
                          src={message.imageUrl} 
                          alt={message.imageName}
                          className="rounded-xl max-w-full h-auto max-h-64 object-cover"
                        />
                        <p className={`text-xs px-3 pb-2 ${message.sender === 'outgoing' ? 'text-indigo-100' : 'text-gray-600'}`}>
                          {message.imageName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed break-words">
                        {message.text}
                      </p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 px-2 ${message.sender === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">{message.time}</span>
                    {message.sender === 'outgoing' && (
                      <span className="text-indigo-600">
                        {message.status === 'read' ? (
                          <CheckCheck size={14} />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck size={14} className="text-gray-400" />
                        ) : (
                          <Check size={14} className="text-gray-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  EA
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Recording Indicator */}
          {isRecording && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-700">Recording... {formatTime(recordingTime)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelRecording}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={stopRecording}
                  className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 sm:gap-3">
            {/* Emoji Button */}
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition flex-shrink-0"
              >
                <Smile size={22} />
              </button>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 w-64 sm:w-80 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Emojis</span>
                    <button 
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl hover:bg-indigo-50 rounded-lg p-2 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Attachment Button */}
            <button 
              onClick={handleAttachment}
              className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition flex-shrink-0"
            >
              <Paperclip size={22} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Text Input */}
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 sm:py-3 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows="1"
                disabled={isRecording}
                className="w-full bg-transparent outline-none resize-none text-sm sm:text-base text-gray-800 placeholder-gray-500 max-h-32 disabled:opacity-50"
                style={{ minHeight: '24px' }}
              />
            </div>

            {/* Image Button - Desktop only */}
            <button 
              onClick={handleImageClick}
              className="hidden sm:flex items-center justify-center w-10 h-10 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition flex-shrink-0"
            >
              <Image size={22} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Send/Voice Button */}
            {inputMessage.trim() ? (
              <button 
                onClick={handleSendMessage}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition flex-shrink-0"
              >
                <Send size={20} />
              </button>
            ) : (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full hover:shadow-lg hover:scale-105 transition flex-shrink-0 ${
                  isRecording 
                    ? 'bg-red-600 animate-pulse' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                } text-white`}
              >
                <Mic size={20} />
              </button>
            )}
          </div>
          
          {/* Quick Actions - Mobile */}
          <div className="flex sm:hidden items-center gap-4 mt-3 px-2">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600"
            >
              <Smile size={16} />
              <span>Emoji</span>
            </button>
            <button 
              onClick={handleImageClick}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600"
            >
              <Image size={16} />
              <span>Image</span>
            </button>
            {isRecording && (
              <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
export default App
