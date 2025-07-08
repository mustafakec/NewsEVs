import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | NewsEVs',
  description: 'The latest news, user guides, and tips from the world of electric vehicles.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
} 