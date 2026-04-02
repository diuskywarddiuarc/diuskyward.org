#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function publishDraftArticles() {
    try {
        console.log('Publishing draft articles...\n');
        
        // Update all draft articles to published
        const { data, error } = await supabase
            .from('news')
            .update({ status: 'published' })
            .eq('status', 'draft');
        
        if (error) {
            console.error('Error updating articles:', error);
            process.exit(1);
        }
        
        console.log(`✅ Successfully published ${data?.length || 0} articles!\n`);
        
        // Verify the update
        const { data: allNews } = await supabase
            .from('news')
            .select('slug, title, status');
        
        console.log('Current articles:');
        allNews?.forEach(article => {
            console.log(`  - "${article.title}" (${article.slug}) - Status: ${article.status}`);
        });
        
    } catch (error) {
        console.error('Unexpected error:', error);
        process.exit(1);
    }
}

publishDraftArticles();
