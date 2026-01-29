
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, UserRole } from '../types';
import { sendMessageToTutor, sendMessageToArchitect } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import UserIcon from './icons/UserIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

// FIX: Add minimal type definitions for the SpeechRecognition API to resolve 'Cannot find name 'SpeechRecognition'' error. The API is not yet part of standard TypeScript DOM typings.
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    start: () => void;
    stop: () => void;
}

// Extend the window object for the SpeechRecognition API
declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition };
        webkitSpeechRecognition: { new(): SpeechRecognition };
    }
}

interface AITutorViewProps {
    isEmbedded?: boolean;
    userRole?: UserRole;
}

const AITutorView: React.FC<AITutorViewProps> = ({ isEmbedded = false, userRole = 'learner' }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isArchitectMode = userRole === 'instructor';
    const title = isArchitectMode ? 'AI Architect' : 'AI Tutor';
    const placeholder = isListening ? "Listening..." : (isArchitectMode ? "Describe the course content you want to generate..." : "Ask me anything or use the mic...");
    const sendMessage = isArchitectMode ? sendMessageToArchitect : sendMessageToTutor;
    const initialMessage = isArchitectMode
        ? "Hello! I'm your AI Architect. I can help you brainstorm course ideas, create module outlines, generate quiz questions, and more. How can I help you build an amazing course today?"
        : "Hello! I'm EmpowerAfriq AI, your personal tutor. How can I help you today? Feel free to ask me about any topic, concept, or problem you're working on.";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setMessages([{ id: `ai-initial-${Date.now()}`, sender: 'ai', text: initialMessage }]);
    }, [initialMessage]);

    const handleSend = useCallback(async (messageText?: string) => {
        const textToSend = messageText || input;
        if (textToSend.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        if (!messageText) setInput('');
        setIsLoading(true);

        const aiMessageId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

        try {
            const stream = await sendMessage(textToSend);
            let aiResponseText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                aiResponseText += chunkText;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    newMessages[newMessages.length - 1] = { ...lastMessage, text: aiResponseText };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message to AI:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                 const lastMessage = newMessages[newMessages.length - 1];
                newMessages[newMessages.length - 1] = { ...lastMessage, text: 'Sorry, I encountered an error. Please try again.' };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, sendMessage]);
    
    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            const recognition = new SpeechRecognitionAPI();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('');
                setInput(transcript);

                if (event.results[0].isFinal) {
                    handleSend(transcript);
                }
            };
            
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
            
            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, [handleSend]);

    const handleVoiceInput = () => {
        if (!recognitionRef.current) return;
        
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInput('');
            recognitionRef.current.start();
        }
    };

    const architectPrompts = [
        "Create a 5-lesson module outline for 'Introduction to Python'",
        "Generate 3 multiple-choice quiz questions about React hooks",
        "Suggest a project-based assignment for a UX design course",
        "Draft a compelling course description for 'Modern JavaScript'",
    ];

    return (
        <div className={isEmbedded ? "flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700" : "flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"}>
            {!isEmbedded && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                        <SparklesIcon className="w-8 h-8 text-crimson" />
                        <h1 className="text-xl font-bold ml-3 text-gray-800 dark:text-white font-serif">{title}</h1>
                    </div>
                </div>
            )}

            <div className="flex-1 p-6 overflow-y-auto space-y-6" aria-live="polite">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-10 h-10 rounded-full bg-crimson flex items-center justify-center flex-shrink-0">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className={`max-w-md p-4 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-crimson text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                            }`}>
                            <p className="whitespace-pre-wrap">{msg.text || '...'}</p>
                        </div>
                         {msg.sender === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                            </div>
                        )}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                 {isArchitectMode && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {architectPrompts.map((prompt, i) => (
                            <button key={i} onClick={() => handleSend(prompt)} disabled={isLoading} className="px-3 py-1 text-sm bg-crimson/10 text-crimson rounded-full hover:bg-crimson/20 dark:bg-crimson/20 dark:text-red-100 dark:hover:bg-crimson/30">
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={placeholder}
                        className="w-full pl-4 pr-32 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-crimson resize-none"
                        rows={1}
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        <button
                            onClick={handleVoiceInput}
                            disabled={!recognitionRef.current}
                            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300'} disabled:opacity-50`}
                             aria-label={isListening ? "Stop listening" : "Start voice input"}
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                        </button>
                         <button
                            onClick={() => handleSend()}
                            disabled={isLoading || input.trim() === ''}
                            className="px-4 py-2 bg-crimson text-white rounded-full font-semibold hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                             aria-label="Send message"
                        >
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AITutorView;
