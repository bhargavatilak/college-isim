import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    User, BookOpen, GraduationCap, UploadCloud, CheckCircle, 
    FileText, UserCheck, Search, FileSignature, CreditCard, 
    ShieldCheck, Rocket, ChevronRight, ChevronLeft, Save
} from 'lucide-react';
import { DocumentVerification } from './DocumentVerification';
import { MeritSelectionDashboard } from './MeritSelectionDashboard';
import { supabase } from '../../lib/supabase';

const STEPS = [
    { id: 1, title: 'Initial Registration', icon: <User size={18} /> },
    { id: 2, title: 'Academic Details', icon: <BookOpen size={18} /> },
    { id: 3, title: 'Course/Program Selection', icon: <GraduationCap size={18} /> },
    { id: 4, title: 'Document Verification', icon: <FileText size={18} /> },
    { id: 5, title: 'Eligibility Verification', icon: <UserCheck size={18} /> },
    { id: 6, title: 'Application Review', icon: <Search size={18} /> },
    { id: 7, title: 'Merit/Selection', icon: <FileSignature size={18} /> },
    { id: 8, title: 'Fee/Payment', icon: <CreditCard size={18} /> },
    { id: 9, title: 'Final Verification', icon: <ShieldCheck size={18} /> },
    { id: 10, title: 'Onboarding', icon: <Rocket size={18} /> },
    { id: 11, title: 'Enrollment Slip', icon: <CheckCircle size={18} /> },
];

