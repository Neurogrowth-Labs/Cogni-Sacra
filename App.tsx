
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Course, Lesson, Job, UserProfile, UserSettings, FullInstitutionData, InstructorSettings, UserRole } from './types';
import { courses as initialCourses, userProfile as initialUserProfile, recommendedJobs, instructorCourses as initialInstructorCourses, fullInstitutionData as initialInstitutionData, userSettings as initialUserSettings, initialInstructorSettings, seekingMentorshipLearners, mentorshipMeetings, instructorSubscriptionTiers, institutionSubscriptionTiers } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CourseDetailView from './components/CourseDetailView';
import AITutorView from './components/AITutorView';
import ProfileView from './components/ProfileView';
import ProfileEditingView from './components/ProfileEditingView';
import JobBoardView from './components/JobBoardView';
import AdaptiveQuizView from './components/AdaptiveQuizView';
import InstructorDashboardView from './components/InstructorDashboardView';
import CourseBuilderView from './components/CourseBuilderView';
import SplashScreen from './components/onboarding/SplashScreen';
import LoginView from './components/onboarding/LoginView';
import RoleSelectionView from './components/onboarding/RoleSelectionView';
import PersonalizationView from './components/onboarding/PersonalizationView';
import WelcomeAssistantView from './components/onboarding/WelcomeAssistantView';
import CourseLandingPage from './components/CourseLandingPage';
import LearningView from './components/LearningView';
import LessonCompletionModal from './components/LessonCompletionModal';
import InstructorAnalyticsView from './components/InstructorAnalyticsView';
import InstitutionDashboardView from './components/InstitutionDashboardView';
import CommunityHubView from './components/CommunityHubView';
import VRClassroomView from './components/VRClassroomView';
import ApplicationModal from './components/ApplicationModal';
import InstitutionLearnersView from './components/InstitutionLearnersView';
import InstitutionSettingsView from './components/InstitutionSettingsView';
import InstitutionProfileView from './components/InstitutionProfileView';
import InstitutionProfileEditingView from './components/InstitutionProfileEditingView';
import ProjectSubmissionView from './components/ProjectSubmissionView';
import CalendarView from './components/CalendarView';
import ProfileSettingsView from './components/ProfileSettingsView';
import InstructorSettingsView from './components/InstructorSettingsView';
import Footer from './components/Footer';
import LiveSessionView from './components/LiveSessionView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import DataPolicyView from './components/DataPolicyView';
import TermsOfServiceView from './components/TermsOfServiceView';
import SubscriptionView from './components/SubscriptionView';
import AIToolsView from './components/AIToolsView';
import LiveConversationView from './components/LiveConversationView';
import LandingPage from './components/landing/LandingPage';

