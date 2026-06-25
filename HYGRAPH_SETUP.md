# Hygraph Startpage Setup Guide

This is a modern services showcase startpage powered by **Hygraph CMS** and built with **Next.js 16**, featuring search, filtering, and responsive design.

## 🚀 Getting Started

### 1. Set Up Your Hygraph Project

1. Go to [Hygraph.com](https://hygraph.com) and create a new project
2. In your project, create a **Product** content model with these fields:
   - `name` (Text, required)
   - `description` (Rich Text or Long Text)
   - `shortDescription` (Text, optional)
   - `url` (URL, optional)
   - `icon` (Text, optional - store emoji or icon character)
   - `image` (Asset, optional)
   - `category` (Reference to Category model, optional)
   - `copyrights` (Reference to Copyright model, multiple, optional)

3. Create a **Category** content model with:
   - `name` (Text, required)
   - `slug` (Slug, optional)

4. Create a **Copyright** content model with:
   - `name` (Text, required)
   - `slug` (Slug, optional)

### 2. Configure the API

1. In your Hygraph project, go to **API Access** → **Endpoints**
2. You'll see your **Content API** endpoint - copy this URL

### 3. Configure the Startpage

1. Set the following variables in `.env.local`
```env
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/...
```
2. Restart the app after updating `.env.local`
3. The app will load Hygraph data from the environment configuration

## 📊 GraphQL Queries

The app uses these queries to fetch data:

### GET_SERVICES
Fetches all services with categories and tags

### GET_CATEGORIES
Fetches all available categories

### SEARCH_SERVICES
Searches services by name

## ✨ Features

- ✅ **Real-time Configuration**: Set your API endpoint without code changes
- ✅ **Search**: Full-text search across service names and descriptions
- ✅ **Category Filtering**: Filter services by category
- ✅ **Tag Display**: Show service tags with counts
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Error Handling**: Clear error messages and retry options
- ✅ **Fast Loading**: GraphQL queries with efficient caching

## 🔧 Development

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables (Optional)

You can optionally set environment variables for default configuration:

```env
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/...
```

If these are set, the app will automatically load them as defaults.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Main page with state management
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── search-filter.tsx     # Search and category filter
│   ├── service-card.tsx      # Individual service card
│   └── service-grid.tsx      # Grid layout for services
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── graphql-queries.ts    # GraphQL query definitions
│   └── hygraph-client.ts     # GraphQL client setup
└── HYGRAPH_SETUP.md          # This file
```

## 🎨 Customization

### Styling
- The app uses **Tailwind CSS** with shadcn/ui components
- Modify `app/globals.css` to change colors and typography
- Edit `tailwind.config.ts` to customize the theme

### GraphQL Queries
- Modify queries in `lib/graphql-queries.ts` to fetch additional fields
- Update the `Service` interface in `lib/types.ts` to match your schema

### Appearance
- Edit the header text in `app/page.tsx` (lines 82-85)
- Customize the grid layout in `components/service-grid.tsx` (line 25)
- Adjust card styling in `components/service-card.tsx`

## 🐛 Troubleshooting

### "Invalid endpoint" error
- Double-check your Hygraph API endpoint URL
- Ensure the endpoint is publicly accessible

### Services not loading
- Check browser console (F12) for detailed error messages
- Verify your Hygraph schema matches the expected fields
- Ensure your content is published in Hygraph

### Search not working
- Check that services have the `name` field populated
- Verify the GraphQL query syntax in `lib/graphql-queries.ts`

## 📚 Resources

- [Hygraph Documentation](https://hygraph.com/docs)
- [GraphQL.org](https://graphql.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

This project is open source and available for personal and commercial use.
