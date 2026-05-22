# Legal Deposit Data Management

This document explains how to transition the **Kenya National Library Service - 2026 Legal Deposit Showcase** from the initial mock preview data to the actual legal deposit entries.

## The `USE_MOCK_DATA` Flag

Currently, the application displays placeholder data for showcasing purposes. This behavior is controlled by a simple feature flag in `/src/data.ts`.

To switch to your actual legal deposit data:

1. Open `/src/data.ts`
2. Change exactly one line at the top of the file:
   ```typescript
   export const USE_MOCK_DATA = false;
   ```

## Adding Real Data

When `USE_MOCK_DATA` is `false`, the app reads from the `realBooks` array in `/src/data.ts`. You must populate this array with your legal deposits.

### JSON Template / Book Structure

Here is the exact structure your data objects must follow:

```typescript
{
  id: "isbn-978-9966-123-45",       // A unique identifier (ISBN or internal ID)
  title: "The Book Title",
  author: "Author Name",
  authorTagline: "Brief Author Intro",
  authorBio: "Full biography of the author...",
  authorAvatar: "from-blue-600 to-blue-900", // Tailwind gradient classes for avatar placeholder
  month: "AUGUST",                  // Display month text
  monthShort: "Aug",                // Short month text
  description: "A comprehensive description of the legal deposit...",
  genre: "Fiction",                 // Categorization for filters
  
  // Visual Configurations
  coverGradient: "from-gray-900 to-black", // Fallback Tailwind gradient
  coverImage: "https://your-cdn.com/images/isbn-978-9966-123-45.jpg", // Optional: URL to real cover image
  
  // Optional: Excerpt (each string is a "page" or "paragraph" in the reader)
  excerpt: [
    "This is the first paragraph or page of the excerpt.",
    "This is the second paragraph or page."
  ]
}
```

### Image Hosting

Do not commit large numbers of high-resolution images to this application's source code, as it will drastically inflate the build size and slow down browsing.

Instead:
1. Upload your book cover images to a secure public CDN, cloud storage bucket (like AWS S3 or GCP Cloud Storage), or the KNLS main website's `/wp-content/uploads/` directory.
2. In your data array, ensure the `coverImage` property contains the fully qualified `https://...` URL to the image.

## Editing the Hero and Featured Author

Both the main landing text (Hero) and the "Featured Author" spotlight are fully editable without touching the UI components. They are also controlled by the `USE_MOCK_DATA` flag in `/src/data.ts`.

### Hero Section (`heroContent`)
Locate `export const heroContent` at the bottom of `/src/data.ts`.
Replace the strings on the right side of the `:` when the mock flag is false (or update both).

```typescript
export const heroContent = {
  badge: USE_MOCK_DATA ? "National Reading Day 2026" : "Your Real Event Name",
  titleLine1: USE_MOCK_DATA ? "Our Stories, Our Future:" : "Your Real Main Headline:",
  titleLine2: USE_MOCK_DATA ? "Empowering Minds Through Reading" : "Your Real Subheadline",
  description: USE_MOCK_DATA 
    ? "..." 
    : "Your real descriptive text explaining the purpose of the showcase."
};
```

### Featured Author Spotlight (`featuredAuthor`)
Locate `export const featuredAuthor` at the bottom of `/src/data.ts`. 
Update the fields to reflect the actual featured author you wish to highlight. Ensure that the `bookIds` array references the `id` of a real book in your `realBooks` array so the app can link to it correctly.

```typescript
export const featuredAuthor = {
  name: USE_MOCK_DATA ? "Dr. Ken Korir" : "A Real Author's Name",
  bio: USE_MOCK_DATA ? "..." : "The full biography of the real author.",
  quote: USE_MOCK_DATA ? "..." : "A profound quote by the featured author.",
  bookIds: USE_MOCK_DATA ? ["b3"] : ["real-1"] // Point this to an existing ID in your realBooks array
};
```
