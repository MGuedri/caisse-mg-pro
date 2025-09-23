
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppProvider, AppUser } from "@/app/(app)/app-provider";
import { fetchAllDataForAdmin, fetchDataForCommerce } from '../actions/data';

async function getUserAndData(): Promise<{ user: AppUser | null; initialData: any }> {
    const supabase = createServerActionClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { user: null, initialData: null };
    }

    const { user: authUser } = session;
    let appUser: AppUser | null = null;
    let initialData = null;

    if (authUser.email?.toLowerCase() === 'onz@live.fr') {
        appUser = {
            id: authUser.id,
            name: 'Super Admin',
            email: authUser.email,
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

    if (!appUser) {
       redirect('/login');
    }

    return { user: appUser, initialData };
}


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, initialData } = await getUserAndData();

  if (!user) {
    return redirect('/login');
  }

  return (
    <AppProvider user={user} initialData={initialData}>
      <main>
        {children}
      </main>
    </AppProvider>
  )
}

    