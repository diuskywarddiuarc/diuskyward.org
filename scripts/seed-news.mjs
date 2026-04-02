#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    console.error('You can find the service role key in your Supabase dashboard under Settings > API');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testNews = [
    {
        title: 'DIU Skyward Launches New Satellite Project',
        slug: 'diu-skyward-launches-new-satellite-project',
        content: 'DIU Skyward is excited to announce the launch of our new CubeSat satellite project. This initiative will allow our team to conduct advanced research in space technology and satellite communications.',
        author: 'DIU Skyward Team',
        summary: 'New CubeSat project announcement',
        cover_image: '/media/images/team/default.jpg',
        status: 'published',
        category: 'Projects',
        seo_title: 'DIU Skyward Launches New Satellite Project',
        seo_description: 'Learn about DIU Skyward\'s new CubeSat satellite project',
        featured: true,
        allow_comments: true,
        show_author: true,
        show_date: true,
    },
    {
        title: 'Rocket Development Milestone Achieved',
        slug: 'rocket-development-milestone-achieved',
        content: 'Our rocket development team has successfully completed the first phase of testing. The rocket reached an altitude of 5000 meters and performed flawlessly. This is a major step forward in our mission to develop high-performance rockets.',
        author: 'DIU Skyward Team',
        summary: 'Rocket testing phase 1 complete',
        cover_image: '/media/images/team/default.jpg',
        status: 'published',
        category: 'Rockets',
        seo_title: 'Rocket Development Milestone Achieved',
        seo_description: 'DIU Skyward completes first phase of rocket testing',
        featured: true,
        allow_comments: true,
        show_author: true,
        show_date: true,
    },
    {
        title: 'DIU Skyward Team Wins National Competition',
        slug: 'diu-skyward-team-wins-national-competition',
        content: 'In an outstanding display of teamwork and engineering excellence, the DIU Skyward robotics team won first place at the National Robotics Competition. Our rover design impressed judges with its innovative approach to autonomous navigation and obstacle detection.',
        author: 'DIU Skyward Team',
        summary: 'National competition victory',
        cover_image: '/media/images/team/default.jpg',
        status: 'published',
        category: 'Achievements',
        seo_title: 'DIU Skyward Team Wins National Competition',
        seo_description: 'DIU Skyward achieves first place in national robotics competition',
        featured: true,
        allow_comments: true,
        show_author: true,
        show_date: true,
    },
    {
        title: 'Join Our Team: Now Hiring',
        slug: 'join-our-team-now-hiring',
        content: 'Are you passionate about aerospace and space technology? DIU Skyward is looking for talented individuals to join our growing team. We\'re hiring for various positions including software engineers, mechanical engineers, and project managers. Check out our careers page for more information.',
        author: 'DIU Skyward Team',
        summary: 'Career opportunities available',
        cover_image: '/media/images/team/default.jpg',
        status: 'published',
        category: 'News',
        seo_title: 'Join DIU Skyward Team - Now Hiring',
        seo_description: 'Explore career opportunities at DIU Skyward',
        featured: false,
        allow_comments: false,
        show_author: true,
        show_date: true,
    },
    {
        title: 'g-gf',
        slug: 'g-gf',
        content: 'This is a test article with the slug g-gf. This article is used for testing the news article page.',
        author: 'DIU Skyward Team',
        summary: 'Test article',
        cover_image: '/media/images/team/default.jpg',
        status: 'published',
        category: 'Test',
        seo_title: 'Test Article',
        seo_description: 'This is a test article',
        featured: false,
        allow_comments: true,
        show_author: true,
        show_date: true,
    },
];

async function seedNews() {
    try {
        console.log('Starting news database seed...');
        
        // Check which articles already exist
        const { data: existingSlugs } = await supabase
            .from('news')
            .select('slug');
        
        const existingSlugSet = new Set(existingSlugs?.map(n => n.slug) || []);
        const articlesToInsert = testNews.filter(article => !existingSlugSet.has(article.slug));
        
        if (articlesToInsert.length === 0) {
            console.log('All articles already exist in the database!');
            console.log('Existing articles:');
            existingSlugs?.forEach(article => {
                console.log(`  - ${article.slug}`);
            });
            return;
        }
        
        // Insert test news articles that don't already exist
        const { data, error } = await supabase
            .from('news')
            .insert(articlesToInsert);
        
        if (error) {
            console.error('Error seeding news:', error);
            process.exit(1);
        }
        
        console.log(`Successfully seeded ${articlesToInsert.length} new news articles!`);
        console.log('New articles created:');
        articlesToInsert.forEach(news => {
            console.log(`  - "${news.title}" (slug: ${news.slug})`);
        });
        
    } catch (error) {
        console.error('Unexpected error:', error);
        process.exit(1);
    }
}

seedNews();
