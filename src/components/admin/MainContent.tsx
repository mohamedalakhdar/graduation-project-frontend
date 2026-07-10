/**
 * Main Content Wrapper Component
 * Consistent content area with proper spacing
 */

interface MainContentProps {
    children: React.ReactNode;
    className?: string;
}

export function MainContent({ children, className = '' }: MainContentProps) {
    return (
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen ${className}`}>
            {children}
        </main>
    );
}
