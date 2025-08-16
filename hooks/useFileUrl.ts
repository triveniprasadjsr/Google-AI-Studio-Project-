import { useState, useEffect } from 'react';
import { getFile } from '../services/db';

export const useFileUrl = (key: string | null | undefined): string | null => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!key) {
            setUrl(null);
            return;
        }

        let isMounted = true;
        let objectUrl: string | null = null;

        const fetchUrl = async () => {
            try {
                const fileBlob = await getFile(key);
                if (isMounted && fileBlob) {
                    objectUrl = URL.createObjectURL(fileBlob);
                    setUrl(objectUrl);
                } else if (isMounted) {
                    setUrl(null);
                }
            } catch (error) {
                console.error(`Failed to fetch file with key ${key}`, error);
                if (isMounted) {
                    setUrl(null);
                }
            }
        };

        fetchUrl();

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [key]);

    return url;
};