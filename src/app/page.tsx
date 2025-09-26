"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LanguageRedirect: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const userLang = navigator.language;
        const lang = userLang.split('-')[0]; // Get the language code (e.g., 'en' from 'en-US')

        switch (lang) {
            case 'en':
                router.push('/en');
                break;
            case 'ar':
                router.push('/ar');
                break;
            default:
                router.push('/en'); // Default to English if language is not supported
        }
    }, [router]);

    return null;
};

export default LanguageRedirect;