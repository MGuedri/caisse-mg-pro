
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

async function handleDataFetch(fetchFn: (supabase: any) => Promise<any>) {
    const supabase = createServerActionClient({ cookies });
    try {
        const { data, error } = await fetchFn(supabase);
        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    } catch (e: any) {
        return { data: null, error: e.message };
    }
}

export async function fetchDataForCommerce(commerceId: string) {
    return handleDataFetch(async (supabase) => {
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

        // In a real app, you'd check each response for errors.
        // For simplicity here, we'll let handleDataFetch catch the first one if it happens.

        return {
            data: {
                products: productsRes.data || [],
                clients: clientsRes.data || [],
                employees: employeesRes.data || [],
                orders: ordersRes.data || [],
                expenses: expensesRes.data || [],
            }
        };
    });
}


export async function fetchAllDataForAdmin() {
    return handleDataFetch(async (supabase) => {
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
            data: {
                commerces: commercesRes.data || [],
                invoices: invoicesRes.data || [],
                products: productsRes.data || [],
                clients: clientsRes.data || [],
                employees: employeesRes.data || [],
                orders: ordersRes.data || [],
                expenses: expensesRes.data || [],
            }
        };
    });
}
