import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'My Movies',
        short_name: 'My Movies',
        description: 'Your personal movie database',
        start_url: '/',
        display: 'standalone',
        background_color: '#141414',
        theme_color: '#141414',
        icons: [
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
