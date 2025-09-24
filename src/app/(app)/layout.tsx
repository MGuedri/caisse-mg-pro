
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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

    // 1. Check if the user is a SuperAdmin
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
            isSuperAdmin: true,
        };
        const { data } = await fetchAllDataForAdmin();
        initialData = data;
    } else {
        // 2. If not a SuperAdmin, check if they are a Commerce Owner
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

    // If no role is found, the user will be null and redirected to login.
    return { user: appUser, initialData };
}


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, initialData } = await getUserAndData();

  // If the user is not found or doesn't have a valid role,
  // the AppProvider will receive null and the page component will show the LoginScreen.
  return (
    <AppProvider user={user} initialData={initialData}>
      {children}
    </AppProvider>
  )
}
