# Hygraph Startpage - Setup Checklist

Use this checklist to ensure everything is properly configured.

---

## Phase 1: Hygraph Project Setup

- [ ] Created a new Hygraph project at hygraph.com
- [ ] Created **Service** model with required fields:
  - [ ] `name` (Text, required)
  - [ ] `description` (Rich Text or Text)
  - [ ] `shortDescription` (Text, optional)
  - [ ] `category` (Reference to Category model)
  - [ ] `tags` (Multiple References to Tag model)
  - [ ] `url` (URL, optional)
  - [ ] `icon` (Text for emoji, optional)
  - [ ] `image` (Asset, optional)
- [ ] Created **Category** model with:
  - [ ] `name` (Text, required)
  - [ ] `slug` (Slug, optional)
- [ ] Created **Tag** model with:
  - [ ] `name` (Text, required)
  - [ ] `slug` (Slug, optional)
- [ ] Created at least 3-5 test services
- [ ] Ensured all services are **Published** (not Draft)
- [ ] Assigned categories and tags to services

---

## Phase 2: Hygraph API Configuration

- [ ] Navigated to **API Access** in Hygraph
- [ ] Found and copied the **Content API endpoint** (under Endpoints)
  - [ ] Endpoint URL saved (looks like: `https://api-eu-central-1.hygraph.com/content/...`)
- [ ] (Optional) Created an **Auth Token** for private content
  - [ ] Token created and copied (if using private schema)
- [ ] (Optional) Tested API endpoint in GraphQL Playground
  - [ ] Ran the sample query to verify connectivity

---

## Phase 3: Local Setup

- [ ] Cloned or downloaded the project
- [ ] Opened project directory in terminal
- [ ] Installed dependencies:
  ```bash
  pnpm install
  ```
- [ ] Verified `graphql-request` and `graphql` are installed:
  ```bash
  pnpm list | grep graphql
  ```

---

## Phase 4: App Configuration

- [ ] Started the development server:
  ```bash
  pnpm dev
  ```
- [ ] Opened app in browser (http://localhost:3000)
- [ ] Clicked the **Settings** icon (⚙️) in top-right
- [ ] Entered Hygraph **API Endpoint** in the configuration modal
- [ ] (Optional) Entered **Auth Token** if using private content
- [ ] Clicked **Save Config**
- [ ] Saw **"Configuration saved!"** success message
- [ ] Waited for services to load (should see loading spinner)
- [ ] Verified services are displayed on the page

---

## Phase 5: Testing Features

### Search
- [ ] Typed a service name in the search box
- [ ] Results filtered in real-time
- [ ] Cleared search and saw all services again

### Category Filter
- [ ] Clicked a category button
- [ ] Services filtered to that category only
- [ ] Clicked "All" to reset filter
- [ ] Multiple filters work together

### Service Cards
- [ ] Service cards display correctly
- [ ] Images load (if provided)
- [ ] Service names are visible
- [ ] Descriptions are displayed
- [ ] Tags show with counts
- [ ] "Visit" button links work (if URLs provided)
- [ ] Cards are responsive on mobile/tablet/desktop

### Responsive Design
- [ ] Desktop (1024px+): 3-column grid
- [ ] Tablet (768-1023px): 2-column grid
- [ ] Mobile (<768px): 1-column grid

---

## Phase 6: Customization (Optional)

- [ ] Modified header text in `app/page.tsx` (lines 82-85)
- [ ] Changed colors in `tailwind.config.ts` or `app/globals.css`
- [ ] Adjusted card styling in `components/service-card.tsx`
- [ ] Updated GraphQL queries in `lib/graphql-queries.ts` (if needed)
- [ ] Changes reflected in browser (hot reload)

---

## Phase 7: Environment Variables (Optional)

If you want to use environment variables instead of UI configuration:

- [ ] Created `.env.local` file in project root
- [ ] Added to `.env.local`:
  ```
  NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/...
  ```
- [ ] Restarted dev server (`pnpm dev`)
- [ ] Verified config is auto-loaded on page load

---

## Phase 8: Build & Deploy (When Ready)

- [ ] Built the project:
  ```bash
  pnpm build
  ```
- [ ] Build completed without errors
- [ ] Tested production build locally:
  ```bash
  pnpm start
  ```
- [ ] (Optional) Deployed to Vercel:
  - [ ] Pushed code to GitHub
  - [ ] Imported repo in Vercel dashboard
  - [ ] Added environment variables in Vercel project settings (if using them)
  - [ ] Deployment successful
  - [ ] Live site works with real Hygraph data

---

## Phase 9: Verification Queries

Test your GraphQL connection by running these queries:

### In the App
- [ ] Services load on first visit (no manual refresh needed)
- [ ] Search works instantly (debounced)
- [ ] Categories filter correctly
- [ ] Error messages are helpful if endpoint is wrong

### In Hygraph GraphQL Playground (Optional)
- [ ] Run this query to verify your endpoint works:
  ```graphql
  {
    services(first: 10) {
      id
      name
      description
    }
  }
  ```
- [ ] Query returns services with correct data

---

## Troubleshooting Checklist

If something isn't working, check:

### App Won't Start
- [ ] Node.js version is 18+ (`node --version`)
- [ ] All dependencies installed (`pnpm install`)
- [ ] No syntax errors in TypeScript files
- [ ] Port 3000 is available

### Configuration Won't Save
- [ ] Endpoint URL is complete (starts with https://)
- [ ] No trailing slashes in endpoint
- [ ] Environment variables are set in `.env.local`
- [ ] Auth token is valid (if provided)

### Services Won't Load
- [ ] Environment variables are configured correctly
- [ ] Hygraph API endpoint is correct
- [ ] Services exist in Hygraph (check dashboard)
- [ ] Services are **Published** (not Draft)
- [ ] Check browser console (F12) for GraphQL errors

### Search/Filter Not Working
- [ ] Services have `name` field populated
- [ ] Categories are assigned to services
- [ ] Tags are assigned to services
- [ ] Service data was published after model creation

### Styling Issues
- [ ] Tailwind CSS is processing (check browser DevTools → Sources)
- [ ] No conflicting CSS (check global styles)
- [ ] Components have proper className props
- [ ] Dark mode preferences (if implemented)

---

## Success Checklist

You're done when:

- ✅ App loads without errors
- ✅ Configuration modal opens and saves
- ✅ Services display from Hygraph
- ✅ Search works
- ✅ Filtering works
- ✅ Cards are responsive
- ✅ Images load (if provided)
- ✅ Links work
- ✅ Ready to customize or deploy

---

## Next Steps

1. **Customize the design** - Update colors, fonts, layout
2. **Add more content** - Create more services in Hygraph
3. **Extend functionality** - Add ratings, reviews, comments
4. **Deploy** - Push to Vercel or your hosting platform
5. **Monitor** - Set up analytics and error tracking

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Start dev server | `pnpm dev` |
| Build for production | `pnpm build` |
| Start production server | `pnpm start` |
| Open in browser | `http://localhost:3000` |
| Browser DevTools | Press `F12` |
| Update `.env.local` | Edit `.env.local` and restart the app |

---

## Resources

- 📖 **HYGRAPH_SETUP.md** - Complete setup and customization guide
- 🔧 **API_CONFIGURATION.md** - Finding your API endpoint
- 📚 **GRAPHQL_EXAMPLES.md** - GraphQL query reference
- 📋 **BUILD_SUMMARY.md** - Architecture and features overview
- ⚡ **QUICK_START.txt** - Quick reference card

---

**Last Updated**: April 2026  
**Framework**: Next.js 16  
**CMS**: Hygraph
