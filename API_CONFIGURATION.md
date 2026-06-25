# API Configuration Guide

## Finding Your Hygraph API Endpoint

### Step 1: Access Your Hygraph Project
1. Go to [hygraph.com](https://hygraph.com) and sign in
2. Select your project from the dashboard

### Step 2: Get Your API Endpoint
1. In the left sidebar, click **API Access**
2. Under **Endpoints**, you'll see your **Content API** endpoint
3. It will look something like:
   ```
   https://api-eu-central-1.hygraph.com/content/[project-id]/[api-stage]
   ```

### Step 3: Configure in the App
1. Create a `.env.local` file in the project root
2. Add your Hygraph endpoint:
```bash
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/...
```
3. Restart the app after saving `.env.local`

The app will load your services automatically from these variables.

---

## Environment Variables (Required)

If you prefer to avoid entering credentials in the UI, you can set environment variables:

### 1. Create `.env.local` in your project root:
```bash
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/...
```

### 2. The app will automatically use these values

**Note:** Only add `NEXT_PUBLIC_` prefixed variables if you want them visible in the browser.

---

## Hygraph Schema Requirements

For the app to work correctly, ensure your Hygraph models have these fields:

### Service Model
```graphql
type Service {
  id: ID!
  name: String!
  description: String!
  shortDescription: String
  url: String
  icon: String          # Optional emoji or icon character
  image: Asset
  category: Category
  tags: [Tag]
  createdAt: DateTime!
}
```

### Category Model
```graphql
type Category {
  id: ID!
  name: String!
  slug: String
}
```

### Tag Model
```graphql
type Tag {
  id: ID!
  name: String!
  slug: String
}
```

---

## Verifying Your Connection

After entering your credentials:

1. The app will send a test query to your endpoint
2. You'll see a **"Configuration saved!"** message if successful
3. Services will automatically load and display
4. If there's an error, check:
   - The endpoint URL is correct
   - Your Hygraph project is accessible
   - Your services have the required fields

---

## Testing GraphQL Queries

To test your GraphQL API directly:

1. Go to **API Access** → **GraphQL Playground** in Hygraph
2. Paste this query to test:

```graphql
{
  services(first: 10) {
    id
    name
    description
    shortDescription
    url
    icon
    category {
      id
      name
    }
    tags(first: 5) {
      id
      name
    }
    image {
      url
      caption
    }
    createdAt
  }
}
```

If this works, your endpoint is correctly configured!

---

## Troubleshooting

### Error: "Invalid endpoint"
- Check the URL format is complete: `https://api-...hygraph.com/content/...`
- Ensure there are no trailing slashes
- Try testing in the Hygraph GraphQL Playground first

### Error: "Unauthorized"
- Your auth token may be expired or invalid
- Try removing the token and using public API access instead
- Regenerate the token in Hygraph if needed

### Services not displaying
- Ensure services are **Published** in Hygraph (not in Draft)
- Check the schema fields match what the app expects
- Try the GraphQL Playground query above to verify data exists

### Search/Filtering not working
- Ensure `name` field has searchable content
- Verify categories and tags are properly linked to services
- Check that the GraphQL queries match your schema

---

## Security Notes

- The configuration is loaded from environment variables in production
- Never share your auth token publicly
- Use environment variables instead of UI configuration
- Consider using a read-only token with limited permissions
