import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Eye, FileText, User, Download, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Document {
  id: string;
  document_type: string;
  original_filename: string;
  file_path: string;
  status: string;
  created_at: string;
  rejection_reason?: string;
}

export const StudentDocumentReview: React.FC = () => {
  const { admissionNumber } = useParams<{ admissionNumber: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    if (!admissionNumber) return;
    const fetchData = async () => {
      setLoading(true);
      // Fetch student info
      const { data: stu } = await supabase
        .from('students')
        .select('first_name, last_name, admission_number, department_code, program_code')
        .eq('admission_number', admissionNumber)
        .single();
      setStudent(stu);

      // Fetch all documents for this student
      const { data: docs } = await supabase
        .from('student_documents')
        .select('*')
        .eq('admission_number', admissionNumber)
        .order('created_at', { ascending: true });

      setDocuments(docs || []);
      if (docs && docs.length > 0) setActiveDoc(docs[0]);
      setLoading(false);
    };
    fetchData();
  }, [admissionNumber]);

  // Load preview when active document changes
  useEffect(() => {
    if (!activeDoc?.file_path) { setPreviewUrl(null); return; }
    const loadPreview = async () => {
      setPreviewLoading(true);
      setPreviewUrl(null);
      try {
        const { data } = await supabase.storage
          .from('student_documents')
          .createSignedUrl(activeDoc.file_path, 300); // 5 min signed URL
        if (data?.signedUrl) setPreviewUrl(data.signedUrl);
      } catch (err) {
        console.error('Error loading preview', err);
      } finally {
        setPreviewLoading(false);
      }
    };
    loadPreview();
  }, [activeDoc]);

  const handleVerify = async (docId: string) => {
    const { error } = await supabase
      .from('student_documents')
      .update({ status: 'Verified', verified_at: new Date().toISOString() })
      .eq('id', docId);
    if (error) { alert('Error: ' + error.message); return; }
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'Verified' } : d));
    if (activeDoc?.id === docId) setActiveDoc(prev => prev ? { ...prev, status: 'Verified' } : null);
  };

  const handleVerifyAll = async () => {
    const pendingDocs = documents.filter(d => d.status === 'Pending Verification');
    if (pendingDocs.length === 0) return;
    if (!window.confirm(`Verify all ${pendingDocs.length} pending documents for this student?`)) return;
    const ids = pendingDocs.map(d => d.id);
    const { error } = await supabase
      .from('student_documents')
      .update({ status: 'Verified', verified_at: new Date().toISOString() })
      .in('id', ids);
    if (error) { alert('Error: ' + error.message); return; }
    setDocuments(prev => prev.map(d => ids.includes(d.id) ? { ...d, status: 'Verified' } : d));
    if (activeDoc && ids.includes(activeDoc.id)) setActiveDoc(prev => prev ? { ...prev, status: 'Verified' } : null);
  };

  const handleReject = async () => {
    if (!showRejectModal) return;
    const { error } = await supabase
      .from('student_documents')
      .update({ status: 'Rejected', rejection_reason: rejectReason || 'Rejected by Registrar' })
      .eq('id', showRejectModal);
    if (error) { alert('Error: ' + error.message); return; }
    setDocuments(prev => prev.map(d => d.id === showRejectModal ? { ...d, status: 'Rejected', rejection_reason: rejectReason } : d));
    if (activeDoc?.id === showRejectModal) setActiveDoc(prev => prev ? { ...prev, status: 'Rejected' } : null);
    setShowRejectModal(null);
    setRejectReason('');
  };

  const statusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'verified') return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>;
    if (s === 'rejected') return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>;
    return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gray-400 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading documents...
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/registrar/verification/pending')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
          <ArrowLeft size={18} /> Back to Pending
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {student ? `${student.first_name} ${student.last_name}` : admissionNumber}
            </h1>
            <p className="text-sm text-gray-500">{admissionNumber} · {student?.department_code} · {student?.program_code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 font-medium">
            {documents.filter(d => d.status === 'Verified').length} Verified
          </span>
          <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 font-medium">
            {documents.filter(d => d.status === 'Pending Verification').length} Pending
          </span>
          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200 font-medium">
            {documents.filter(d => d.status === 'Rejected').length} Rejected
          </span>
          {documents.some(d => d.status === 'Pending Verification') && (
            <button
              onClick={handleVerifyAll}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
            >
              <CheckCircle size={15} /> Verify All Pending
            </button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[500px]">

        {/* Left: Document List */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          <div className="p-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Documents ({documents.length})
          </div>
          {documents.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No documents found</div>
          ) : (
            documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeDoc?.id === doc.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={15} className={`flex-shrink-0 ${activeDoc?.id === doc.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{doc.document_type}</div>
                    <div className="mt-0.5">{statusBadge(doc.status)}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: Document Viewer */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          {!activeDoc ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-3 opacity-40" />
                <p>Select a document to preview</p>
              </div>
            </div>
          ) : (
            <>
              {/* Doc header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{activeDoc.document_type}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock size={12} /> Uploaded {new Date(activeDoc.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(activeDoc.status)}
                  {previewUrl && (
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      <Eye size={14} /> Open <Download size={12} />
                    </a>
                  )}
                  {activeDoc.status === 'Pending Verification' && (
                    <>
                      <button onClick={() => handleVerify(activeDoc.id)}
                        className="flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                        <CheckCircle size={14} /> Verify
                      </button>
                      <button onClick={() => setShowRejectModal(activeDoc.id)}
                        className="flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Rejection reason */}
              {activeDoc.status === 'Rejected' && activeDoc.rejection_reason && (
                <div className="mx-4 mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  <span><strong>Rejected:</strong> {activeDoc.rejection_reason}</span>
                </div>
              )}

              {/* Preview */}
              <div className="flex-1 p-4 overflow-auto bg-gray-50">
                {previewLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      Loading preview...
                    </div>
                  </div>
                ) : previewUrl ? (
                  activeDoc.original_filename?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <img src={previewUrl} alt={activeDoc.document_type} className="max-w-full h-auto mx-auto rounded-lg shadow" />
                  ) : (
                    <iframe
                      src={previewUrl}
                      title={activeDoc.document_type}
                      className="w-full h-full rounded-lg border border-gray-200"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Preview not available</p>
                      <p className="text-xs mt-1 text-gray-400">File may be stored in a private bucket. Use "Open" button above.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Reject Document</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection. This will be visible to the student.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Document is unclear, please resubmit a clearer copy..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
