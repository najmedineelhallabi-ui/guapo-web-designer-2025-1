"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-red-600">
              Une erreur s'est produite
            </h1>
            <p className="text-gray-600">
              Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}