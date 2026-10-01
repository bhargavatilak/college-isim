import React from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const Calendar: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
                    <p className="text-gray-500">Manage university events, holidays, and term schedules</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus size={20} />
                    <span>Add Event</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">September 2026</h2>
                        <div className="flex gap-2">
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft size={20} /></button>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                                {day}
                            </div>
                        ))}
                        {Array.from({length: 30}).map((_, i) => (
                            <div key={i} className={`bg-white min-h-[100px] p-2 ${i === 14 ? 'bg-purple-50' : ''}`}>
                                <span className={`text-sm ${i === 14 ? 'font-bold text-purple-600' : 'text-gray-700'}`}>{i + 1}</span>
                                {i === 4 && <div className="mt-1 text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">Holiday</div>}
                                {i === 14 && <div className="mt-1 text-xs bg-purple-200 text-purple-800 px-1 py-0.5 rounded">Mid Terms</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-purple-600" />
                        Upcoming Events
                    </h2>
                    <div className="space-y-4">
                        {[
                            { title: 'Mid Term Exams', date: 'Sep 15 - Sep 20', type: 'Academic' },
                            { title: 'Registration Deadline', date: 'Sep 25', type: 'Administrative' },
                            { title: 'National Holiday', date: 'Oct 02', type: 'Holiday' }
                        ].map((event, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px]">
                                    <span className="text-xs text-gray-500">{event.date.split(' ')[0]}</span>
                                    <span className="text-lg font-bold text-gray-900">{event.date.split(' ')[1]}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                        <Clock size={12} /> {event.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
