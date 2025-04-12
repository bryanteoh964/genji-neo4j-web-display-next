import React from 'react';
import Link from 'next/link';

const translators = [
  { name: 'Waley' },
  { name: 'Seidensticker' },
  { name: 'Tyler' },
  { name: 'Washburn' },
  { name: 'Cranston' }
];

export default function TranslatorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Translators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {translators.map((translator) => (
          <Link 
            key={translator.name}
            href={`/translators/${translator.name}`}
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{translator.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
} 