export const NewRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    
    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');
    const [course, setCourse] = useState('');
    const [year, setYear] = useState('1st Year');
    const [semester, setSemester] = useState('1st Semester');
    const [departmentsList, setDepartmentsList] = useState<any[]>([]);
    const [programsList, setProgramsList] = useState<any[]>([]);
    
    const [admissionNumber, setAdmissionNumber] = useState<string>('');
    const [applicationId, setApplicationId] = useState<number>(Date.now()); // Unique ID per session

    useEffect(() => {
        const fetchOptions = async () => {
            const { data: depts } = await supabase.from('departments').select('*');
            if (depts) setDepartmentsList(depts);
            
            const { data: progs } = await supabase.from('programs').select('*');
            if (progs) setProgramsList(progs);
        };
        fetchOptions();

        const draft = location.state?.resumeDraft;
        if (draft) {
            setCurrentStep(draft.step || 1);
            setFirstName(draft.firstName || draft.name?.split(' ')[0] || '');
            setLastName(draft.lastName || draft.name?.split(' ').slice(1).join(' ') || '');
            setAdmissionNumber(draft.id || '');
            if (draft.applicationId) setApplicationId(draft.applicationId);
            if (draft.email) setEmail(draft.email);
            if (draft.phone) setPhone(draft.phone);
            if (draft.dob) setDob(draft.dob);
            if (draft.gender) setGender(draft.gender);
            if (draft.address) setAddress(draft.address);
            if (draft.department) setDepartment(draft.department);
            if (draft.course) setCourse(draft.course);
            if (draft.year) setYear(draft.year); else setYear('1st Year');
            if (draft.semester) setSemester(draft.semester); else setSemester('1st Semester');
        } else {
            // New Registration - Reset everything
            setCurrentStep(1);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setDob('');
            setGender('');
            setAddress('');
            setDepartment('');
            setCourse('');
            setYear('1st Year');
            setSemester('1st Semester');
            setAdmissionNumber('');
            setApplicationId(Date.now());
        }
    }, [location.state, location.key]);

    const generateAdmissionNumber = async () => {
        const year = new Date().getFullYear().toString().slice(-2);
        
        const deptCode = department || 'GEN';
        const selectedProgram = programsList.find(p => p.program_code === course);
        
        let specCode = 'GEN';
        if (selectedProgram) {
             const spec = selectedProgram.specialization || selectedProgram.program_code || '';
             const parts = spec.split('-');
             const lastPart = parts[parts.length - 1];
             specCode = lastPart.substring(0, 3).toUpperCase();
             if (!specCode) specCode = 'GEN';
        }
        
        try {
            const { data, error } = await supabase.rpc('generate_admission_number', {
                p_year_prefix: year,
                p_branch: deptCode,
                p_spec: specCode
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Failed to generate admission number from database", error);
            // Fallback just in case the RPC isn't set up yet, though the prompt asked for DB
            const serial = String(Math.floor(Math.random() * 900) + 100);
            return `${year}${deptCode}${specCode}${serial}`;
        }
    };

    useEffect(() => {
        const generate = async () => {
            if (currentStep >= 4 && !admissionNumber) {
                const num = await generateAdmissionNumber();
                setAdmissionNumber(num);
            }
        };
        generate();
    }, [currentStep, admissionNumber, department, course]);

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const { error } = await supabase.from('students').insert([{
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                dob: dob || null, // Fix invalid date error for empty string
                gender: gender || null,
                address: address || null,
                department_code: department,
                program_code: course,
                current_year: year,
                current_semester: semester,
                admission_number: admissionNumber,
                status: 'Active',
                admission_date: new Date().toISOString().split('T')[0]
            }]);
            
            if (error) throw error;

            // Remove this application from drafts using both applicationId and id for legacy compatibility
            const drafts = JSON.parse(localStorage.getItem('registration_drafts') || '[]');
            const draftIdToRemove = location.state?.resumeDraft?.id;
            const updatedDrafts = drafts.filter((d: any) => {
                if (d.applicationId === applicationId) return false;
                if (draftIdToRemove && d.id === draftIdToRemove) return false;
                if (admissionNumber && d.id === admissionNumber) return false;
                return true;
            });
            localStorage.setItem('registration_drafts', JSON.stringify(updatedDrafts));

            alert('Student successfully registered!');
            navigate('/admission-cell/dashboard');
        } catch (error: any) {
            console.error('Error inserting student:', error);
            alert('Failed to register student: ' + (error.message || JSON.stringify(error)));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 print:space-y-0 print:m-0 print:max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Registration</h1>
                    <p className="text-gray-500 text-sm mt-1">Complete the {STEPS.length}-step admission process</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row print:shadow-none print:border-none print:m-0 print:p-0">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 p-6 flex-shrink-0 print:hidden">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Application Progress</h3>
                    <div className="space-y-4">
                        {STEPS.map((step, index) => (
                            <div 
                                key={step.id} 
                                onClick={() => setCurrentStep(step.id)}
                                className={`flex items-center gap-4 cursor-pointer transition-colors hover:bg-gray-100 p-2 -mx-2 rounded-lg ${
                                    currentStep === step.id 
                                        ? 'text-blue-600' 
                                        : currentStep > step.id 
                                            ? 'text-green-600' 
                                            : 'text-gray-400'
                                }`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    currentStep === step.id 
                                        ? 'border-blue-600 bg-blue-50' 
                                        : currentStep > step.id 
                                            ? 'border-green-600 bg-green-50' 
                                            : 'border-gray-200 bg-white'
                                }`}>
                                    {currentStep > step.id ? <CheckCircle size={16} /> : step.icon}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${currentStep === step.id ? 'text-gray-900' : currentStep > step.id ? 'text-gray-700' : 'text-gray-500'}`}>
                                        Step {step.id}
                                    </p>
                                    <p className={`text-xs ${currentStep === step.id ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-6 md:p-8 flex flex-col min-h-[600px] print:p-0 print:min-h-0">
                    <div className="mb-8 print:hidden">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {STEPS[currentStep - 1].icon}
                            {STEPS[currentStep - 1].title}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Please fill out the details below carefully.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 print:overflow-visible">
                        {currentStep === 1 && <StepOneForm firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} dob={dob} setDob={setDob} gender={gender} setGender={setGender} address={address} setAddress={setAddress} />}
                        {currentStep === 2 && <StepTwoForm />}
                        {currentStep === 3 && <StepThreeForm department={department} setDepartment={setDepartment} course={course} setCourse={setCourse} year={year} setYear={setYear} semester={semester} setSemester={setSemester} departmentsList={departmentsList} programsList={programsList} />}
                        {currentStep === 4 && <DocumentVerification 
                            applicationId={applicationId} 
                            studentName={`${firstName || 'New'} ${lastName || 'Student'}`.trim()}
                            admissionNumber={admissionNumber}
                            department={department ? department.toUpperCase() : 'Not Selected'}
                            course={course ? course.toUpperCase().replace('-', ' ') : 'Not Selected'}
                        />}
                        {currentStep === 5 && <StepFiveForm onNext={handleNext} />}
                        {currentStep === 6 && <StepSixForm firstName={firstName} department={department} course={course} onNext={handleNext} />}
                        {currentStep === 7 && <StepSevenForm admissionNumber={admissionNumber} onNext={handleNext} />}
                        {currentStep === 8 && <StepNineForm onNext={handleNext} />}
                        {currentStep === 9 && <StepTenForm onNext={handleNext} />}
                        {currentStep === 10 && <StepElevenForm onNext={handleNext} />}
                        {currentStep === 11 && <StepEightForm 
                            handleSubmit={handleSubmit}
                            firstName={firstName}
                            lastName={lastName}
                            email={email}
                            phone={phone}
                            dob={dob}
                            department={department}
                            course={course}
                            admissionNumber={admissionNumber}
                        />}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center print:hidden">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentStep === 1 
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => {
                                    const drafts = JSON.parse(localStorage.getItem('registration_drafts') || '[]');
                                    const newDraft = {
                                        id: admissionNumber || `DRAFT-${Date.now()}`,
                                        name: `${firstName} ${lastName}`.trim() || 'Unnamed Applicant',
                                        phone: phone || 'N/A',
                                        step: currentStep,
                                        date: new Date().toISOString().split('T')[0],
                                        program: course || department || 'Pending',
                                        applicationId: applicationId,
                                        firstName, lastName, email, phone, dob, gender, address, department, course, year, semester
                                    };
                                    // Remove older version using reliable applicationId and legacy id
                                    const draftIdToRemove = location.state?.resumeDraft?.id;
                                    const updatedDrafts = drafts.filter((d: any) => {
                                        if (d.applicationId === newDraft.applicationId) return false;
                                        if (draftIdToRemove && d.id === draftIdToRemove) return false;
                                        if (admissionNumber && d.id === admissionNumber) return false;
                                        return true;
                                    });
                                    updatedDrafts.push(newDraft);
                                    localStorage.setItem('registration_drafts', JSON.stringify(updatedDrafts));
                                    
                                    alert('Registration Draft Saved! You can resume it from the Sidebar.');
                                    navigate('/admission-cell/resume');
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <Save size={18} />
                                Save Draft (Pause)
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentStep === STEPS.length}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                                    currentStep === STEPS.length 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {currentStep === STEPS.length ? 'Submit' : 'Next Step'}
                                {currentStep !== STEPS.length && <ChevronRight size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StepOneForm = ({ firstName, setFirstName, lastName, setLastName, email, setEmail, phone, setPhone, dob, setDob, gender, setGender, address, setAddress }: any) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Permanent Address</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Enter full address"></textarea>
        </div>
    </div>
);

const StepTwoForm = () => (
    <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Class 10th Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Board</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / CISCE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="IGCSE">IGCSE / Cambridge</option>
                        <option value="Other">Other / International</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Passing Year</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="YYYY" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Percentage / CGPA</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 85.5 or 9.2" />
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Class 12th Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Board</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / CISCE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="IGCSE">IGCSE / Cambridge</option>
                        <option value="Other">Other / International</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Passing Year</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="YYYY" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Overall Percentage / CGPA</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 85.5 or 9.2" />
                </div>
            </div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">PCM Subject Marks (For B.Tech / B.Sc)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">PCM %age</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 88.0" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Physics (out of 100)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0-100" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Chemistry (out of 100)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0-100" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Maths (out of 100)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0-100" />
                </div>
            </div>
        </div>
    </div>
);

const StepThreeForm = ({ department, setDepartment, course, setCourse, year, setYear, semester, setSemester, departmentsList = [], programsList = [] }: any) => {
    const filteredPrograms = programsList.filter((p: any) => p.department_code === department);
    const selectedProgramObj = programsList.find((p: any) => p.program_code === course);
    const isMba = department === 'MBA' || course?.startsWith('MBA') || selectedProgramObj?.degree === 'MBA';
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Department / Faculty</label>
                    <select value={department} onChange={e => {
                        setDepartment(e.target.value);
                        setCourse('');
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="">Select Department</option>
                        {departmentsList.map((d: any) => (
                            <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Program / Course</label>
                    <select value={course} onChange={e => setCourse(e.target.value)} disabled={!department} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400">
                        <option value="">Select Program</option>
                        {filteredPrograms.map((p: any) => (
                            <option key={p.program_code} value={p.program_code}>
                                {p.program_name} {p.specialization ? `- ${p.specialization}` : ''} ({p.program_code})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedProgramObj && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-center justify-between">
                    <div>
                        <span className="font-bold">{selectedProgramObj.program_name}</span> · Degree: <span className="font-semibold">{selectedProgramObj.degree}</span> · Level: <span className="font-semibold">{isMba ? 'Postgraduate (PG)' : 'Undergraduate (UG)'}</span>
                    </div>
                    <div className="font-bold text-blue-900">
                        Duration: {selectedProgramObj.duration_years || (isMba ? 2 : 4)} Years ({selectedProgramObj.semesters || (isMba ? 4 : 8)} Semesters)
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Academic Year</label>
                    <select value={year || '1st Year'} onChange={e => setYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium">
                        <option value="1st Year">1st Year (Default)</option>
                        <option value="2nd Year">2nd Year</option>
                        {!isMba && <option value="3rd Year">3rd Year</option>}
                        {!isMba && <option value="4th Year">4th Year</option>}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Academic Semester</label>
                    <select value={semester || '1st Semester'} onChange={e => setSemester(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium">
                        <option value="1st Semester">1st Semester (Default)</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="3rd Semester">3rd Semester</option>
                        <option value="4th Semester">4th Semester</option>
                        {!isMba && <option value="5th Semester">5th Semester</option>}
                        {!isMba && <option value="6th Semester">6th Semester</option>}
                        {!isMba && <option value="7th Semester">7th Semester</option>}
                        {!isMba && <option value="8th Semester">8th Semester</option>}
                    </select>
                </div>
            </div>
        </div>
    );
};

const StepFourForm = () => (
    <div className="space-y-6">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3">
            <div className="mt-0.5"><UploadCloud size={20} /></div>
            <div>
                <p className="font-semibold mb-1">Document Upload Guidelines</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>All documents must be in PDF, JPG, or PNG format.</li>
                    <li>Maximum file size per document is 2MB.</li>
                    <li>Ensure all text is clearly readable before uploading.</li>
                </ul>
            </div>
        </div>

        <div className="space-y-4">
            <div className="border border-gray-200 p-4 rounded-lg flex items-center justify-between bg-white">
                <div>
                    <h4 className="font-medium text-gray-900">Passport Size Photograph</h4>
                    <p className="text-sm text-gray-500">Recent color photograph</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Upload File
                </button>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg flex items-center justify-between bg-white">
                <div>
                    <h4 className="font-medium text-gray-900">10th Marksheet</h4>
                    <p className="text-sm text-gray-500">Original scanned copy</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Upload File
                </button>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg flex items-center justify-between bg-white">
                <div>
                    <h4 className="font-medium text-gray-900">12th Marksheet</h4>
                    <p className="text-sm text-gray-500">Original scanned copy or web copy if original not issued</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Upload File
                </button>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg flex items-center justify-between bg-white">
                <div>
                    <h4 className="font-medium text-gray-900">Aadhar Card / Identity Proof</h4>
                    <p className="text-sm text-gray-500">Both front and back</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Upload File
                </button>
            </div>
        </div>
    </div>
);


const StepFiveForm = ({ onNext }: any) => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Academic Eligibility Check</h3>
            <div className="space-y-3">
                <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">10th Grade Percentage &gt; 60%</span>
                </label>
                <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">12th Grade Percentage &gt; 60% (PCM/PCB)</span>
                </label>
                <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Age criteria met (&ge; 17 years)</span>
                </label>
                <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Valid Entrance Exam Score (JEE/State CET)</span>
                </label>
            </div>
        </div>
        <div className="flex gap-4">
            <button type="button" onClick={onNext} className="flex-1 bg-green-50 text-green-700 border border-green-200 py-3 rounded-lg font-medium hover:bg-green-100 transition">Mark as Eligible</button>
            <button type="button" onClick={() => alert('Applicant marked as Not Eligible.')} className="flex-1 bg-red-50 text-red-700 border border-red-200 py-3 rounded-lg font-medium hover:bg-red-100 transition">Mark as Not Eligible</button>
        </div>
    </div>
);

const StepSixForm = ({ firstName, department, course, onNext }: any) => {
    const hasBasic = !!firstName;
    const hasProgram = !!(department && course);
    return (
    <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Application Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500">Applicant Name</div><div className="font-medium text-gray-900">{firstName || 'Not Entered'}</div>
                <div className="text-gray-500">Registration Status</div><div className={`font-medium ${hasBasic ? 'text-green-600' : 'text-red-500'}`}>{hasBasic ? 'Completed' : 'Pending'}</div>
                <div className="text-gray-500">Academic Details</div><div className="font-medium text-gray-500">Pending Verification</div>
                <div className="text-gray-500">Program Selection</div><div className={`font-medium ${hasProgram ? 'text-green-600' : 'text-red-500'}`}>{hasProgram ? 'Confirmed' : 'Pending'}</div>
                <div className="text-gray-500">Eligibility Status</div><div className="font-medium text-blue-600">Under Review</div>
            </div>
        </div>
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Reviewer Remarks</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Add internal notes..."></textarea>
        </div>
        <button type="button" onClick={onNext} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">Approve Application</button>
    </div>
)};

const StepSevenForm = ({ admissionNumber, onNext }: any) => {
    const [meritData, setMeritData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMerit = async () => {
            if (!admissionNumber) {
                setLoading(false);
                return;
            }
            try {
                // Mock fetching from the new admission_merit_records table
                const { data } = await supabase.from('admission_merit_records').select('*').eq('admission_number', admissionNumber).single();
                if (data) setMeritData(data);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchMerit();
    }, [admissionNumber]);

    if (loading) return <div className="text-center p-6 text-gray-500">Checking merit status...</div>;

    // As requested, embedding the full administrative Merit Selection Dashboard right inside Step 7
    return (
        <div className="w-full -mx-4 -mt-4">
            <MeritSelectionDashboard />
        </div>
    );
};

const StepEightForm = ({ handleSubmit, firstName, lastName, email, phone, dob, department, course, admissionNumber }: any) => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                // First get the file path from the database
                const { data, error } = await supabase
                    .from('student_documents')
                    .select('file_path')
                    .eq('admission_number', admissionNumber)
                    .ilike('document_type', '%Photo%')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (data && data.file_path) {
                    // Then get the public URL from storage
                    const { data: urlData } = supabase.storage
                        .from('student_documents')
                        .getPublicUrl(data.file_path);
                    
                    if (urlData && urlData.publicUrl) {
                        setPhotoUrl(urlData.publicUrl);
                    }
                }
            } catch (err) {
                console.error("Error fetching photograph:", err);
            }
        };
        
        if (admissionNumber) {
            fetchPhoto();
        }
    }, [admissionNumber]);

    return (
    <div className="space-y-6">
        <div className="bg-white border-2 border-gray-200 p-8 rounded-lg shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 print:bg-gray-100"></div>
            
            <div className="text-center mb-8 border-b-2 border-gray-100 pb-6 relative">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md print:border-2 print:border-gray-800 print:bg-white print:text-black">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Provisional Enrollment Slip</h2>
                <p className="text-gray-500 font-medium mt-1">ISIM University ERP System</p>
                
                {/* Photograph Area */}
                <div className="absolute top-0 right-4 w-28 h-36 border-2 border-gray-300 rounded overflow-hidden bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                    {photoUrl ? (
                        <img src={photoUrl} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                        <span>Photo<br/>Not Uploaded</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admission Number</label>
                        <p className="font-mono text-lg font-bold text-blue-700 print:text-black">{admissionNumber || 'PENDING'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Name</label>
                        <p className="font-bold text-gray-900 text-base">{firstName} {lastName}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</label>
                        <p className="font-medium text-gray-800">{phone || 'N/A'}</p>
                        <p className="font-medium text-gray-800">{email || 'N/A'}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Academic Session</label>
                        <p className="font-bold text-gray-900">{new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
                        <p className="font-bold text-gray-900">{department || 'Not Selected'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Program / Course</label>
                        <p className="font-bold text-gray-900">{course ? course.toUpperCase().replace('-', ' ') : 'Not Selected'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-start gap-3 text-sm text-gray-600">
                <FileSignature className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p>This is a computer-generated document. The admission is provisional and subject to final verification of original documents by the university registrar.</p>
            </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <button 
                onClick={() => window.print()}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
                <FileSignature size={18} /> Print Slip
            </button>
            <button 
                onClick={handleSubmit} 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
                <CheckCircle size={18} /> Complete Registration &amp; Save
            </button>
        </div>
    </div>
);};

const StepNineForm = ({ onNext }: any) => {
    const [admissionFee, setAdmissionFee] = useState<number>(500);
    const [tuitionFee, setTuitionFee] = useState<number>(2500);
    const [libraryFee, setLibraryFee] = useState<number>(300);
    const [busFee, setBusFee] = useState<number>(0);
    const [hostelFee, setHostelFee] = useState<number>(0);

    const totalPayable = (admissionFee || 0) + (tuitionFee || 0) + (libraryFee || 0) + (busFee || 0) + (hostelFee || 0);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-medium text-gray-700">Configure Student Fees</div>
                <div className="p-4 space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 w-1/2">Admission Fee</span>
                        <input type="number" value={admissionFee} onChange={(e) => setAdmissionFee(Number(e.target.value))} className="w-1/2 px-3 py-1 border border-gray-300 rounded text-right" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 w-1/2">Tuition Fee (Semester 1)</span>
                        <input type="number" value={tuitionFee} onChange={(e) => setTuitionFee(Number(e.target.value))} className="w-1/2 px-3 py-1 border border-gray-300 rounded text-right" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 w-1/2">Library &amp; Lab Fee</span>
                        <input type="number" value={libraryFee} onChange={(e) => setLibraryFee(Number(e.target.value))} className="w-1/2 px-3 py-1 border border-gray-300 rounded text-right" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 w-1/2">Bus Fee (If applicable)</span>
                        <input type="number" value={busFee} onChange={(e) => setBusFee(Number(e.target.value))} className="w-1/2 px-3 py-1 border border-gray-300 rounded text-right" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 w-1/2">Hostel Fee (If applicable)</span>
                        <input type="number" value={hostelFee} onChange={(e) => setHostelFee(Number(e.target.value))} className="w-1/2 px-3 py-1 border border-gray-300 rounded text-right" />
                    </div>
                    
                    <div className="flex justify-between font-bold text-gray-900 border-t pt-3 mt-3 text-lg">
                        <span>Total Payable</span>
                        <span>₹{totalPayable.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>Bank Transfer (NEFT/RTGS)</option>
                        <option>Demand Draft</option>
                        <option>Credit/Debit Card</option>
                        <option>Education Loan</option>
                        <option>Pending (Set Fees Only)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Transaction ID / DD Number</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. TXN12345678 or Leave Blank" />
                </div>
            </div>
            <button onClick={onNext} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">Save Fee Configuration &amp; Record Receipt</button>
        </div>
    );
};

const StepTenForm = ({ onNext }: any) => (
    <div className="space-y-6">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm flex gap-3">
            <ShieldCheck size={24} className="flex-shrink-0" />
            <div>
                <p className="font-bold mb-1">Final Authorization Required</p>
                <p>This is the final lock step. Once authorized, the student profile will be officially created in the ERP and sent to the Academic department.</p>
            </div>
        </div>
        <div className="space-y-4 mt-6">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-medium text-gray-700">I confirm all physical documents match digital uploads</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-medium text-gray-700">I confirm fee payment has been realized in institute account</span>
            </label>
        </div>
        <button onClick={onNext} className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <ShieldCheck size={18} /> Authorize &amp; Lock Enrollment
        </button>
    </div>
);

const StepElevenForm = ({ onNext }: any) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <User size={24} />
                </div>
                <h4 className="font-semibold text-gray-900">Identity Card</h4>
                <p className="text-sm text-gray-500">Generate student ID card and library barcode.</p>
                <button className="text-sm font-medium text-blue-600 hover:underline">Generate ID Card</button>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 text-center space-y-3">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <Rocket size={24} />
                </div>
                <h4 className="font-semibold text-gray-900">ERP Access</h4>
                <p className="text-sm text-gray-500">Create login credentials and institutional email.</p>
                <button className="text-sm font-medium text-indigo-600 hover:underline">Provision Accounts</button>
            </div>
        </div>
        <div className="pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">All onboarding tasks completed successfully.</p>
            <button onClick={onNext} className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition">
                Submit to Registrar for Final Approval
            </button>
        </div>
    </div>
);
