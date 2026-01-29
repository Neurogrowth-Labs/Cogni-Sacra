import React from 'react';
import { teamMembers } from '../../constants';

const TeamMemberCard: React.FC<{ name: string; title: string; avatarUrl: string; }> = ({ name, title, avatarUrl }) => (
    <div className="text-center">
        <img className="mx-auto h-32 w-32 rounded-full object-cover" src={avatarUrl} alt={name} />
        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
        <p className="mt-1 text-md text-crimson dark:text-red-400 font-semibold">{title}</p>
    </div>
);

const LandingAbout: React.FC = () => {
    return (
        <div className="pt-16">
            {/* Page Header */}
            <section className="py-20 bg-white dark:bg-gray-800/50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-serif">
                        Our Mission is to Make Quality Education Accessible to All
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                        Cogni-Sacra is a next-generation online education platform dedicated to delivering world-class digital learning experiences. We believe that education should be accessible, engaging, and personalized for everyone, everywhere.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 lg:py-24">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white font-serif">Our Story</h2>
                    </div>
                     <div className="mt-12 max-w-3xl mx-auto">
                        <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                            Founded in 2024 by a team of passionate educators and technologists, Cogni-Sacra was born from a simple idea: learning should adapt to the individual, not the other way around. We saw the potential of AI to create truly personalized educational experiences and set out to build a platform that empowers both learners and instructors. From a small prototype to a global community, our focus has always been on harnessing technology to unlock human potential.
                        </p>
                    </div>
                 </div>
            </section>

            {/* Our Team */}
            <section className="py-20 lg:py-24 bg-white dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white font-serif">Meet the Team</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                            The passionate minds behind Cogni-Sacra, dedicated to revolutionizing education.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map(member => (
                            <TeamMemberCard key={member.name} {...member} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingAbout;
