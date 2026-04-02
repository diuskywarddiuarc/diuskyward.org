import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, studentId, department, division, message } = body;

        // Basic validation
        if (!fullName || !studentId || !department || !division) {
            return NextResponse.json(
                { error: 'Required fields are missing' },
                { status: 400 }
            );
        }

        if (!supabase) {
            console.warn("Supabase client not initialized but form submitted.");
            return NextResponse.json({ success: true, data: [] });
        }

        const { data, error } = await supabase
            .from('applications')
            .insert([
                {
                    full_name: fullName,
                    student_id: studentId,
                    department,
                    division,
                    message
                }
            ]);

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Backend Error:', error.message);
        return NextResponse.json(
            { error: 'Failed to process application' },
            { status: 500 }
        );
    }
}
