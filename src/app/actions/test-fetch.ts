
'use server';

export const testFetch = async () => {
  try {
    console.log('Attempting to fetch from: https://httpbin.org/get');
    const res = await fetch('https://httpbin.org/get', { next: { revalidate: 0 } });
    console.log('Fetch successful, status:', res.status);
    return { success: res.ok, status: res.status, data: await res.json() };
  } catch (e: any) {
    console.error('Fetch failed with error:', e.message);
    return { error: `Fetch failed: ${e.message}` };
  }
};
