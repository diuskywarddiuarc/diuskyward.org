#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
    try {
        console.log('Checking database...\n');
        
        // Query with service role key (should see all data regardless of RLS)
        const { data: allNews, error } = await supabase
            .from('news')
            .select('id, slug, title, status');
        
        if (error) {
            console.error('Error:', error);
            process.exit(1);
        }
        
        console.log(`Total articles in database: ${allNews?.length || 0}\n`);
        
        if (allNews && allNews.length > 0) {
            console.log('Articles:');
            allNews.forEach(article => {
                console.log(`  - "${article.title}"`);
                console.log(`    Slug: ${article.slug}`);
                console.log(`    Status: ${article.status}`);
            });
        } else {
            console.log('No articles found in database.');
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
        process.exit(1);
    }
}

checkDatabase();
