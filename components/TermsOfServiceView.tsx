import React from 'react';

const TermsOfServiceView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif mb-6">Terms of Service</h1>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                 <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                <h2 className="text-2xl font-bold font-serif pt-4">1. Agreement to Terms</h2>
                <p>By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the Services. These terms affect your legal rights and obligations, so please read them carefully.</p>

                <h2 className="text-2xl font-bold font-serif pt-4">2. Your Account</h2>
                <p>You may need to create an account to use some of our Services. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>

                <h2 className="text-2xl font-bold font-serif pt-4">3. Content on the Services</h2>
                <p>You are responsible for your use of the Services and for any Content you provide, including compliance with applicable laws, rules, and regulations. You should only provide Content that you are comfortable sharing with others.</p>
                
                <h2 className="text-2xl font-bold font-serif pt-4">4. Prohibited Conduct</h2>
                <p>You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the Services in any medium, including without limitation by any automated or non-automated “scraping”; (ii) using any automated system, including without limitation “robots,” “spiders,” “offline readers,” etc., to access the Services in a manner that sends more request messages to the servers than a human can reasonably produce in the same period of time by using a conventional on-line web browser.</p>
            </div>
        </div>
    );
};

export default TermsOfServiceView;
