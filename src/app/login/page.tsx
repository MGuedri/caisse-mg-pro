
'use server';
// This page is now a simple entry point to the main app's login screen.
// We redirect to the / route, and the layout will handle showing the login screen if not authenticated.
import { redirect } from "next/navigation";

export default async function LoginPage() {
    redirect('/');
}
