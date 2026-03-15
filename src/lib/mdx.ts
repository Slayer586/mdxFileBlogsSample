import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the root folder where all MDX files are stored
const root = process.cwd();
const blogsDirectory = path.join(root, 'content/blogs');

export type BlogMetadata = {
  title: string;
  date: string;
  description: string;
  author: string;
  slug: string;
  coverImage?: string;
  category?: string;
};

export type BlogFile = {
  metadata: BlogMetadata;
  content: string;
};

// Gets all MDX files inside the 'content/blogs' directory
export function getBlogs(): BlogMetadata[] {
  // Read all files from the directory
  const files = fs.existsSync(blogsDirectory) ? fs.readdirSync(blogsDirectory) : [];

  const blogs = files
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Read file content
      const filePath = path.join(blogsDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse gray-matter metadata
      const { data } = matter(fileContent);

      return {
        ...(data as Omit<BlogMetadata, 'slug'>),
        slug: fileName.replace('.mdx', ''), // Create slug by removing .mdx
      };
    })
    // Sort blogs by date descending
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return blogs;
}

// Get the actual content and metadata for a single blog by slug
export function getBlogBySlug(slug: string): BlogFile | null {
  const filePath = path.join(blogsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Parse out frontmatter data and body content
  const { data, content } = matter(fileContent);

  return {
    metadata: { ...data, slug } as BlogMetadata,
    content,
  };
}
