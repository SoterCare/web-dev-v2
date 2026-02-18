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
      html: `
        <p>The aging population is growing at an unprecedented rate, presenting both challenges and opportunities for the healthcare sector. In this landscape, Artificial Intelligence (AI) and the Internet of Things (IoT) are emerging as powerful tools to enhance the quality of life for seniors and provide peace of mind for their families.</p>
        
        <h2>The Role of AI in Senior Care</h2>
        <p>AI-driven systems can analyze vast amounts of data to predict potential health issues before they become critical. For instance, machine learning algorithms can monitor daily activity patterns and alert caregivers to significant deviations that might indicate a fall, illness, or cognitive decline. This proactive approach shifts the model from reactive treatment to preventive care.</p>
        
        <h2>IoT: Connecting the Care Ecosystem</h2>
        <p>IoT devices, such as smart sensors, wearable monitors, and automated home systems, create a connected ecosystem that supports independent living. Smart homes can automatically adjust lighting, temperature, and even secure doors, ensuring a safe environment for seniors. Wearables track vital signs like heart rate and blood pressure, transmitting real-time data to healthcare providers.</p>
        
        <h2>Benefits of Technology Integration</h2>
        <ul>
          <li><strong>Enhanced Safety:</strong> Automated fall detection and emergency response systems significantly reduce response times in case of accidents.</li>
          <li><strong>Remote Monitoring:</strong> Families can stay connected and informed about their loved ones' well-being from anywhere in the world.</li>
          <li><strong>Personalized Care:</strong> AI can tailor care plans based on individual health data and preferences, ensuring more effective interventions.</li>
          <li><strong>Cost Efficiency:</strong> Preventive care can reduce hospital readmissions and the need for constant in-person supervision.</li>
        </ul>
        
        <p>At SoterCare, we are committed to leveraging these cutting-edge technologies to build a safer, more connected future for elderly care. By integrating AI and IoT, we empower seniors to live with dignity and independence while ensuring they receive the support they need.</p>
      `,
      text: 'The aging population is growing at an unprecedented rate...',
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
      html: `
        <p>Falls are a leading cause of injury among seniors, making effective fall detection technology a critical component of modern elderly care. But how does this technology actually work? Let's explore the science behind the sensors.</p>
        
        <h2>Accelerometers and Gyroscopes</h2>
        <p>Most fall detection devices rely on a combination of accelerometers and gyroscopes. An accelerometer measures changes in velocity, while a gyroscope measures orientation and rotation. By analyzing data from these sensors, algorithms can distinguish between normal activities like sitting down and sudden, high-impact events like a fall.</p>
        
        <h2>The Algorithm's Role</h2>
        <p>Hardware is only half the equation. Sophisticated algorithms process the raw sensor data to filter out false alarms. For example, the system needs to know the difference between dropping the device and a person actually falling. Advanced systems use machine learning to improve accuracy over time, learning from individual user patterns.</p>
        
        <h2>Why Reliability Matters</h2>
        <p>False positives can be annoying, but false negatives can be dangerous. A reliable fall detection system must balance sensitivity with specificity. Immediate notification to caregivers or emergency services can make the difference between a quick recovery and long-term complications.</p>
        
        <p>Modern solutions are moving beyond simple wearables to include radar-based room sensors and vision-based AI, offering non-intrusive ways to keep seniors safe without requiring them to wear a device 24/7.</p>
      `,
      text: 'Falls are a leading cause of injury among seniors...',
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
      html: `
        <p>Prevention is always better than cure. While technology provides a safety net, making your home environment safer is the first line of defense against falls. Here are five practical tips to fall-proof your home.</p>
        
        <h3>1. Remove Tripping Hazards</h3>
        <p>Clear walkways of clutter, loose rugs, and electrical cords. Secure carpets to the floor or use non-slip backing.</p>
        
        <h3>2. Improve Lighting</h3>
        <p>Ensure all rooms, hallways, and staircases are well-lit. Install night lights in the bedroom and bathroom to guide the way at night.</p>
        
        <h3>3. Install Grab Bars</h3>
        <p>Place grab bars in the bathroom near the toilet and in the shower. These provide crucial support where slips are most common.</p>
        
        <h3>4. Wear Proper Footwear</h3>
        <p>Avoid walking in socks or loose slippers. Wear non-slip, sturdy shoes inside the house to improve stability.</p>
        
        <h3>5. Keep Essentials Accessible</h3>
        <p>Store frequently used items in easy-to-reach cabinets to avoid the need for step stools or reaching overhead.</p>
        
        <p>By implementing these simple changes, you can drastically reduce the risk of falls and create a safer, more comfortable living space.</p>
      `,
      text: 'Prevention is always better than cure...',
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
