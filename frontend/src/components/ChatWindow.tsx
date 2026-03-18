import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Minus, X, ChevronDown, Mic, ImageIcon, Sticker, ThumbsUp, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ChatWindow() {
    const { isChatOpen, activeChatProduct, closeChat } = useStore();
    const [message, setMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);

    const predefinedOptions = [
        "Good morning, is this still available?",
        "Is the price negotiable?",
        "Can I see more photos?",
        "Where are you located?"
    ];

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        setMessageHistory(prev => [...prev, text]);
        setMessage('');
    };

    // Provide safe defaults to prevent null checks if closed abruptly
    if (!isChatOpen || !activeChatProduct) return null;

    if (isMinimized) {
        return (
            <div className="fixed bottom-0 right-8 md:right-24 w-72 bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border border-gray-200 z-[9999] overflow-hidden translate-y-1 cursor-pointer hover:bg-gray-50 flex items-center justify-between px-4 py-3 transition-colors"
                onClick={() => setIsMinimized(false)}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-inner">
                        {activeChatProduct.seller_name?.[0] || 'S'}
                    </div>
                    <span className="font-semibold text-sm truncate max-w-[150px] text-gray-900">
                        {activeChatProduct.seller_name}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <button onClick={(e) => { e.stopPropagation(); closeChat(); }} className="hover:bg-gray-200 hover:text-gray-900 p-1 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 right-4 md:right-24 w-[360px] bg-white rounded-t-xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border border-gray-200 z-[9999] flex flex-col h-[520px] transition-transform animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white rounded-t-xl shadow-sm z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-inner relative">
                        {activeChatProduct.seller_name?.[0] || 'S'}
                        {/* Active dot */}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col cursor-pointer group">
                        <div className="flex items-center gap-1 font-bold text-[15px] leading-tight text-gray-900 group-hover:underline">
                            <span className="truncate max-w-[140px]">{activeChatProduct.seller_name}</span>
                            <span className="text-gray-400 font-normal">·</span>
                            <span className="truncate max-w-[60px]">{activeChatProduct.title}</span>
                            <ChevronDown size={14} className="text-gray-400 ml-0.5" />
                        </div>
                        <span className="text-[11px] text-gray-500">Active now</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <button onClick={() => setIsMinimized(true)} className="hover:bg-gray-100 hover:text-gray-600 p-1.5 rounded-full transition-colors">
                        <Minus size={20} />
                    </button>
                    <button onClick={closeChat} className="hover:bg-gray-100 hover:text-gray-600 p-1.5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Context Card */}
            <div className="p-3 border-b border-gray-100 flex flex-col gap-2.5 bg-[#f8f9fa]">
                <div className="flex items-start gap-3">
                    <img src={activeChatProduct.image_url} alt="" className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-200 bg-white" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium mb-0.5 uppercase tracking-wider">Marketplace</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                            {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(activeChatProduct.price)} - {activeChatProduct.title}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link to={`/item/${activeChatProduct.id}`} onClick={() => setIsMinimized(true)} className="flex-1 bg-gray-200/80 hover:bg-gray-300/80 text-gray-900 text-[13px] font-bold py-1.5 rounded-lg text-center transition-colors">
                        See details
                    </Link>
                    <button className="flex-1 bg-gray-200/80 hover:bg-gray-300/80 text-gray-900 text-[13px] font-bold py-1.5 rounded-lg transition-colors">
                        More options
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-white">
                <div className="flex flex-col items-center justify-center mt-4 mb-8 text-center">
                    <div className="w-[72px] h-[72px] rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold mb-3 shadow-md relative">
                        {activeChatProduct.seller_name?.[0] || 'S'}
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{activeChatProduct.seller_name}</h3>
                    <p className="text-[13px] text-gray-500 mt-2">
                        You started this chat. <Link to={`/seller/${activeChatProduct.seller_id}`} className="text-blue-600 font-semibold hover:underline">View seller profile</Link>
                    </p>
                </div>

                {/* Predefined Options */}
                {messageHistory.length === 0 && (
                    <div className="flex flex-col gap-2 mt-auto pb-2">
                        {predefinedOptions.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(opt)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2.5 rounded-2xl text-[14px] font-medium text-left transition-colors self-end max-w-[85%] shadow-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Message History */}
                {messageHistory.map((msg, idx) => (
                    <div key={idx} className="flex flex-col gap-1 items-end mt-2">
                        <div className="bg-blue-600 text-white px-3.5 py-2.5 rounded-[18px] rounded-br-sm max-w-[85%] text-[15px] shadow-sm leading-snug">
                            {msg}
                        </div>
                        {idx === messageHistory.length - 1 && (
                            <span className="text-[11px] text-gray-400 mr-1">Delivered</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <div className="flex gap-2 text-blue-600">
                    <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Mic size={20} /></button>
                    <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors hidden sm:block"><ImageIcon size={20} /></button>
                    <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors hidden sm:block"><Sticker size={20} /></button>
                    <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors font-bold text-[10px] uppercase items-center justify-center hidden sm:flex h-[32px] w-[32px]">GIF</button>
                </div>
                <div className="flex-1 bg-[#f0f2f5] rounded-full flex items-center px-3.5 py-2">
                    <input
                        type="text"
                        placeholder="Aa"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-[15px] placeholder-gray-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(message);
                            }
                        }}
                    />
                </div>
                <div className="text-blue-600">
                    <button className="hover:bg-blue-50 p-1.5 rounded-full transition-colors" onClick={() => handleSendMessage(message)}>
                        {message.trim() ? <Send size={20} /> : <ThumbsUp size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
