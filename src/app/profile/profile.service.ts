import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../core/supabase.service';

export interface UserProfile {
    id: string;
    person_a_name: string;
    person_b_name: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private supabase = inject(SupabaseService);

    profile = signal<UserProfile | null>(null);

    constructor() {
        // Load profile whenever auth state changes (user logs in)
        this.supabase.client.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                this.loadProfile(session.user.id);
            } else {
                this.profile.set(null);
            }
        });

        // Try load initially if already logged in
        this.supabase.client.auth.getUser().then(({ data }) => {
            if (data.user) {
                this.loadProfile(data.user.id);
            }
        });
    }

    async loadProfile(userId: string) {
        const { data, error } = await this.supabase.client
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error loading profile (might not exist yet):', error);
            
            // Try to extract names from user metadata saved during signup
            const { data: authData } = await this.supabase.client.auth.getUser();
            const meta = authData?.user?.user_metadata || {};
            const personA = meta['person_a_name'] || 'Pessoa A';
            const personB = meta['person_b_name'] || 'Pessoa B';

            try {
                // Now that the user is authenticated, we can safely create the profile
                // without triggering RLS violations.
                await this.saveProfile(userId, personA, personB);
            } catch (saveErr) {
                console.error('Error auto-creating profile:', saveErr);
                // Fallback if saveProfile fails
                this.profile.set({
                    id: userId,
                    person_a_name: personA,
                    person_b_name: personB
                });
            }
            return;
        }

        this.profile.set(data as UserProfile);
    }

    async saveProfile(userId: string, personAName: string, personBName: string) {
        const { data, error } = await this.supabase.client
            .from('profiles')
            .upsert({
                id: userId,
                person_a_name: personAName || 'Pessoa A',
                person_b_name: personBName || 'Pessoa B',
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving profile:', error);
            throw error;
        }

        this.profile.set(data as UserProfile);
    }
}
