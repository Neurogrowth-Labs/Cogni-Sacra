import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle } from 'lucide-react';

const HolographicMap = () => (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-3xl group border border-slate-200">
        {/* Animated Grid with Perspective (Red) */}
        <div className="absolute inset-0 opacity-25" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.15) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px',
                 transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-10%)',
                 transformOrigin: 'bottom center'
             }}>
        </div>
        
        {/* Radar/Pulse Effect at Center representing Location (Red) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
                {/* Ping Rings */}
                <div className="absolute w-24 h-24 border border-red-500/40 rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute w-40 h-40 border border-red-500/20 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
                
                {/* Center Dot */}
                <div className="relative w-4 h-4 bg-red-650 rounded-full shadow-[0_0_20px_rgba(220,38,38,1)] z-10 animate-pulse">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Target Reticle */}
                <div className="absolute -top-10 -left-10 w-6 h-6 border-t-2 border-l-2 border-red-550/65 rounded-tl"></div>
                <div className="absolute -top-10 -right-10 w-6 h-6 border-t-2 border-r-2 border-red-550/65 rounded-tr"></div>
                <div className="absolute -bottom-10 -left-10 w-6 h-6 border-b-2 border-l-2 border-red-550/65 rounded-bl"></div>
                <div className="absolute -bottom-10 -right-10 w-6 h-6 border-b-2 border-r-2 border-red-550/65 rounded-br"></div>
            </div>
        </div>

        {/* Floating Data Particles */}
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-red-500 rounded-full animate-float shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        <div className="absolute bottom-20 right-16 w-1 h-1 bg-red-400 rounded-full animate-float [animation-delay:2s] opacity-70"></div>
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-50"></div>

        {/* Scanning Line Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-[15%] w-full animate-scan pointer-events-none"></div>
        
        {/* Data HUD Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl max-w-[220px]">
            <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black tracking-widest uppercase text-white">Sovereignty Signal: ACTIVE</span>
            </div>
            <div className="font-mono text-[9px] text-slate-450 leading-tight">
                <span className="text-red-500">ANCHOR:</span> COGNISACRA_HQ<br/>
                <span className="text-slate-450">LOC:</span> Nairobi Hub / Cape Town<br/>
                <span className="text-slate-500">GPS:</span> 1.2921° S, 36.8219° E
            </div>
        </div>
    </div>
);

const LandingContact: React.FC = () => {
    const [isSent, setIsSent] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSent(true);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-white text-slate-900 font-sans antialiased pt-28">
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs uppercase tracking-widest text-red-658 font-black block">Direct Routing</span>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Get in Touch
                        </h1>
                        <p className="mt-4 text-slate-550 text-sm sm:text-base font-semibold max-w-2xl mx-auto">
                            Connect directly with our registry directorates, systems architects, or commercial onboarding divisions.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                        
                        {/* Contact Form */}
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                            <h2 className="text-xl font-bold font-sans text-slate-900 mb-6 uppercase tracking-wider">
                                Send us a Message
                            </h2>
                            
                            {isSent ? (
                                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl space-y-4 text-center">
                                    <div className="p-3 bg-green-100 text-green-650 rounded-full w-fit mx-auto animate-bounce">
                                        <CheckCircle size={30} />
                                    </div>
                                    <h4 className="text-base font-black text-slate-900">Transmission Successful</h4>
                                    <p className="text-xs text-slate-505 leading-relaxed font-semibold">
                                        Your request has been cryptographically signed and uplinked to the Nairobi Sovereign Node. A regional director will respond within 4 hours.
                                    </p>
                                    <button
                                        onClick={() => setIsSent(false)}
                                        className="text-xs text-red-600 hover:underline font-extrabold"
                                    >
                                        Send another transmission
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1.5 col-span-1">
                                        <label htmlFor="name" className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Full Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            required 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full text-xs font-semibold px-4 py-3.5 border rounded-xl border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-red-550 transition shadow-sm" 
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-1">
                                        <label htmlFor="email" className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            required 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full text-xs font-semibold px-4 py-3.5 border rounded-xl border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-red-550 transition shadow-sm" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="message" className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Request Body</label>
                                        <textarea 
                                            id="message" 
                                            rows={5} 
                                            required 
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            className="w-full text-xs font-semibold px-4 py-3 border rounded-xl border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-red-550 transition shadow-sm"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-rose-550 hover:from-rose-550 hover:to-red-650 text-white text-xs font-black uppercase tracking-widest rounded-xl transition duration-300">
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mr-4 text-red-600">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">Sovereign Registry</h3>
                                        <a href="mailto:support@cognisacra.org" className="text-xs text-red-600 font-mono hover:underline">support@cognisacra.org</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mr-4 text-red-600">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">Direct Chancellor line</h3>
                                        <a href="tel:+25420123456" className="text-xs text-slate-700 hover:underline font-mono">+254 (20) 123-456</a>
                                        <p className="text-[9px] text-slate-400 font-semibold">Available Mon-Fri, 9am - 5pm EAT</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mr-4 text-red-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">Registered Address</h3>
                                        <p className="text-xs text-slate-600 font-semibold">12 Kilimani Rise, Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-200">
                                <HolographicMap />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingContact;
