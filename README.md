# klr.dev

My personal website, built with [Astro](https://astro.build/).

## Goals

The main goal with my personal site build this time around was simplicity and performance. I didn't want to maintain a complex JavaScript app or convoluted build process, but I still wanted modern tooling and excellent performance.

I already keep my resume in [another GitHub repo](https://github.com/kylegrantlucas/resume) so I thought it would be fun to have my personal website generate off of that file, keeping my resume and website in sync at all times.

I chose Astro because it delivers:
- **Zero JavaScript by default** - Ships only the HTML and CSS needed
- **Island architecture** - Add interactivity only where needed
- **Modern developer experience** - Great tooling with minimal configuration
- **Excellent performance** - Static generation with optional server-side rendering

## Deployment

The site is deployed using GitHub Pages with Fastly as a CDN for improved global performance:

1. **GitHub Pages** handles the static site hosting with automatic deployments from the repository
2. **Fastly CDN** provides edge caching and faster content delivery worldwide
3. This setup gives me the simplicity of GitHub's native hosting with the performance benefits of a modern CDN

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: CSS with modern features
- **Deployment**: [GitHub Pages](https://pages.github.com/) + [Fastly CDN](https://fastly.com/)
- **Content**: Dynamically generated from my resume repository
