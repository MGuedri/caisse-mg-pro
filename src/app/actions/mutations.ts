'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Commerce, Product, Client, Employee, Expense, Order } from '../(app)/app-provider';
import { add } from 'date-fns';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// General purpose function to handle mutations
async function handleMutation(callback: (supabase: any) => Promise<any>, revalidationPaths: string[] = []) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    );
    try {
        const { data, error } = await callback(supabase);
        if (error) {
            console.error('Supabase mutation error:', error.message);
            return { data: null, error: error.message };
        }
        
        revalidationPaths.forEach(path => revalidatePath(path));

        return { data, error: null };
    } catch (e: any) {
        console.error('Server action error:', e.message);
        return { data: null, error: e.message };
    }
}

// ======================
// COMMERCE MUTATIONS (SuperAdmin only)
// ======================

export async function createCommerce(commerceData: Commerce, ownerPassword?: string) {
     const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.createUser({
            email: commerceData.owneremail,
            password: ownerPassword!,
            email_confirm: true,
        });

        if (authError) {
            return { error: `Erreur Auth: ${authError.message}` };
        }
        const owner_id = authData.user!.id;
        
        return handleMutation(supabase => 
            supabase.from('commerces').insert({
                ...commerceData,
                id: undefined, 
                owner_id,
            }),
            ['/'] 
        );
    } catch (e: any) {
        return { data: null, error: e.message };
    }
}

export async function updateCommerce(id: string, commerceData: Partial<Commerce>) {
    return handleMutation(supabase => 
        supabase.from('commerces').update(commerceData).eq('id', id),
        ['/']
    );
}

export async function deleteCommerce(id: string, owner_id: string) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
     
    try {
        const { error: deleteCommerceError } = await supabaseAdmin.from('commerces').delete().eq('id', id);
        if(deleteCommerceError) {
            return { error: `Erreur suppression commerce: ${deleteCommerceError.message}` };
        }

        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(owner_id);
        if(deleteUserError && deleteUserError.message !== 'User not found') {
            console.error(`Failed to delete auth user ${owner_id}: ${deleteUserError.message}`);
        }

        revalidatePath('/');
        return { data: 'ok', error: null };
    } catch (e: any) {
        return { data: null, error: e.message };
    }
}

// ======================
// INVOICE MUTATIONS (SuperAdmin only)
// ======================

export async function createInvoice(commerceId: string, amount: number, commerceName: string) {
    const dueDate = add(new Date(), { months: 1 });
    const newInvoice = {
        commerce_id: commerceId,
        amount: amount,
        due_date: dueDate.toISOString(),
        status: 'pending' as const,
        commerceName: commerceName,
    };
    return handleMutation(supabase => 
        supabase.from('invoices').insert(newInvoice),
        ['/']
    );
}

export async function markInvoiceAsPaid(invoiceId: string) {
     return handleMutation(supabase => 
        supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', invoiceId),
        ['/']
    );
}


// ======================
// GENERIC MUTATIONS (for Owners)
// ======================
export async function addProduct(productData: Omit<Product, 'id'>) {
    return handleMutation(supabase => supabase.from('products').insert(productData), ['/']);
}
export async function updateProduct(id: string, productData: Partial<Product>) {
    return handleMutation(supabase => supabase.from('products').update(productData).eq('id', id), ['/']);
}
export async function deleteProduct(id: string) {
    return handleMutation(supabase => supabase.from('products').delete().eq('id', id), ['/']);
}

export async function addClient(clientData: Omit<Client, 'id'>) {
    return handleMutation(supabase => supabase.from('clients').insert(clientData), ['/']);
}
export async function updateClient(id: string, clientData: Partial<Client>) {
    return handleMutation(supabase => supabase.from('clients').update(clientData).eq('id', id), ['/']);
}
export async function deleteClient(id: string) {
    return handleMutation(supabase => supabase.from('clients').delete().eq('id', id), ['/']);
}

export async function addEmployee(employeeData: Omit<Employee, 'id'>) {
    const fullEmployeeData = {
        ...employeeData,
        avatar: `https://i.pravatar.cc/150?u=${randomUUID()}`
    };
    return handleMutation(supabase => supabase.from('employees').insert(fullEmployeeData), ['/']);
}
export async function updateEmployee(id: string, employeeData: Partial<Employee>) {
    return handleMutation(supabase => supabase.from('employees').update(employeeData).eq('id', id), ['/']);
}
export async function deleteEmployee(id: string) {
    return handleMutation(supabase => supabase.from('employees').delete().eq('id', id), ['/']);
}

export async function addExpense(expenseData: Omit<Expense, 'id'>) {
    return handleMutation(supabase => supabase.from('expenses').insert(expenseData), ['/']);
}
export async function updateExpense(id: string, expenseData: Partial<Expense>) {
    return handleMutation(supabase => supabase.from('expenses').update(expenseData).eq('id', id), ['/']);
}
export async function deleteExpense(id: string) {
    return handleMutation(supabase => supabase.from('expenses').delete().eq('id', id), ['/']);
}

export async function addOrder(orderData: Omit<Order, 'id'>) {
    const payload = { ...orderData, items: orderData.items };
    return handleMutation(supabase => supabase.from('orders').insert(payload), ['/']);
}
