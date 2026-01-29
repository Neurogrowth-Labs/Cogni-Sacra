
import React, { useState } from 'react';
import { Course, Module, Lesson, UserRole, FacultyMember, QuizQuestion, QuizOption, Resource } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import SparklesIcon from './icons/SparklesIcon';
import AITutorView from './AITutorView';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
// FIX: Import missing XMarkIcon component to resolve 'Cannot find name' error.
import XMarkIcon from './icons/XMarkIcon';
import { getLessonIcon, getResourceIcon } from './utils/uiUtils';
import LockClosedIcon from './icons/LockClosedIcon';

interface CourseBuilderViewProps {
    initialCourse: Course;
    onSave: (updatedCourse: Course) => void;
    onBack: () => void;
    userRole: UserRole;
    faculty?: FacultyMember[];
}

const CourseBuilderView: React.FC<CourseBuilderViewProps> = ({ initialCourse, onSave, onBack, userRole, faculty }) => {
    const [course, setCourse] = useState<Course>({
        level: 'Beginner',
        priceType: 'free',
        price: 0,
        ...initialCourse,
    });
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "priceType") {
            setCourse(prev => ({ ...prev, priceType: value as Course['priceType'], price: value === 'free' ? 0 : prev.price }));
        } else if (name === "price") {
            setCourse(prev => ({ ...prev, price: parseFloat(value) || 0 }));
        } else {
            setCourse(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleModuleChange = (moduleId: string, newTitle: string) => {
        setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m) }));
    };

    const handleModulePrereqChange = (moduleId: string, prereqId: string) => {
        setCourse(prev => {
            const moduleIndex = prev.modules.findIndex(m => m.id === moduleId);
            if (moduleIndex === -1) return prev;

            const module = prev.modules[moduleIndex];
            const currentPrereqs = module.prerequisites || [];
            let newPrereqs;

            if (currentPrereqs.includes(prereqId)) {
                newPrereqs = currentPrereqs.filter(id => id !== prereqId);
            } else {
                newPrereqs = [...currentPrereqs, prereqId];
            }

            const newModules = [...prev.modules];
            newModules[moduleIndex] = { ...module, prerequisites: newPrereqs };
            return { ...prev, modules: newModules };
        });
    };

    const handleLessonFieldChange = (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => {
        setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) } : m) }));
    };

    const handleAddModule = () => {
        const newModule: Module = { id: `mod-${Date.now()}`, title: 'New Module', lessons: [] };
        setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
    };
    
    const handleAddLesson = (moduleId: string) => {
        const newLesson: Lesson = { id: `les-${Date.now()}`, title: 'New Lesson', duration: '10 min', isCompleted: false, format: 'video', questions: [] };
        setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m) }));
    };

    const handleRemoveModule = (moduleId: string) => {
        if (window.confirm('Are you sure you want to delete this module and all its lessons?')) {
            setCourse(prev => ({ ...prev, modules: prev.modules.filter(m => m.id !== moduleId) }));
        }
    };

    const handleRemoveLesson = (moduleId: string, lessonId: string) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m) }));
        }
    };
    
    const handleQuizChange = (moduleId: string, lessonId: string, updatedQuestions: QuizQuestion[]) => {
        handleLessonFieldChange(moduleId, lessonId, 'questions', updatedQuestions);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8 max-h-[calc(100vh-10rem)] animate-fade-in">
            {/* Left Panel: Course Structure */}
            <div className="w-full lg:w-1/2 flex flex-col">
                <div className="flex-shrink-0">
                    <button onClick={onBack} className="flex items-center text-crimson dark:text-red-400 hover:underline mb-4 font-semibold">
                        <ChevronLeftIcon className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Course Builder</h1>
                         <button onClick={() => onSave({ ...course, isDraft: false })} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-lg transition-transform hover:scale-105">
                            Save & Publish
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 space-y-4 pb-4">
                    {/* Course Details Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-serif mb-4">Course Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
                                <input type="text" name="title" id="title" value={course.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea name="description" id="description" value={course.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="imageUrl" className="block text-sm font-medium">Image URL</label>
                                    <input type="url" name="imageUrl" id="imageUrl" value={course.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                                </div>
                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium">Difficulty Level</label>
                                    <select name="level" id="level" value={course.level} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-crimson focus:ring-crimson">
                                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                                    </select>
                                </div>
                                {userRole === 'institution' && faculty && (
                                    <div className="md:col-span-2">
                                        <label htmlFor="instructor" className="block text-sm font-medium">Instructor</label>
                                        <select name="instructor" id="instructor" value={course.instructor} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-crimson focus:ring-crimson">
                                            {faculty.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Pricing */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pricing</h3>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                            <div className="flex items-center"><input type="radio" id="free" name="priceType" value="free" checked={course.priceType === 'free'} onChange={handleChange} className="h-4 w-4 text-crimson border-gray-300 focus:ring-crimson" /><label htmlFor="free" className="ml-2 text-sm font-medium">Free</label></div>
                            <div className="flex items-center"><input type="radio" id="one-time" name="priceType" value="one-time" checked={course.priceType === 'one-time'} onChange={handleChange} className="h-4 w-4 text-crimson border-gray-300 focus:ring-crimson" /><label htmlFor="one-time" className="ml-2 text-sm font-medium">One-Time</label></div>
                        </div>
                        {course.priceType !== 'free' && (
                            <div className="mt-3">
                                <label htmlFor="price" className="block text-sm font-medium">Price ($)</label>
                                <input type="number" name="price" id="price" value={course.price} onChange={handleChange} className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-crimson focus:ring-crimson" min="0" step="0.01" />
                            </div>
                        )}
                    </div>
                    {/* Modules & Lessons */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-serif">Curriculum</h2>
                        {course.modules.map((module, index) => {
                            const previousModules = course.modules.slice(0, index);
                            return (
                                <div key={module.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <input type="text" value={module.title} onChange={(e) => handleModuleChange(module.id, e.target.value)} className="w-full font-bold text-md bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-crimson pb-1"/>
                                        <button onClick={() => handleRemoveModule(module.id)} className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full flex-shrink-0" aria-label={`Delete module: ${module.title}`}><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                    
                                    {/* Prerequisites Selection */}
                                    {previousModules.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center mb-2">
                                                <LockClosedIcon className="w-3 h-3 text-gray-500 mr-1" />
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prerequisites</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {previousModules.map(prevMod => {
                                                    const isSelected = module.prerequisites?.includes(prevMod.id);
                                                    return (
                                                        <button
                                                            key={prevMod.id}
                                                            onClick={() => handleModulePrereqChange(module.id, prevMod.id)}
                                                            className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 flex items-center ${
                                                                isSelected 
                                                                ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-200 font-medium' 
                                                                : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {prevMod.title || 'Untitled Module'}
                                                            {isSelected && <span className="ml-1.5 font-bold">✓</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600 ml-1">
                                        {module.lessons.map(lesson => (
                                            <LessonEditor 
                                                key={lesson.id}
                                                lesson={lesson} 
                                                moduleId={module.id} 
                                                isExpanded={expandedLessonId === lesson.id}
                                                onToggle={() => setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id)}
                                                onLessonChange={handleLessonFieldChange}
                                                onQuizChange={handleQuizChange}
                                                onRemove={() => handleRemoveLesson(module.id, lesson.id)}
                                            />
                                        ))}
                                        <button onClick={() => handleAddLesson(module.id)} className="w-full mt-2 py-2 text-sm font-semibold text-crimson border-2 border-dashed border-crimson/30 rounded-lg hover:bg-crimson/5 dark:hover:bg-crimson/10 flex items-center justify-center transition-colors"><PlusIcon className="w-4 h-4 mr-2"/>Add Lesson</button>
                                    </div>
                                </div>
                            );
                        })}
                        <button onClick={handleAddModule} className="w-full mt-4 py-3 text-md font-semibold text-crimson border-2 border-dashed border-crimson/50 rounded-xl hover:bg-crimson/5 dark:hover:bg-crimson/10 flex items-center justify-center transition-all hover:shadow-md"><PlusIcon className="w-5 h-5 mr-2" />Add Module</button>
                    </div>
                </div>
            </div>
            {/* Right Panel: AI Content Architect */}
            <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 flex items-center mb-4">
                    <SparklesIcon className="w-8 h-8 text-crimson" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-3 font-serif">AI Content Architect</h2>
                </div>
                <div className="flex-1 min-h-0">
                    <AITutorView isEmbedded={true} userRole={userRole} />
                </div>
            </div>
        </div>
    );
};

const ResourceEditor: React.FC<{
    resources: Resource[];
    onResourcesChange: (resources: Resource[]) => void;
}> = ({ resources, onResourcesChange }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [format, setFormat] = useState<Resource['format']>('link');

    const handleAdd = () => {
        if (!name.trim() || !url.trim()) return;
        const newResource: Resource = {
            id: `res-${Date.now()}`,
            name: name.trim(),
            url: url.trim(),
            format,
        };
        onResourcesChange([...resources, newResource]);
        setName('');
        setUrl('');
        setFormat('link');
    };

    const handleRemove = (id: string) => {
        onResourcesChange(resources.filter(res => res.id !== id));
    };

    return (
        <div className="space-y-3">
            {resources.map(res => (
                <div key={res.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                    <div className="flex items-center space-x-2">
                        {getResourceIcon(res.format, 'w-5 h-5 flex-shrink-0')}
                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate">{res.name}</a>
                    </div>
                    <button onClick={() => handleRemove(res.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 flex-shrink-0">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                </div>
            ))}
            <div className="pt-2 border-t dark:border-gray-700 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Resource Name" className="w-full text-sm p-1.5 border rounded-md dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" className="w-full text-sm p-1.5 border rounded-md dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select value={format} onChange={e => setFormat(e.target.value as Resource['format'])} className="w-full text-sm p-1.5 border rounded-md dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson">
                        <option value="link">Link</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="zip">ZIP</option>
                    </select>
                    <button onClick={handleAdd} className="w-full text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 flex items-center justify-center">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Resource
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sub-component for editing a lesson
const LessonEditor: React.FC<{
    lesson: Lesson;
    moduleId: string;
    isExpanded: boolean;
    onToggle: () => void;
    onLessonChange: (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => void;
    onQuizChange: (moduleId: string, lessonId: string, questions: QuizQuestion[]) => void;
    onRemove: () => void;
}> = ({ lesson, moduleId, isExpanded, onToggle, onLessonChange, onQuizChange, onRemove }) => {

    const renderFormatSpecificFields = () => {
        switch (lesson.format) {
            case 'video':
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium">Video URL</label>
                            <input type="url" value={lesson.videoUrl || ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Transcript</label>
                            <textarea value={lesson.transcript || ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'transcript', e.target.value)} rows={5} className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                    </div>
                );
            case 'reading':
                return (
                    <div>
                        <label className="text-xs font-medium">Content</label>
                        <textarea value={lesson.content || ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'content', e.target.value)} rows={8} className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                    </div>
                );
            case 'project':
                return (
                     <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium">Project Brief</label>
                            <textarea value={lesson.projectBrief || ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'projectBrief', e.target.value)} rows={5} className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                         <div>
                            <label className="text-xs font-medium">Deadline</label>
                            <input type="date" value={lesson.deadline ? lesson.deadline.split('T')[0] : ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'deadline', e.target.value ? new Date(e.target.value).toISOString() : '')} className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                    </div>
                );
            case 'live-session':
                 return (
                     <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium">Session Time</label>
                            <input type="datetime-local" value={lesson.sessionTime ? lesson.sessionTime.slice(0, 16) : ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'sessionTime', e.target.value ? new Date(e.target.value).toISOString() : '')} className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                         <div>
                            <label className="text-xs font-medium">Session URL</label>
                            <input type="url" value={lesson.liveSessionUrl || ''} onChange={(e) => onLessonChange(moduleId, lesson.id, 'liveSessionUrl', e.target.value)} placeholder="https://meet.google.com/..." className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                    </div>
                );
            case 'quiz':
                return <QuizBuilder questions={lesson.questions || []} onQuizChange={(q) => onQuizChange(moduleId, lesson.id, q)} />;
            default:
                return <p className="text-sm text-gray-500">No specific options for this format.</p>;
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-700">
            <div className="p-2 flex items-center justify-between">
                <div className="flex items-center flex-grow">
                    {getLessonIcon(lesson.format, 'w-5 h-5 mr-2 flex-shrink-0')}
                    <input type="text" value={lesson.title} onChange={(e) => onLessonChange(moduleId, lesson.id, 'title', e.target.value)} className="w-full text-sm font-semibold bg-transparent focus:outline-none focus:ring-1 focus:ring-crimson rounded-sm p-1" />
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={onToggle} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-expanded={isExpanded}>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={onRemove} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" aria-label={`Delete lesson: ${lesson.title}`}>
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Format</label>
                            <select value={lesson.format} onChange={(e) => onLessonChange(moduleId, lesson.id, 'format', e.target.value)} className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson">
                                <option value="video">Video</option><option value="reading">Reading</option><option value="quiz">Quiz</option><option value="live-session">Live Session</option><option value="project">Project</option><option value="metaverse">Metaverse</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Duration</label>
                            <input type="text" value={lesson.duration} onChange={(e) => onLessonChange(moduleId, lesson.id, 'duration', e.target.value)} placeholder="e.g., 25 min" className="mt-1 block w-full text-sm p-1.5 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" />
                        </div>
                    </div>
                    {renderFormatSpecificFields()}
                    <div className="pt-4 border-t dark:border-gray-600 mt-4">
                        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Resources</h4>
                        <ResourceEditor
                            resources={lesson.resources || []}
                            onResourcesChange={(newResources) => onLessonChange(moduleId, lesson.id, 'resources', newResources)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for building quizzes
const QuizBuilder: React.FC<{
    questions: QuizQuestion[];
    onQuizChange: (questions: QuizQuestion[]) => void;
}> = ({ questions, onQuizChange }) => {

    const updateQuestion = (qId: string, updatedQ: Partial<QuizQuestion>) => {
        onQuizChange(questions.map(q => q.id === qId ? {...q, ...updatedQ} : q));
    };

    const addQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `q-${Date.now()}`,
            questionText: '',
            options: [{ id: `o-${Date.now()}`, text: '' }],
            correctOptionId: '',
        };
        onQuizChange([...questions, newQuestion]);
    };
    
    const removeQuestion = (qId: string) => {
        onQuizChange(questions.filter(q => q.id !== qId));
    };
    
    const addOption = (qId: string) => {
        const newOption: QuizOption = { id: `o-${Date.now()}`, text: '' };
        const updatedQuestions = questions.map(q => q.id === qId ? {...q, options: [...q.options, newOption]} : q);
        onQuizChange(updatedQuestions);
    };

    const updateOption = (qId: string, oId: string, text: string) => {
         const updatedQuestions = questions.map(q => q.id === qId ? {...q, options: q.options.map(o => o.id === oId ? {...o, text} : o)} : q);
        onQuizChange(updatedQuestions);
    };
    
    const removeOption = (qId: string, oId: string) => {
        const updatedQuestions = questions.map(q => q.id === qId ? {...q, options: q.options.filter(o => o.id !== oId)} : q);
        onQuizChange(updatedQuestions);
    };


    return (
        <div className="space-y-4">
            {questions.map((q, qIndex) => (
                <div key={q.id} className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md border dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold">Question {qIndex + 1}</label>
                        <button onClick={() => removeQuestion(q.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button>
                    </div>
                    <textarea value={q.questionText} onChange={e => updateQuestion(q.id, { questionText: e.target.value })} placeholder="Question text..." rows={2} className="w-full text-sm p-1.5 border rounded-md dark:bg-gray-800 focus:border-crimson focus:ring-crimson" />
                    <div className="mt-2 space-y-2">
                        {q.options.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <input type="radio" name={`correct-ans-${q.id}`} checked={q.correctOptionId === opt.id} onChange={() => updateQuestion(q.id, { correctOptionId: opt.id })} />
                                <input type="text" value={opt.text} onChange={e => updateOption(q.id, opt.id, e.target.value)} placeholder="Option text..." className="flex-grow text-sm p-1.5 border rounded-md dark:bg-gray-800 focus:border-crimson focus:ring-crimson" />
                                <button onClick={() => removeOption(q.id, opt.id)}><XMarkIcon className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        ))}
                        <button onClick={() => addOption(q.id)} className="text-xs font-semibold text-blue-600 hover:underline">+ Add Option</button>
                    </div>
                     <textarea value={q.explanation || ''} onChange={e => updateQuestion(q.id, { explanation: e.target.value })} placeholder="Explanation for correct answer (optional)..." rows={1} className="w-full text-xs p-1 mt-2 border rounded-md dark:bg-gray-800 focus:border-crimson focus:ring-crimson" />
                </div>
            ))}
            <button onClick={addQuestion} className="w-full mt-2 py-1.5 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 flex items-center justify-center">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Question
            </button>
        </div>
    );
};

export default CourseBuilderView;
