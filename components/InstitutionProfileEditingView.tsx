import React, { useState } from 'react';
import { FullInstitutionData, CampusLocation, Program, Course, GalleryItem, ImpactStory, Testimonial, OfficeHour } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import XMarkIcon from './icons/XMarkIcon';
import TrashIcon from './icons/TrashIcon';

interface InstitutionProfileEditingViewProps {
    institutionData: FullInstitutionData;
    onSave: (updatedData: FullInstitutionData) => void;
    onBack: () => void;
}

const InstitutionProfileEditingView: React.FC<InstitutionProfileEditingViewProps> = ({ institutionData, onSave, onBack }) => {
    const [data, setData] = useState(institutionData);
    const [newLocation, setNewLocation] = useState({ name: '', address: '' });
    const [newProgram, setNewProgram] = useState({ title: '', type: 'Micro-Credential', description: '' });
    const [newPhoto, setNewPhoto] = useState({ imageUrl: '', caption: '' });
    const [newStory, setNewStory] = useState({ title: '', author: '', content: '', imageUrl: '' });
    const [newTestimonial, setNewTestimonial] = useState({ name: '', quote: '', rating: 0 });
    const [newOfficeHour, setNewOfficeHour] = useState({ day: 'Monday', time: '', facultyName: '' });


    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({...prev, profile: {...prev.profile, [name]: value }}));
    };
    
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, profile: { ...prev.profile, contact: { ...prev.profile.contact, [name]: value } } }));
    };

    const handleSupportLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, profile: { ...prev.profile, supportLinks: { ...(prev.profile.supportLinks || {}), [name]: value } } }));
    };

    const handleAddLocation = () => {
        if (newLocation.name.trim() && newLocation.address.trim()) {
            const locationToAdd: CampusLocation = {
                id: `loc-${Date.now()}`,
                name: newLocation.name.trim(),
                address: newLocation.address.trim(),
                imageUrl: `https://picsum.photos/seed/campus${Date.now()}/400/250`
            };
            setData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    locations: [...prev.profile.locations, locationToAdd]
                }
            }));
            setNewLocation({ name: '', address: '' });
        }
    };
    
     const handleRemoveLocation = (id: string) => {
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                locations: prev.profile.locations.filter(loc => loc.id !== id)
            }
        }));
    };

    const handleAddProgram = () => {
        if (newProgram.title.trim() && newProgram.description.trim()) {
            const programToAdd: Program = {
                id: `prog-${Date.now()}`,
                title: newProgram.title.trim(),
                type: newProgram.type as Program['type'],
                description: newProgram.description.trim()
            };
            setData(prev => ({
                ...prev,
                programs: [...(prev.programs || []), programToAdd]
            }));
            setNewProgram({ title: '', type: 'Micro-Credential', description: '' });
        }
    };
    
    const handleRemoveProgram = (id: string) => {
        setData(prev => ({
            ...prev,
            programs: (prev.programs || []).filter(p => p.id !== id)
        }));
    };
    
    const handleCourseStatusChange = (courseId: string, status: Course['status']) => {
        setData(prev => ({
            ...prev,
            courses: (prev.courses || []).map(c => c.id === courseId ? { ...c, status } : c)
        }));
    };

    const handleRemoveGalleryItem = (id: string) => {
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                gallery: prev.profile.gallery.filter(p => p.id !== id)
            }
        }));
    };

    const handleAddGalleryItem = () => {
        if (newPhoto.imageUrl.trim() && newPhoto.caption.trim()) {
            const photoToAdd: GalleryItem = {
                id: `gal-${Date.now()}`,
                imageUrl: newPhoto.imageUrl.trim(),
                caption: newPhoto.caption.trim(),
            };
            setData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    gallery: [...(prev.profile.gallery || []), photoToAdd]
                }
            }));
            setNewPhoto({ imageUrl: '', caption: '' });
        }
    };
    
    const handleRemoveImpactStory = (id: string) => {
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                impactStories: prev.profile.impactStories.filter(s => s.id !== id)
            }
        }));
    };
    
    const handleAddImpactStory = () => {
        if (newStory.title.trim() && newStory.content.trim()) {
            const storyToAdd: ImpactStory = {
                id: `story-${Date.now()}`,
                imageUrl: newStory.imageUrl.trim() || `https://picsum.photos/seed/story${Date.now()}/400/250`,
                title: newStory.title,
                author: newStory.author,
                content: newStory.content
            };
             setData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    impactStories: [...(prev.profile.impactStories || []), storyToAdd]
                }
            }));
            setNewStory({ title: '', author: '', content: '', imageUrl: '' });
        }
    };

    const handleAddTestimonial = () => {
        if (newTestimonial.name.trim() && newTestimonial.quote.trim()) {
            const testimonialToAdd: Testimonial = {
                id: `test-${Date.now()}`,
                name: newTestimonial.name,
                quote: newTestimonial.quote,
                rating: newTestimonial.rating,
                avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
            };
            setData(prev => ({...prev, profile: {...prev.profile, testimonials: [...(prev.profile.testimonials || []), testimonialToAdd] }}));
            setNewTestimonial({ name: '', quote: '', rating: 0 });
        }
    };
    
    const handleRemoveTestimonial = (id: string) => {
        setData(prev => ({...prev, profile: {...prev.profile, testimonials: prev.profile.testimonials.filter(t => t.id !== id) }}));
    };

    const handleAddOfficeHour = () => {
        if (newOfficeHour.time.trim() && newOfficeHour.facultyName.trim()) {
            const officeHourToAdd: OfficeHour = {
                id: `oh-${Date.now()}`,
                ...newOfficeHour
            };
            setData(prev => ({...prev, profile: {...prev.profile, mentorshipProgram: {...prev.profile.mentorshipProgram, officeHours: [...(prev.profile.mentorshipProgram.officeHours || []), officeHourToAdd]}}}));
            setNewOfficeHour({ day: 'Monday', time: '', facultyName: '' });
        }
    };

    const handleRemoveOfficeHour = (id: string) => {
        setData(prev => ({...prev, profile: {...prev.profile, mentorshipProgram: {...prev.profile.mentorshipProgram, officeHours: prev.profile.mentorshipProgram.officeHours.filter(oh => oh.id !== id)}}}));
    };


    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <button onClick={onBack} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6 font-semibold">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Profile
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-10">
                 <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Edit Institution Profile</h1>
                    <button onClick={() => onSave(data)} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-lg">
                        Save Changes
                    </button>
                </div>

                {/* Basic Identity */}
                <div className="space-y-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Basic Identity</h3>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution Name</label>
                        <input type="text" name="name" id="name" value={data.name} onChange={e => setData(d => ({...d, name: e.target.value}))} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tagline</label>
                        <input type="text" name="tagline" id="tagline" value={data.profile.tagline} onChange={handleProfileChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300">About Section</label>
                        <textarea name="about" id="about" value={data.profile.about} onChange={handleProfileChange} rows={5} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                </div>

                 {/* Contact Info */}
                 <div className="space-y-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Contact & Support Links</h3>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium">Website</label>
                        <input type="url" name="website" id="website" value={data.profile.website} onChange={handleProfileChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium">Contact Email</label>
                        <input type="email" id="email" name="email" value={data.profile.contact.email} onChange={handleContactChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium">Contact Phone</label>
                        <input type="tel" id="phone" name="phone" value={data.profile.contact.phone} onChange={handleContactChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="faq" className="block text-sm font-medium">FAQ Link</label>
                        <input type="url" id="faq" name="faq" value={data.profile.supportLinks?.faq || ''} onChange={handleSupportLinkChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="helpDesk" className="block text-sm font-medium">Help Desk Link</label>
                        <input type="url" id="helpDesk" name="helpDesk" value={data.profile.supportLinks?.helpDesk || ''} onChange={handleSupportLinkChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="applicationPortal" className="block text-sm font-medium">Application Portal Link</label>
                        <input type="url" id="applicationPortal" name="applicationPortal" value={data.profile.supportLinks?.applicationPortal || ''} onChange={handleSupportLinkChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                </div>

                {/* Location Management */}
                 <div className="space-y-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Manage Locations</h3>
                     <div className="space-y-2">
                        {data.profile.locations.map(loc => (
                            <div key={loc.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div>
                                    <p className="font-semibold">{loc.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{loc.address}</p>
                                </div>
                                <button onClick={() => handleRemoveLocation(loc.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                     </div>
                     <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                        <h4 className="font-semibold mb-2">Add New Location</h4>
                        <input type="text" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} placeholder="Campus Name (e.g., Main Campus)" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                        <input type="text" value={newLocation.address} onChange={e => setNewLocation({...newLocation, address: e.target.value})} placeholder="Full Address" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                        <button onClick={handleAddLocation} className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                            + Add Location
                        </button>
                    </div>
                </div>
                 
                {/* Academic Offerings Management */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Academic Offerings</h3>
                    
                    <div className="pt-4 space-y-2">
                        <h4 className="font-semibold mb-2">Manage Programs</h4>
                        {data.programs?.map(prog => (
                            <div key={prog.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div>
                                    <p className="font-semibold">{prog.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{prog.type}</p>
                                </div>
                                <button onClick={() => handleRemoveProgram(prog.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                        <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                            <h5 className="font-semibold mb-2">Add New Program</h5>
                            <input type="text" value={newProgram.title} onChange={e => setNewProgram({...newProgram, title: e.target.value})} placeholder="Program Title" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <select value={newProgram.type} onChange={e => setNewProgram({...newProgram, type: e.target.value})} className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm">
                                <option>Micro-Credential</option>
                                <option>Professional Certificate</option>
                                <option>Degree Pathway</option>
                            </select>
                            <textarea value={newProgram.description} onChange={e => setNewProgram({...newProgram, description: e.target.value})} placeholder="Program Description" rows={3} className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <button onClick={handleAddProgram} className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                + Add Program
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <h4 className="font-semibold mb-2">Manage Course Listings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Set the visibility of courses on your public profile.</p>
                        <div className="space-y-2">
                            {data.courses?.map(course => (
                                <div key={course.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <p className="font-semibold">{course.title}</p>
                                    <select 
                                        value={course.status} 
                                        onChange={(e) => handleCourseStatusChange(course.id, e.target.value as Course['status'])}
                                        className="text-sm rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 shadow-sm"
                                    >
                                        <option value="active">Active</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Multimedia & Storytelling */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Multimedia & Storytelling</h3>
                    
                    <div>
                        <label htmlFor="videoIntroductionUrl" className="block text-sm font-medium">Video Introduction URL (YouTube Embed)</label>
                        <input 
                            type="url" 
                            id="videoIntroductionUrl" 
                            name="videoIntroductionUrl" 
                            value={data.profile.videoIntroductionUrl || ''} 
                            onChange={handleProfileChange} 
                            placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                            className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"
                        />
                    </div>

                    <div className="pt-4 space-y-2">
                        <h4 className="font-semibold mb-2">Manage Photo Gallery</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {data.profile.gallery?.map(photo => (
                                <div key={photo.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <img src={photo.imageUrl} alt={photo.caption} className="w-16 h-10 object-cover rounded" />
                                        <p className="text-sm font-semibold truncate">{photo.caption}</p>
                                    </div>
                                    <button onClick={() => handleRemoveGalleryItem(photo.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 flex-shrink-0">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                            <h5 className="font-semibold mb-2">Add New Photo</h5>
                            <input type="url" value={newPhoto.imageUrl} onChange={e => setNewPhoto({...newPhoto, imageUrl: e.target.value})} placeholder="Image URL" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <input type="text" value={newPhoto.caption} onChange={e => setNewPhoto({...newPhoto, caption: e.target.value})} placeholder="Caption" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <button onClick={handleAddGalleryItem} className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                + Add Photo to Gallery
                            </button>
                        </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                        <h4 className="font-semibold mb-2">Manage Impact Stories</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {data.profile.impactStories?.map(story => (
                                <div key={story.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <div>
                                        <p className="font-semibold">{story.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{story.author}</p>
                                    </div>
                                    <button onClick={() => handleRemoveImpactStory(story.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                            <h5 className="font-semibold mb-2">Add New Impact Story</h5>
                            <input type="text" value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})} placeholder="Story Title" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <input type="text" value={newStory.author} onChange={e => setNewStory({...newStory, author: e.target.value})} placeholder="Author (e.g., Alumnus Name)" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <textarea value={newStory.content} onChange={e => setNewStory({...newStory, content: e.target.value})} placeholder="Story Content" rows={3} className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <input type="url" value={newStory.imageUrl} onChange={e => setNewStory({...newStory, imageUrl: e.target.value})} placeholder="Image URL (Optional)" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            <button onClick={handleAddImpactStory} className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                + Add Impact Story
                            </button>
                        </div>
                    </div>
                </div>

                {/* Learner & Community Engagement */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Learner & Community Engagement</h3>
                    
                    <div className="pt-4 space-y-2">
                        <h4 className="font-semibold mb-2">Manage Testimonials</h4>
                        {data.profile.testimonials?.map(t => (
                             <div key={t.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div>
                                    <p className="font-semibold">{t.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">"{t.quote}"</p>
                                </div>
                                <button onClick={() => handleRemoveTestimonial(t.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                        <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                             <h5 className="font-semibold mb-2">Add New Testimonial</h5>
                             <input type="text" value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})} placeholder="Learner's Name" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                             <textarea value={newTestimonial.quote} onChange={e => setNewTestimonial({...newTestimonial, quote: e.target.value})} placeholder="Quote" rows={3} className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                             <input type="number" min="1" max="5" value={newTestimonial.rating || ''} onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value) || 0})} placeholder="Rating (1-5)" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                             <button onClick={handleAddTestimonial} className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                + Add Testimonial
                            </button>
                        </div>
                    </div>

                     <div className="pt-4 space-y-2">
                        <h4 className="font-semibold mb-2">Manage Mentorship Program</h4>
                        <textarea 
                            value={data.profile.mentorshipProgram.description} 
                            onChange={e => setData(prev => ({...prev, profile: {...prev.profile, mentorshipProgram: {...prev.profile.mentorshipProgram, description: e.target.value}}}))}
                            placeholder="Program Description" rows={4} className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                        
                        <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                            <h5 className="font-semibold mb-2">Manage Office Hours</h5>
                             {data.profile.mentorshipProgram.officeHours?.map(oh => (
                                <div key={oh.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <p className="text-sm font-semibold">{oh.day}, {oh.time} - {oh.facultyName}</p>
                                    <button onClick={() => handleRemoveOfficeHour(oh.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                             <div className="pt-2 border-t dark:border-gray-700 grid grid-cols-3 gap-2">
                                <select value={newOfficeHour.day} onChange={e => setNewOfficeHour({...newOfficeHour, day: e.target.value})} className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm">
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                </select>
                                <input type="text" value={newOfficeHour.time} onChange={e => setNewOfficeHour({...newOfficeHour, time: e.target.value})} placeholder="Time (e.g., 2-4 PM)" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                                <input type="text" value={newOfficeHour.facultyName} onChange={e => setNewOfficeHour({...newOfficeHour, facultyName: e.target.value})} placeholder="Faculty Name" className="block w-full text-sm rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                             </div>
                              <button onClick={handleAddOfficeHour} className="w-full mt-2 py-2 text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                + Add Office Hour
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstitutionProfileEditingView;