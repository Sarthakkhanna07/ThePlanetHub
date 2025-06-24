// lib/authListener.js
import { useEffect } from 'react';
import { supabase } from './supabaseClient';

export function useAuthUpsert() {
  useEffect(() => {
    // When the component mounts, set up the listener
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        // Upsert into public.users
        try {
          const username = user.user_metadata?.full_name
            ? user.user_metadata.full_name.replace(/\s+/g, '').toLowerCase()
            : user.email.split('@')[0];

          const { data, error } = await supabase
            .from('users')
            .upsert(
              {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || username,
                username,
                // if you want to default role here; or leave null and force setup-role
                role: 'researcher', 
              },
              { onConflict: 'id' } // ensures that if row exists, it’s updated; else inserted
            )
            .select()
            .single();

          if (error) {
            console.error('Error upserting user row:', error);
          } else {
            console.log('User row upserted:', data);
          }
        } catch (e) {
          console.error('Unexpected error upserting user row:', e);
        }
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
}
