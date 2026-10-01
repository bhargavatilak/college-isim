import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import bgImage from '../../assets/college-bg.png';
import logoImage from '../../assets/glb-logo.png';

export const Login: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleQuickLogin = (roleId: string) => {
        setUserId(roleId);
        setPassword('password123'); // Optional: auto-fill a dummy password
        // The form won't auto-submit unless we trigger it or call the API directly.
        // I will call the logic directly.
        executeLogin(roleId);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        executeLogin(userId);
    };

    const executeLogin = async (idToLogin: string) => {
        setError('');
        setLoading(true);

        const normalizedUserId = idToLogin.trim().toLowerCase();

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (normalizedUserId === 'director') {
                login({ id: 1, email: 'director@glb.edu', roles: ['ROLE_DIRECTOR'], accessToken: 'mock-jwt-token' });
                navigate('/director/dashboard');
            } else if (normalizedUserId === 'hod') {
                login({ id: 2, email: 'hod@glb.edu', roles: ['ROLE_HOD'], accessToken: 'mock-jwt-token' });
                navigate('/hod/registrations');
            } else if (normalizedUserId === 'faculty') {
                login({ id: 3, email: 'faculty@glb.edu', roles: ['ROLE_FACULTY'], accessToken: 'mock-jwt-token' });
                navigate('/faculty/attendance');
            } else if (normalizedUserId === 'student') {
                login({ id: 4, email: 'student@glb.edu', roles: ['ROLE_STUDENT'], accessToken: 'mock-jwt-token' });
                navigate('/student/admit-card');
            } else if (normalizedUserId === 'exam') {
                login({ id: 5, email: 'exam@glb.edu', roles: ['ROLE_EXAM_ADMIN'], accessToken: 'mock-jwt-token' });
                navigate('/examination/dashboard');
            } else if (normalizedUserId === 'finance') {
                login({ id: 6, email: 'finance@glb.edu', roles: ['ROLE_FINANCE'], accessToken: 'mock-jwt-token' });
                navigate('/finance/payment');
            } else if (normalizedUserId === 'librarian') {
                login({ id: 7, email: 'library@glb.edu', roles: ['ROLE_LIBRARIAN'], accessToken: 'mock-jwt-token' });
                navigate('/librarian/scanner');
            } else if (normalizedUserId === 'registrar') {
                login({ id: 8, email: 'registrar@glb.edu', roles: ['ROLE_REGISTRAR'], accessToken: 'mock-jwt-token' } as any);
                navigate('/registrar/admission');
            } else if (normalizedUserId === 'admission-cell') {
                login({ id: 9, email: 'admissions@glb.edu', roles: ['ROLE_ADMISSION_CELL'], accessToken: 'mock-jwt-token' } as any);
                navigate('/admission-cell/dashboard');
            } else if (normalizedUserId === 'helpdesk') {
                login({ id: 10, email: 'helpdesk@glb.edu', roles: ['ROLE_OFFICE_HELP_DESK'], accessToken: 'mock-jwt-token' } as any);
                navigate('/helpdesk/dashboard');
            } else {
                setError('Invalid credentials. (Hint: try director, hod, faculty, student, exam, finance, librarian, registrar, admission-cell, helpdesk)');
            }
        } catch (err) {
            setError('Connection failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Background Image Area (Left Side) */}
            <div 
                className="hidden lg:flex lg:flex-1 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40 mix-blend-multiply"></div>
                
                {/* College Branding Overlay */}
                <div className="relative z-10 flex flex-col justify-end p-16 w-full text-white">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm p-2 rounded-2xl mb-6 shadow-lg border border-white/20">
                        <img src={logoImage} alt="GL Bajaj Logo" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-2">GL Bajaj Group of Institutions</h1>
                    <p className="text-2xl font-light text-gray-200 mb-4">Mathura</p>
                    <div className="w-24 h-1 bg-blue-500 rounded-full mb-6"></div>
                    <p className="text-lg text-gray-300 max-w-xl">
                        Welcome to the Integrated Student Information Management (ISIM) Portal. 
                        A centralized ERP solution for academic excellence, administration, and campus lifecycle management.
                    </p>
                </div>
            </div>

            {/* Login Form Area (Right Side) */}
            <div className="w-full lg:w-[480px] xl:w-[550px] flex flex-col justify-center px-8 sm:px-16 py-12 bg-white shadow-2xl relative z-20">
                <div className="w-full max-w-sm mx-auto">
                    
                    {/* Mobile Branding (Only shows on small screens) */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-4">
                            <img src={logoImage} alt="GL Bajaj Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <div className="text-center mb-8 hidden lg:block">
                        <div className="w-32 h-32 mx-auto mb-4">
                            <img src={logoImage} alt="GL Bajaj Logo" className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <p className="text-gray-500 text-sm">Please sign in to your ISIM account to continue.</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">User ID / Email</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow text-gray-900"
                                    placeholder="Enter your registered ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow text-gray-900"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input 
                                id="remember-me" 
                                type="checkbox" 
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                Keep me signed in
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Sign In Securely"
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} GL Bajaj Group of Institutions.</p>
                        <p className="mt-1 mb-6">Integrated Student Information Management System</p>
                        
                        {/* Testing Credentials Block */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left shadow-sm">
                            <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">🛠️ Quick Login (Click to Test)</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                                <div onClick={() => handleQuickLogin('director')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> director</div><div className="text-gray-500">(Director Dashboard)</div>
                                <div onClick={() => handleQuickLogin('hod')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> hod</div><div className="text-gray-500">(HOD Module)</div>
                                <div onClick={() => handleQuickLogin('faculty')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> faculty</div><div className="text-gray-500">(Faculty Module)</div>
                                <div onClick={() => handleQuickLogin('student')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> student</div><div className="text-gray-500">(Student Portal)</div>
                                <div onClick={() => handleQuickLogin('finance')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> finance</div><div className="text-gray-500">(Finance Module)</div>
                                <div onClick={() => handleQuickLogin('exam')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> exam</div><div className="text-gray-500">(Exam Cell Admin)</div>
                                <div onClick={() => handleQuickLogin('librarian')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> librarian</div><div className="text-gray-500">(Librarian Module)</div>
                                <div onClick={() => handleQuickLogin('registrar')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> registrar</div><div className="text-gray-500">(Admissions)</div>
                                <div onClick={() => handleQuickLogin('admission-cell')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> admission-cell</div><div className="text-gray-500">(Admission Cell)</div>
                                <div onClick={() => handleQuickLogin('helpdesk')} className="cursor-pointer hover:text-blue-600 transition-colors"><span className="font-semibold text-gray-900">ID:</span> helpdesk</div><div className="text-gray-500">(Office Help Desk)</div>
                            </div>
                            <p className="mt-3 text-[10px] text-gray-400 italic">* Clicking an ID will auto-fill and log you in immediately.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
