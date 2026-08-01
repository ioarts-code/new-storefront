# Environment Setup Guide

This guide explains how to set up your `.env.local` file locally for development in systems like VSCode on a PC, including configuration for Hygraph CMS and Stripe payment processing.

## 🚀 Getting Started

### 1. Create the .env.local File

1. Open your project root directory in VSCode (or your preferred code editor)
2. In the root folder (same level as `package.json`), create a new file named `.env.local`
3. This file will store all your local environment variables

**Note:** The `.env.local` file is automatically listed in `.gitignore` and will NOT be committed to Git, keeping your secrets safe.

## 📝 Environment Variables Configuration

### 2. Set Up Hygraph Configuration

If you're using Hygraph CMS for content management, add the following to your `.env.local`:

```env
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/YOUR_PROJECT_ID/master
HYGRAPH_AUTH_TOKEN=YOUR_HYGRAPH_AUTH_TOKEN
```

**How to get these values:**

1. Go to [Hygraph.com](https://hygraph.com) and log in to your project
2. Navigate to **Settings** → **API Access** → **Endpoints**
3. Copy your **Content API** endpoint (this is your `NEXT_PUBLIC_HYGRAPH_ENDPOINT`)
4. Go to **Settings** → **API Access** → **Permanent Auth Tokens**
5. Create a new token or copy an existing one (this is your `HYGRAPH_AUTH_TOKEN`)

For detailed Hygraph setup instructions, see [HYGRAPH_SETUP.md](./HYGRAPH_SETUP.md)

### 3. Set Up Stripe Configuration

To enable payment processing with Stripe, add the following to your `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

**How to get these values:**

1. Go to [Stripe.com](https://stripe.com) and log in to your dashboard
2. Click on **Developers** in the left sidebar
3. Select **API Keys** from the submenu
4. You'll see two keys:
   - **Publishable Key** (starts with `pk_`) - This is your `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** (starts with `sk_`) - This is your `STRIPE_SECRET_KEY`
5. Copy both keys and paste them into your `.env.local` file

**Important:** 
- The `NEXT_PUBLIC_` prefix means this variable is exposed to the browser - use the **Publishable Key** here
- The `STRIPE_SECRET_KEY` is only used server-side and should NEVER be exposed to the browser
- Always use **Test Keys** during development (they'll have `_test_` in them)
- Switch to **Live Keys** only when deploying to production

## 📋 Complete .env.local Example

Here's a complete example of what your `.env.local` file should look like:

```env
# Hygraph CMS
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://api-eu-central-1.hygraph.com/content/abc123def456/master
HYGRAPH_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijklmnop
STRIPE_SECRET_KEY=sk_test_abcdefghijklmnopqrstuvwxyz1234567890
```

## 🔄 Using .env.local in Development

### In VSCode or Your Code Editor

1. After creating/updating `.env.local`, you may need to restart your development server:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart it
   pnpm dev
   ```

2. The application will automatically load variables from `.env.local` when running locally

3. You can verify variables are loaded by checking:
   - Browser console for `NEXT_PUBLIC_` variables (they're available in the browser)
   - Server logs for all variables (they're available in the server)

### Accessing Variables in Your Code

**In Client Components:**
```tsx
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

**In Server Components or API Routes:**
```tsx
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const hygraphEndpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
```

## 🛡️ Security Best Practices

1. **Never commit .env.local** - It's in `.gitignore` for a reason
2. **Never share your Secret Keys** - They give full access to your Stripe and Hygraph accounts
3. **Use Test Keys first** - Always test with test/development keys before going live
4. **Rotate keys regularly** - If you suspect a key has been exposed, regenerate it immediately
5. **Use different keys per environment** - Keep development, staging, and production keys separate

## ✅ Verification Checklist

After setting up your `.env.local`, verify everything works:

- [ ] `.env.local` file exists in the project root
- [ ] All required variables are populated with actual values
- [ ] Development server restarts after creating/updating `.env.local`
- [ ] No errors appear in the browser console related to environment variables
- [ ] Hygraph content loads successfully (if using CMS)
- [ ] Stripe checkout can be initiated (if using payments)

## 🐛 Troubleshooting

### Variables not loading
- Check that `.env.local` is in the project root (same level as `package.json`)
- Restart the development server after creating/updating `.env.local`
- Verify variable names match exactly (they're case-sensitive)

### "Stripe is not defined" error
- Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Check that the value starts with `pk_test_` or `pk_live_`
- Restart the development server

### Hygraph content not loading
- Verify `NEXT_PUBLIC_HYGRAPH_ENDPOINT` URL is correct
- Check that `HYGRAPH_AUTH_TOKEN` is valid and not expired
- Ensure your content is published in Hygraph (not just drafted)

### "Variable is undefined" in code
- Double-check the variable name is spelled correctly
- Remember `NEXT_PUBLIC_` variables are only available in the browser
- Server-side only variables won't be accessible in client components

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Hygraph Documentation](https://hygraph.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js .env.local Guide](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables)

## 📄 Related Documentation

- [HYGRAPH_SETUP.md](./HYGRAPH_SETUP.md) - Detailed Hygraph configuration
- [README.md](./README.md) - Project overview
