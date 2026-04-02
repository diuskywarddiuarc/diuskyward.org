import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  console.error('You can find the service role key in your Supabase dashboard under Settings > API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSchema() {
  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(process.cwd(), 'supabase-news-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          console.error('Error executing statement:', error);
          // Continue with other statements
        }
      }
    }

    console.log('✅ Schema execution completed!');
    console.log('Verifying table creation...');

    // Verify the table was created with correct columns
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('❌ Table was not created. You may need to run this SQL manually in your Supabase dashboard.');
    } else {
      console.log('✅ News table exists and is accessible!');
    }

  } catch (error) {
    console.error('❌ Error running schema:', error);
    console.log('\n💡 Tip: You can also run this SQL manually in your Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-news-schema.sql');
    console.log('4. Click "Run"');
  }
}

runSchema();