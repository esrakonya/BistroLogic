// Dosya Yolu: /src/app/admin/content/page.tsx
'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { CheckCircleIcon, XCircleIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

interface SiteContent {
  id: number;
  key: string;
  value: string;
  description: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content', { 
        cache: 'no-store',
        credentials: 'include' 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to load content data.');
      }
      const data = await res.json();
      setContents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleInputChange = (key: string, value: string) => {
    setContents(currentContents =>
      currentContents.map(c => (c.key === key ? { ...c, value } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contents),
    });

    setIsSubmitting(false);

    if (res.ok) {
      setSuccess('All changes saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'An error occurred while saving.');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 uppercase tracking-tight">Content Management</h1>
          <div className="h-1 w-20 bg-neutral-200"></div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1000px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- NOTIFICATIONS --- */}
      <div className="fixed top-10 right-10 z-50 w-full max-w-sm px-4">
        <Transition show={!!success} as={Fragment} enter="transform ease-out duration-300 transition" enterFrom="translate-y-2 opacity-0 sm:translate-x-4" enterTo="translate-y-0 opacity-100 sm:translate-x-0" leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="p-4 bg-neutral-900 text-white rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
            <CheckCircleIcon className="h-6 w-6 text-green-400"/>
            <p className="text-sm font-medium">{success}</p>
          </div>
        </Transition>
        
        <Transition show={!!error} as={Fragment} enter="transform ease-out duration-300 transition" enterFrom="translate-y-2 opacity-0 sm:translate-x-4" enterTo="translate-y-0 opacity-100 sm:translate-x-0" leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="p-4 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center gap-4">
            <XCircleIcon className="h-6 w-6"/>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </Transition>
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-400 uppercase tracking-widest text-xs font-bold">
            <DocumentTextIcon className="h-4 w-4" />
            System Configuration
          </div>
          <h1 className="text-4xl font-serif font-bold text-neutral-900">Site Content</h1>
          <p className="text-neutral-500 font-light">Update your restaurant information, slogans, and public content.</p>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 bg-white p-8 md:p-12 rounded-3xl border border-neutral-100 shadow-sm">
          {contents.map(content => (
            <div key={content.key} className="group space-y-2">
              <label htmlFor={content.key} className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">
                {content.description || content.key.replace(/_/g, ' ')}
              </label>
              
              {content.value.length > 60 || content.key.includes('text') || content.key.includes('address') ? (
                <textarea
                  id={content.key}
                  value={content.value}
                  onChange={e => handleInputChange(content.key, e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800 leading-relaxed"
                />
              ) : (
                <input
                  type="text"
                  id={content.key}
                  value={content.value}
                  onChange={e => handleInputChange(content.key, e.target.value)}
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800"
                />
              )}
            </div>
          ))}
        </div>
        
        {/* --- ACTION BUTTON --- */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold py-4 px-12 rounded-full transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-neutral-200"
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </form>
    </main>
  );
}