// lib/sanity.js
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'flw07sff', // your project ID
  dataset: 'production',  // your dataset
  useCdn: true,           // `false` if you want fresh data
  apiVersion: '2025-09-30' // today's date or latest
})
