
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppProvider, AppUser } from "@/app/(app)/app-provider";
import { fetchAllDataForAdmin, fetchDataForCommerce } from '../actions/data';

async function getUserAndData(): Promise<{ user: AppUser | null; initialData: any }> {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { user: null, initialData: null };
    }

    const { user: authUser } = session;
    let appUser: AppUser | null = null;
    let initialData = null;

    // Check for SuperAdmin first
    const { data: superAdmin } = await supabase
        .from('superadmins')
        .select('user_id')
        .eq('user_id', authUser.id)
        .single();

    if (superAdmin) {
        appUser = {
            id: authUser.id,
            name: 'Super Admin',
            email: authUser.email!,
            role: 'SuperAdmin',
            isSuperAdmin: true
        };
        const { data } = await fetchAllDataForAdmin();
        initialData = data;
    } else {
        const { data: commerce } = await supabase
            .from('commerces')
            .select('*')
            .eq('owner_id', authUser.id)
            .single();
        
        if (commerce) {
            appUser = {
                id: authUser.id,
                name: commerce.ownername,
                email: commerce.owneremail,
                role: 'Owner',
                isSuperAdmin: false,
                commerceId: commerce.id,
                commerceName: commerce.name,
                owneremail: commerce.owneremail
            };
            const { data } = await fetchDataForCommerce(commerce.id);
            initialData = data;
        }
    }

    return { user: appUser, initialData };
}


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, initialData } = await getUserAndData();

  return (
    <AppProvider user={user} initialData={initialData}>
      {children}
    </AppProvider>
  )
}
