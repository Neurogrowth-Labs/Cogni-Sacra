
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = (text: string) => {
    const { language, translate } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);

    useEffect(() => {
        if (language === 'en') {
            setTranslatedText(text);
            return;
        }

        let isMounted = true;
        setTranslatedText('...'); // Loading state
        
        translate(text)
            .then(result => {
                if (isMounted) {
                    setTranslatedText(result);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setTranslatedText(text); // Fallback on error
                }
            });

        return () => {
            isMounted = false;
        };
    }, [text, language, translate]);

    return translatedText;
};
