import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    currentUser = signal<User | null>(null);

    constructor() {
        // Prevent crash if URL is not set (e.g. initial setup)
        const url = environment.supabaseUrl;
        const key = environment.supabaseKey;

        if (!url || url.includes('YOUR_SUPABASE_URL') || !key || key.includes('YOUR_SUPABASE_KEY')) {
            console.warn('Supabase not configured. Please update environment.ts');
            // Mock client or null to prevent crash, effectively preventing auth but allowing app to load
            this.supabase = {
                auth: {
                    getUser: async () => ({ data: { user: null } }),
                    getSession: async () => ({ data: { session: null } }),
                    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                    signOut: async () => ({ error: null }),
                }
            } as any;
            return;
        }

        this.supabase = createClient(url, key);

        // Initial load
        this.supabase.auth.getUser().then(({ data }) => {
            this.currentUser.set(data.user);
        });

        // Listen for changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                this.currentUser.set(session?.user || null);
            } else if (event === 'SIGNED_OUT') {
                this.currentUser.set(null);
            }
        });
    }

    get client() {
        return this.supabase;
    }

    get user() {
        return this.supabase.auth.getUser();
    }

    get session() {
        return this.supabase.auth.getSession();
    }

    async signOut() {
        return this.supabase.auth.signOut();
    }

    async signIn(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async signUp(email: string, password: string) {
        return this.supabase.auth.signUp({
            email,
            password,
        });
    }

    async resetPassword(email: string) {
        return this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/auth/recovery`,
        });
    }

    async updatePassword(password: string) {
        return this.supabase.auth.updateUser({
            password
        });
    }
}
