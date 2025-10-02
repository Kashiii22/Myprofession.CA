// lib/sanity.js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'flw07sff', // your project ID
  dataset: 'production',  // your dataset
  useCdn: true,           // `false` if you want fresh data
  apiVersion: '2025-09-30' // today's date or latest
})

const builder = imageUrlBuilder(sanityClient);

// Helper function to generate image URLs
export function urlFor(source) {
  return builder.image(source);
}