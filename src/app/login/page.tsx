
import { serverSignIn } from '@/app/actions/auth';
import { Logo } from '@/app/(app)/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;
  let errorMessage = '';

  if (error) {
    switch (error) {
        case 'Invalid login credentials':
            errorMessage = 'Email ou mot de passe incorrect.';
            break;
        default:
            errorMessage = decodeURIComponent(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-white">Caisse MG Pro</h1>
        </div>

        {errorMessage && (
          <div className="bg-red-600/20 border border-red-600 text-red-300 px-4 py-3 rounded mb-6 text-sm">
            <div className="font-bold mb-1">Erreur de connexion</div>
            {errorMessage}
          </div>
        )}

        <form action={serverSignIn} className="space-y-6">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="onz@live.fr"
              defaultValue="onz@live.fr"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••••"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
