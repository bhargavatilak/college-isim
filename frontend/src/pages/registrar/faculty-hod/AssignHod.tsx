import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ShieldAlert, CheckCircle, Search, UserCheck, Lock, FileText, Calendar, Key } from 'lucide-react';

export const AssignHod: React.FC = () => {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
    const [department, setDepartment] = useState('');
    const [tenureStart, setTenureStart] = useState('');
    const [tenureEnd, setTenureEnd] = useState('');
    
    // New state fields
    const [departmentsList, setDepartmentsList] = useState<any[]>([]);
    const [appointmentNumber, setAppointmentNumber] = useState(`APPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    const [remarks, setRemarks] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [confirmCheckbox, setConfirmCheckbox] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchFaculty();
        fetchDepartments();
    }, []);

    const fetchFaculty = async () => {
        const { data } = await supabase.from('faculty').select('*').eq('status', 'ACTIVE');
        if (data) setFaculty(data);
    };

    const fetchDepartments = async () => {
        const { data, error } = await supabase.from('departments').select('*');
        if (data) {
            setDepartmentsList(data);
        } else {
            console.error('Failed to fetch departments:', error);
        }
    };

    const handleAssign = async () => {
        if (!selectedFaculty || !department || !tenureStart || !appointmentNumber) {
            setMessage('Error: Please fill in all required fields.');
            return;
        }

        if (selectedFaculty.department !== department) {
            setMessage(`Error: Selected faculty member belongs to ${selectedFaculty.department || 'another department'}, not ${department}.`);
            return;
        }

        if (!confirmCheckbox) {
            setMessage('Error: You must confirm the assignment by checking the box.');
            return;
        }

        if (!authPassword || authPassword !== 'admin123') {
            setMessage('Error: Invalid authorization password.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Check if department already has an active HOD
            const { data: existingHod, error: checkError } = await supabase
                .from('hod_assignments')
                .select('*')
                .eq('department', department)
                .eq('status', 'ACTIVE');
            
            if (checkError) throw checkError;
            
            if (existingHod && existingHod.length > 0) {
                setMessage(`Error: The department ${department} already has an ACTIVE HOD.`);
                setLoading(false);
                return;
            }

            // Generate HOD ID: HOD-DEPT-XXX
            const deptPrefix = department.substring(0, 3).toUpperCase();
            const hodId = `HOD-${deptPrefix}-${Math.floor(100 + Math.random() * 900)}`;

            const { error } = await supabase.from('hod_assignments').insert([{
                faculty_id: selectedFaculty.id,
                hod_id: hodId,
                department,
                start_date: tenureStart,
                end_date: tenureEnd || null,
                status: 'ACTIVE',
                appointment_number: appointmentNumber,
                remarks: remarks
            }]);

            if (error) throw error;

            setMessage(`Successfully assigned HOD role. New HOD ID: ${hodId}`);
            setSelectedFaculty(null);
            setDepartment('');
            setTenureStart('');
            setTenureEnd('');
            setAppointmentNumber(`APPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
            setRemarks('');
            setAuthPassword('');
            setConfirmCheckbox(false);
        } catch (err: any) {
            console.error(err);
            setMessage(`Error: ${err.message || 'Failed to assign HOD'}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredFaculty = faculty.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.faculty_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.department && f.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Left Column - Selection */}
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assign HOD</h1>
                    <p className="text-gray-500">Elevate an existing faculty member to Head of Department.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[700px]">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-medium text-gray-900 mb-4">Select Faculty Member</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search faculty..." 
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {filteredFaculty.map(f => (
                            <div 
                                key={f.id}
                                onClick={() => setSelectedFaculty(f)}
                                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors mb-1 ${selectedFaculty?.id === f.id ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50 border border-transparent'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                    {f.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">{f.name}</div>
                                    <div className="text-xs text-gray-500">{f.faculty_id} • {f.department}</div>
                                </div>
                                {selectedFaculty?.id === f.id && (
                                    <CheckCircle size={20} className="text-purple-600" />
                                )}
                            </div>
                        ))}
                        {filteredFaculty.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No active faculty members found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column - Assignment Form */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6 pt-0 lg:pt-14">
                {message && (
                    <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {message}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <ShieldAlert size={20} className="text-purple-600" />
                            Role Assignment Details
                        </h2>
                    </div>

                    <div className="p-6 flex flex-col gap-6">
                        {!selectedFaculty ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 text-center">
                                <UserCheck size={48} className="mb-4 opacity-30" />
                                <p>Select a faculty member from the list to continue.</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-lg shadow-sm">
                                        {selectedFaculty.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-purple-900">{selectedFaculty.name}</div>
                                        <div className="text-sm text-purple-700">Faculty ID: {selectedFaculty.faculty_id} • Dept: {selectedFaculty.department}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Department <span className="text-red-500">*</span></label>
                                        <select
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white text-sm"
                                        >
                                            <option value="">Select Department...</option>
                                            {departmentsList.map((d: any) => (
                                                <option key={d.id} value={d.name || d.department_name}>{d.name || d.department_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment No. <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                value={appointmentNumber}
                                                onChange={(e) => setAppointmentNumber(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tenure Start Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="date"
                                                value={tenureStart}
                                                onChange={(e) => setTenureStart(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tenure End Date (Optional)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="date"
                                                value={tenureEnd}
                                                onChange={(e) => setTenureEnd(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        rows={2}
                                        placeholder="Add any additional notes about this appointment..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm resize-none"
                                    ></textarea>
                                </div>

                                {/* Authorization Section */}
                                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-5">
                                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                                        <Lock size={16} className="text-gray-500" />
                                        Authorization Required
                                    </h3>
                                    
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Registrar Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="password"
                                                    value={authPassword}
                                                    onChange={(e) => setAuthPassword(e.target.value)}
                                                    placeholder="Enter admin password (admin123)"
                                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm"
                                                />
                                            </div>
                                        </div>
                                        
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={confirmCheckbox}
                                                onChange={(e) => setConfirmCheckbox(e.target.checked)}
                                                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-600 leading-snug">
                                                I confirm that I have verified the credentials of <strong>{selectedFaculty.name}</strong> and authorize this appointment as Head of Department for {department || '[Select Department]'}.
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={handleAssign}
                                        disabled={loading}
                                        className="w-full py-3 font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            'Processing Assignment...'
                                        ) : (
                                            <>
                                                <ShieldAlert size={18} />
                                                Confirm & Authorize Assignment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
