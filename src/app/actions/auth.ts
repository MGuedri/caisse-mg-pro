
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function signIn(email: string, password_): Promise<{ user?: any, error?: string }> {
  const supabase = createServerActionClient({ cookies });
  
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: password_,
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authUser) {
        return { error: 'Utilisateur non trouvé.' };
    }
    
    // Check if user is SuperAdmin first
    if (email.toLowerCase() === 'onz@live.fr') {
        const superAdminProfile = {
            id: authUser.id,
            name: 'Super Admin',
            email: authUser.email!,
            role: 'SuperAdmin',
            isSuperAdmin: true
        };
        return { user: superAdminProfile };
    }
    
    // If not superadmin, find their commerce profile
    const { data: commerce, error: commerceError } = await supabase
        .from('commerces')
        .select('*')
        .eq('owneremail', email)
        .single();
    
    if (commerceError || !commerce) {
        await supabase.auth.signOut(); // Sign out if no profile found
        return { error: 'Profil de commerce non trouvé pour cet utilisateur.' };
    }

    const ownerProfile = {
        id: authUser.id,
        name: commerce.ownername,
        email: commerce.owneremail,
        role: 'Owner',
        isSuperAdmin: false,
        commerceId: commerce.id,
        commerceName: commerce.name
    };

    return { user: ownerProfile };
  } catch (e: any) {
    return { error: e.message };
  }
}


export async function signOut() {
  try {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
    revalidatePath('/');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
