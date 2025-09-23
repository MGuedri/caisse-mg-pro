
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Commerce, Product, Client, Employee, Expense, Order } from '../(app)/app-provider';
import { add } from 'date-fns';

// General purpose function to handle mutations
async function handleMutation(callback: (supabase: any) => Promise<any>) {
    const supabase = createServerActionClient({ cookies });
    try {
        const { data, error } = await callback(supabase);
        if (error) {
            console.error('Supabase mutation error:', error.message);
            return { error: error.message };
        }
        revalidatePath('/'); // Revalidate all paths for simplicity
        return { data };
    } catch (e: any) {
        console.error('Server action error:', e.message);
        return { error: e.message };
    }
}

// ======================
// COMMERCE MUTATIONS (SuperAdmin only)
// ======================

export async function createCommerce(commerceData: Commerce, ownerPassword?: string) {
    const supabaseAdmin = createServerActionClient({ cookies }, {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.createUser({
        email: commerceData.owneremail,
        password: ownerPassword!,
        email_confirm: true, // Auto-confirm user
    });

    if (authError) {
        return { error: `Erreur Auth: ${authError.message}` };
    }
    const owner_id = authData.user!.id;
    
    // 2. Create the commerce profile
    return handleMutation(supabase => 
        supabase.from('commerces').insert({
            ...commerceData,
            id: undefined, // Let Supabase generate it
            owner_id,
        })
    );
}

export async function updateCommerce(id: string, commerceData: Partial<Commerce>) {
    return handleMutation(supabase => 
        supabase.from('commerces').update(commerceData).eq('id', id)
    );
}

export async function deleteCommerce(id: string) {
    const supabaseAdmin = createServerActionClient({ cookies }, {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });
     
    // We need to get the owner_id before deleting the commerce
    const { data: commerce, error: fetchError } = await supabaseAdmin.from('commerces').select('owner_id').eq('id', id).single();
    if (fetchError || !commerce) {
        return { error: 'Commerce non trouvé.'};
    }
    
    // Delete the commerce record
    const { error: deleteCommerceError } = await supabaseAdmin.from('commerces').delete().eq('id', id);
    if(deleteCommerceError) {
        return { error: `Erreur suppression commerce: ${deleteCommerceError.message}` };
    }

    // Delete the auth user
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(commerce.owner_id);
     if(deleteUserError) {
        // This is not ideal, but we've already deleted the commerce.
        // In a real app, this should be a transaction.
        console.error(`Failed to delete auth user ${commerce.owner_id}: ${deleteUserError.message}`);
    }

    revalidatePath('/');
    return { data: 'ok' };
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
        supabase.from('invoices').insert(newInvoice)
    );
}

export async function markInvoiceAsPaid(invoiceId: string) {
     return handleMutation(supabase => 
        supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', invoiceId)
    );
}


// ======================
// GENERIC MUTATIONS (for Owners)
// ======================
export async function addProduct(productData: Omit<Product, 'id'>) {
    return handleMutation(supabase => supabase.from('products').insert(productData));
}
export async function updateProduct(id: string, productData: Partial<Product>) {
    return handleMutation(supabase => supabase.from('products').update(productData).eq('id', id));
}
export async function deleteProduct(id: string) {
    return handleMutation(supabase => supabase.from('products').delete().eq('id', id));
}

export async function addClient(clientData: Omit<Client, 'id'>) {
    return handleMutation(supabase => supabase.from('clients').insert(clientData));
}
export async function updateClient(id: string, clientData: Partial<Client>) {
    return handleMutation(supabase => supabase.from('clients').update(clientData).eq('id', id));
}
export async function deleteClient(id: string) {
    return handleMutation(supabase => supabase.from('clients').delete().eq('id', id));
}

export async function addEmployee(employeeData: Omit<Employee, 'id'>) {
    return handleMutation(supabase => supabase.from('employees').insert(employeeData));
}
export async function updateEmployee(id: string, employeeData: Partial<Employee>) {
    return handleMutation(supabase => supabase.from('employees').update(employeeData).eq('id', id));
}
export async function deleteEmployee(id: string) {
    return handleMutation(supabase => supabase.from('employees').delete().eq('id', id));
}

export async function addExpense(expenseData: Omit<Expense, 'id'>) {
    return handleMutation(supabase => supabase.from('expenses').insert(expenseData));
}
export async function updateExpense(id: string, expenseData: Partial<Expense>) {
    return handleMutation(supabase => supabase.from('expenses').update(expenseData).eq('id', id));
}
export async function deleteExpense(id: string) {
    return handleMutation(supabase => supabase.from('expenses').delete().eq('id', id));
}

export async function addOrder(orderData: Omit<Order, 'id'>) {
    // The items in an order are JSON, so we need to stringify them if they are not already
    const payload = { ...orderData, items: JSON.stringify(orderData.items) };
    return handleMutation(supabase => supabase.from('orders').insert(payload));
}
