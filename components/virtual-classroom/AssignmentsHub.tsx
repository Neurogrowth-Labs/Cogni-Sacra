import React, { useState } from 'react';
import { FileText, Calendar, Award, CheckCircle, AlertCircle, Upload, Link2, Eye, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment } from './types';

interface AssignmentsHubProps {
  assignments: Assignment[];
  onSubmitWork: (id: string, file: string) => void;
  onGradeAssignment?: (id: string, score: string, feedback: string) => void;
  onAddAssignment?: (newAssignment: Assignment) => void;
  userRole?: 'learner' | 'instructor' | 'institution';
}

export const AssignmentsHub: React.FC<AssignmentsHubProps> = ({ 
  assignments, 
  onSubmitWork,
  onGradeAssignment,
  onAddAssignment,
  userRole = 'learner'
}) => {
  const isInstructor = userRole === 'instructor' || userRole === 'institution';
  const [selectedTag, setSelectedTag] = useState<'Assigned' | 'Submitted' | 'Past Due'>('Assigned');
  const [activeSubmit, setActiveSubmit] = useState<Assignment | null>(null);
  
  // Instructor States
  const [gradeScoreInput, setGradeScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignCourse, setNewAssignCourse] = useState('Data Structure & Algorithms');
  const [newAssignDate, setNewAssignDate] = useState('');
  const [newAssignPoints, setNewAssignPoints] = useState(100);

  // Student States
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const filtered = assignments.filter((a) => {
    if (selectedTag === 'Assigned') return a.status === 'Assigned';
    if (selectedTag === 'Submitted') return a.status === 'Submitted';
    return a.status === 'Past Due';
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0].name);
    }
  };

  const simulateUpload = (name: string) => {
    setFileName(name);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmit) return;

    const finalPath = githubUrl || fileName || 'Project_Final_Bundle.zip';
    onSubmitWork(activeSubmit.id, finalPath);

    // reset
    setFileName('');
    setGithubUrl('');
    setUploadProgress(null);
    setActiveSubmit(null);
  };

  return (
    <div id="assignments-hub" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <FileText className="text-indigo-600 w-5 h-5" />
            {isInstructor ? 'Assignments Grading Panel' : 'Classroom Assignments'}
          </h2>
          <p className="text-sm text-slate-500">
            {isInstructor 
              ? 'Moderate submissions, award grades, write feedback, and register new classroom tasks.' 
              : 'Track task boundaries, project submissions, and instructor review scores'}
          </p>
        </div>
        
        {isInstructor && (
          <button
            id="btn-add-assignment-modal"
            onClick={() => setShowAddAssignmentModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Create Task
          </button>
        )}
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['Assigned', 'Submitted', 'Past Due'] as const).map((tag) => (
            <button
              id={`tab-assign-${tag}`}
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setActiveSubmit(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedTag === tag ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tag} (
              {
                assignments.filter((a) => {
                  if (tag === 'Assigned') return a.status === 'Assigned';
                  if (tag === 'Submitted') return a.status === 'Submitted';
                  return a.status === 'Past Due';
                }).length
              }
              )
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assignment Lists */}
        <div className={activeSubmit ? 'lg:col-span-6 space-y-3' : 'lg:col-span-12 space-y-3'}>
          {filtered.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
              <CheckCircle className="mx-auto text-slate-300 w-12 h-12 mb-2" />
              <p className="text-sm font-medium">All caught up here!</p>
              <p className="text-xs text-slate-400">No assignments are present in this list.</p>
            </div>
          ) : (
            filtered.map((assignment) => (
              <div
                id={`assignment-card-${assignment.id}`}
                key={assignment.id}
                onClick={() => {
                  if (isInstructor) {
                    if (assignment.status === 'Submitted') {
                      setActiveSubmit(assignment);
                      setGradeScoreInput(assignment.score || '');
                      setFeedbackInput(assignment.feedback || '');
                    } else {
                      alert("You can only grade submitted assignments. This assignment is under outstanding status: " + assignment.status);
                    }
                  } else {
                    if (assignment.status === 'Assigned') {
                      setActiveSubmit(assignment);
                    }
                  }
                }}
                className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                  activeSubmit?.id === assignment.id
                    ? 'border-indigo-600 bg-indigo-50/10 shadow-sm'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {assignment.courseName}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-sm mt-1.5">{assignment.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        Due {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-amber-600">
                        <Award size={13} />
                        {assignment.points} Points possible
                      </span>
                    </div>
                  </div>

                  <div>
                    {assignment.status === 'Submitted' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                        <Check size={12} /> Received
                      </span>
                    ) : assignment.status === 'Past Due' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-rose-100 text-rose-800 rounded-full animate-pulse">
                        <AlertCircle size={12} /> Lagging
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {assignment.status === 'Submitted' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">
                        Submitted File:{' '}
                        <code className="bg-slate-100 text-slate-855 px-1.5 py-0.5 rounded text-[11px] font-mono">
                          {assignment.submittedAt || "Portfolio_Bundle.zip"}
                        </code>
                      </span>
                      {assignment.score ? (
                        <span className="font-extrabold text-indigo-750 bg-indigo-50 px-2.5 py-1 rounded-full">Graded Score: {assignment.score}</span>
                      ) : (
                        <span className="font-medium text-amber-650 bg-amber-50 px-2 py-0.5 rounded-full">Score Pending</span>
                      )}
                    </div>
                    {assignment.feedback && (
                      <div className="bg-slate-100/60 p-2 rounded-lg border border-slate-200/50 text-[11px] text-slate-650 leading-relaxed">
                        <strong className="text-slate-800">Feedback:</strong> "{assignment.feedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Submission Interactive Panel */}
        <AnimatePresence>
          {activeSubmit && (
            isInstructor ? (
              <motion.div
                id="grade-assignment-panel"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="lg:col-span-6 bg-slate-50 border border-amber-250 p-5 rounded-2xl h-fit shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Submissions Grade Station</h3>
                    <h4 className="font-extrabold text-slate-950 text-base">{activeSubmit.title}</h4>
                  </div>
                  <button
                    id="btn-close-grading"
                    onClick={() => setActiveSubmit(null)}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Student Submission Details</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Submitted Artifact:</span>
                    <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px] max-w-[150px] truncate">
                      {activeSubmit.submittedAt || "Courseware_Project_Draft.zip"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Points Bound:</span>
                    <span className="font-bold text-slate-900">{activeSubmit.points} pts max</span>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (onGradeAssignment) {
                    onGradeAssignment(activeSubmit.id, gradeScoreInput, feedbackInput);
                  }
                  setActiveSubmit(null);
                }} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-655 uppercase mb-1">
                      Award score *
                    </label>
                    <input
                      type="text"
                      required
                      value={gradeScoreInput}
                      onChange={(e) => setGradeScoreInput(e.target.value)}
                      placeholder="e.g. A+ or 95/100"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-655 uppercase mb-1">
                      Feedback / Improvement Advice
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Add specific mentorship advice or syntax improvements..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-confirm-grading"
                    className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition text-center shadow"
                  >
                    Commit Grade & Feedback
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                id="submit-assignment-panel"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="lg:col-span-6 bg-slate-50 border border-indigo-100 p-5 rounded-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Submitting Portfolio</h3>
                    <h4 className="font-extrabold text-slate-950 text-base">{activeSubmit.title}</h4>
                  </div>
                  <button
                    id="btn-close-submit"
                    onClick={() => setActiveSubmit(null)}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmission} className="space-y-4">
                  {/* Drag / Drop Zone */}
                  <div
                    id="uploader-drag-zone"
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                      dragActive ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload-input"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".zip,.pdf,.docx,.tsx,.py"
                    />
                    <label htmlFor="file-upload-input" className="cursor-pointer block">
                      <Upload className="mx-auto text-indigo-500 w-10 h-10 mb-2" />
                      <p className="text-xs font-bold text-slate-700">
                        Drag & drop your files, or <span className="text-indigo-600 hover:underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Accepts PDF, ZIP, DOCX, React Code (Max 50MB)</p>
                    </label>
                  </div>

                  {/* Progress Indicators */}
                  {fileName && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <p className="text-xs font-bold text-slate-800 truncate">{fileName}</p>
                        {uploadProgress !== null && (
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700">
                        {uploadProgress === 100 ? 'Complete' : `${uploadProgress}%`}
                      </span>
                    </div>
                  )}

                  {/* Share Repository option */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Or Share GitHub Repository / OneDrive link
                    </label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-2.5 text-slate-400" size={15} />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/your-username/repo-name"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1.5">
                    <button
                      type="submit"
                      disabled={!fileName && !githubUrl}
                      id="btn-final-submit"
                      className="flex-1 py-2 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <Sparkles size={13} />
                      Submit Portfolio
                    </button>
                  </div>
                </form>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Create New Task Modal (Instructor-only) */}
      <AnimatePresence>
        {showAddAssignmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              id="instructor-add-assignment-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-indigo-600" size={18} />
                Introduce Classroom Task
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (onAddAssignment) {
                  onAddAssignment({
                    id: Math.random().toString(),
                    title: newAssignTitle,
                    courseName: newAssignCourse,
                    dueDate: newAssignDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    points: Number(newAssignPoints),
                    status: 'Assigned',
                  });
                }
                setNewAssignTitle('');
                setShowAddAssignmentModal(false);
                alert("Successfully published new assignment to the students' task queue.");
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={newAssignTitle}
                    onChange={(e) => setNewAssignTitle(e.target.value)}
                    placeholder="e.g. Relational Database Joins Implementation"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase mb-1">Course Track</label>
                  <select
                    value={newAssignCourse}
                    onChange={(e) => setNewAssignCourse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  >
                    <option value="Data Structure & Algorithms">Data Structure & Algorithms</option>
                    <option value="Advanced React & TypeScript">Advanced React & TypeScript</option>
                    <option value="Database Engineering & PostgreSQL">Database Engineering & PostgreSQL</option>
                    <option value="AI-Powered Platform Architecture">AI-Powered Platform Architecture</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-650 uppercase mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newAssignDate}
                      onChange={(e) => setNewAssignDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-650 uppercase mb-1">Max Points</label>
                    <input
                      type="number"
                      value={newAssignPoints}
                      onChange={(e) => setNewAssignPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAssignmentModal(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-605 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Publish Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
