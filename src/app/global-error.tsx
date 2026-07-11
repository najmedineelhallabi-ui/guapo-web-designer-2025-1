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
      <body className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 font-sans px-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-black mb-4 text-gray-200">500</h1>
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="text-gray-500 text-sm mb-8">Quelque chose s&apos;est mal passé. Réessaie ou contacte-nous.</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}