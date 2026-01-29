
import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import ChartBarIcon from '../icons/ChartBarIcon';
import UsersIcon from '../icons/UsersIcon';

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="flex items-center justify-center w-16 h-16 bg-crimson/10 text-crimson rounded-xl mb-6 mx-auto">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-serif mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{children}</p>
    </div>
);

const LandingServices: React.FC = () => {
    return (
        <div className="pt-16">
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-serif">
                            Solutions for Every Learner & Educator
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                            EmpowerAfriq Academy offers a suite of powerful tools and features tailored to the unique needs of individuals, instructors, and large institutions.
                        </p>
                    </div>

                    {/* For Learners */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white font-serif mb-10">For Learners</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <ServiceCard icon={<SparklesIcon className="w-8 h-8" />} title="Personalized Learning Paths">
                                Our AI analyzes your goals and progress to build a custom curriculum just for you, ensuring you learn what matters most, faster.
                            </ServiceCard>
                            <ServiceCard icon={<BriefcaseIcon className="w-8 h-8" />} title="Career-Focused Outcomes">
                                Go beyond theory. Our Career Hub connects your new skills with real job opportunities, helping you land your dream role.
                            </ServiceCard>
                        </div>
                    </div>

                     {/* For Instructors */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white font-serif mb-10">For Instructors</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <ServiceCard icon={<BookOpenIcon className="w-8 h-8" />} title="AI-Powered Course Creation">
                                Use our AI Architect to brainstorm ideas, generate quizzes, and build engaging course content in a fraction of the time.
                            </ServiceCard>
                             <ServiceCard icon={<ChartBarIcon className="w-8 h-8" />} title="Actionable Analytics">
                                Understand your students' progress with detailed analytics, identify areas for improvement, and optimize your teaching.
                            </ServiceCard>
                        </div>
                    </div>

                    {/* For Institutions */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white font-serif mb-10">For Institutions</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <ServiceCard icon={<UsersIcon className="w-8 h-8" />} title="Team Management & Reporting">
                                Manage learners, assign courses, and track your organization's skill development with a powerful, centralized dashboard.
                            </ServiceCard>
                             <ServiceCard icon={<ChartBarIcon className="w-8 h-8" />} title="Enterprise-Scale Analytics">
                                Gain deep insights into your workforce's learning trends, measure ROI, and make data-driven decisions about your training programs.
                            </ServiceCard>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default LandingServices;
