import { supabase } from './src/lib/supabase';
async function test() {
  const { data, error } = await supabase.from('admissions_applications').select('*').limit(1);
  console.log('admissions_applications', data, error);
}
test();
