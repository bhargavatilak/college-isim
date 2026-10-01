import React, { useState, useEffect } from 'react';
import { Search, History, ChevronRight, User, Eye, Archive, Play, Filter, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getStepName = (step: number) => {
    const steps = [
        'Initial Registration',
        'Academic Details',
        'Course/Program Selection',
        'Document Verification',
        'Eligibility Verification',
        'Application Review',
        'Merit/Selection',
        'Fee/Payment',
        'Final Verification',
        'Onboarding',
        'Enrollment Slip',
        'Complete'
    ];
    return steps[step - 1] || 'Unknown Stage';
};

export const ResumeRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [pausedAtFilter, setPausedAtFilter] = useState('All');
    const [programFilter, setProgramFilter] = useState('All');
    const [academicYearFilter, setAcademicYearFilter] = useState('2026-27');
    const [lastActivityFilter, setLastActivityFilter] = useState('Any');
    const [ageFilter, setAgeFilter] = useState('Any');

    const [drafts, setDrafts] = useState<any[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [activeSearch, setActiveSearch] = useState('');

    useEffect(() => {
        const savedDrafts = JSON.parse(localStorage.getItem('registration_drafts') || '[]');
        setDrafts(savedDrafts);
    }, []);

    const handleArchive = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if(confirm('Are you sure you want to archive this draft?')) {
            const newDrafts = drafts.filter(d => d.id !== id);
            setDrafts(newDrafts);
            localStorage.setItem('registration_drafts', JSON.stringify(newDrafts));
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setActiveSearch('');
        setStatusFilter('All');
        setPausedAtFilter('All');
        setProgramFilter('All');
        setAcademicYearFilter('2026-27');
        setLastActivityFilter('Any');
        setAgeFilter('Any');
        setShowAll(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const executeSearch = () => {
        setActiveSearch(searchTerm);
        setShowAll(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    const filteredDrafts = drafts.filter(draft => {
        // Privacy filter: only show if "showAll" is clicked OR a specific mobile number is searched
        if (!showAll) {
            if (activeSearch.trim().length < 4) return false;
            const matchesSearch = draft.phone?.includes(activeSearch) || draft.id.toLowerCase().includes(activeSearch.toLowerCase());
            if (!matchesSearch) return false;
        }

        const matchesProgram = programFilter === 'All' || draft.program === programFilter;
        
        return matchesProgram;
    });

    // Stats
    const totalPaused = drafts.length;
    const step1to3 = drafts.filter(d => d.step >= 1 && d.step <= 3).length;
    const step4to6 = drafts.filter(d => d.step >= 4 && d.step <= 6).length;
    const step7plus = drafts.filter(d => d.step >= 7).length;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Registration</h1>
                <p className="text-gray-500 text-sm mt-1">Search and continue incomplete admission applications</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by Name / Application ID / Mobile / Email" 
                        className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        onClick={executeSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Search
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                            <option>All</option>
                            <option>Paused</option>
                            <option>Needs Document</option>
                            <option>Pending Fee</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Paused At</label>
                        <select value={pausedAtFilter} onChange={(e) => setPausedAtFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                            <option>All</option>
                            <option>Step 1-3 (Initial)</option>
                            <option>Step 4-6 (Verification)</option>
                            <option>Step 7+ (Final)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Program</label>
                        <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                            <option>All</option>
                            <option>BTECH-CSE</option>
                            <option>MBA</option>
                            <option>BBA</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Academic Year</label>
                        <select value={academicYearFilter} onChange={(e) => setAcademicYearFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                            <option>2026-27</option>
                            <option>2025-26</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Last Activity</label>
                        <select value={lastActivityFilter} onChange={(e) => setLastActivityFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                            <option>Any</option>
                            <option>Today</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Application Age</label>
                        <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                            <option>Any</option>
                            <option>&lt; 30 Days</option>
                            <option>&gt; 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 text-sm">
                        <Filter size={16} /> Search
                    </button>
                    <button onClick={resetFilters} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 text-sm">
                        <RefreshCw size={16} /> Reset Filters
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">
                <div onClick={() => setShowAll(true)} className="flex-1 p-4 border-r border-gray-200 text-center cursor-pointer hover:bg-gray-50 transition">
                    <div className="text-2xl font-bold text-gray-900">{totalPaused}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Paused</div>
                </div>
                <div className="flex-1 p-4 border-r border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{step1to3}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Step 1-3</div>
                </div>
                <div className="flex-1 p-4 border-r border-gray-200 text-center">
                    <div className="text-2xl font-bold text-orange-600">{step4to6}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Step 4-6</div>
                </div>
                <div className="flex-1 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{step7plus}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Step 7+</div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                {filteredDrafts.map((draft) => {
                    const progressPercent = Math.round((draft.step / 11) * 100);
                    
                    return (
                        <div 
                            key={draft.id} 
                            onClick={() => navigate('/admission-cell/new-registration', { state: { resumeDraft: draft } })}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="p-5 flex flex-col md:flex-row gap-6">
                                {/* Left Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{draft.name}</h3>
                                                <div className="text-sm text-gray-500 flex flex-wrap gap-2 items-center mt-1">
                                                    <span className="font-medium text-gray-700">{draft.id}</span>
                                                    <span>•</span>
                                                    <span>{draft.phone || 'No Phone'}</span>
                                                    {draft.email && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{draft.email}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-sm font-medium text-blue-600 mt-1">
                                                    {draft.program || 'Program Not Selected'}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate('/admission-cell/new-registration', { state: { resumeDraft: draft } }); }}
                                            className="hidden md:flex px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-colors items-center gap-2"
                                        >
                                            Resume <ChevronRight size={18} />
                                        </button>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <div className="flex justify-between text-xs mb-1 font-semibold">
                                            <span className="text-gray-600">Progress: {draft.step} / 11</span>
                                            <span className="text-blue-600">{progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div>
                                            <span className="text-gray-500 block text-xs uppercase font-semibold">Current Stage</span>
                                            <span className="font-medium text-gray-900">{getStepName(draft.step)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block text-xs uppercase font-semibold">Status</span>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                                                <span className="font-medium text-gray-900">PAUSED <span className="text-gray-400 font-normal ml-1">• {draft.date}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Footer */}
                            <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex gap-3">
                                <button onClick={(e) => e.stopPropagation()} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-2">
                                    <Eye size={16} /> View Details
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate('/admission-cell/new-registration', { state: { resumeDraft: draft } }); }}
                                    className="md:hidden px-4 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Play size={16} /> Resume
                                </button>
                                <button onClick={(e) => handleArchive(e, draft.id)} className="px-4 py-1.5 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-red-50 flex items-center gap-2 ml-auto">
                                    <Archive size={16} /> Archive
                                </button>
                            </div>
                        </div>
                    );
                })}
                
                {filteredDrafts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <History size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Drafts Found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
