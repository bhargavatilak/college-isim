import React, { useState } from 'react';
import { BookOpen, Search, BookMarked, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const ISBNScanner: React.FC = () => {
    const [isbn, setIsbn] = useState('');
    const [studentId, setStudentId] = useState('');
    const [book, setBook] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [loadingBook, setLoadingBook] = useState(false);
    const [loadingStudent, setLoadingStudent] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleScanBook = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingBook(true);
        setMessage({ type: '', text: '' });
        
        setTimeout(() => {
            if (isbn === '978-0131103627') {
                setBook({
                    isbn: '978-0131103627',
                    title: 'The C Programming Language',
                    author: 'Brian W. Kernighan, Dennis M. Ritchie',
                    edition: '2nd Edition',
                    available: 4,
                    total: 10,
                    shelf: 'CS-A4'
                });
            } else {
                setBook(null);
                setMessage({ type: 'error', text: 'Book not found. You can add it to the library catalog.' });
            }
            setLoadingBook(false);
        }, 600);
    };

    const handleVerifyStudent = () => {
        if (!studentId) return;
        setLoadingStudent(true);
        setMessage({ type: '', text: '' });

        setTimeout(() => {
            if (studentId === 'STU123') {
                setStudent({
                    id: 'STU123',
                    name: 'Rajesh Kumar',
                    course: 'B.Tech CSE',
                    activeIssues: 2,
                    maxLimit: 4,
                    fines: 0
                });
            } else {
                setStudent(null);
                setMessage({ type: 'error', text: 'Student not found in the database.' });
            }
            setLoadingStudent(false);
        }, 600);
    };

    const handleIssueBook = () => {
        if (!book || !student) return;
        
        if (student.activeIssues >= student.maxLimit) {
            setMessage({ type: 'error', text: 'Student has reached maximum borrowing limit (4 books).' });
            return;
        }

        if (student.fines > 0) {
            setMessage({ type: 'error', text: 'Cannot issue book. Student has unpaid fines.' });
            return;
        }

        setMessage({ type: 'success', text: `Book "${book.title}" successfully issued to ${student.name}. Due date: in 14 days.` });
        setBook({ ...book, available: book.available - 1 });
        setStudent({ ...student, activeIssues: student.activeIssues + 1 });
    };

    return (
        <div className="p-6 bg-amber-50/30 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="text-amber-600" /> Library ISBN Scanner & Issue
                </h1>
                <p className="text-sm text-gray-500 mt-1">Scan book barcodes and verify student eligibility for issuance.</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                    {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Book Scan Section */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">1. Scan ISBN Barcode</h3>
                        <form onSubmit={handleScanBook} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Enter or scan ISBN (Try 978-0131103627)" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 outline-none transition-shadow"
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                />
                            </div>
                            <button type="submit" disabled={loadingBook} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                                {loadingBook ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Lookup"}
                            </button>
                        </form>
                    </div>

                    {book && (
                        <div className="bg-amber-600 rounded-xl shadow-md p-6 text-white">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-20 bg-amber-800 rounded flex items-center justify-center text-amber-500 shadow-inner">
                                    <BookMarked size={32} />
                                </div>
                                <div>
                                    <span className="text-amber-200 text-xs font-bold uppercase tracking-wider">{book.isbn}</span>
                                    <h2 className="text-xl font-bold mt-1 leading-tight">{book.title}</h2>
                                    <p className="text-amber-100 text-sm mt-1">{book.author}</p>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-amber-500/50 pt-4">
                                <div>
                                    <p className="text-amber-200 text-xs">Available</p>
                                    <p className="font-bold text-xl">{book.available} <span className="text-sm font-normal text-amber-300">/ {book.total}</span></p>
                                </div>
                                <div>
                                    <p className="text-amber-200 text-xs">Location</p>
                                    <p className="font-bold text-lg">{book.shelf}</p>
                                </div>
                                <div>
                                    <p className="text-amber-200 text-xs">Edition</p>
                                    <p className="font-bold text-lg">{book.edition}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Student Verify Section */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">2. Verify Student</h3>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Enter Student ID (Try STU123)" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 outline-none transition-shadow"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                />
                            </div>
                            <button onClick={handleVerifyStudent} disabled={loadingStudent} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                                {loadingStudent ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Verify"}
                            </button>
                        </div>
                    </div>

                    {student && (
                        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                                    <p className="text-sm text-gray-500 font-medium">{student.id} | {student.course}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${student.fines > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {student.fines > 0 ? `Unpaid Fines: ₹${student.fines}` : 'Clear Account'}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 font-medium">Active Book Issues</span>
                                    <span className="font-bold text-gray-900">{student.activeIssues} / {student.maxLimit}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${student.activeIssues >= student.maxLimit ? 'bg-red-500' : 'bg-amber-500'}`}
                                        style={{ width: `${(student.activeIssues / student.maxLimit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button 
                                onClick={handleIssueBook}
                                disabled={!book || book.available === 0}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold shadow-md transition-all flex justify-center items-center gap-2"
                            >
                                <CheckCircle2 size={20} />
                                {book ? `Issue "${book.title}" to ${student.name}` : "Scan a book first to issue"}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
