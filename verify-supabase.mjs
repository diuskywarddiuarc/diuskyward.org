import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Did you pass --env-file=.env.local?');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('Testing connection to Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    const { data, error } = await supabase.from('contact_messages').select('id').limit(1);
    
    // We expect a 42P01 error (relation does not exist) if the connection works but the table isn't there yet.
    if (error && error.code === '42P01') {
      console.log('✅ Connection Successful! The database was reached, but the tables have not been created yet. You are ready to create them.');
    } else if (error) {
      console.error('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection Successful! Tables already exist.');
    }
  } catch (err) {
    console.error('❌ Network or unexpected error:', err);
  }
}

verifyConnection();
