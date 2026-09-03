
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import CogniSacraLogo from './components/icons/IntelliLearnLogo';
import RoleSelectionView from './components/onboarding/RoleSelectionView';
import PersonalizationView from './components/onboarding/PersonalizationView';
import WelcomeAssistantView from './components/onboarding/WelcomeAssistantView';
import ResetPasswordFormView from './components/onboarding/ResetPasswordFormView';
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
import VirtualClassroomView from './components/VirtualClassroomView';
import { InstitutionPortalView } from './components/InstitutionPortalView';
import LandingPage from './components/landing/LandingPage';
import { supabase } from './services/supabaseClient';
import { authService } from './services/authService';
import type { AuthUser } from './services/authService';
import VirtualLibraryView from './components/VirtualLibraryView';
import CogniSacraInstitutionalLibraryView from './components/CogniSacraInstitutionalLibraryView';
import { AIArchitectView } from './components/AIArchitectView';
import AdminDashboardView from './components/admin/AdminDashboardView';
import AdminUsersView from './components/admin/AdminUsersView';
import AdminCoursesView from './components/admin/AdminCoursesView';
import AdminLibraryView from './components/admin/AdminLibraryView';

export type View = 'dashboard' | 'course' | 'tutor' | 'profile' | 'jobs' | 'adaptive-quiz' | 'instructor-dashboard' | 'course-builder' | 'course-landing' | 'learning' | 'instructor-analytics' | 'institution-dashboard' | 'community' | 'vr-classroom' | 'institution-learners' | 'institution-settings' | 'project-submission' | 'calendar' | 'profile-editing' | 'profile-settings' | 'institution-profile' | 'institution-profile-editing' | 'instructor-settings' | 'live-session' | 'about' | 'contact' | 'data-policy' | 'terms-of-service' | 'ai-tools' | 'virtual-class' | 'institution-portal' | 'library' | 'ai-architect' | 'admin-dashboard' | 'admin-users' | 'admin-courses' | 'admin-library' | 'admin-analytics' | 'admin-settings';
type OnboardingStep = 'splash' | 'auth' | 'role-selection' | 'personalization' | 'welcome' | 'loaded' | 'reset-password';
type Theme = 'light' | 'dark';
type TextSize = 'base' | 'lg' | 'xl';
type AppState = 'landing' | 'app';

// Map view names to URL paths
export const viewToPath: Record<View, string> = {
    'dashboard': '/dashboard',
    'course': '/course',
    'tutor': '/tutor',
    'profile': '/profile',
    'jobs': '/jobs',
    'adaptive-quiz': '/adaptive-quiz',
    'instructor-dashboard': '/instructor/dashboard',
    'course-builder': '/instructor/course-builder',
    'course-landing': '/course-landing',
    'learning': '/learning',
    'instructor-analytics': '/instructor/analytics',
    'institution-dashboard': '/institution/dashboard',
    'community': '/community',
    'vr-classroom': '/vr-classroom',
    'institution-learners': '/institution/learners',
    'institution-settings': '/institution/settings',
    'project-submission': '/project-submission',
    'calendar': '/calendar',
    'profile-editing': '/profile/edit',
    'profile-settings': '/settings',
    'institution-profile': '/institution/profile',
    'institution-profile-editing': '/institution/profile/edit',
    'instructor-settings': '/instructor/settings',
    'live-session': '/live-session',
    'about': '/about',
    'contact': '/contact',
    'data-policy': '/data-policy',
    'terms-of-service': '/terms-of-service',
    'ai-tools': '/ai-tools',
    'virtual-class': '/virtual-class',
    'institution-portal': '/institution/portal',
    'library': '/library',
    'ai-architect': '/ai-architect',
    'admin-dashboard': '/admin/dashboard',
    'admin-users': '/admin/users',
    'admin-courses': '/admin/courses',
    'admin-library': '/admin/library',
    'admin-analytics': '/admin/analytics',
    'admin-settings': '/admin/settings',
};

// Map URL paths to view names
export const pathToView: Record<string, View> = Object.entries(viewToPath).reduce((acc, [view, path]) => {
    acc[path] = view as View;
    return acc;
}, {} as Record<string, View>);

