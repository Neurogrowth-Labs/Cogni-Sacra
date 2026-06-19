import React from 'react';
import { FullInstitutionData, Course } from '../types';
import UsersIcon from './icons/UsersIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import CertificateIcon from './icons/CertificateIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import StatCard from './shared/StatCard';
import BarChart from './shared/BarChart';
import DoughnutChart from './shared/DoughnutChart';
import InstitutionCourseCard from './InstitutionCourseCard';
import CheckIcon from './icons/CheckIcon';
import { Radio } from 'lucide-react';

interface InstitutionDashboardViewProps {
    institutionData: FullInstitutionData;
    onCreateCourse: () => void;
    onEditCourse: (course: Course) => void;
    onViewCourse: (course: Course) => void;
    subscriptionPlan: string | null;
}

const InstitutionDashboardView: React.FC<InstitutionDashboardViewProps> = ({ 
    institutionData, 
    onCreateCourse, 
    onEditCourse, 
    onViewCourse, 
    subscriptionPlan
}) => {
    const { name, analytics, courses } = institutionData;

    // Prepare data for charts
    const departmentData = analytics.demographicsByDepartment?.map(d => ({ label: d.department, value: d.count })) || [];
    const regionData = analytics.demographicsByRegion?.map(d => ({ label: d.region, value: d.count })) || [];
    const ageData = analytics.demographicsByAge?.map(d => ({ label: d.ageGroup, value: d.count })) || [];
    const progressData = analytics.progressDistribution.map(p => ({ label: p.status, value: p.count }));

    const revenueByCourseData = analytics.revenueByCourse?.map(r => {
        const course = courses.find(c => c.id === r.courseId);
        return {
            label: course?.title || 'Unknown Course',
            value: r.revenue,
        }
    }) || [];

    // Colors for charts
    const ageColors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6'];
    const progressColors = ['#10B981', '#F59E0B', '#EF4444']; // Completed, In Progress, Not Started

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Welcome, {name}</p>
                 {subscriptionPlan && (
                    <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                        <CheckIcon className="w-5 h-5" />
                        <span>Active Plan: {subscriptionPlan}</span>
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    icon={<UsersIcon className="w-6 h-6 text-blue-800 dark:text-blue-200" />}
                    label="Total Learners"
                    value={analytics.totalLearners.toLocaleString()}
                    color="bg-blue-100 dark:bg-blue-900/50"
                />
                <StatCard
                    icon={<BookOpenIcon className="w-6 h-6 text-green-800 dark:text-green-200" />}
                    label="Active Courses"
                    value={analytics.activeCourses.toLocaleString()}
                    color="bg-green-100 dark:bg-green-900/50"
                />
                <StatCard
                    icon={<CertificateIcon className="w-6 h-6 text-amber-800 dark:text-amber-200" />}
                    label="Certificates Issued"
                    value={analytics.certificatesIssued.toLocaleString()}
                    color="bg-amber-100 dark:bg-amber-900/50"
                />
                <StatCard
                    icon={<BriefcaseIcon className="w-6 h-6 text-indigo-800 dark:text-indigo-200" />}
                    label="Learners Placed"
                    value={analytics.learnersPlacedInJobs.toLocaleString()}
                    color="bg-indigo-100 dark:bg-indigo-900/50"
                />
                {analytics.totalRevenue && (
                    <StatCard
                        icon={<CurrencyDollarIcon className="w-6 h-6 text-pink-800 dark:text-pink-200" />}
                        label="Total Revenue"
                        value={`$${analytics.totalRevenue.toLocaleString()}`}
                        color="bg-pink-100 dark:bg-pink-900/50"
                    />
                )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart
                    title="Revenue by Course"
                    data={revenueByCourseData}
                    color="bg-blue-500"
                />
                <DoughnutChart
                    title="Learner Progress Distribution"
                    data={progressData}
                    colors={progressColors}
                />
            </div>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-8"></div>

            {/* Course Management Section */}
            <div>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-serif">Course Management</h2>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your institution's course catalog.</p>
                    </div>
                    <button onClick={onCreateCourse} className="px-6 py-3 font-semibold text-white bg-crimson rounded-full hover:bg-red-800 shadow-lg transition-transform hover:scale-105 self-start md:self-center">
                        Create New Course
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map(course => (
                        <InstitutionCourseCard
                            key={course.id}
                            course={course}
                            onEdit={() => onEditCourse(course)}
                            onView={() => onViewCourse(course)}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default InstitutionDashboardView;