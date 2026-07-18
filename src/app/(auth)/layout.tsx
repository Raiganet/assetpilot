export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">AssetPilot</h1>
          <p className="text-gray-600 dark:text-gray-400">Enterprise Asset Lifecycle Management</p>
        </div>
        {children}
      </div>
    </div>
  );
}