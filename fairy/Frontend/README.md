# TODO:

### HEADER:
- [x] ~~change header text colour when background becomes dark~~ gave 75% opacity bg instead
- [x] make background lighter when in dark mode

### STICKY-SECTION:
- [x] refactor it to use {...children}, make it easier to use
- [ ] get shadows working

### SCROLL:
- [ ] check out smooth scrolling and scroll snap to sections
- [ ] scroll to top button
- [ ] make scroll down indicator clickable
- [ ] change shake velocity to match scroll speed to top.

### MATTER-JS:
- [ ] change initialBodies (currently they just drop, could make them pour in from sides or something)
- [ ] vectorise hero text (svg static bodies in matter.js world)
- [ ] bullet time (slow mo) on shake
  - [matter-js demo](https://brm.io/matter-js/demo/#timescale)
- [ ] change initialBodiesCount based on width 
- [ ] why does simulation reinitialise when changing debug?

### OTHER:
- [x] make `animated-link-button` scroll on hover effect nicer (out bottom, and in from top)
- [ ] change shape colours and colourful-text colours to match (decide colour palette -> also change section colours)

### RANDOM IDEAS:
- [ ] drag shapes through different sections (colour mask between sections)
- [ ] make login/signup windows pop up/scroll within the matter-js canvas
- [ ] maybe still need a section navigation (i.e. about, mission, our team, contact, etc.)
  - [x] [awwwards side menu](https://www.youtube.com/watch?v=MsdR8iAscNs)
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
