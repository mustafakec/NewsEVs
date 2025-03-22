// import { google } from 'googleapis';

// const WP_API_URL = 'https://elektrikliyiz.com/wp-json/wp/v2';

// export interface WordPressPost {
//   id: number;
//   title: {
//     rendered: string;
//   };
//   excerpt: {
//     rendered: string;
//   };
//   featured_media: number;
//   _embedded?: {
//     'wp:featuredmedia'?: Array<{
//       source_url: string;
//     }>;
//   };
//   date: string;
// }

// async function getTopPostsFromAnalytics() {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//       scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
//     });

//     const analyticsClient = google.analytics('v3');
//     const response = await analyticsClient.data.ga.get({
//       auth,
//       ids: `ga:${process.env.GA_VIEW_ID}`,
//       'start-date': '30daysAgo',
//       'end-date': 'today',
//       metrics: 'ga:pageviews',
//       dimensions: 'ga:pagePath',
//       sort: '-ga:pageviews',
//       'max-results': 50,
//       filters: 'ga:pagePath=~^/[0-9]{4}/', // Sadece haber URL'lerini filtrele
//     });

//     return response.data.rows?.map(row => {
//       const path = row[0];
//       const postId = path.split('/').filter(Boolean).pop();
//       return parseInt(postId);
//     }).filter(Boolean) || [];
//   } catch (error) {
//     console.error('Google Analytics verisi alınırken hata:', error);
//     return [];
//   }
// }

// export async function getMostViewedPosts(limit = 50) {
//   try {
//     const topPostIds = await getTopPostsFromAnalytics();
//     if (!topPostIds.length) {
//       return getLatestPosts(1, limit); // Fallback to latest posts
//     }

//     const posts = await Promise.all(
//       topPostIds.slice(0, limit).map(async (postId) => {
//         const response = await fetch(`${WP_API_URL}/posts/${postId}?_embed`);
//         return response.ok ? response.json() : null;
//       })
//     );

//     return posts.filter(Boolean) as WordPressPost[];
//   } catch (error) {
//     console.error('En çok görüntülenen postlar alınırken hata:', error);
//     return getLatestPosts(1, limit); // Fallback to latest posts
//   }
// }

// export async function getLatestPosts(page = 1, perPage = 50) {
//   try {
//     const response = await fetch(
//       `${WP_API_URL}/posts?_embed&page=${page}&per_page=${perPage}&orderby=comment_count&order=desc`,
//       {
//         next: { revalidate: 3600 }
//       }
//     );

//     if (!response.ok) {
//       throw new Error('WordPress API yanıt vermedi');
//     }

//     const posts = await response.json();
//     return posts as WordPressPost[];
//   } catch (error) {
//     console.error('WordPress postları alınırken hata:', error);
//     return [];
//   }
// }


// src/services/wordpress.ts

const WP_API_URL = 'https://elektrikliyiz.com/wp-json/wp/v2';

// export interface WordPressPost {
//   id: number;
//   title: {
//     rendered: string;
//   };
//   excerpt: {
//     rendered: string;
//   };
//   featured_media: number;
//   _embedded?: {
//     'wp:featuredmedia'?: Array<{
//       source_url: string;
//     }>;
//   };
//   date: string;
// }

// export async function getLatestPosts(page = 1, perPage = 50) {
//   try {
//     const response = await fetch(
//       `${WP_API_URL}/posts?_embed&page=${page}&per_page=${perPage}`,
//       {
//         next: { revalidate: 3600 } // Her saat önbelleği yenile
//       }
//     );

//     if (!response.ok) {
//       throw new Error('WordPress API yanıt vermedi');
//     }

//     const posts = await response.json();
//     return posts as WordPressPost[];
//   } catch (error) {
//     console.error('WordPress postları alınırken hata:', error);
//     return [];
//   }
// }


export async function getLatestPosts(page = 1, perPage = 10) {
    try {
      const response = await fetch(
        `${WP_API_URL}/posts?_embed&page=${page}&per_page=${perPage}`,
        {
          next: { revalidate: 3600 }
        }
      );
  
      if (!response.ok) {
        throw new Error('WordPress API yanıt vermedi');
      }
  
      const totalPosts = response.headers.get('X-WP-Total');
      const posts = await response.json();
      
      return {
        posts,
        total: parseInt(totalPosts || '0')
      };
    } catch (error) {
      console.error('WordPress postları alınırken hata:', error);
      return { posts: [], total: 0 };
    }
  }