type View = 'dashboard' | 'course' | 'tutor' | 'profile' | 'jobs' | 'adaptive-quiz' | 'instructor-dashboard' | 'course-builder' | 'course-landing' | 'learning' | 'instructor-analytics' | 'institution-dashboard' | 'community' | 'vr-classroom' | 'institution-learners' | 'institution-settings' | 'project-submission' | 'calendar' | 'profile-editing' | 'profile-settings' | 'institution-profile' | 'institution-profile-editing' | 'instructor-settings' | 'live-session' | 'about' | 'contact' | 'data-policy' | 'terms-of-service' | 'ai-tools' | 'live-conversation';
type OnboardingStep = 'splash' | 'auth' | 'role-selection' | 'personalization' | 'welcome' | 'loaded';
type Theme = 'light' | 'dark';
type TextSize = 'base' | 'lg' | 'xl';
type AppState = 'landing' | 'app';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('app');
    const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('loaded');
    const [currentView, setCurrentView] = useState<View>('course-landing');
    const [userRole, setUserRole] = useState<UserRole>('learner');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(initialCourses.find(c => c.id === 'react-mastery') || null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [currentQuiz, setCurrentQuiz] = useState<Lesson | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [instructorCourses, setInstructorCourses] = useState<Course[]>(initialInstructorCourses);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isCompletionModalOpen, setCompletionModalOpen] = useState(false);
    const [analyticsCourse, setAnalyticsCourse] = useState<Course | null>(null);
    const [applyingForJob, setApplyingForJob] = useState<Job | null>(null);
    const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);
    const [userProfileData, setUserProfileData] = useState<UserProfile>(initialUserProfile);
    const [userSettingsData, setUserSettingsData] = useState<UserSettings>(initialUserSettings);
    const [instructorSettingsData, setInstructorSettingsData] = useState<InstructorSettings>(initialInstructorSettings);
    const [institutionData, setInstitutionData] = useState<FullInstitutionData>(initialInstitutionData);
    const [theme, setTheme] = useState<Theme>('light');
    const [textSize, setTextSize] = useState<TextSize>('base');
    const [institutionSubscriptionPlan, setInstitutionSubscriptionPlan] = useState<string | null>(null);
    const [instructorSubscriptionPlan, setInstructorSubscriptionPlan] = useState<string | null>(null);
    const [bookmarkedCourseIds, setBookmarkedCourseIds] = useState<Set<string>>(new Set());
    const [isFlipping, setIsFlipping] = useState(false);
    const [learnerInterests, setLearnerInterests] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

     useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    const handleSetAppState = (state: AppState) => {
        setIsFlipping(true);
        setTimeout(() => {
            setAppState(state);
            setIsFlipping(false);
        }, 500); // Match CSS transition duration
    };

    useEffect(() => {
        if (appState === 'app' && onboardingStep === 'splash') {
            try {
                if (localStorage.getItem('empowerAfriqRememberMe') === 'true') {
                    setOnboardingStep('role-selection');
                }
            } catch (e) {
                console.warn("Could not access localStorage for 'Remember Me' feature.");
            }
        }
    }, [appState, onboardingStep]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { 
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const getTextSizeClass = () => {
        switch(textSize) {
            case 'lg': return 'text-lg';
            case 'xl': return 'text-xl';
            default: return 'text-base';
        }
    }

    const allCoursesForLearner = useMemo(() => {
        const combined = [...courses, ...instructorCourses, ...institutionData.courses];
        const uniqueIds = new Set();
        return combined.filter(course => {
            if (uniqueIds.has(course.id)) {
                return false;
            }
            uniqueIds.add(course.id);
            return true;
        });
    }, [courses, instructorCourses, institutionData.courses]);

    const personalizedCourses = useMemo(() => {
        if (userRole !== 'learner' || learnerInterests.length === 0) {
            return allCoursesForLearner;
        }
        return allCoursesForLearner.filter(course =>
            learnerInterests.includes(course.category)
        );
    }, [allCoursesForLearner, learnerInterests, userRole]);


    const handleLogout = useCallback(() => {
        try {
            localStorage.removeItem('empowerAfriqRememberMe');
        } catch (e) {
            console.warn("Could not clear 'Remember Me' preference from localStorage.");
        }
        handleSetAppState('landing');
        setOnboardingStep('splash');
        setCurrentView('dashboard');
        setUserRole('learner'); // Reset to a default
        setSelectedCourse(null);
        setCurrentLesson(null);
        setCurrentQuiz(null);
        setEditingCourse(null);
        setAnalyticsCourse(null);
        setApplyingForJob(null);
        setApplicationModalOpen(false);
        setCompletionModalOpen(false);
        setInstitutionSubscriptionPlan(null);
        setInstructorSubscriptionPlan(null);
    }, []);

    const handleSelectCourse = useCallback((course: Course) => {
        setSelectedCourse(course);
        if (course.progress === 0 && userRole === 'learner') {
            setCurrentView('course-landing');
        } else {
            setCurrentView('course');
        }
    }, [userRole]);

    const handleEnrollCourse = useCallback((courseToEnroll: Course) => {
        setCourses(prevCourses => prevCourses.map(c => 
            c.id === courseToEnroll.id ? { ...c, progress: 1 } : c
        ));
        setSelectedCourse(prev => prev ? { ...prev, progress: 1 } : courseToEnroll);
        setCurrentView('course');
    }, []);

    const handleNavigate = useCallback((view: View) => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
        setCurrentView(view);
    }, []);

    const handleStartLesson = useCallback((lesson: Lesson, course: Course) => {
        setSelectedCourse(course);
        if (lesson.format === 'adaptive-quiz') {
            setCurrentQuiz(lesson);
            setCurrentView('adaptive-quiz');
        } else if (lesson.format === 'metaverse') {
            setCurrentLesson(lesson);
            setCurrentView('vr-classroom');
        } else if (lesson.format === 'project') {
            setCurrentLesson(lesson);
            setCurrentView('project-submission');
        } else if (lesson.format === 'live-session') {
            setCurrentLesson(lesson);
            setCurrentView('live-session');
        }
        else {
            setCurrentLesson(lesson);
            setCurrentView('learning');
        }
    }, []);

    const handleCompleteLesson = useCallback((lessonToComplete: Lesson) => {
        const updateLessonStatus = (courseList: Course[]) => courseList.map(c => {
            if (c.id === selectedCourse?.id) {
                return {
                    ...c,
                    modules: c.modules.map(m => ({
                        ...m,
                        lessons: m.lessons.map(l => l.id === lessonToComplete.id ? { ...l, isCompleted: true } : l)
                    }))
                };
            }
            return c;
        });
        setCourses(updateLessonStatus);
        setInstructorCourses(updateLessonStatus);

        setCompletionModalOpen(true);
    }, [selectedCourse]);
    
    const handleApplyJob = useCallback((job: Job) => {
        setApplyingForJob(job);
        setApplicationModalOpen(true);
    }, []);

    const handleAuthentication = useCallback((name: string) => {
        if (name !== 'Alex Turner' && name !== 'New User') { // A bit more robust check
            const newUserProfile: UserProfile = {
                name: name,
                displayName: name,
                username: name.toLowerCase().replace(/\s+/g, '_'),
                avatarUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}`,
                title: 'Lifelong Learner',
                coursesInProgress: 0,
                coursesCompleted: 0,
                achievements: [],
                certificates: [],
                learningGoals: [],
                skills: [],
                bio: `Eager to start my learning journey on EmpowerAfriq Academy!`,
                contact: { email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com` },
                location: { city: '', country: '' },
                education: [],
                socialLinks: {},
                mentorshipStatus: 'seeking',
                coverImageUrl: 'https://picsum.photos/seed/profile-banner/1200/300',
            };
            setUserProfileData(newUserProfile);
        } else {
            setUserProfileData(initialUserProfile); // If it's Alex, reset to default Alex profile
        }
        setOnboardingStep('role-selection');
    }, []);

    const handleSelectRoleOnboarding = useCallback((role: UserRole) => {
        setUserRole(role);
        if (role === 'learner') {
            setOnboardingStep('personalization');
        } else if (role === 'institution') {
            setOnboardingStep('loaded');
            setCurrentView('institution-dashboard');
        } else { // instructor
            setOnboardingStep('loaded');
            setCurrentView('instructor-dashboard');
        }
    }, []);

    const handlePersonalizationComplete = useCallback((interests: string[]) => {
        setLearnerInterests(interests);
        setOnboardingStep('welcome');
    }, []);

    const handleSelectInstitutionPlan = useCallback((planName: string) => {
        setInstitutionSubscriptionPlan(planName);
    }, []);

    const handleSelectInstructorPlan = useCallback((planName: string) => {
        setInstructorSubscriptionPlan(planName);
    }, []);

    const handleCreateCourse = useCallback(() => {
        const newCourse: Course = {
            id: `course-${Date.now()}`,
            title: 'New Course Title',
            instructor: userProfileData.name,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
            progress: 0,
            category: 'New Category',
            description: '',
            isDraft: true,
            modules: [],
            priceType: 'free',
            price: 0,
        };
        setEditingCourse(newCourse);
        setCurrentView('course-builder');
    }, [userProfileData.name]);
    
    const handleCreateInstitutionCourse = useCallback(() => {
        const newCourse: Course = {
            id: `course-${Date.now()}`,
            title: 'New Institution Course',
            instructor: institutionData.profile.faculty[0]?.name || institutionData.name,
            university: institutionData.name,
            universityLogo: institutionData.branding.logoUrl,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
            progress: 0,
            category: 'New Category',
            description: '',
            isDraft: true,
            modules: [],
            priceType: 'one-time',
            price: 99.99,
            status: 'active',
        };
        setEditingCourse(newCourse);
        setCurrentView('course-builder');
    }, [institutionData]);

    const handleEditCourse = useCallback((course: Course) => {
        setEditingCourse(course);
        setCurrentView('course-builder');
    }, []);

    const handleSaveCourse = useCallback((updatedCourse: Course) => {
        if (userRole === 'instructor') {
            setInstructorCourses(prev => {
                const index = prev.findIndex(c => c.id === updatedCourse.id);
                if (index > -1) {
                    const newCourses = [...prev];
                    newCourses[index] = updatedCourse;
                    return newCourses;
                }
                return [...prev, updatedCourse];
            });
            setCurrentView('instructor-dashboard');
        } else if (userRole === 'institution') {
            setInstitutionData(prev => {
                const existingCourses = prev.courses || [];
                const index = existingCourses.findIndex(c => c.id === updatedCourse.id);
                let newCourses;
                if (index > -1) {
                    newCourses = [...existingCourses];
                    newCourses[index] = updatedCourse;
                } else {
                    newCourses = [...existingCourses, updatedCourse];
                }
                return { ...prev, courses: newCourses };
            });
            setCurrentView('institution-dashboard');
        }
        setEditingCourse(null);
    }, [userRole]);

    const handleViewAnalytics = useCallback((course: Course) => {
        setAnalyticsCourse(course);
        setCurrentView('instructor-analytics');
    }, []);

    const handleNavigateToEditProfile = useCallback(() => {
        setCurrentView('profile-editing');
    }, []);

    const handleSaveProfile = useCallback((updatedProfile: UserProfile) => {
        setUserProfileData(updatedProfile);
        setCurrentView('profile');
    }, []);
    
    const handleSaveInstitutionProfile = useCallback((updatedData: FullInstitutionData) => {
        setInstitutionData(updatedData);
        setCurrentView('institution-profile');
    }, []);

    const handleNavigateToSettings = useCallback(() => {
        if (userRole === 'learner') {
            setCurrentView('profile-settings');
        } else if (userRole === 'instructor') {
            setCurrentView('instructor-settings');
        } else if (userRole === 'institution') {
            setCurrentView('institution-settings');
        }
    }, [userRole]);

    const handleToggleBookmark = useCallback((courseId: string) => {
        setBookmarkedCourseIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) {
                newSet.delete(courseId);
            } else {
                newSet.add(courseId);
            }
            return newSet;
        });
    }, []);


    const renderContent = () => {
        const dashboardUserName = userRole === 'institution' ? institutionData.name : userProfileData.name;

        switch (currentView) {
            case 'dashboard':
                return <Dashboard 
                    courses={personalizedCourses} 
                    onSelectCourse={handleSelectCourse} 
                    onNavigate={handleNavigate} 
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                    userName={dashboardUserName}
                    searchTerm={searchTerm}
                    userRole={userRole}
                />;
            case 'course-landing':
                return selectedCourse ? (
                    <CourseLandingPage 
                        course={selectedCourse} 
                        onEnroll={handleEnrollCourse} 
                        onBack={() => setCurrentView('dashboard')}
                    />
                ) : (
                     <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'course':
                return selectedCourse ? (
                    <CourseDetailView 
                        course={selectedCourse} 
                        onBack={() => setCurrentView(userRole === 'instructor' ? 'instructor-dashboard' : (userRole === 'institution' ? 'institution-dashboard' : 'dashboard'))} 
                        onStartLesson={(lesson) => handleStartLesson(lesson, selectedCourse)}
                        allCourses={allCoursesForLearner}
                        onSelectCourse={handleSelectCourse}
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'learning':
                 return currentLesson && selectedCourse ? (
                    <LearningView 
                        course={selectedCourse} 
                        lesson={currentLesson} 
                        onBack={() => setCurrentView('course')} 
                        onCompleteLesson={handleCompleteLesson}
                        onNavigateLesson={(lesson) => handleStartLesson(lesson, selectedCourse)}
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'live-session':
                 return currentLesson && selectedCourse ? (
                    <LiveSessionView 
                        course={selectedCourse} 
                        lesson={currentLesson} 
                        onBack={() => setCurrentView('course')} 
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'vr-classroom':
                 return <Dashboard 
                    courses={personalizedCourses} 
                    onSelectCourse={handleSelectCourse} 
                    onNavigate={handleNavigate} 
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                    userName={dashboardUserName}
                    searchTerm={searchTerm}
                    userRole={userRole}
                />;
            case 'project-submission':
                 return currentLesson && selectedCourse ? (
                    <ProjectSubmissionView
                        course={selectedCourse} 
                        lesson={currentLesson} 
                        onBack={() => setCurrentView('course')} 
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'tutor':
                return <AITutorView userRole={userRole} />;
            case 'profile':
                return <ProfileView 
                    userProfile={userProfileData} 
                    instructorSettings={instructorSettingsData}
                    userRole={userRole}
                    courses={courses} 
                    allCourses={allCoursesForLearner}
                    instructorCourses={instructorCourses}
                    jobs={recommendedJobs} 
                    onSelectCourse={handleSelectCourse}
                    onApplyJob={handleApplyJob}
                    onEditProfile={handleNavigateToEditProfile}
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                />;
            case 'profile-editing':
                return <ProfileEditingView
                    userProfile={userProfileData}
                    onSave={handleSaveProfile}
                    onBack={() => setCurrentView('profile')}
                />;
             case 'profile-settings':
                return <ProfileSettingsView
                    settings={userSettingsData}
                    onSaveSettings={setUserSettingsData}
                    onUpdateTheme={setTheme}
                    onUpdateTextSize={setTextSize}
                    currentTheme={theme}
                    currentTextSize={textSize}
                />;
            case 'jobs':
                return <JobBoardView jobs={recommendedJobs} onApplyJob={handleApplyJob} />;
            case 'community':
                return <CommunityHubView />;
            case 'calendar':
                return <CalendarView courses={allCoursesForLearner} mentorshipMeetings={mentorshipMeetings} />;
            case 'adaptive-quiz':
                return currentQuiz && selectedCourse ? (
                     <AdaptiveQuizView course={selectedCourse} quizLesson={currentQuiz} onBack={() => setCurrentView('course')} />
                ) : (
                     <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'instructor-dashboard':
                if (userRole === 'instructor' && !instructorSubscriptionPlan) {
                    return <SubscriptionView
                        onSelectPlan={handleSelectInstructorPlan}
                        tiers={instructorSubscriptionTiers}
                        title="Choose Your Instructor Plan"
                        subtitle="Select the perfect subscription tier to boost your marketing and advertisement reach."
                    />;
                }
                return <InstructorDashboardView 
                    courses={instructorCourses} 
                    onCreateCourse={handleCreateCourse} 
                    onEditCourse={handleEditCourse} 
                    onViewCourse={handleSelectCourse} 
                    onViewAnalytics={handleViewAnalytics} 
                    seekingMentorshipLearners={seekingMentorshipLearners}
                    subscriptionPlan={instructorSubscriptionPlan}
                />;
            case 'course-builder':
                return editingCourse ? (
                    <CourseBuilderView 
                        initialCourse={editingCourse} 
                        onSave={handleSaveCourse} 
                        onBack={() => setCurrentView(userRole === 'instructor' ? 'instructor-dashboard' : 'institution-dashboard')}
                        userRole={userRole}
                        faculty={institutionData.profile.faculty}
                    />
                ) : (
                    userRole === 'instructor' ?
                    <InstructorDashboardView courses={instructorCourses} onCreateCourse={handleCreateCourse} onEditCourse={handleEditCourse} onViewCourse={handleSelectCourse} onViewAnalytics={handleViewAnalytics} seekingMentorshipLearners={seekingMentorshipLearners} subscriptionPlan={instructorSubscriptionPlan} />
                    : <InstitutionDashboardView institutionData={institutionData} onCreateCourse={handleCreateInstitutionCourse} onEditCourse={handleEditCourse} onViewCourse={handleSelectCourse} subscriptionPlan={institutionSubscriptionPlan} />
                );
            case 'instructor-analytics':
                 return analyticsCourse ? (
                    <InstructorAnalyticsView course={analyticsCourse} onBack={() => setCurrentView('instructor-dashboard')} />
                ) : (
                     <InstructorDashboardView courses={instructorCourses} onCreateCourse={handleCreateCourse} onEditCourse={handleEditCourse} onViewCourse={handleSelectCourse} onViewAnalytics={handleViewAnalytics} seekingMentorshipLearners={seekingMentorshipLearners} subscriptionPlan={instructorSubscriptionPlan} />
                );
            case 'instructor-settings':
                return <InstructorSettingsView settings={instructorSettingsData} onSave={setInstructorSettingsData} />;
            case 'institution-dashboard':
                if (userRole === 'institution' && !institutionSubscriptionPlan) {
                     return <SubscriptionView
                        onSelectPlan={handleSelectInstitutionPlan}
                        tiers={institutionSubscriptionTiers}
                        title="Choose Your Institution Plan"
                        subtitle="Select the perfect subscription tier to boost your institution's marketing and advertisement reach."
                    />;
                }
                return <InstitutionDashboardView 
                            institutionData={institutionData} 
                            onCreateCourse={handleCreateInstitutionCourse} 
                            onEditCourse={handleEditCourse} 
                            onViewCourse={handleSelectCourse}
                            subscriptionPlan={institutionSubscriptionPlan}
                        />;
            case 'institution-learners':
                return <InstitutionLearnersView institutionData={institutionData} setInstitutionData={setInstitutionData} />;
            case 'institution-settings':
                return <InstitutionSettingsView institutionData={institutionData} onSave={setInstitutionData} />;
            case 'institution-profile':
                return <InstitutionProfileView institutionData={institutionData} onNavigate={() => setCurrentView('institution-profile-editing')} />;
            case 'institution-profile-editing':
                return <InstitutionProfileEditingView institutionData={institutionData} onSave={handleSaveInstitutionProfile} onBack={() => setCurrentView('institution-profile')} />;
            case 'about':
                return <AboutView />;
            case 'contact':
                return <ContactView />;
            case 'data-policy':
                return <DataPolicyView />;
            case 'terms-of-service':
                return <TermsOfServiceView />;
            case 'ai-tools':
                return <AIToolsView />;
            case 'live-conversation':
                return <LiveConversationView />;
            default:
                return <Dashboard 
                    courses={personalizedCourses} 
                    onSelectCourse={handleSelectCourse} 
                    onNavigate={handleNavigate} 
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                    userName={dashboardUserName}
                    searchTerm={searchTerm}
                    userRole={userRole}
                />;
        }
    };
    
    const renderOnboarding = () => {
        switch(onboardingStep) {
            case 'splash':
                return <SplashScreen onFinish={() => setOnboardingStep('auth')} />;
            case 'auth':
                return <LoginView onAuthenticated={handleAuthentication} />;
            case 'role-selection':
                return <RoleSelectionView onSelectRole={handleSelectRoleOnboarding} />;
            case 'personalization':
                return <PersonalizationView onComplete={handlePersonalizationComplete} />;
            case 'welcome':
                return <WelcomeAssistantView onStart={() => setOnboardingStep('loaded')} />;
            default:
                return null;
        }
    };
    
    const renderAppContent = () => {
        if (onboardingStep !== 'loaded') {
            return (
                 <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center transition-opacity duration-500">
                    {renderOnboarding()}
                </div>
            )
        }
        return (
            <div className={`h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex ${getTextSizeClass()}`}>
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                        aria-hidden="true"
                    />
                )}
                
                {/* Sidebar - fixed on mobile, flex item on desktop */}
                <div className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-0 lg:h-full lg:flex-shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20 lg:translate-x-0'}`}>
                    <Sidebar 
                        isOpen={isSidebarOpen} 
                        onNavigate={handleNavigate} 
                        currentView={currentView}
                        setSidebarOpen={setSidebarOpen}
                        userRole={userRole}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
                    <Header 
                        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                        isSidebarOpen={isSidebarOpen} 
                        userRole={userRole} 
                        onLogout={handleLogout}
                        onNavigateToProfile={() => handleNavigate('profile')}
                        onNavigateToSettings={handleNavigateToSettings}
                        userName={userProfileData.name}
                        userAvatarUrl={userProfileData.avatarUrl || ''}
                        institutionName={institutionData.name}
                        institutionLogoUrl={institutionData.branding.logoUrl}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                    
                    <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 scroll-smooth">
                        <div className="max-w-7xl mx-auto pb-10">
                            {renderContent()}
                        </div>
                        <Footer onNavigate={handleNavigate} />
                    </main>
                </div>

                 <LessonCompletionModal 
                    isOpen={isCompletionModalOpen}
                    onClose={() => setCompletionModalOpen(false)}
                    achievement={userProfileData.achievements.find(a => a.name === 'Lesson Leader')}
                />
                <ApplicationModal 
                    isOpen={isApplicationModalOpen}
                    onClose={() => setApplicationModalOpen(false)}
                    job={applyingForJob}
                    userProfile={userProfileData}
                />
            </div>
        )
    };

    return (
        <div className="min-h-screen">
            {/* Logic for Landing/App flip */}
            {appState === 'landing' ? (
                 <div className="absolute w-full h-full min-h-screen">
                     <LandingPage onGetStarted={() => handleSetAppState('app')} />
                </div>
            ) : (
                /* Once in app mode, render without the 3D wrapper to fix fixed positioning contexts */
                <div className="absolute w-full h-full min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
                     {renderAppContent()}
                </div>
            )}
        </div>
    );
};

export default App;
