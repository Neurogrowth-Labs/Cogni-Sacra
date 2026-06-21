
import React from 'react';

const DataPolicyView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif mb-6">Data Policy</h1>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                <h2 className="text-2xl font-bold font-serif pt-4">1. Introduction</h2>
                <p>Welcome to CogniSacra Academy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
                
                <h2 className="text-2xl font-bold font-serif pt-4">2. What Information Do We Collect?</h2>
                <p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.</p>

                <h2 className="text-2xl font-bold font-serif pt-4">3. How Do We Use Your Information?</h2>
                <p>We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                
                <h2 className="text-2xl font-bold font-serif pt-4">4. Will Your Information Be Shared With Anyone?</h2>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
            </div>
        </div>
    );
};

export default DataPolicyView;
