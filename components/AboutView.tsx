
import React from 'react';
import CogniSacraLogo from './icons/IntelliLearnLogo';

const AboutView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
                <CogniSacraLogo className="w-20 h-20 mx-auto text-crimson" />
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white font-serif">About EmpowerAfriq Academy</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Learn Without Limits</p>
            </div>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <p>
                    EmpowerAfriq Academy is a next-generation online education platform dedicated to delivering world-class digital learning experiences. We believe that education should be accessible, engaging, and personalized for everyone, everywhere.
                </p>
                <p>
                    Our mission is to empower learners, educators, and institutions globally by combining cutting-edge UI/UX, AI-powered personalization, and a scalable, robust infrastructure. We strive to create a learning ecosystem where knowledge is not just consumed, but created, shared, and applied to solve real-world problems.
                </p>
                
                <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-800 dark:text-white mb-3">Our Core Values</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li><span className="font-semibold">Learner-Centricity:</span> Our learners are at the heart of everything we do. We design experiences that are intuitive, supportive, and tailored to individual needs and goals.</li>
                        <li><span className="font-semibold">Innovation with AI:</span> We leverage the power of artificial intelligence to create adaptive learning paths, provide instant support through our AI Tutor, and offer tools that help instructors build better courses faster.</li>
                        <li><span className="font-semibold">Accessibility:</span> We are committed to making education accessible to all, regardless of background or location, by offering a range of free and affordable courses and supporting multiple languages and accessibility standards.</li>
                        <li><span className="font-semibold">Community & Collaboration:</span> Learning is a social experience. We foster a vibrant community where students, mentors, and instructors can connect, collaborate, and grow together.</li>
                    </ul>
                </div>
                <p>
                    Join us on our journey to redefine education and unlock human potential.
                </p>
            </div>
        </div>
    );
};

export default AboutView;
