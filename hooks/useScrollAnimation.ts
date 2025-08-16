import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        const elements = Array.from(document.querySelectorAll('.animate-on-scroll'));
        elements.forEach((el) => observerRef.current?.observe(el));

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);
};