// Auth-related paths
export const authPaths = {
    signin: '/signin',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
};

const App: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [appState, setAppState] = useState<AppState>('app');
    const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('loaded');
    const [currentView, setCurrentView] = useState<View>(() => {
        // Initialize currentView from URL path
        const path = window.location.pathname;
        return pathToView[path] || 'dashboard';
    });
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
    const [session, setSession] = useState<any>(null);
    const [rejoinSession, setRejoinSession] = useState<any>(null);
    const [libraryActiveTab, setLibraryActiveTab] = useState<string>('twin');
    const [tutorActiveTab, setTutorActiveTab] = useState<string>('ask-tutor');
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);

    // Platform Admin State - now fetched from API in each component

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Sync currentView with URL path changes (browser back/forward buttons)
    useEffect(() => {
        const path = location.pathname;
        const viewFromPath = pathToView[path];
        if (viewFromPath && viewFromPath !== currentView) {
            setCurrentView(viewFromPath);
        }
        // Handle tab parameter for library and tutor views
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab) {
            if (viewFromPath === 'library') {
                setLibraryActiveTab(tab);
            } else if (viewFromPath === 'tutor') {
                setTutorActiveTab(tab);
            }
        }
    }, [location.pathname, location.search]);

    // Backend Auth Session Check
    useEffect(() => {
        const initSession = async () => {
            try {
                // Check for reset-password or verify-email token in URL
                const urlParams = new URLSearchParams(window.location.search);
                const urlToken = urlParams.get('token');
                const path = window.location.pathname;

                if (path === '/reset-password' && urlToken) {
                    setResetToken(urlToken);
                    setAppState('app');
                    setOnboardingStep('reset-password');
                    setIsAuthReady(true);
                    return;
                }

                if (path === '/verify-email' && urlToken) {
                    // Auto-verify email via backend then redirect to login
                    try {
                        const response = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL || 'https://cogni-sacra-backend-production.up.railway.app'}/api/v1/auth/verify-email?token=${urlToken}`
                        );
                        const data = await response.json();
                        if (data.success) {
                            window.history.replaceState({}, document.title, '/');
                            setOnboardingStep('auth');
                        } else {
                            console.warn('Email verification failed:', data.message);
                            setOnboardingStep('splash');
                        }
                    } catch (err) {
                        console.warn('Email verification error:', err);
                        setOnboardingStep('splash');
                    }
                    setIsAuthReady(true);
                    return;
                }

                const rememberMe = localStorage.getItem('cogniSacraRememberMe');
                if (rememberMe === 'false') {
                    authService.logout();
                    setSession(null);
                    setOnboardingStep('splash');
                    setIsAuthReady(true);
                    return;
                }

                // Check if we have a valid token and fetch current user from backend
                const user = await authService.getCurrentUser();
                if (user) {
                    setSession({ user: { id: user.id, email: user.email, user_metadata: { full_name: user.name } } });

                    // Update profile data from backend user
                    setUserProfileData((prev: UserProfile) => ({
                        ...prev,
                        name: user.name || prev.name,
                        avatarUrl: user.avatar_url || `https://i.pravatar.cc/150?u=${user.email}`,
                    }));

                    // Set role from backend
                    if (user.role) {
                        let mappedRole: UserRole = 'learner';
                        if (user.role === 'platform_admin') {
                            mappedRole = 'platform_admin';
                        } else if (user.role === 'instructor') {
                            mappedRole = 'instructor';
                        } else if (user.role === 'institution' || user.role === 'institution_admin') {
                            mappedRole = 'institution';
                        }
                        setUserRole(mappedRole);
                    }

                    // If user has a role from backend (not just 'user'), they've completed onboarding
                    if (user.role && user.role !== 'user') {
                        setOnboardingStep('loaded');
                    } else {
                        // Fallback to Supabase profile for legacy users
                        const profile = await fetchUserProfile(user.id);
                        if (profile?.onboarding_completed) {
                            setOnboardingStep('loaded');
                        } else {
                            setOnboardingStep(profile?.onboarding_step || 'role-selection');
                        }
                    }
                } else {
                    setOnboardingStep('splash');
                }
            } catch (err) {
                console.warn("Auth session init error:", err);
                setOnboardingStep('splash');
            } finally {
                setIsAuthReady(true);
            }
        };

        initSession();

        // Listen for auth state changes from authService
        const { unsubscribe } = authService.onAuthStateChange((event, user) => {
            if (event === 'SIGNED_IN' && user) {
                setSession({ user: { id: user.id, email: user.email, user_metadata: { full_name: user.name } } });

                // Update profile data from backend user
                setUserProfileData(prev => ({
                    ...prev,
                    name: user.name || prev.name,
                    avatarUrl: user.avatar_url || `https://i.pravatar.cc/150?u=${user.email}`,
                }));

                // Set role from backend (map backend roles to frontend roles)
                if (user.role) {
                    let mappedRole: UserRole = 'learner';
                    if (user.role === 'platform_admin') {
                        mappedRole = 'platform_admin';
                    } else if (user.role === 'instructor') {
                        mappedRole = 'instructor';
                    } else if (user.role === 'institution' || user.role === 'institution_admin') {
                        mappedRole = 'institution';
                    } else {
                        // 'user', 'independent_learner', 'institution_learner', etc. -> learner
                        mappedRole = 'learner';
                    }
                    setUserRole(mappedRole);
                }

                // If user already has a role from backend, skip onboarding
                if (user.role && user.role !== 'user') {
                    setOnboardingStep('loaded');
                } else {
                    fetchUserProfile(user.id).then(profile => {
                        if (profile?.onboarding_completed) {
                            setOnboardingStep('loaded');
                        } else {
                            setOnboardingStep(profile?.onboarding_step || 'role-selection');
                        }
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                setSession(null);
                setUserProfileData(initialUserProfile);
                setOnboardingStep('splash');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserProfile = async (userId: string): Promise<{ onboarding_completed?: boolean; onboarding_step?: OnboardingStep; role?: UserRole } | null> => {
        try {
            // 1. Fetch Basic Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError || !profile) {
                console.warn("Error fetching profile:", profileError?.message);
                return null;
            }

            const currentRole = profile.role as UserRole;
            setUserRole(currentRole);

            // 2. Fetch Role Specific Data
            if (currentRole === 'learner') {
                const { data: learnerData, error: learnerError } = await supabase
                    .from('learners_data')
                    .select('*')
                    .eq('id', userId)
                    .single();
                
                if (learnerData && !learnerError) {
                    setUserProfileData(prev => ({
                        ...prev,
                        name: profile.full_name || prev.name,
                        avatarUrl: profile.avatar_url || prev.avatarUrl,
                        bio: learnerData.bio || prev.bio,
                        title: learnerData.title || prev.title,
                        username: learnerData.username || prev.username,
                        coverImageUrl: learnerData.cover_image_url || prev.coverImageUrl,
                        location: {
                            city: learnerData.location_city || '',
                            country: learnerData.location_country || ''
                        },
                        skills: learnerData.skills || prev.skills,
                        socialLinks: learnerData.social_links || prev.socialLinks,
                        education: learnerData.education || prev.education,
                        learningGoals: learnerData.learning_goals || prev.learningGoals,
                        mentorshipStatus: learnerData.mentorship_status || prev.mentorshipStatus,
                        targetCareer: learnerData.target_career || prev.targetCareer
                    }));
                }
            } else if (currentRole === 'instructor') {
                const { data: instructorData, error: instrError } = await supabase
                    .from('instructors_data')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (instructorData && !instrError) {
                    // Update main profile for header display
                    setUserProfileData(prev => ({
                        ...prev,
                        name: profile.full_name || prev.name,
                        avatarUrl: profile.avatar_url || prev.avatarUrl,
                    }));
                    
                    // Update Instructor Settings
                    setInstructorSettingsData(prev => ({
                        ...prev,
                        publicProfile: {
                            ...prev.publicProfile,
                            displayName: instructorData.display_name || profile.full_name,
                            bio: instructorData.bio || prev.publicProfile.bio,
                            socialLinks: instructorData.social_links || prev.publicProfile.socialLinks,
                            accreditations: instructorData.accreditations || prev.publicProfile.accreditations,
                            licenses: instructorData.licenses || prev.publicProfile.licenses,
                            resumeUrl: instructorData.resume_url || prev.publicProfile.resumeUrl
                        },
                        payout: instructorData.payout_settings || prev.payout,
                        notifications: instructorData.notification_settings || prev.notifications
                    }));
                }
            } else if (currentRole === 'institution') {
                 const { data: instData, error: instError } = await supabase
                    .from('institutions_data')
                    .select('*')
                    .eq('id', userId)
                    .single();
                
                if (instData && !instError) {
                    setInstitutionData(prev => ({
                        ...prev,
                        name: instData.name || prev.name,
                        profile: {
                            ...prev.profile,
                            tagline: instData.tagline || prev.profile.tagline,
                            about: instData.about || prev.profile.about,
                            bannerUrl: instData.banner_url || prev.profile.bannerUrl,
                            website: instData.website || prev.profile.website,
                            contact: {
                                email: instData.contact_email || prev.profile.contact.email,
                                phone: instData.contact_phone || prev.profile.contact.phone
                            }
                        },
                        branding: {
                            ...prev.branding,
                            logoUrl: instData.branding_logo_url || prev.branding.logoUrl,
                            primaryColor: instData.branding_primary_color || prev.branding.primaryColor
                        },
                        settings: instData.settings || prev.settings,
                        monetization: instData.monetization_settings || prev.monetization
                    }));
                }
            }

            return {
                onboarding_completed: profile.onboarding_completed,
                onboarding_step: profile.onboarding_step,
                role: currentRole
            };
        } catch (err) {
            console.error("Profile fetch error:", err);
            return null;
        }
    };

    const handleSetAppState = (state: AppState) => {
        setIsFlipping(true);
        setTimeout(() => {
            setAppState(state);
            setIsFlipping(false);
        }, 500); // Match CSS transition duration
    };


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


    // Helper function to navigate to a view and update URL
    const navigateToView = useCallback((view: View, options?: { subTab?: string; replace?: boolean }) => {
        setCurrentView(view);
        const path = viewToPath[view];
        const fullPath = options?.subTab ? `${path}?tab=${options.subTab}` : path;
        if (options?.replace) {
            navigate(fullPath, { replace: true });
        } else {
            navigate(fullPath);
        }

        if (view === 'library' && options?.subTab) {
            setLibraryActiveTab(options.subTab);
        }
        if (view === 'tutor' && options?.subTab) {
            setTutorActiveTab(options.subTab);
        }
    }, [navigate]);

    const handleLogout = useCallback(async () => {
        try {
            authService.logout();
            await supabase.auth.signOut();
            localStorage.removeItem('cogniSacraRememberMe');
        } catch (e) {
            console.warn("Error signing out:", e);
        }
        handleSetAppState('landing');
        setOnboardingStep('splash');
        navigateToView('dashboard');
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
    }, [navigateToView]);

    const handleSelectCourse = useCallback((course: Course) => {
        setSelectedCourse(course);
        if (course.progress === 0 && userRole === 'learner') {
            navigateToView('course-landing');
        } else {
            navigateToView('course');
        }
    }, [userRole, navigateToView]);

    const handleEnrollCourse = useCallback((courseToEnroll: Course) => {
        setCourses(prevCourses => prevCourses.map(c =>
            c.id === courseToEnroll.id ? { ...c, progress: 1 } : c
        ));
        setSelectedCourse(prev => prev ? { ...prev, progress: 1 } : courseToEnroll);
        navigateToView('course');
    }, [navigateToView]);

    const handleNavigate = useCallback((view: View, subTab?: string) => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
        navigateToView(view, { subTab });
    }, [navigateToView]);

    const handleStartLesson = useCallback((lesson: Lesson, course: Course) => {
        setSelectedCourse(course);
        if (lesson.format === 'adaptive-quiz') {
            setCurrentQuiz(lesson);
            navigateToView('adaptive-quiz');
        } else if (lesson.format === 'metaverse') {
            setCurrentLesson(lesson);
            navigateToView('vr-classroom');
        } else if (lesson.format === 'project') {
            setCurrentLesson(lesson);
            navigateToView('project-submission');
        } else if (lesson.format === 'live-session') {
            setCurrentLesson(lesson);
            navigateToView('live-session');
        }
        else {
            setCurrentLesson(lesson);
            navigateToView('learning');
        }
    }, [navigateToView]);

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

    const handleAuthentication = useCallback(async (name: string) => {
        // This is triggered after successful backend API login/register in LoginView
        const user = authService.getUser();
        if (user) {
            setSession({ user: { id: user.id, email: user.email, user_metadata: { full_name: user.name } } });

            // Update userProfileData with data from backend
            setUserProfileData(prev => ({
                ...prev,
                name: user.name || name || prev.name,
                avatarUrl: user.avatar_url || `https://i.pravatar.cc/150?u=${user.email}`,
            }));

            // Set role from backend (map backend roles to frontend roles)
            if (user.role) {
                let mappedRole: UserRole = 'learner';
                if (user.role === 'platform_admin') {
                    mappedRole = 'platform_admin';
                } else if (user.role === 'instructor') {
                    mappedRole = 'instructor';
                } else if (user.role === 'institution' || user.role === 'institution_admin') {
                    mappedRole = 'institution';
                } else {
                    // 'user', 'independent_learner', 'institution_learner', etc. -> learner
                    mappedRole = 'learner';
                }
                setUserRole(mappedRole);

                // For platform_admin, skip onboarding and go directly to admin dashboard
                if (mappedRole === 'platform_admin') {
                    setOnboardingStep('loaded');
                    navigateToView('admin-dashboard');
                    return;
                }
            }

            // If user already has a role from backend, they're past onboarding
            // Skip role selection if backend returns a valid role
            if (user.role && user.role !== 'user') {
                // User has completed registration with role selection on backend
                setOnboardingStep('loaded');
            } else {
                // Try to fetch additional profile from Supabase (for onboarding state)
                const profile = await fetchUserProfile(user.id);
                if (profile?.onboarding_completed) {
                    setOnboardingStep('loaded');
                } else {
                    setOnboardingStep('role-selection');
                }
            }
        } else {
            setOnboardingStep('role-selection');
        }
    }, [navigateToView]);

    const handleSelectRoleOnboarding = useCallback(async (role: UserRole) => {
        setUserRole(role);

        // For learner, go to personalization first to collect interests
        if (role === 'learner') {
            setOnboardingStep('personalization');
            return;
        }

        // For instructor/institution, complete onboarding via backend API
        try {
            await authService.completeOnboarding({
                accountType: role,
                interests: [],
            });
        } catch (e) {
            console.error("Error completing onboarding:", e);
        }

        // Also update Supabase for backward compatibility
        if (session && session.user) {
            try {
                await supabase.from('profiles').update({
                    role: role,
                    onboarding_step: 'loaded',
                    onboarding_completed: true
                }).eq('id', session.user.id);
            } catch (e) {
                console.error("Error updating role in Supabase:", e);
            }
        }

        setOnboardingStep('loaded');
        if (role === 'institution') {
            navigateToView('institution-dashboard');
        } else {
            navigateToView('instructor-dashboard');
        }
    }, [session, navigateToView]);

    const handlePersonalizationComplete = useCallback(async (interests: string[]) => {
        setLearnerInterests(interests);

        // Complete onboarding via backend API with learner role and interests
        try {
            await authService.completeOnboarding({
                accountType: 'learner',
                interests: interests,
            });
        } catch (e) {
            console.error("Error completing onboarding:", e);
        }

        // Also sync to Supabase for backward compatibility
        if (session) {
            supabase.from('learners_data').update({ skills: interests, interests: interests }).eq('id', session.user.id).then(({ error }) => {
                if (error) console.error("Error saving interests:", error);
            });
            supabase.from('profiles').update({ onboarding_step: 'welcome' }).eq('id', session.user.id).then();
        }
        setOnboardingStep('welcome');
    }, [session]);

    const handleSelectInstitutionPlan = useCallback((planName: string) => {
        setInstitutionSubscriptionPlan(planName);
    }, []);

    const handleWelcomeStart = useCallback(() => {
        if (session) {
            supabase.from('profiles').update({
                onboarding_step: 'loaded',
                onboarding_completed: true
            }).eq('id', session.user.id).then();
        }
        setOnboardingStep('loaded');
    }, [session]);

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
        navigateToView('course-builder');
    }, [userProfileData.name, navigateToView]);

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
        navigateToView('course-builder');
    }, [institutionData, navigateToView]);

    const handleEditCourse = useCallback((course: Course) => {
        setEditingCourse(course);
        navigateToView('course-builder');
    }, [navigateToView]);

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
            navigateToView('instructor-dashboard');
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
            navigateToView('institution-dashboard');
        }
        setEditingCourse(null);
    }, [userRole, navigateToView]);

    const handleViewAnalytics = useCallback((course: Course) => {
        setAnalyticsCourse(course);
        navigateToView('instructor-analytics');
    }, [navigateToView]);

    const handleNavigateToEditProfile = useCallback(() => {
        navigateToView('profile-editing');
    }, [navigateToView]);

    const handleSaveProfile = useCallback(async (updatedProfile: UserProfile) => {
        setUserProfileData(updatedProfile);

        // Sync to backend API
        if (authService.isAuthenticated()) {
            try {
                await authService.updateProfile({
                    name: updatedProfile.name,
                    username: updatedProfile.username,
                    bio: updatedProfile.bio,
                    avatar_url: updatedProfile.avatarUrl,
                    cover_image_url: updatedProfile.coverImageUrl,
                    title: updatedProfile.title,
                    location_city: updatedProfile.location?.city,
                    location_country: updatedProfile.location?.country,
                    skills: updatedProfile.skills,
                    social_links: updatedProfile.socialLinks,
                    learning_goals: updatedProfile.learningGoals,
                    mentorship_status: updatedProfile.mentorshipStatus,
                    target_career: updatedProfile.targetCareer
                });
            } catch (error) {
                console.error("Error saving profile to API:", error);
            }
        }

        // Also sync to Supabase for backward compatibility
        if (session) {
            const updates: any = {
                username: updatedProfile.username,
                bio: updatedProfile.bio,
                title: updatedProfile.title,
                location_city: updatedProfile.location?.city,
                location_country: updatedProfile.location?.country,
                skills: updatedProfile.skills,
                social_links: updatedProfile.socialLinks,
                learning_goals: updatedProfile.learningGoals,
                target_career: updatedProfile.targetCareer
            };

            // Also update main profile table for name/avatar
            supabase.from('profiles').update({
                full_name: updatedProfile.name,
                avatar_url: updatedProfile.avatarUrl
            }).eq('id', session.user.id).then();

            supabase.from('learners_data').update(updates).eq('id', session.user.id).then(({ error }) => {
                if (error) console.error("Error saving profile to DB:", error);
            });
        }

        navigateToView('profile');
    }, [session, navigateToView]);

    const handleSaveInstitutionProfile = useCallback((updatedData: FullInstitutionData) => {
        setInstitutionData(updatedData);
        navigateToView('institution-profile');
    }, [navigateToView]);

    const handleNavigateToSettings = useCallback(() => {
        if (userRole === 'learner') {
            navigateToView('profile-settings');
        } else if (userRole === 'instructor') {
            navigateToView('instructor-settings');
        } else if (userRole === 'institution') {
            navigateToView('institution-settings');
        }
    }, [userRole, navigateToView]);

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
                        onBack={() => navigateToView('dashboard')}
                        userProfile={userProfileData}
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
                        onBack={() => navigateToView(userRole === 'instructor' ? 'instructor-dashboard' : (userRole === 'institution' ? 'institution-dashboard' : 'dashboard'))}
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
                        onBack={() => navigateToView('course')}
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
                        onBack={() => navigateToView('course')}
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
                        onBack={() => navigateToView('course')}
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
                return <AITutorView userRole={userRole} initialTab={tutorActiveTab} onTabChange={setTutorActiveTab} />;
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
                    onBack={() => navigateToView('profile')}
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
                     <AdaptiveQuizView course={selectedCourse} quizLesson={currentQuiz} onBack={() => navigateToView('course')} />
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
                    rejoinSession={rejoinSession}
                    onRejoinSession={() => {
                        navigateToView('virtual-class');
                    }}
                />;
            case 'course-builder':
                return editingCourse ? (
                    <CourseBuilderView
                        initialCourse={editingCourse}
                        onSave={handleSaveCourse}
                        onBack={() => navigateToView(userRole === 'instructor' ? 'instructor-dashboard' : 'institution-dashboard')}
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
                    <InstructorAnalyticsView course={analyticsCourse} onBack={() => navigateToView('instructor-dashboard')} />
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
                return <InstitutionProfileView institutionData={institutionData} onNavigate={() => navigateToView('institution-profile-editing')} />;
            case 'institution-profile-editing':
                return <InstitutionProfileEditingView institutionData={institutionData} onSave={handleSaveInstitutionProfile} onBack={() => navigateToView('institution-profile')} />;
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
            case 'ai-architect':
                return <AIArchitectView userRole={userRole} />;
            case 'library':
                return userRole === 'institution' ? <CogniSacraInstitutionalLibraryView /> : <VirtualLibraryView userRole={userRole} initialTab={libraryActiveTab} onTabChange={setLibraryActiveTab} />;
            case 'institution-portal':
                return <InstitutionPortalView institutionData={institutionData} />;
            case 'virtual-class':
                return (
                    <VirtualClassroomView
                        userRole={userRole}
                        rejoinSessionToLoad={rejoinSession}
                        onClearRejoinSession={() => setRejoinSession(null)}
                        onLeaveClass={(sess) => {
                            if (userRole === 'instructor') {
                                setRejoinSession(sess);
                                navigateToView('instructor-dashboard');
                            } else if (userRole === 'institution') {
                                setRejoinSession(null);
                                navigateToView('virtual-class');
                            } else {
                                navigateToView('dashboard');
                            }
                        }}
                    />
                );
            // Platform Admin Views
            case 'admin-dashboard':
                return <AdminDashboardView onNavigate={navigateToView} />;
            case 'admin-users':
                return <AdminUsersView />;
            case 'admin-courses':
                return <AdminCoursesView onViewCourse={(courseId: string) => console.log('View course:', courseId)} />;
            case 'admin-library':
                return <AdminLibraryView onViewItem={(itemId: string) => console.log('View item:', itemId)} />;
            case 'admin-analytics':
                return <AdminDashboardView onNavigate={navigateToView} />;
            case 'admin-settings':
                return <AdminDashboardView onNavigate={navigateToView} />;
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
            case 'reset-password':
                return resetToken ? (
                    <ResetPasswordFormView
                        token={resetToken}
                        onSuccess={() => {
                            setResetToken(null);
                            window.history.replaceState({}, document.title, '/');
                            setOnboardingStep('auth');
                        }}
                        onBackToLogin={() => {
                            setResetToken(null);
                            window.history.replaceState({}, document.title, '/');
                            setOnboardingStep('auth');
                        }}
                    />
                ) : null;
            case 'role-selection':
                return <RoleSelectionView onSelectRole={handleSelectRoleOnboarding} />;
            case 'personalization':
                return <PersonalizationView onComplete={handlePersonalizationComplete} />;
            case 'welcome':
                return <WelcomeAssistantView onStart={handleWelcomeStart} />;
            default:
                return null;
        }
    };
    
    const renderAppContent = () => {
        if (!isAuthReady) {
            return (
                <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center animate-pulse">
                        <CogniSacraLogo className="w-40 h-40" />
                        <a
                            href="https://www.f6s.com/cognisacra"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 hover:opacity-80 transition-opacity"
                        >
                            <img src="/f6s.jpeg" alt="F6S" className="h-8 w-auto object-contain" />
                        </a>
                    </div>
                </div>
            );
        }
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
                        libraryActiveTab={libraryActiveTab}
                        tutorActiveTab={tutorActiveTab}
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
