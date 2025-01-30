import { defineCollection, z } from "astro:content";

// Define the "services" collection
const servicesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pageTitle: z.string(),
    slug: z.string(),
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
    about: z.string().optional(),
    articleLink: z.string().optional(),
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

// Export all collections
export const collections = {
  services: servicesCollection,
  testimonials: testimonialsCollection,
  team: teamCollection,
  projects: projectsCollection,
};
