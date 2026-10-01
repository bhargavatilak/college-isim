import React, { useState, useEffect } from 'react';
import { Building2, Save, FileText, CheckCircle2, Shield, Calendar, Globe, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const DEFAULT_DETAILS = {
    id: 1,
    name: 'International School of Information Management',
    code: 'ISIM-UNI-2026',
    established: '2010',
    type: 'Private University',
    accreditation: 'NAAC A+ Grade',
    viceChancellor: 'Dr. K. S. Sharma',
    registrar: 'Prof. S. R. Verma',
    address: '123 University Campus Drive, Knowledge Park',
    city: 'Jaipur',
    state: 'Rajasthan',
    zip: '302022',
    phone: '+91 141 2704000',
    email: 'info@isim.edu.in',
    website: 'https://www.isim.edu.in',
    affiliationStatus: 'Active',
    validUntil: '2030-12-31'
};

export const UniversityDetails: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [savedMessage, setSavedMessage] = useState(false);

    const [details, setDetails] = useState(() => {
        const saved = localStorage.getItem('university_details');
        if (saved) {
            try {
                return { ...DEFAULT_DETAILS, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to parse local university details:', e);
            }
        }
        return DEFAULT_DETAILS;
    });

    const [backupDetails, setBackupDetails] = useState(details);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data, error } = await supabase.from('university_affiliations').select('*').limit(1).maybeSingle();
                if (data && !error) {
                    const fetchedDetails = {
                        id: data.id || details.id || 1,
                        name: data.name || data.university_name || details.name,
                        code: data.code || data.university_code || details.code,
                        established: data.established || data.established_year || details.established,
                        type: data.type || data.institution_type || details.type,
                        accreditation: data.accreditation || details.accreditation,
                        viceChancellor: data.viceChancellor || data.vice_chancellor || details.viceChancellor,
                        registrar: data.registrar || details.registrar,
                        address: data.address || details.address,
                        city: data.city || details.city,
                        state: data.state || details.state,
                        zip: data.zip || details.zip,
                        phone: data.phone || details.phone,
                        email: data.email || details.email,
                        website: data.website || details.website,
                        affiliationStatus: data.affiliationStatus || data.affiliation_status || data.status || details.affiliationStatus,
                        validUntil: data.validUntil || data.valid_until || details.validUntil
                    };
                    setDetails(fetchedDetails);
                    localStorage.setItem('university_details', JSON.stringify(fetchedDetails));
                }
            } catch (e) {
                console.warn('Supabase fetch notice:', e);
            }
        };
        fetchDetails();
    }, []);

    const handleEdit = () => {
        setBackupDetails({ ...details });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDetails({ ...backupDetails });
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsEditing(false);
        // Persist to local storage immediately
        localStorage.setItem('university_details', JSON.stringify(details));
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 4000);

        // Attempt background persistence to Supabase
        try {
            const payload = {
                id: details.id || 1,
                university_name: details.name,
                status: details.affiliationStatus,
                name: details.name,
                code: details.code,
                established: details.established,
                type: details.type,
                accreditation: details.accreditation,
                vice_chancellor: details.viceChancellor,
                registrar: details.registrar,
                address: details.address,
                city: details.city,
                state: details.state,
                zip: details.zip,
                phone: details.phone,
                email: details.email,
                website: details.website,
                valid_until: details.validUntil
            };
            const { error } = await supabase.from('university_affiliations').upsert([payload]);
            if (error) {
                console.warn('Supabase save note:', error.message);
            }
        } catch (err) {
            console.warn('Supabase connection note:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="space-y-6">
            {savedMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm animate-fade-in">
                    <Check className="text-emerald-600 shrink-0" size={20} />
                    <span className="font-medium">University details updated and saved successfully!</span>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Building2 className="text-purple-600" />
                        University & Affiliation Details
                    </h2>
                    <p className="text-gray-600 mt-1">Manage institutional information, accreditation, and affiliation status.</p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 shadow-sm"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleEdit}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
                        >
                            <FileText size={18} /> Edit Details
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={details.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University Code</label>
                                <input 
                                    type="text" 
                                    name="code"
                                    value={details.code}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                                <input 
                                    type="text" 
                                    name="established"
                                    value={details.established}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
                                <select 
                                    name="type"
                                    value={details.type}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                >
                                    <option value="Private University">Private University</option>
                                    <option value="State University">State University</option>
                                    <option value="Central University">Central University</option>
                                    <option value="Deemed University">Deemed University</option>
                                    <option value="Autonomous College">Autonomous College</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Contact & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input 
                                    type="text" 
                                    name="address"
                                    value={details.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    value={details.city}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State & ZIP</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        name="state"
                                        value={details.state}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="State"
                                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                    />
                                    <input 
                                        type="text" 
                                        name="zip"
                                        value={details.zip}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="ZIP"
                                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={details.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={details.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                <input 
                                    type="text" 
                                    name="website"
                                    value={details.website}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Affiliation Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Affiliation & Compliance</h3>
                        
                        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-medium text-emerald-800">Status: {details.affiliationStatus}</h4>
                                <p className="text-sm text-emerald-700 mt-1">Affiliation is currently active and compliant with regulatory bodies.</p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Change Affiliation Status</label>
                                <select 
                                    name="affiliationStatus"
                                    value={details.affiliationStatus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending Renewal">Pending Renewal</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        name="accreditation"
                                        value={details.accreditation}
                                        onChange={handleChange}
                                        placeholder="e.g. NAAC A+ Grade"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                                        <Shield size={16} className="text-purple-600" />
                                        <span className="text-sm font-medium text-gray-800">{details.accreditation || 'Not Specified'}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                                {isEditing ? (
                                    <input 
                                        type="date" 
                                        name="validUntil"
                                        value={details.validUntil}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                                        <Calendar size={16} className="text-blue-600" />
                                        <span className="text-sm font-medium text-gray-800">{details.validUntil || 'Not Specified'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Key Officials */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Key Officials</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vice Chancellor</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold shrink-0">
                                        {details.viceChancellor ? details.viceChancellor.split(' ').map(n => n[0]).join('').substring(0, 3) : 'VC'}
                                    </div>
                                    <input 
                                        type="text" 
                                        name="viceChancellor"
                                        value={details.viceChancellor}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:text-gray-900 disabled:font-medium"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registrar</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                        {details.registrar ? details.registrar.split(' ').map(n => n[0]).join('').substring(0, 3) : 'R'}
                                    </div>
                                    <input 
                                        type="text" 
                                        name="registrar"
                                        value={details.registrar}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:text-gray-900 disabled:font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
