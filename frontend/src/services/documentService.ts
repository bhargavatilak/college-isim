import { supabase } from '../lib/supabase';

// Helper to generate a unique filename
const generateFileName = (applicationId: number | string, docType: string, file: File) => {
  const ext = file.name.split('.').pop();
  const cleanDocType = docType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `${applicationId}/${cleanDocType}_${Date.now()}.${ext}`;
};

export const uploadDocument = async (applicationId: number | string, admissionNumber: string, documentType: string, file: File, uploadedBy: string) => {
  const filePath = generateFileName(applicationId, documentType, file);
  
  // 1. Upload file to Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('student_documents')
    .upload(filePath, file);

  if (storageError) throw storageError;

  // 2. Insert metadata into Supabase Database
  const { data: dbData, error: dbError } = await supabase
    .from('student_documents')
    .insert([{
      application_id: applicationId.toString(),
      admission_number: admissionNumber,
      document_type: documentType,
      file_path: filePath,
      original_filename: file.name,
      uploaded_by: uploadedBy,
      verification_status: 'PENDING'
    }]);

  if (dbError) throw dbError;
  return dbData;
};

export const getDocuments = async (applicationId: number | string) => {
  const { data, error } = await supabase
    .from('student_documents')
    .select('*')
    .eq('application_id', applicationId.toString());
    
  if (error) throw error;
  return { data }; // Mimic axios response structure
};

export const downloadDocument = async (documentId: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from('student_documents')
    .download(filePath);
    
  if (error) throw error;
  return { data }; // Returns a Blob
};

export const getDocumentUrl = (filePath: string) => {
  const { data } = supabase.storage
    .from('student_documents')
    .getPublicUrl(filePath);
  return data.publicUrl;
};

export const verifyDocument = async (documentId: string) => {
  const { data, error } = await supabase
    .from('student_documents')
    .update({ status: 'Verified', verified_at: new Date().toISOString() })
    .eq('id', documentId);
    
  if (error) throw error;
  return { data };
};

export const rejectDocument = async (documentId: string, reason: string) => {
  const { data, error } = await supabase
    .from('student_documents')
    .update({ status: 'Rejected', rejection_reason: reason })
    .eq('id', documentId);
    
  if (error) throw error;
  return { data };
};

export const deleteDocument = async (documentId: string, filePath: string) => {
  // 1. Delete from storage
  await supabase.storage.from('student_documents').remove([filePath]);
  
  // 2. Delete from DB
  const { data, error } = await supabase.from('student_documents').delete().eq('id', documentId);
  if (error) throw error;
  return { data };
};

export const replaceDocument = async (documentId: string, file: File, uploadedBy: string) => {
  console.warn("replaceDocument is not fully wired up to Supabase yet");
  return { data: true };
};
