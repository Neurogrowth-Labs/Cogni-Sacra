import React from 'react';
import { Sparkles, Briefcase, BookOpen, BarChart3, Users, Network } from 'lucide-react';

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center transform hover:-translate-y-1.5 hover:shadow-[0_4px_30px_rgba(239,68,68,0.06)] hover:border-red-300 transition duration-300 flex flex-col items-center justify-between space-y-4 shadow-sm">
        <div className="flex items-center justify-center w-14 h-14 bg-red-55/80 text-red-600 border border-red-100 rounded-2xl">
            {icon}
        </div>
        <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">{children}</p>
        </div>
    </div>
);

const LandingServices: React.FC = () => {
    return (
        <div className="bg-white text-slate-900 font-sans antialiased pt-28">
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs uppercase tracking-widest text-red-600 font-black block">Structured Offerings</span>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Solutions for Every Learner & Educator
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-slate-500 text-sm sm:text-base font-semibold">
                            CogniSacra™ delivers high-throughput tools engineered specifically to adapt to individuals, multi-campus instructors, and large sovereign institutions.
                        </p>
                    </div>

                    {/* For Learners */}
                    <div className="mt-20 space-y-8">
                        <h3 className="text-2xl sm:text-3xl font-black text-center text-slate-900 font-sans tracking-wide">For Learners</h3>
                        <div className="grid gap-8 md:grid-cols-2">
                            <ServiceCard icon={<Sparkles size={24} />} title="Personalized Learning Paths">
                                Our offline companions analyze conceptual checkpoints to dynamically deliver curriculum materials, ensuring fast mastery without buffering.
                            </ServiceCard>
                            <ServiceCard icon={<Briefcase size={24} />} title="Sovereign Career Matches">
                                Port clean credentials directly to validated corporate nodes, bypassing recruitment bottlenecks and unlocking scholarship grants.
                            </ServiceCard>
                        </div>
                    </div>

                     {/* For Instructors */}
                    <div className="mt-24 space-y-8">
                        <h3 className="text-2xl sm:text-3xl font-black text-center text-slate-900 font-sans tracking-wide">For Instructors</h3>
                        <div className="grid gap-8 md:grid-cols-2">
                            <ServiceCard icon={<BookOpen size={24} />} title="AI-Assisted Curriculum Design">
                                Brainstorm syllabus outlines, generate student quizzes, and map course codes to international matrices instantly.
                            </ServiceCard>
                             <ServiceCard icon={<BarChart3 size={24} />} title="Department Drift Audits">
                                Keep complete sync between virtual campuses, approve lecturing hours, and split course earnings to mobile business wallets.
                            </ServiceCard>
                        </div>
                    </div>

                    {/* For Institutions */}
                    <div className="mt-24 space-y-8">
                        <h3 className="text-2xl sm:text-3xl font-black text-center text-slate-900 font-sans tracking-wide">For Institutions</h3>
                        <div className="grid gap-8 md:grid-cols-2">
                            <ServiceCard icon={<Users size={24} />} title="Multi-Campus Command and Control">
                                Chancellor offices manage global registration registries, secure server configurations, and issue certificates.
                            </ServiceCard>
                             <ServiceCard icon={<Network size={24} />} title="Accreditation Reporting Systems">
                                Compile real-time attendance, graduation indices, and citation logs to push directly to state ministry auditors.
                            </ServiceCard>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default LandingServices;
