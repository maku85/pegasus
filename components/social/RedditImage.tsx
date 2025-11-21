'use client';

import { useState } from 'react';

interface RedditImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function RedditImage({ src, alt, className }: RedditImageProps) {
    const [error, setError] = useState(false);

    if (error) return null;

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}
