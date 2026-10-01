import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const run = async () => {
    // The previous run_sql wasn't working well with rpc if function is not defined, 
    // maybe we can just inform the user to run it via the SQL editor.
};
run();
