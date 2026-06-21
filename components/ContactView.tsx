
import React from 'react';
import EnvelopeIcon from './icons/EnvelopeIcon';
import PhoneIcon from './icons/PhoneIcon';

const ContactView: React.FC = () => {
    return (
         <div className="max-w-4xl mx-auto animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-serif">Get in Touch</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">We'd love to hear from you. Please don't hesitate to reach out.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" id="name" required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input type="email" id="email" required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                        <textarea id="message" rows={5} required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full py-3 px-4 bg-crimson text-white font-bold rounded-lg hover:bg-red-800 transition-transform hover:scale-105 shadow-lg">
                            Send Message
                        </button>
                    </div>
                </form>
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="flex items-start">
                        <EnvelopeIcon className="w-6 h-6 mr-4 text-crimson flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">General Inquiries</h3>
                            <a href="mailto:support@cognisacra.edu" className="text-blue-600 dark:text-blue-400 hover:underline">support@cognisacra.edu</a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <EnvelopeIcon className="w-6 h-6 mr-4 text-crimson flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Admissions</h3>
                            <a href="mailto:admissions@cognisacra.edu" className="text-blue-600 dark:text-blue-400 hover:underline">admissions@cognisacra.edu</a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <PhoneIcon className="w-6 h-6 mr-4 text-crimson flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Phone Support</h3>
                            <a href="tel:+15551234567" className="text-blue-600 dark:text-blue-400 hover:underline">+1 (555) 123-4567</a>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 9am - 5pm EST</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactView;
