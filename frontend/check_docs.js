import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const checkDocs = async () => {
    const { data, error } = await supabase.from('student_documents').select('*, students(first_name, last_name)').limit(1);
    console.log(data, error);
}
checkDocs();
