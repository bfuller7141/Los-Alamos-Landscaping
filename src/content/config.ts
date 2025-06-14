import { defineCollection, z } from "astro:content";
import { optional } from "astro:schema";

// Define the "services" collection
const servicesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pageTitle: z.string(),
    slug: z.string().optional(),
    icon: z.string(),
    description: z.string(),
    btntxt: z.string(),
    about: z.string(),
    image: z.string(),
    alt: z.string(),
    imageTwo: z.string(),
    altTwo: z.string(),
    gallery: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
  }),
});

// Define the "testimonials" collection
const testimonialsCollection = defineCollection({
  schema: z.object({
    rating: z.number().min(1).max(5),
    name: z.string(),
    testimonial: z.string(),
  }),
});

// Define the "team" collection
const teamCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string(),
  }),
});

// Define the "projects" collection
const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    mainAlt: z.string(),
    imageTwo: z.string(),
    altTwo: z.string(),
    creditTwo: z.string().optional(),
    about: z.string().optional(),
    articleLink: z.string().optional(),
    gallery: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string(),
          credit: z.string().optional(),
        })
      )
      .optional(),
  }),
});

// Define the "blog" collection
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    titlePage: z.string(),
    date: z.date(), 
    thumbnail: z.string(),
    coverImage: z.string(),
    featured: z.boolean().default(false),
    slug: z.string().optional(),
    article: z.string(),
    excerpt: z.string(),
  }),
});

// Export all collections
export const collections = {
  services: servicesCollection,
  testimonials: testimonialsCollection,
  team: teamCollection,
  projects: projectsCollection,
  blog: blogCollection,
};