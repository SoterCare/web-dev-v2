import { GraphQLClient, gql } from 'graphql-request';

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT || '';

if (!HYGRAPH_ENDPOINT) {
  console.warn('HYGRAPH_ENDPOINT is not defined in environment variables');
}

export const hygraph = new GraphQLClient(HYGRAPH_ENDPOINT);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  coverImage: {
    url: string;
  };
  content: {
    html: string;
    text?: string;
    raw?: any;
  };
  author?: {
    name: string;
    picture?: {
      url: string;
    };
  };
}

const PostFragment = gql`
  fragment PostFragment on Post {
    id
    title
    slug
    publishedAt
    excerpt
    coverImage {
      url
    }
    author {
      name
      picture {
        url
      }
    }
  }
`;

const MOCK_POSTS: BlogPost[] = [
  {
    id: 'mock-1',
    title: 'The Future of Elderly Care: AI and IoT',
    slug: 'future-of-elderly-care',
    publishedAt: new Date().toISOString(),
    excerpt: 'How artificial intelligence and internet of things are revolutionizing how we care for our seniors.',
    coverImage: {
      url: '/assets/blog/blog1.png',
    },
    content: {
      html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
      text: 'Lorem ipsum dolor sit amet...',
    },
    author: {
      name: 'Dr. Sarah Smith',
      picture: {
        url: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    }
  },
  {
    id: 'mock-2',
    title: 'Understanding Fall Detection Technology',
    slug: 'understanding-fall-detection',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    excerpt: 'A deep dive into the algorithms and sensors that make modern fall detection possible and reliable.',
    coverImage: {
      url: '/assets/blog/blog2.png',
    },
    content: {
      html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
      text: 'Lorem ipsum...',
    },
    author: {
      name: 'James Wilson',
    }
  },
  {
    id: 'mock-3',
    title: '5 Tips for Preventing Falls at Home',
    slug: '5-tips-preventing-falls',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    excerpt: 'Simple but effective changes you can make to your living environment to significantly reduce the risk of falls.',
    coverImage: {
      url: '/assets/blog/blog3.png',
    },
    content: {
      html: '<p>Detailed content about preventing falls...</p>',
      text: 'Detailed content...',
    },
    author: {
      name: 'SoterCare Team'
    }
  }
];

export const getRecentPosts = async (first: number = 3): Promise<BlogPost[]> => {
  if (!HYGRAPH_ENDPOINT) {
    console.warn('Using MOCK data for recent posts');
    return MOCK_POSTS.slice(0, first);
  }
  const query = gql`
    ${PostFragment}
    query GetRecentPosts($first: Int!) {
      posts(orderBy: publishedAt_DESC, first: $first) {
        ...PostFragment
      }
    }
  `;

  try {
    const data: { posts: BlogPost[] } = await hygraph.request(query, { first });
    if (!data.posts || data.posts.length === 0) {
      console.warn('No posts found in Hygraph, using MOCK data for recent posts');
      return MOCK_POSTS.slice(0, first);
    }
    return data.posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return MOCK_POSTS.slice(0, first); // Fallback to mock on error too
  }
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
  if (!HYGRAPH_ENDPOINT) {
    console.warn('Using MOCK data for all posts');
    return MOCK_POSTS;
  }
  const query = gql`
    ${PostFragment}
    query GetAllPosts {
      posts(orderBy: publishedAt_DESC) {
        ...PostFragment
      }
    }
  `;

  try {
    const data: { posts: BlogPost[] } = await hygraph.request(query);
    return data.posts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return MOCK_POSTS; // Fallback to mock
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  if (!HYGRAPH_ENDPOINT) {
    console.warn('Using MOCK data for post by slug');
    return MOCK_POSTS.find(p => p.slug === slug) || MOCK_POSTS[0];
  }
  const query = gql`
    ${PostFragment}
    query GetPostBySlug($slug: String!) {
      post(where: { slug: $slug }) {
        ...PostFragment
        content {
          html
          text
          raw
        }
      }
    }
  `;

  try {
    const data: { post: BlogPost | null } = await hygraph.request(query, { slug });
    return data.post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return MOCK_POSTS.find(p => p.slug === slug) || MOCK_POSTS[0];
  }
};
