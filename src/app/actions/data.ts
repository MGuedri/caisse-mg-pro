
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function fetchDataForCommerce(commerceId: string) {
    const supabase = createServerActionClient({ cookies });
    
    const [
        productsRes,
        clientsRes,
        employeesRes,
        ordersRes,
        expensesRes,
    ] = await Promise.all([
        supabase.from('products').select('*').eq('commerce_id', commerceId),
        supabase.from('clients').select('*').eq('commerce_id', commerceId),
        supabase.from('employees').select('*').eq('commerce_id', commerceId),
        supabase.from('orders').select('*').eq('commerce_id', commerceId).order('timestamp', { ascending: false }),
        supabase.from('expenses').select('*').eq('commerce_id', commerceId),
    ]);

    // Note: We don't check for individual errors here for simplicity in this context
    // A production app should handle this more gracefully.

    return {
        products: productsRes.data || [],
        clients: clientsRes.data || [],
        employees: employeesRes.data || [],
        orders: ordersRes.data || [],
        expenses: expensesRes.data || [],
    };
}


export async function fetchAllDataForAdmin() {
    const supabase = createServerActionClient({ cookies });

    const [
        commercesRes,
        invoicesRes,
        productsRes,
        clientsRes,
        employeesRes,
        ordersRes,
        expensesRes,
    ] = await Promise.all([
        supabase.from('commerces').select('*'),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('expenses').select('*'),
    ]);
    
    return {
        commerces: commercesRes.data || [],
        invoices: invoicesRes.data || [],
        products: productsRes.data || [],
        clients: clientsRes.data || [],
        employees: employeesRes.data || [],
        orders: ordersRes.data || [],
        expenses: expensesRes.data || [],
    };
}
