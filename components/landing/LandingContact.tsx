
import React from 'react';
import EnvelopeIcon from '../icons/EnvelopeIcon';
import PhoneIcon from '../icons/PhoneIcon';
import MapPinIcon from '../icons/MapPinIcon';

const HolographicMap = () => (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden rounded-lg group border border-gray-800">
        {/* Animated Grid with Perspective */}
        <div className="absolute inset-0 opacity-30" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px',
                 transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-10%)',
                 transformOrigin: 'bottom center'
             }}>
        </div>
        
        {/* Radar/Pulse Effect at Center representing Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
                {/* Ping Rings */}
                <div className="absolute w-24 h-24 border border-crimson/40 rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute w-40 h-40 border border-crimson/20 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
                
                {/* Center Dot */}
                <div className="relative w-4 h-4 bg-crimson rounded-full shadow-[0_0_20px_rgba(220,20,60,1)] z-10 animate-pulse">
                    <div className="absolute inset-0 bg-crimson rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Target Reticle */}
                <div className="absolute -top-10 -left-10 w-6 h-6 border-t-2 border-l-2 border-crimson/60 rounded-tl"></div>
                <div className="absolute -top-10 -right-10 w-6 h-6 border-t-2 border-r-2 border-crimson/60 rounded-tr"></div>
                <div className="absolute -bottom-10 -left-10 w-6 h-6 border-b-2 border-l-2 border-crimson/60 rounded-bl"></div>
                <div className="absolute -bottom-10 -right-10 w-6 h-6 border-b-2 border-r-2 border-crimson/60 rounded-br"></div>
            </div>
        </div>

        {/* Floating Data Particles */}
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
        <div className="absolute bottom-20 right-16 w-1 h-1 bg-blue-400 rounded-full animate-float [animation-delay:2s] opacity-70"></div>
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-50"></div>

        {/* Scanning Line Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/5 to-transparent h-[15%] w-full animate-scan pointer-events-none"></div>
        
        {/* Data HUD Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-lg max-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Signal Active</span>
            </div>
            <div className="font-mono text-[9px] text-gray-300 leading-tight">
                <span className="text-crimson">TARGET:</span> HQ_CAMBRIDGE<br/>
                <span className="text-gray-500">COORDS:</span> 42.3736° N, 71.1097° W<br/>
                <span className="text-gray-500">STATUS:</span> OPERATIONAL
            </div>
        </div>
    </div>
);

const LandingContact: React.FC = () => {
    return (
        <div className="pt-16">
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-serif">
                            Get in Touch
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            We'd love to hear from you. Please don't hesitate to reach out.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold font-serif mb-6">Send us a Message</h2>
                            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input type="text" id="name" required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm focus:border-crimson focus:ring-crimson" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input type="email" id="email" required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm focus:border-crimson focus:ring-crimson" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                    <textarea id="message" rows={5} required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm focus:border-crimson focus:ring-crimson"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full py-3 px-4 bg-crimson text-white font-bold rounded-lg hover:bg-red-800 transition-transform hover:scale-105 shadow-lg">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <EnvelopeIcon className="w-6 h-6 mr-4 text-crimson flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">General Inquiries</h3>
                                    <a href="mailto:support@cogni-sacra.edu" className="text-blue-600 dark:text-blue-400 hover:underline">support@cogni-sacra.edu</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <PhoneIcon className="w-6 h-6 mr-4 text-crimson flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Phone Support</h3>
                                    <a href="tel:+15551234567" className="text-blue-600 dark:text-blue-400 hover:underline">+1 (555) 123-4567</a>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 9am - 5pm EST</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPinIcon className="w-6 h-6 mr-4 text-crimson flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Our Office</h3>
                                    <p className="text-gray-600 dark:text-gray-400">123 Learning Lane, Cambridge, MA 02138</p>
                                </div>
                            </div>
                             <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
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
