// src/pages/admission-cell/DocumentVerification.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Upload, File, Clock, Loader2, Eye, Download, Trash2, RefreshCw } from 'lucide-react';
import {
  uploadDocument,
  getDocuments,
  downloadDocument,
  verifyDocument,
  rejectDocument,
  replaceDocument,
  deleteDocument,
  getDocumentUrl
} from '../../services/documentService';

// Types
interface DocumentDTO {
  id: number | string;
  documentType: string;
  originalFileName: string;
  storedFileName: string;
  fileSize: number;
  mimeType: string;
  uploadStatus: string;
  verificationStatus: string;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  version: number;
  remarks?: string;
}

interface Props {
  applicationId: number; // In real usage, pass the actual application id
  studentName?: string;
  admissionNumber?: string;
  department?: string;
  course?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export const DocumentVerification: React.FC<Props> = ({ applicationId, studentName, admissionNumber, department, course }) => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Mock required documents configuration – in production this would come from backend
  const requiredDocs = [
    { type: 'Photograph', required: true },
    { type: 'Signature', required: true },
    { type: 'Aadhaar', required: true },
    { type: '10th Marksheet', required: true },
    { type: '12th Marksheet', required: true },
    { type: 'Transfer Certificate', required: false },
    { type: 'Migration Certificate', required: false },
    { type: 'Character Certificate', required: false },
    { type: 'Domicile Certificate', required: false },
    { type: 'Category Certificate', required: false },
    { type: 'Income Certificate', required: false },
    { type: 'Entrance Scorecard', required: false },
    { type: 'Medical Certificate', required: false },
    { type: 'Other Supporting Document', required: false },
  ];

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const response = await getDocuments(applicationId);
      if (Array.isArray(response.data)) {
        const mappedDocs: DocumentDTO[] = response.data.map(doc => ({
          id: doc.id,
          documentType: doc.document_type,
          originalFileName: doc.original_filename,
          storedFileName: doc.file_path,
          fileSize: 0,
          mimeType: '',
          uploadStatus: 'UPLOADED',
          verificationStatus: doc.status.toUpperCase().replace(/ /g, '_'),
          uploadedAt: doc.created_at,
          verifiedAt: doc.verified_at,
          rejectionReason: doc.rejection_reason
        }));
        setDocuments(mappedDocs);
      } else {
        setDocuments([]);
      }
    } catch (e) {
      console.error(e);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [applicationId]);

  // ---- Helpers ----
  const getDocumentByType = (type: string) => Array.isArray(documents) ? documents.find((d) => d.documentType === type) : undefined;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Invalid file type. Please upload PDF, JPG, JPEG or PNG.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('File size exceeds the permitted limit.');
      return;
    }
    setErrorMsg('');
    setSelectedFile(file);
    setSelectedDocType(docType);
  };

  const startUpload = async () => {
    if (!selectedFile || !selectedDocType) return;
    setUploadProgress(0);
    try {
      const currentAdmissionNumber = admissionNumber || `TEMP_${applicationId}`;
      await uploadDocument(
        applicationId,
        currentAdmissionNumber,
        selectedDocType,
        selectedFile,
        'admission-cell',
        (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setUploadProgress(percent);
        }
      );
      setSelectedFile(null);
      setSelectedDocType('');
      await fetchDocs();
    } catch (e) {
      console.error(e);
      setErrorMsg('Upload failed.');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleMarkOffline = (docType: string) => {
    const offlineDoc: DocumentDTO = {
      id: Math.random(),
      documentType: docType,
      originalFileName: 'Offline Submission (Hardcopy)',
      storedFileName: 'offline',
      fileSize: 0,
      mimeType: 'text/plain',
      uploadStatus: 'UPLOADED',
      verificationStatus: 'VERIFIED',
      uploadedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      rejectionReason: '',
      version: 1
    };
    setDocuments((prev) => [...prev, offlineDoc]);
  };

  const handleVerify = async (docId: string | number) => {
    await verifyDocument(docId.toString());
    await fetchDocs();
  };

  const handleReject = async (docId: string | number) => {
    const reason = prompt('Enter rejection reason');
    if (!reason) return;
    await rejectDocument(docId.toString(), reason);
    await fetchDocs();
  };

  const handleReplace = async (docId: string | number, file: File) => {
    // Note: not implemented in supabase mockup yet, fallback to backend if needed
    // await replaceDocument(docId, file, 'admission-cell');
    await fetchDocs();
  };

  const handleDelete = async (docId: string | number, storedFileName: string) => {
    if (!window.confirm('Are you sure you want to remove this uploaded document?')) return;
    await deleteDocument(docId.toString(), storedFileName);
    await fetchDocs();
  };

  // ---- Summary calculations ----
  const totalRequired = requiredDocs.filter((d) => d.required).length;
  const uploadedCount = requiredDocs.filter((d) => getDocumentByType(d.type)?.uploadStatus === 'UPLOADED').length;
  const verifiedCount = requiredDocs.filter((d) => getDocumentByType(d.type)?.verificationStatus === 'VERIFIED').length;
  const pendingCount = requiredDocs.filter((d) => getDocumentByType(d.type)?.verificationStatus === 'PENDING').length;
  const rejectedCount = requiredDocs.filter((d) => getDocumentByType(d.type)?.verificationStatus === 'REJECTED').length;

  // UI
  return (
    <div className="space-y-6">
      {/* Header with student meta – in real product these props would be fetched */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Student Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>Student Name: <span className="font-medium">{studentName || 'Student Name'}</span></div>
          <div>Admission No: <span className="font-medium">{admissionNumber || 'Pending'}</span></div>
          <div>Program: <span className="font-medium">{course || 'B.Tech'}</span></div>
          <div>Branch: <span className="font-medium">{department || 'CSE'}</span></div>
          <div>Specialization: <span className="font-medium">-</span></div>
          <div>Session: <span className="font-medium">{new Date().getFullYear()}-{new Date().getFullYear() + 1}</span></div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-500 uppercase">Required</p>
          <p className="text-2xl font-bold">{totalRequired}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-500 uppercase">Uploaded</p>
          <p className="text-2xl font-bold">{uploadedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-500 uppercase">Verified</p>
          <p className="text-2xl font-bold">{verifiedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-500 uppercase">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xs text-gray-500 uppercase">Rejected</p>
          <p className="text-2xl font-bold">{rejectedCount}</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Document Completion – {uploadedCount} / {totalRequired}</p>
        <div className="w-full bg-gray-200 rounded h-2">
          <div className="bg-blue-600 h-2 rounded" style={{ width: `${(uploadedCount / totalRequired) * 100}%` }} />
        </div>
        <p className="text-sm font-medium">Verification – {verifiedCount} / {totalRequired}</p>
        <div className="w-full bg-gray-200 rounded h-2">
          <div className="bg-green-600 h-2 rounded" style={{ width: `${(verifiedCount / totalRequired) * 100}%` }} />
        </div>
      </div>

      {/* Document List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Document</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Required</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">File</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Verification</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requiredDocs.map((doc) => {
              const existing = getDocumentByType(doc.type);
              return (
                <tr key={doc.type} className="border-t">
                  <td className="px-4 py-2">{doc.type}</td>
                  <td className="px-4 py-2">{doc.required ? 'Required' : 'Optional'}</td>
                  <td className="px-4 py-2">
                    {existing ? (
                      <div className="flex items-center space-x-2">
                        <File size={16} />
                        <span className="text-sm">{existing.originalFileName}</span>
                        <span className="text-xs text-gray-500">{(existing.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input type="file" onChange={(e) => handleFileSelect(e, doc.type)} style={{ display: 'none' }} id={`file_${doc.type}`} />
                        <label htmlFor={`file_${doc.type}`} className="cursor-pointer text-blue-600 hover:underline">
                          Upload
                        </label>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {existing ? (
                      <span className={
                        `px-2 py-1 text-xs rounded-full ${
                          existing.uploadStatus === 'UPLOADED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`
                      }>
                        {existing.uploadStatus}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {existing ? (
                      <span className={
                        `px-2 py-1 text-xs rounded-full ${
                          existing.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                          existing.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          existing.verificationStatus === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`
                      }>
                        {existing.verificationStatus}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {existing ? (
                      <>
                        <a href={getDocumentUrl(existing.storedFileName)} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                          <Download size={14} className="inline" /> Download
                        </a>
                        <button onClick={() => handleVerify(existing.id)} className="text-sm text-green-600 hover:underline">
                          <CheckCircle size={14} className="inline" /> Verify
                        </button>
                        <button onClick={() => handleReject(existing.id)} className="text-sm text-red-600 hover:underline">
                          <XCircle size={14} className="inline" /> Reject
                        </button>
                        <button
                          onClick={async () => {
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.onchange = async (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) await handleReplace(existing.id, file);
                            };
                            fileInput.click();
                          }}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          <RefreshCw size={14} className="inline" /> Replace
                        </button>
                        {existing.uploadStatus !== 'VERIFIED' && (
                          <button onClick={() => handleDelete(existing.id, existing.storedFileName)} className="text-sm text-gray-600 hover:underline">
                            <Trash2 size={14} className="inline" /> Delete
                          </button>
                        )}
                      </>
                    ) : (
                      <button onClick={() => handleMarkOffline(doc.type)} className="text-sm text-gray-600 hover:underline flex items-center gap-1">
                        <CheckCircle size={14} className="inline" /> Mark Offline
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Upload Progress & Controls */}
      {selectedFile && selectedDocType && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p>Uploading <strong>{selectedFile.name}</strong> as <strong>{selectedDocType}</strong></p>
          {uploadProgress !== null && (
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          <button
            onClick={startUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;
