/**
 * Framework packs for front-end frameworks, site builders / CMSs and front-end libraries.
 * Each pack teaches what a detected technology is, how the scan could tell, and what code built with it looks like.
 *
 * Note: code snippets pass through the builder's {{placeholder}} filler, so template syntax in snippets must never
 * use a bare placeholder key ({{ name }}, {{ domain }}, {{ brand }}, {{ accent }}, {{ tagline }}, {{ frontend }}, {{ hosting }}).
 */

import type { FrameworkPack } from './types';

export const FRONTEND_PACKS: FrameworkPack[] = [
  /* ------------------------------------------------------------------ */
  /* Front-end frameworks                                                */
  /* ------------------------------------------------------------------ */
  {
    detection: 'Next.js',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Next.js',
        role: 'React framework that handles pages, routing and rendering on the server',
        beginnerNote:
          'React gives you building blocks for a UI; Next.js is the full kit around them. It decides which page to show for each URL, can build the HTML on a server so pages appear fast, and bundles everything for the browser.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Next.js pages and React components (often written in TypeScript first)' },
    files: [
      { path: 'app/layout.tsx', note: 'Shared page shell (header, footer, <html> tag) wrapped around every page' },
      { path: 'app/page.tsx', note: 'The home page: the file’s location decides its URL (/)' },
      { path: 'app/blog/[slug]/page.tsx', note: 'A dynamic route: [slug] matches any value, like /blog/hello-world' },
      { path: 'app/api/subscribe/route.ts', note: 'A route handler: a small back-end endpoint living in the same project' },
      { path: 'next.config.js', note: 'Project settings such as image domains, redirects and build options' },
    ],
    code: [
      {
        id: 'fw-nextjs-server-page',
        title: 'A Next.js page that fetches data on the server',
        file: 'app/blog/page.tsx',
        language: 'TypeScript (React)',
        explanation:
          'In the Next.js App Router, components are Server Components by default: this function runs on the server, waits for the posts, and sends finished HTML to the browser. The revalidate option lets Next.js reuse the fetched data for 60 seconds instead of calling the API on every visit. The <Link> component makes moving between pages feel instant because Next.js fetches the next page in the background.',
        code: `// app/blog/page.tsx: the folder path makes this the /blog page
// This is a Server Component, so it runs on the server, not in the browser
import Link from 'next/link';

type Post = { id: number; slug: string; title: string; excerpt: string };

async function getPosts(): Promise<Post[]> {
  // Reuse the result for 60 seconds instead of calling the API on every visit
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>Latest posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={\`/blog/\${post.slug}\`}>{post.title}</Link>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      },
    ],
    concepts: [
      {
        term: 'Server-side rendering (SSR)',
        meaning:
          'The server builds a page’s HTML before sending it, so you see content right away instead of waiting for JavaScript to draw it. It is like a restaurant plating your meal in the kitchen rather than handing you the ingredients.',
      },
      {
        term: 'File-based routing',
        meaning:
          'Folder and file names become URLs. Creating app/about/page.tsx automatically gives you an /about page, with no separate list of routes to maintain.',
      },
    ],
    howWeKnow:
      'Its HTML loads JavaScript from /_next/static/, a folder that only Next.js creates when it builds a site. Some Next.js pages also embed a __NEXT_DATA__ script holding the page’s data, or send an x-powered-by: Next.js header.',
  },
  {
    detection: 'React',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'React',
        role: 'JavaScript library for building user interfaces out of components',
        beginnerNote:
          'React lets developers build a page from small, reusable pieces called components, like LEGO bricks. You describe what the screen should look like for the current data, and React updates just the parts that changed.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'React components and browser logic (often written in TypeScript first)' },
    files: [
      { path: 'src/main.jsx', note: 'Entry point: finds a <div id="root"> in the HTML and draws the app inside it' },
      { path: 'src/App.jsx', note: 'Top-level component that arranges the rest of the app' },
      { path: 'src/components/SearchList.jsx', note: 'A reusable component with its own state' },
      { path: 'package.json', note: 'Lists react, react-dom and the other packages the app depends on' },
    ],
    code: [
      {
        id: 'fw-react-component',
        title: 'A React component with state and data fetching',
        file: 'src/components/SearchList.jsx',
        language: 'JavaScript (React)',
        explanation:
          'A React component is a function that returns what the UI should look like. useState stores values the component remembers (what you typed and the results), and every time one changes React re-runs the function and updates the screen. useEffect fetches new results whenever the query changes, and cancels the old request if you keep typing.',
        code: `import { useEffect, useState } from 'react';

// A component is just a function that returns what should appear on screen
export default function SearchList({ placeholder }) {
  const [query, setQuery] = useState(''); // what the user typed
  const [items, setItems] = useState([]); // results from the server

  // Runs after the component appears, and again whenever query changes
  useEffect(() => {
    const controller = new AbortController();
    fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setItems(data.results))
      .catch((err) => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort(); // cancel the old request if the user keeps typing
  }, [query]);

  return (
    <div>
      <input value={query} placeholder={placeholder} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
      },
    ],
    concepts: [
      {
        term: 'Component',
        meaning:
          'A self-contained piece of UI, such as a button, a card or a whole page, written as a function you can reuse. Big apps are built by nesting small components inside bigger ones.',
      },
      {
        term: 'State',
        meaning:
          'Data a component remembers while the app runs, like the text in a search box. When state changes, React redraws the parts of the screen that depend on it.',
      },
    ],
    howWeKnow:
      'The HTML contains markers that React’s own code leaves behind, such as a data-reactroot attribute or a reference to react-dom, the part of React that draws components into a web page. If we spotted Next.js instead, we also list React, because Next.js is built on top of it.',
  },
  {
    detection: 'Nuxt (Vue)',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Nuxt',
        role: 'Vue framework that adds routing, data fetching and server rendering',
        beginnerNote:
          'Nuxt is to Vue what Next.js is to React. Vue draws the interface; Nuxt organizes the whole site, turning files into pages and building HTML on the server so pages load quickly.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Vue components and Nuxt pages (often written in TypeScript first)' },
    files: [
      { path: 'pages/index.vue', note: 'Home page: every file in pages/ becomes a URL' },
      { path: 'pages/products/[id].vue', note: 'Dynamic page that matches /products/1, /products/2 and so on' },
      { path: 'components/ProductCard.vue', note: 'Reusable Vue component, available in pages without importing it' },
      { path: 'server/api/products/[id].get.ts', note: 'A small back-end endpoint that runs on Nuxt’s built-in server' },
      { path: 'nuxt.config.ts', note: 'Project settings: modules, runtime config, rendering options' },
    ],
    code: [
      {
        id: 'fw-nuxt-page',
        title: 'A Nuxt page that loads a product',
        file: 'pages/products/[id].vue',
        language: 'Vue',
        explanation:
          'This single file is a whole page. useRoute reads the id from the URL, and useFetch loads the product: on the first visit it runs on the server so the HTML arrives filled in, and when you click between pages it runs in the browser. The template shows a loading message, an error, or the product, depending on the request status.',
        code: `<!-- pages/products/[id].vue: this file's location makes it the /products/:id page -->
<script setup lang="ts">
const route = useRoute();

// Runs on the server for the first visit, then in the browser as you navigate
const { data: product, status, error } = await useFetch(
  () => \`/api/products/\${route.params.id}\`
);

useHead({ title: () => product.value?.title ?? 'Product' });
</script>

<template>
  <main>
    <p v-if="status === 'pending'">Loading…</p>
    <p v-else-if="error">Sorry, we could not load this product.</p>
    <article v-else-if="product">
      <h1>{{ product.title }}</h1>
      <img :src="product.imageUrl" :alt="product.title" />
      <p>{{ product.description }}</p>
      <NuxtLink to="/products">Back to all products</NuxtLink>
    </article>
  </main>
</template>`,
      },
    ],
    concepts: [
      {
        term: 'Hydration',
        meaning:
          'The server sends ready-made HTML so you see the page instantly, then JavaScript in the browser “wakes it up” by attaching click handlers and state. Think of a toy that arrives assembled, and you just add the batteries.',
      },
    ],
    howWeKnow:
      'The page contains a __NUXT__ script (data the server hands over to the browser) or loads its files from /_nuxt/, the folder Nuxt builds its JavaScript and CSS into.',
  },
  {
    detection: 'Vue.js',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Vue.js',
        role: 'Approachable JavaScript framework for building interactive interfaces',
        beginnerNote:
          'Vue connects your data to the HTML. When the data changes, the page updates by itself. Its templates look a lot like normal HTML, which is why many people find it easy to start with.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Vue components and browser logic' },
    files: [
      { path: 'src/main.js', note: 'Creates the Vue app and mounts it onto a <div id="app">' },
      { path: 'src/App.vue', note: 'Root component that holds the rest of the interface' },
      { path: 'src/components/TaskList.vue', note: 'Single-file component: script, template and styles together' },
      { path: 'vite.config.js', note: 'Build tool settings (Vite is the usual companion to Vue)' },
    ],
    code: [
      {
        id: 'fw-vue-sfc',
        title: 'A Vue single-file component',
        file: 'src/components/TaskList.vue',
        language: 'Vue',
        explanation:
          'A .vue file keeps a component’s logic, HTML template and CSS together. ref() creates reactive values, so when you add or tick a task Vue updates the list and the counter automatically. v-model links an input to a value in both directions, and the scoped style only applies to this component, which is where the data-v-… attributes in the page come from.',
        code: `<script setup>
import { ref, computed } from 'vue';
const newTask = ref('');
const tasks = ref([{ id: 1, text: 'Read the Vue docs', done: false }]);

// computed values update automatically whenever tasks change
const remaining = computed(() => tasks.value.filter((t) => !t.done).length);

function addTask() {
  if (!newTask.value.trim()) return;
  tasks.value.push({ id: Date.now(), text: newTask.value, done: false });
  newTask.value = '';
}
</script>

<template>
  <form @submit.prevent="addTask">
    <input v-model="newTask" placeholder="What needs doing?" /> <button>Add</button>
  </form>
  <p>{{ remaining }} left to do</p>
  <ul>
    <li v-for="task in tasks" :key="task.id" :class="{ done: task.done }">
      <label><input type="checkbox" v-model="task.done" /> {{ task.text }}</label>
    </li>
  </ul>
</template>

<style scoped>
.done { text-decoration: line-through; opacity: 0.6; }
</style>`,
      },
    ],
    concepts: [
      {
        term: 'Reactivity',
        meaning:
          'The framework watches your data and updates the page whenever it changes, like a spreadsheet cell that recalculates when you edit the numbers it depends on.',
      },
      {
        term: 'Scoped CSS',
        meaning:
          'Styles that only apply inside one component, so a .title rule in one file cannot accidentally restyle a .title somewhere else. Vue does this by adding unique data-v-… attributes to the component’s elements.',
      },
    ],
    howWeKnow:
      'Vue’s scoped styles stamp elements with attributes like data-v-7ba5bd90 so each component’s CSS only affects itself. We also look for script files named vue.js or vue.global.js.',
  },
  {
    detection: 'Angular',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Angular',
        role: 'Full front-end framework from Google with routing, forms and HTTP built in',
        beginnerNote:
          'Angular is an all-in-one toolkit: instead of picking separate libraries for each job, you get one official way to do routing, forms, data loading and testing. It is popular for large business apps where many developers need to follow the same structure.',
      },
    ],
    language: { name: 'TypeScript', usedFor: 'Angular components, services and routing' },
    files: [
      { path: 'src/main.ts', note: 'Starts the app by bootstrapping the root component' },
      { path: 'src/app/app.config.ts', note: 'App-wide providers, such as the router and the HTTP client' },
      { path: 'src/app/app.routes.ts', note: 'Maps URLs to the components that should appear' },
      { path: 'src/app/products/product-list.component.ts', note: 'A component: TypeScript class plus its HTML template' },
      { path: 'angular.json', note: 'Angular CLI workspace settings for building and serving the app' },
    ],
    code: [
      {
        id: 'fw-angular-component',
        title: 'An Angular component that loads products',
        file: 'src/app/products/product-list.component.ts',
        language: 'TypeScript',
        explanation:
          'The @Component decorator tells Angular this class is a piece of UI and gives it an HTML template. inject(HttpClient) asks Angular to hand over its HTTP helper (the app must register it with provideHttpClient()), and the products signal holds the list so the template re-renders when data arrives. The @for block loops over products, and the currency pipe formats each price.',
        code: `import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';

interface Product { id: number; title: string; price: number; }

@Component({
  selector: 'app-product-list', // used in HTML as <app-product-list />
  imports: [CurrencyPipe],
  template: \`
    <h2>Products</h2>
    @for (product of products(); track product.id) {
      <div class="card">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price | currency }}</p>
      </div>
    } @empty {
      <p>No products yet.</p>
    }
  \`,
})
export class ProductListComponent implements OnInit {
  private http = inject(HttpClient); // Angular hands us its HTTP helper
  products = signal<Product[]>([]);  // a signal: when it changes, the template updates

  ngOnInit() {
    this.http.get<Product[]>('/api/products').subscribe((data) => this.products.set(data));
  }
}`,
      },
    ],
    concepts: [
      {
        term: 'Dependency injection',
        meaning:
          'Instead of a component creating its own helpers (like an HTTP client), it asks the framework for them and Angular supplies a shared instance. It is like a hotel room that comes with towels provided, rather than you packing your own.',
      },
      {
        term: 'TypeScript',
        meaning:
          'JavaScript with types added, so the editor can warn you that product.prce is a typo before the code ever runs. Browsers cannot run it directly, so it is converted to plain JavaScript during the build.',
      },
    ],
    howWeKnow:
      'Angular writes an ng-version attribute (for example ng-version="17.3.0") onto the app’s root element when it starts. An ng-app attribute points to AngularJS, the older first version of the framework.',
  },
  {
    detection: 'Svelte / SvelteKit',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Svelte',
        role: 'Component framework that does most of its work at build time (SvelteKit adds routing and server rendering)',
        beginnerNote:
          'Most frameworks ship a lot of code to the browser to figure out what changed. Svelte works more like a translator: it converts your components into small, efficient JavaScript before the site is published, so the browser has less to download.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Svelte components and SvelteKit load functions' },
    files: [
      { path: 'src/routes/+layout.svelte', note: 'Shared layout wrapped around every page' },
      { path: 'src/routes/blog/+page.svelte', note: 'The /blog page UI' },
      { path: 'src/routes/blog/+page.server.js', note: 'load() function that fetches the page’s data on the server' },
      { path: 'src/lib/components/PostCard.svelte', note: 'A reusable component' },
      { path: 'svelte.config.js', note: 'Svelte and SvelteKit settings, including which adapter deploys the site' },
    ],
    code: [
      {
        id: 'fw-svelte-page',
        title: 'A SvelteKit page with live search',
        file: 'src/routes/blog/+page.svelte',
        language: 'Svelte',
        explanation:
          'SvelteKit runs the load() function in the neighbouring +page.server.js file and passes its result into this page as data. $state marks a value that should update the page when it changes, and $derived recalculates the filtered list whenever the search text changes. The CSS at the bottom is automatically scoped to this component, which is why Svelte sites have svelte-xxxx class names.',
        code: `<script>
  // data comes from the load() function in +page.server.js next to this file
  let { data } = $props();

  let search = $state('');

  // $derived recalculates whenever search or data.posts changes
  let visible = $derived(
    data.posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
  );
</script>

<h1>Blog</h1>
<input bind:value={search} placeholder="Search posts" />

{#each visible as post (post.slug)}
  <article>
    <a href="/blog/{post.slug}">{post.title}</a>
    <p>{post.summary}</p>
  </article>
{:else}
  <p>No posts match “{search}”.</p>
{/each}

<style>
  /* Svelte scopes this CSS to this component automatically */
  article { margin-block: 1rem; }
</style>`,
      },
    ],
    concepts: [
      {
        term: 'Compiler',
        meaning:
          'A tool that translates code you write into a different form before it runs. Svelte compiles components into plain JavaScript at build time, so the browser does less work.',
      },
    ],
    howWeKnow:
      'Svelte gives elements generated class names like svelte-1x2y3z so each component’s CSS stays scoped to it, and SvelteKit pages include a __sveltekit startup script that boots the app in the browser.',
  },
  {
    detection: 'Astro',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Astro',
        role: 'Content-focused web framework that ships little or no JavaScript by default',
        beginnerNote:
          'Astro builds pages into plain HTML and only adds JavaScript to the specific parts that need to be interactive. That makes it a great fit for blogs, docs and marketing sites where speed matters more than app-like features.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Astro components and build-time data loading' },
    files: [
      { path: 'src/pages/index.astro', note: 'Home page: files in src/pages/ become URLs' },
      { path: 'src/layouts/BaseLayout.astro', note: 'Shared HTML shell: head tags, header, footer' },
      { path: 'src/content/blog/first-post.md', note: 'A blog post written in Markdown' },
      { path: 'src/components/LikeButton.jsx', note: 'An interactive React component used as an “island”' },
      { path: 'astro.config.mjs', note: 'Integrations (React, Tailwind, sitemap…) and output settings' },
    ],
    code: [
      {
        id: 'fw-astro-page',
        title: 'An Astro page with a content collection and an island',
        file: 'src/pages/blog/index.astro',
        language: 'Astro',
        explanation:
          'Code between the --- fences runs at build time (or on the server), never in the browser: here it loads every Markdown post in the blog collection and sorts them by date. The rest is an HTML-like template. The LikeButton is a React component (added with the @astrojs/react integration), and client:visible tells Astro to send its JavaScript only when it scrolls into view.',
        code: `---
// Runs at build time or on the server, never in the visitor's browser
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import LikeButton from '../../components/LikeButton.jsx';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<BaseLayout title="Blog">
  <h1>Latest posts</h1>
  <ul>
    {posts.map((post) => (
      <li>
        <a href={\`/blog/\${post.id}/\`}>{post.data.title}</a>
        <time datetime={post.data.pubDate.toISOString()}>
          {post.data.pubDate.toLocaleDateString()}
        </time>
      </li>
    ))}
  </ul>

  <!-- An island: only this component gets JavaScript, once it scrolls into view -->
  <LikeButton client:visible />
</BaseLayout>`,
      },
    ],
    concepts: [
      {
        term: 'Islands architecture',
        meaning:
          'Most of the page is static HTML (the ocean), with small interactive components (the islands) that get their own JavaScript. Visitors download code only for the parts that actually need it.',
      },
      {
        term: 'Static site generation (SSG)',
        meaning:
          'Building every page into a finished HTML file ahead of time, before anyone visits. Serving a pre-built file is fast and cheap, like handing out printed flyers instead of writing each one on request.',
      },
    ],
    howWeKnow:
      'Astro puts its built CSS and JavaScript in a /_astro/ folder, and interactive components are wrapped in <astro-island> elements that tell the browser which parts of the page need JavaScript.',
  },
  {
    detection: 'Remix / React Router',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Remix',
        role: 'Full-stack React framework built around routes with server loaders and actions',
        beginnerNote:
          'Remix gives each URL a route file that says what data to load and what happens when a form is submitted, with both running on the server. It leans on standard web features like HTML forms, and it has since merged into React Router v7.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'React route components plus server-side loaders and actions (often TypeScript)' },
    files: [
      { path: 'app/root.tsx', note: 'The root layout: <html>, <head> and the outlet where pages appear' },
      { path: 'app/routes/_index.tsx', note: 'The home page route' },
      { path: 'app/routes/notes.tsx', note: 'The /notes route, with its loader, action and UI in one file' },
      { path: 'app/db.server.ts', note: 'Database helper; the .server name keeps it out of browser bundles' },
    ],
    code: [
      {
        id: 'fw-remix-route',
        title: 'A Remix route with a loader and an action',
        file: 'app/routes/notes.tsx',
        language: 'TypeScript (React)',
        explanation:
          'The loader runs on the server when someone opens /notes and returns data for the page. When the form is submitted, Remix sends it to the action on the server, saves the note, and then re-runs the loader so the list updates by itself. In React Router v7 the same code works with imports from "react-router" instead of the @remix-run packages.',
        code: `// app/routes/notes.tsx: the file name makes this the /notes page
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';

// loader: runs on the server before the page renders
export async function loader() {
  const notes = await db.note.findMany({ orderBy: { createdAt: 'desc' } });
  return json({ notes });
}

// action: runs on the server when the <Form> below is submitted
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  await db.note.create({ data: { text: String(form.get('text')) } });
  return json({ ok: true });
}

export default function Notes() {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <main>
      <Form method="post">
        <input name="text" required />
        <button type="submit">Add note</button>
      </Form>
      <ul>{notes.map((n) => <li key={n.id}>{n.text}</li>)}</ul>
    </main>
  );
}`,
      },
    ],
    concepts: [
      {
        term: 'Loader and action',
        meaning:
          'A loader is server code that reads data for a page (for GET requests); an action is server code that handles changes like form submissions (POST). Keeping both next to the UI makes it clear where each piece of data comes from.',
      },
      {
        term: 'Progressive enhancement',
        meaning:
          'Build the page so its basics work with plain HTML, then layer JavaScript on top for a smoother experience. A Remix form still submits even if the JavaScript has not finished loading.',
      },
    ],
    howWeKnow:
      'Remix writes the server’s loader data into a window.__remixContext script (plus a __remixManifest listing the app’s routes), so the browser can pick up where the server left off without fetching everything again.',
  },
  {
    detection: 'Gatsby',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Gatsby',
        role: 'React-based framework that pre-builds sites using a GraphQL data layer',
        beginnerNote:
          'Gatsby gathers content from Markdown files, a CMS or APIs, lets pages ask for exactly the data they need with GraphQL, and builds everything into fast static pages before the site goes live.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'React pages, templates and Gatsby build scripts' },
    files: [
      { path: 'gatsby-config.js', note: 'Site metadata and the plugins that pull in content (Markdown, images, CMS)' },
      { path: 'gatsby-node.js', note: 'Build-time code that creates pages, for example one page per blog post' },
      { path: 'src/pages/blog.js', note: 'A page: files in src/pages/ become URLs' },
      { path: 'src/templates/blog-post.js', note: 'Template reused for every individual post' },
      { path: 'content/posts/hello-world.md', note: 'A post written in Markdown' },
    ],
    code: [
      {
        id: 'fw-gatsby-page-query',
        title: 'A Gatsby page with a GraphQL query',
        file: 'src/pages/blog.js',
        language: 'JavaScript (React)',
        explanation:
          'While building the site, Gatsby runs the GraphQL query at the bottom, reading every Markdown post, and passes the result into the page component as data. The component is ordinary React. The slug field is added by a small function in gatsby-node.js that runs during the build.',
        code: `import * as React from 'react';
import { graphql, Link } from 'gatsby';

export default function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;
  return (
    <main>
      <h1>Blog</h1>
      {posts.map((post) => (
        <article key={post.fields.slug}>
          <Link to={post.fields.slug}>{post.frontmatter.title}</Link> <small>{post.frontmatter.date}</small>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  );
}

// Gatsby runs this query while building the site and passes the result in as data
export const query = graphql\`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields { slug }
        frontmatter { title date(formatString: "MMMM D, YYYY") }
      }
    }
  }
\`;`,
      },
    ],
    concepts: [
      {
        term: 'GraphQL',
        meaning:
          'A query language where you describe the exact shape of the data you want and get back just that. It is like ordering from a menu by listing precisely the sides you want, rather than accepting a fixed combo.',
      },
    ],
    howWeKnow:
      'Gatsby leaves its name in the HTML: pages mount inside <div id="___gatsby">, and wrappers and images carry class names such as gatsby-focus-wrapper and gatsby-image-wrapper.',
  },
  {
    detection: 'Expo (React Native Web)',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Expo (React Native Web)',
        role: 'Builds the website from React Native code that can also power iOS and Android apps',
        beginnerNote:
          'Expo is a toolkit for React Native, which is normally used to build phone apps. With React Native Web, the same components (View, Text, Pressable) are translated into HTML and CSS, so a single codebase can produce a website as well as mobile apps.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'React Native screens shared between web and mobile (often TypeScript)' },
    files: [
      { path: 'app/_layout.tsx', note: 'Expo Router layout: navigation shell shared by every screen' },
      { path: 'app/index.tsx', note: 'The home screen, which is also the / page on the web' },
      { path: 'app/settings.tsx', note: 'Another screen, reachable at /settings on the web' },
      { path: 'app.json', note: 'Expo config: app name, icons, and web build settings' },
    ],
    code: [
      {
        id: 'fw-expo-screen',
        title: 'An Expo Router screen that runs on web and mobile',
        file: 'app/index.tsx',
        language: 'TypeScript (React Native)',
        explanation:
          'This screen uses React Native components instead of HTML tags: View is a box, Text shows words and Pressable handles taps or clicks. On a phone they become native views; on the web, React Native Web turns them into <div>s and CSS. Expo Router uses the app/ folder the way Next.js does, so this file is the home screen everywhere (and app/settings.tsx would become /settings).',
        code: `// app/index.tsx: the home screen on iOS, Android and the web
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [items, setItems] = useState<string[]>([]);

  function addItem() {
    if (!text.trim()) return;
    setItems([...items, text]);
    setText('');
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Add an item" />
      <Pressable style={styles.button} onPress={addItem}><Text style={styles.buttonText}>Add</Text></Pressable>
      <FlatList data={items} keyExtractor={(item, i) => \`\${i}-\${item}\`} renderItem={({ item }) => <Text>{item}</Text>} />
    </View>
  );
}

// No CSS files: styles are JavaScript objects, which become real CSS on the web
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#4630eb', borderRadius: 8, padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
});`,
      },
    ],
    concepts: [
      {
        term: 'Cross-platform code',
        meaning:
          'Writing an app once and running it on several platforms (web, iOS, Android) instead of building three separate apps. It saves time, though each platform may still need a few special touches.',
      },
    ],
    howWeKnow:
      'Its scripts load from /_expo/static/, the folder Expo creates when it exports a React Native app as a website.',
  },
  {
    detection: 'Ember.js',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Ember.js',
        role: 'Opinionated JavaScript framework with strong conventions for large web apps',
        beginnerNote:
          'Ember decides a lot for you: where files go, how URLs map to screens, and how data is loaded. Once you learn its conventions, you can jump into any Ember project and already know your way around.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Ember routes, components and services' },
    files: [
      { path: 'app/router.js', note: 'Lists every URL in the app and the route that handles it' },
      { path: 'app/routes/posts.js', note: 'Loads the data for the /posts screen' },
      { path: 'app/templates/posts.hbs', note: 'Handlebars template that displays that data' },
      { path: 'app/components/post-card.js', note: 'Reusable component logic (paired with a template)' },
      { path: 'config/environment.js', note: 'App settings for development and production' },
    ],
    code: [
      {
        id: 'fw-ember-route',
        title: 'An Ember router and route',
        file: 'app/routes/posts.js',
        language: 'JavaScript',
        explanation:
          'The router map lists the app’s URLs, and by convention the posts route is found in app/routes/posts.js. Ember calls its model() hook when you visit /posts, waits for the data, then renders app/templates/posts.hbs with that data available as @model. You never wire these files together yourself: matching names are enough.',
        code: `// app/router.js lists the app's URLs:
//   Router.map(function () {
//     this.route('posts');                         // /posts
//     this.route('post', { path: '/posts/:id' });  // /posts/42
//   });

// app/routes/posts.js: Ember finds this file because its name matches the route
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostsRoute extends Route {
  // Ember Data's store: a shared cache of records loaded from the API
  @service store;

  // Whatever model() returns becomes @model in app/templates/posts.hbs,
  // which can loop over it with {{#each @model as |post|}}
  model() {
    return this.store.findAll('post');
  }
}`,
      },
    ],
    concepts: [
      {
        term: 'Convention over configuration',
        meaning:
          'Instead of writing settings to connect pieces of code, you follow naming and folder rules and the framework connects them for you. A route called posts automatically uses routes/posts.js and templates/posts.hbs.',
      },
    ],
    howWeKnow:
      'Ember apps usually include a <meta name="…/config/environment"> tag holding the app’s settings, and elements rendered by classic Ember components get ids like ember123 and an ember-view class.',
  },
  {
    detection: 'Alpine.js',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Alpine.js',
        role: 'Lightweight library that adds interactivity straight from HTML attributes',
        beginnerNote:
          'Alpine is for sprinkling behaviour onto a mostly static page, like dropdowns, tabs and modals, without a build step or a big framework. You write small bits of logic directly inside HTML attributes.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-alpine-dropdown',
        title: 'An Alpine.js filterable list',
        file: 'index.html',
        language: 'HTML',
        explanation:
          'x-data creates a small bundle of state for this element and everything inside it. @click changes that state, x-show hides or shows elements, x-model keeps the input and the query in sync, and x-for repeats the <li> for each matching item. There is no separate JavaScript file: Alpine reads these attributes when the page loads.',
        code: `<!-- Load Alpine (defer so it runs after the HTML is ready) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- x-data holds the state for this element and everything inside it -->
<div x-data="{
  open: false,
  query: '',
  fruits: ['Apples', 'Bananas', 'Cherries'],
  get matches() {
    return this.fruits.filter(f => f.toLowerCase().includes(this.query.toLowerCase()));
  }
}">
  <button @click="open = !open">
    <span x-text="open ? 'Hide' : 'Show'"></span> fruit list
  </button>

  <div x-show="open" x-transition>
    <input x-model="query" placeholder="Filter…">
    <ul>
      <template x-for="fruit in matches" :key="fruit">
        <li x-text="fruit"></li>
      </template>
    </ul>
    <p x-show="matches.length === 0">No matches.</p>
  </div>
</div>`,
      },
    ],
    concepts: [
      {
        term: 'Declarative UI',
        meaning:
          'You describe what the page should look like for a given state (show this when open is true) instead of writing step-by-step instructions to hide and show elements. The library does the updating.',
      },
    ],
    howWeKnow:
      'The HTML is sprinkled with Alpine’s special attributes, such as x-data, x-show, x-model and @click, and the page loads the alpinejs script that reads them.',
  },
  {
    detection: 'htmx',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'htmx',
        role: 'Small library that lets HTML elements fetch and swap in HTML from the server',
        beginnerNote:
          'With htmx, the server sends back ready-made pieces of HTML instead of JSON, and htmx drops them into the page. You get app-like updates without writing much JavaScript, and the server stays in charge of how things look.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-htmx-search',
        title: 'Live search and delete with htmx',
        file: 'templates/contacts.html',
        language: 'HTML',
        explanation:
          'The search box uses hx-get to request /contacts/search as you type (waiting 500 ms after you pause), and hx-target says where to put the HTML rows the server sends back. The delete button sends a DELETE request and, when the server replies with an empty response, htmx replaces the closest table row with nothing, removing it. No page reloads and no hand-written fetch calls.',
        code: `<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.4/dist/htmx.min.js"></script>

<!-- As you type, htmx asks the server for matching rows -->
<input type="search" name="q" placeholder="Search contacts…"
       hx-get="/contacts/search"
       hx-trigger="input changed delay:500ms, search"
       hx-target="#results"
       hx-indicator="#spinner">
<span id="spinner" class="htmx-indicator">Searching…</span>

<table>
  <tbody id="results">
    <!-- The server replies with ready-made rows like this one -->
    <tr>
      <td>Ada Lovelace</td>
      <td>
        <button hx-delete="/contacts/42"
                hx-confirm="Delete this contact?"
                hx-target="closest tr"
                hx-swap="outerHTML">
          Delete
        </button>
      </td>
    </tr>
  </tbody>
</table>`,
      },
    ],
    concepts: [
      {
        term: 'Hypermedia (HTML over the wire)',
        meaning:
          'Instead of the server sending raw data (JSON) for browser code to turn into HTML, the server sends finished HTML fragments. The browser just places them on the page.',
      },
    ],
    howWeKnow:
      'The HTML uses htmx’s attributes, such as hx-get, hx-post, hx-target and hx-swap, and the page loads the htmx script that makes those attributes work.',
  },

  /* ------------------------------------------------------------------ */
  /* Site builders & CMS                                                 */
  /* ------------------------------------------------------------------ */
  {
    detection: 'WordPress',
    stackItems: [
      {
        layer: 'Backend',
        name: 'WordPress',
        role: 'Open-source PHP content management system that renders pages from themes and plugins',
        beginnerNote:
          'WordPress lets people write posts and pages in a friendly editor, stores them in a database, and uses a theme to turn them into web pages. Plugins add features like shops, forms or SEO tools without writing code.',
      },
      {
        layer: 'Data',
        name: 'MySQL / MariaDB',
        role: 'WordPress’s standard database for posts, pages, users and settings',
        beginnerNote:
          'Every post, comment and setting in a WordPress site lives in tables such as wp_posts and wp_options in a MySQL-compatible database.',
      },
    ],
    language: { name: 'PHP', usedFor: 'WordPress core, themes and plugins' },
    files: [
      { path: 'wp-config.php', note: 'Database connection details and site-wide settings' },
      { path: 'wp-content/themes/my-theme/functions.php', note: 'Theme setup: menus, image sizes, scripts and styles' },
      { path: 'wp-content/themes/my-theme/index.php', note: 'Fallback template that lists posts using The Loop' },
      { path: 'wp-content/themes/my-theme/single.php', note: 'Template for a single blog post' },
      { path: 'wp-content/plugins/', note: 'Installed plugins that add features (shop, forms, SEO…)' },
    ],
    code: [
      {
        id: 'fw-wordpress-loop',
        title: 'The Loop in a WordPress theme template',
        file: 'wp-content/themes/my-theme/index.php',
        language: 'PHP',
        explanation:
          'Before this template runs, WordPress has already worked out from the URL which posts to show and loaded them from the database. “The Loop” steps through those posts one at a time: the_post() sets up the current post, and helper functions like the_title() and the_permalink() print its details. get_header() and get_footer() pull in other template files so every page shares them. Newer block themes describe templates in HTML instead, but classic PHP themes like this are still very common.',
        code: `<?php
/**
 * index.php: the fallback template in a classic WordPress theme.
 * WordPress has already loaded the right posts before this file runs.
 */
get_header(); // pulls in header.php
?>

<main class="site-main">
  <?php if ( have_posts() ) : ?>
    <?php while ( have_posts() ) : the_post(); // The Loop: set up the next post ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <p class="meta">Posted on <?php echo esc_html( get_the_date() ); ?> by <?php the_author(); ?></p>
        <?php the_excerpt(); ?>
      </article>
    <?php endwhile; ?>

    <?php the_posts_pagination(); ?>
  <?php else : ?>
    <p><?php esc_html_e( 'Sorry, no posts matched your search.', 'my-theme' ); ?></p>
  <?php endif; ?>
</main>

<?php
get_sidebar(); // sidebar.php
get_footer();  // footer.php`,
      },
    ],
    concepts: [
      {
        term: 'CMS (content management system)',
        meaning:
          'Software that lets non-programmers create and edit website content through an admin screen, while templates control how that content looks. Writers write; the theme handles the design.',
      },
      {
        term: 'Plugin',
        meaning:
          'An add-on that plugs extra features into existing software without changing its core code, like apps on a phone. WordPress has tens of thousands of them.',
      },
    ],
    howWeKnow:
      'Its images, styles and scripts load from /wp-content/ and /wp-includes/, the folders every WordPress site uses for themes, plugins, uploads and WordPress’s own files.',
  },
  {
    detection: 'Shopify',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Shopify',
        role: 'Hosted e-commerce platform that runs the store: products, inventory, orders and themes',
        beginnerNote:
          'Shopify is like renting a fully equipped shop. The store owner adds products in an admin panel, and Shopify handles the servers, security and scaling, so the business can focus on selling.',
      },
      {
        layer: 'Backend',
        name: 'Checkout & payments (Shopify)',
        role: 'Shopify’s own cart checkout and payment processing',
        beginnerNote:
          'When you pay on a Shopify store, the checkout is run by Shopify itself, which takes care of card payments, taxes and fraud checks for every store on the platform.',
      },
    ],
    language: { name: 'Liquid', usedFor: 'Shopify theme templates' },
    files: [
      { path: 'layout/theme.liquid', note: 'The outer HTML shell shared by every page of the store' },
      { path: 'templates/product.json', note: 'Lists which sections appear on product pages, in what order' },
      { path: 'sections/main-product.liquid', note: 'The main product section: images, price, variants, add to cart' },
      { path: 'snippets/price.liquid', note: 'A small reusable piece of template' },
      { path: 'config/settings_schema.json', note: 'Theme settings the owner can change in the theme editor' },
    ],
    code: [
      {
        id: 'fw-shopify-product-section',
        title: 'A Shopify Liquid product section',
        file: 'sections/main-product.liquid',
        language: 'Liquid',
        explanation:
          'Liquid is Shopify’s template language: {{ }} prints a value and {% %} runs logic like loops and if-statements. Shopify fills in the product object for you, filters like money format prices, and the form tag builds an “add to cart” form that posts to Shopify’s cart. The schema block at the bottom tells the theme editor about this section so store owners can add and configure it without code.',
        code: `{% comment %} sections/main-product.liquid: shows one product {% endcomment %}
<div class="product">
  <img
    src="{{ product.featured_image | image_url: width: 800 }}"
    alt="{{ product.featured_image.alt | escape }}" loading="lazy">

  <div class="product__info">
    <h1>{{ product.title }}</h1>
    <p class="price">{{ product.selected_or_first_available_variant.price | money }}</p>

    {% form 'product', product %}
      <select name="id">
        {% for variant in product.variants %}
          <option value="{{ variant.id }}" {% unless variant.available %}disabled{% endunless %}>
            {{ variant.title }} - {{ variant.price | money }}
          </option>
        {% endfor %}
      </select>
      <button type="submit" {% unless product.available %}disabled{% endunless %}>
        {% if product.available %}Add to cart{% else %}Sold out{% endif %}
      </button>
    {% endform %}

    <div class="rte">{{ product.description }}</div>
  </div>
</div>

{% schema %}
{ "name": "Product information", "tag": "section" }
{% endschema %}`,
      },
    ],
    concepts: [
      {
        term: 'Template language',
        meaning:
          'A mini-language mixed into HTML that fills in dynamic data, like a mail-merge letter with blanks for each customer’s name. Liquid, Twig and Handlebars are all examples.',
      },
      {
        term: 'SaaS (software as a service)',
        meaning:
          'Software you rent and use over the internet instead of installing and running yourself. The provider handles servers, updates and security for a monthly fee.',
      },
    ],
    howWeKnow:
      'Its theme files and images load from cdn.shopify.com, and Shopify’s servers add their own headers, such as x-shopify-stage, to the pages they send.',
  },
  {
    detection: 'Squarespace',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Squarespace',
        role: 'All-in-one website builder: templates, editor, hosting and domains in one subscription',
        beginnerNote:
          'Squarespace lets people build a polished site by picking a template and editing it visually. There are no servers to manage and usually no code to write; Squarespace hosts everything.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Website builder',
        meaning:
          'A hosted service where you design pages by dragging, dropping and typing instead of coding. The builder generates the HTML, CSS and JavaScript for you and keeps the site online.',
      },
      {
        term: 'Managed hosting',
        meaning:
          'The provider runs the servers, security updates, backups and scaling for you. It is like renting a furnished apartment where the landlord fixes the plumbing.',
      },
    ],
    howWeKnow:
      'Its CSS and scripts load from static.squarespace.com (and images usually from images.squarespace-cdn.com), servers that only Squarespace sites use.',
  },
  {
    detection: 'Wix',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Wix',
        role: 'Hosted drag-and-drop website builder with optional code (Velo) and business apps',
        beginnerNote:
          'Wix lets anyone build a site visually and add features like bookings, stores and blogs from an app market. Wix hosts the site, and developers can optionally add JavaScript through its Velo platform.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-wix-velo-page',
        title: 'Optional page code with Wix Velo',
        file: 'Home page code (Wix Editor)',
        language: 'JavaScript',
        explanation:
          'Most Wix sites have no custom code, but Velo lets developers add JavaScript to pages. $w selects elements that were placed in the visual editor by their IDs, and wixData queries a collection stored in the site’s built-in CMS. Here, typing in a search box filters recipes and a repeater (a repeating layout designed in the editor) shows the results.',
        code: `// Page code in the Wix Editor. $w finds elements you placed with drag-and-drop.
import wixData from 'wix-data';

$w.onReady(async function () {
  // Decide how each repeated card shows its recipe
  $w('#recipesRepeater').onItemReady(($item, itemData) => {
    $item('#recipeTitle').text = itemData.title;
    $item('#recipeImage').src = itemData.image;
  });

  $w('#searchInput').onInput(() => loadRecipes($w('#searchInput').value));
  await loadRecipes('');
});

async function loadRecipes(term) {
  // "Recipes" is a collection in the site's built-in CMS
  let query = wixData.query('Recipes').ascending('title').limit(20);
  if (term) {
    query = query.contains('title', term);
  }
  const results = await query.find();
  $w('#recipesRepeater').data = results.items;
}`,
      },
    ],
    concepts: [
      {
        term: 'No-code / low-code',
        meaning:
          'Tools that let you build software mostly by clicking and configuring, with code as an optional extra. They make simple sites fast to launch, at the cost of less control than writing everything yourself.',
      },
    ],
    howWeKnow:
      'Wix’s servers add an x-wix-request-id header to their responses, and Wix sites load files from Wix-only domains such as static.parastorage.com and static.wixstatic.com.',
  },
  {
    detection: 'Webflow',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Webflow',
        role: 'Visual web design tool that generates HTML and CSS, with a built-in CMS and hosting',
        beginnerNote:
          'Webflow feels like a design app, but every box you draw is a real HTML element and every style is real CSS. Designers can build professional sites without writing code, and Webflow hosts them.',
      },
    ],
    files: [
      { path: 'index.html', note: 'Each page designed in Webflow becomes an HTML file (visible if the site is exported)' },
      { path: 'css/my-studio.webflow.css', note: 'The CSS generated from the styles set in the designer' },
      { path: 'js/webflow.js', note: 'Webflow’s script for interactions, navbars, sliders and tabs' },
    ],
    code: [
      {
        id: 'fw-webflow-output',
        title: 'The HTML Webflow generates (simplified)',
        file: 'blog.html',
        language: 'HTML',
        explanation:
          'Webflow users design visually, and this is roughly the HTML it produces. The html tag carries data-wf-page and data-wf-site IDs, built-in components use w- classes (w-nav, w-dyn-list), and a CMS Collection List repeats one designed item for every entry in the collection. The webflow.js script powers the mobile menu and interactions.',
        code: `<!-- Simplified HTML that Webflow generates for a blog page -->
<html data-wf-page="6650a1b2c3d4e5f601234567" data-wf-site="6650a1b2c3d4e5f601234560">
<head>
  <link href="css/normalize.css" rel="stylesheet" type="text/css">
  <link href="css/webflow.css" rel="stylesheet" type="text/css">
  <link href="css/my-studio.webflow.css" rel="stylesheet" type="text/css">
</head>
<body>
  <div class="navbar w-nav" data-collapse="medium" data-animation="default">
    <a href="/" class="brand w-nav-brand">Studio</a>
    <nav role="navigation" class="w-nav-menu">
      <a href="/work" class="nav-link w-nav-link">Work</a>
      <a href="/blog" aria-current="page" class="nav-link w-nav-link w--current">Blog</a>
    </nav>
  </div>

  <!-- A CMS Collection List: one designed item, repeated for every blog post -->
  <div class="w-dyn-list">
    <div role="list" class="w-dyn-items">
      <div role="listitem" class="post-card w-dyn-item">
        <a href="/blog/hello-world" class="post-link w-inline-block">
          <h3>Hello world</h3>
        </a>
      </div>
    </div>
  </div>

  <script src="js/webflow.js" type="text/javascript"></script>
</body>
</html>`,
      },
    ],
    concepts: [
      {
        term: 'Visual development',
        meaning:
          'Building with a visual editor that maps directly onto real code: dragging a box creates a <div>, and changing its padding writes a CSS rule. You get the output of hand-written code without typing it.',
      },
    ],
    howWeKnow:
      'Webflow stamps the <html> tag with data-wf-page and data-wf-site IDs and loads its webflow.js script. Sites hosted by Webflow also pull their files from Webflow’s own CDN at website-files.com.',
  },
  {
    detection: 'Framer',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Framer',
        role: 'Design tool that publishes websites directly, rendered with React',
        beginnerNote:
          'Framer started as a prototyping tool for designers and now publishes real, hosted websites straight from the canvas. Under the hood the published site is a React app, and developers can add their own React code components.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-framer-code-component',
        title: 'A Framer code component',
        file: 'LikeCounter.tsx',
        language: 'TypeScript (React)',
        explanation:
          'Framer sites are mostly designed visually, but developers can write code components: normal React components that designers drag onto the canvas like any other element. addPropertyControls adds inputs to Framer’s side panel, so a designer can change the label or color without touching the code.',
        code: `// A Framer code component: a React component designers can drag onto the canvas
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function LikeCounter(props) {
    const { label = "Like", color = "#0099FF" } = props
    const [count, setCount] = useState(0)

    return (
        <button
            onClick={() => setCount(count + 1)}
            style={{ background: color, color: "white", border: "none", borderRadius: 12, padding: "12px 20px" }}
        >
            {label} · {count}
        </button>
    )
}

// These controls appear in Framer's side panel, so designers can edit props without code
addPropertyControls(LikeCounter, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Like" },
    color: { type: ControlType.Color, title: "Color", defaultValue: "#0099FF" },
})`,
      },
    ],
    concepts: [
      {
        term: 'Design-to-code',
        meaning:
          'Tools that turn a visual design directly into a working website, removing the hand-off where a developer rebuilds a designer’s mockup from scratch.',
      },
    ],
    howWeKnow:
      'Its images and scripts load from framerusercontent.com, the domain Framer uses to host the files of published Framer sites.',
  },
  {
    detection: 'Ghost',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Ghost',
        role: 'Open-source Node.js publishing platform for blogs, newsletters and memberships',
        beginnerNote:
          'Ghost is built for writers and publishers: it combines a clean editor, email newsletters and paid memberships in one app. The site’s look comes from a theme written with Handlebars templates.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Ghost’s Node.js server (themes are written as Handlebars templates)' },
    files: [
      { path: 'content/themes/my-theme/default.hbs', note: 'Base layout wrapped around every page' },
      { path: 'content/themes/my-theme/index.hbs', note: 'Home page: the list of latest posts' },
      { path: 'content/themes/my-theme/post.hbs', note: 'Template for a single post' },
      { path: 'content/themes/my-theme/partials/post-card.hbs', note: 'A reusable piece of template' },
      { path: 'content/themes/my-theme/package.json', note: 'Theme name, version and settings such as image sizes' },
    ],
    code: [
      {
        id: 'fw-ghost-index',
        title: 'A Ghost theme home page template',
        file: 'content/themes/my-theme/index.hbs',
        language: 'Handlebars',
        explanation:
          'Ghost themes use Handlebars: {{ }} prints data and {{#…}} blocks add logic. The first line wraps this page inside default.hbs. {{#foreach posts}} repeats the card for each post Ghost loaded, and helpers like img_url, excerpt and reading_time format the data. The size="m" option uses an image size defined in the theme’s package.json.',
        code: `{{!< default}}
{{!-- index.hbs: the home page. The line above wraps it in default.hbs --}}

<main class="post-feed">
  {{#foreach posts}}
    <article class="post-card {{post_class}}">
      {{#if feature_image}}
        <a href="{{url}}">
          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy">
        </a>
      {{/if}}

      <h2><a href="{{url}}">{{title}}</a></h2>
      <p>{{excerpt words="30"}}</p>

      <footer>
        {{primary_author.name}} ·
        <time datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time> ·
        {{reading_time}}
      </footer>
    </article>
  {{/foreach}}
</main>

{{pagination}}`,
      },
    ],
    concepts: [
      {
        term: 'Headless CMS',
        meaning:
          'A CMS that stores and serves content through an API without dictating how it is displayed, so any front end (a website, an app) can use it. Ghost can work as a normal themed site or headless through its Content API.',
      },
    ],
    howWeKnow:
      'Ghost adds a <meta name="generator" content="Ghost …"> tag, including its version number, to every page it renders.',
  },
  {
    detection: 'Drupal',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Drupal',
        role: 'Open-source PHP CMS for large, structured sites with complex permissions',
        beginnerNote:
          'Drupal is a powerful CMS often chosen by universities, governments and big organizations. It lets you define your own content types (like Event or Course), each with custom fields, and control exactly who can edit what.',
      },
    ],
    language: { name: 'PHP', usedFor: 'Drupal core, modules and themes (templates use Twig)' },
    files: [
      { path: 'web/sites/default/settings.php', note: 'Database connection and site configuration' },
      { path: 'web/themes/custom/mytheme/mytheme.info.yml', note: 'Declares the theme, its regions and libraries' },
      { path: 'web/themes/custom/mytheme/templates/node--article--teaser.html.twig', note: 'How an Article looks in a list' },
      { path: 'web/modules/custom/my_module/', note: 'Custom PHP module adding site-specific features' },
      { path: 'composer.json', note: 'Lists Drupal core and contributed modules as PHP dependencies' },
    ],
    code: [
      {
        id: 'fw-drupal-twig',
        title: 'A Drupal Twig template for an article teaser',
        file: 'web/themes/custom/mytheme/templates/node--article--teaser.html.twig',
        language: 'Twig',
        explanation:
          'Drupal picks templates by file name: node--article--teaser means “an Article node shown in teaser (list) view”. Twig prints values with {{ }} and runs logic with {% %}. The content variable holds every field of the article, already rendered, so the template prints the image and then everything else except the fields it chooses to hide.',
        code: `{#
/**
 * node--article--teaser.html.twig: how an Article looks in a list.
 * Drupal chooses this file by its name: node + content type + view mode.
 */
#}
{%
  set classes = [
    'node',
    'node--type-' ~ node.bundle|clean_class,
    'node--view-mode-' ~ view_mode|clean_class,
  ]
%}
<article{{ attributes.addClass(classes) }}>
  {{ title_prefix }}
  <h2{{ title_attributes }}>
    <a href="{{ url }}" rel="bookmark">{{ label }}</a>
  </h2>
  {{ title_suffix }}

  <div class="meta">By {{ author_name }} on {{ date }}</div>

  <div{{ content_attributes }}>
    {{ content.field_image }}
    {# Print every other field except the image, comments and links #}
    {{ content|without('field_image', 'comment', 'links') }}
  </div>
</article>`,
      },
    ],
    concepts: [
      {
        term: 'Content type',
        meaning:
          'A kind of content with its own set of fields, like a form template. An Event might have a date, location and ticket link, while an Article has a title, image and body.',
      },
    ],
    howWeKnow:
      'Drupal sites usually send an X-Generator: Drupal header and a matching <meta name="Generator"> tag, keep uploaded files under /sites/default/files/, and embed a drupal-settings-json script with settings for the browser.',
  },
  {
    detection: 'HubSpot CMS',
    stackItems: [
      {
        layer: 'Backend',
        name: 'HubSpot CMS',
        role: 'Hosted CMS connected to HubSpot’s CRM, forms and marketing tools',
        beginnerNote:
          'HubSpot is best known for sales and marketing software. Its CMS hosts the website too, so every form fill, page view and email click can land directly in the same customer database the sales team uses.',
      },
    ],
    language: { name: 'HubL', usedFor: 'HubSpot templates and modules (a Jinja-like template language)' },
    files: [
      { path: 'my-theme/theme.json', note: 'Theme name and settings' },
      { path: 'my-theme/templates/layouts/base.html', note: 'Base layout other templates extend' },
      { path: 'my-theme/templates/blog-listing.html', note: 'Template for the list of blog posts' },
      { path: 'my-theme/modules/hero.module/module.html', note: 'A drag-and-drop module marketers can edit' },
      { path: 'my-theme/modules/hero.module/fields.json', note: 'The editable fields that module shows in the page editor' },
    ],
    code: [
      {
        id: 'fw-hubspot-blog-listing',
        title: 'A HubSpot blog listing template in HubL',
        file: 'my-theme/templates/blog-listing.html',
        language: 'HubL',
        explanation:
          'HubL is HubSpot’s template language, based on Jinja: {{ }} prints values and {% %} runs logic. The comment at the top tells HubSpot this is a blog listing template. HubSpot provides the contents list of posts, and filters such as truncatehtml and format_date tidy up each excerpt and date.',
        code: `<!--
  templateType: blog_listing
  isAvailableForNewContent: true
  label: Blog listing
-->
{% extends "./layouts/base.html" %}

{% block body %}
<main class="blog-listing">
  <h1>{{ group.public_title }}</h1>

  {# contents is the list of posts HubSpot loaded for this page #}
  {% for content in contents %}
    <article class="post-card">
      {% if content.featured_image %}
        <img src="{{ content.featured_image }}" alt="{{ content.featured_image_alt_text }}" loading="lazy">
      {% endif %}
      <h2><a href="{{ content.absolute_url }}">{{ content.name }}</a></h2>
      <p>{{ content.post_list_content|truncatehtml(150) }}</p>
      <small>
        {{ content.publish_date|format_date('long') }} · {{ content.blog_post_author.display_name }}
      </small>
    </article>
  {% endfor %}
</main>
{% endblock body %}`,
      },
    ],
    concepts: [
      {
        term: 'CRM (customer relationship management)',
        meaning:
          'A database of every contact and customer, plus their history with a company: emails, calls, purchases and form submissions. Connecting it to the website lets marketing see which pages bring in customers.',
      },
    ],
    howWeKnow:
      'Pages built on HubSpot CMS usually carry a <meta name="generator" content="HubSpot"> tag and load files from paths like /hubfs/ and HubSpot domains such as hs-scripts.com. The HubSpot tracking script alone can also appear on sites hosted elsewhere, so the generator tag and /hubfs/ files are the stronger clues.',
  },

  /* ------------------------------------------------------------------ */
  /* Libraries                                                           */
  /* ------------------------------------------------------------------ */
  {
    detection: 'Tailwind CSS',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Tailwind CSS',
        role: 'Utility-first CSS framework: style elements with small single-purpose classes',
        beginnerNote:
          'Instead of writing a CSS rule like .card { padding: 24px }, you add ready-made classes such as p-6 directly in the HTML. At build time Tailwind generates only the CSS for the classes you actually used.',
      },
    ],
    files: [
      { path: 'src/styles/globals.css', note: 'Imports Tailwind so its utilities are generated into the site’s CSS' },
    ],
    code: [
      {
        id: 'fw-tailwind-card',
        title: 'A product card styled with Tailwind classes',
        file: 'components/ProductCard.html',
        language: 'HTML',
        explanation:
          'Every class does one small job: p-6 adds padding, rounded-2xl rounds the corners, text-slate-600 sets a text color. Prefixes add conditions: md: applies from medium screens up, hover: only while the pointer is over the element, and dark: only in dark mode. You can build a whole design without leaving the HTML.',
        code: `<!-- A product card styled only with Tailwind utility classes -->
<div class="max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800">
  <img class="h-48 w-full object-cover" src="/images/sneaker.jpg" alt="Red running sneaker" />

  <div class="space-y-3 p-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Trail Runner</h3>
      <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        In stock
      </span>
    </div>

    <p class="text-sm text-slate-600 dark:text-slate-300">
      Lightweight, grippy and ready for muddy mornings.
    </p>

    <!-- md: applies from medium screens up; hover: only while the pointer is over it -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <span class="text-2xl font-bold text-slate-900 dark:text-white">$89</span>
      <button class="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400">
        Add to cart
      </button>
    </div>
  </div>
</div>`,
      },
    ],
    concepts: [
      {
        term: 'Utility-first CSS',
        meaning:
          'Styling with many tiny classes that each do one thing (margin, color, font size) instead of writing a custom class for every component. It trades longer class lists for never having to invent class names or hunt through CSS files.',
      },
      {
        term: 'Responsive design',
        meaning:
          'Making one page adapt to phones, tablets and desktops. Breakpoints are screen widths where the layout changes, like switching a list from stacked to side-by-side.',
      },
    ],
    howWeKnow:
      'The page’s CSS defines Tailwind’s internal variables, such as --tw-shadow and --tw-ring-color, which Tailwind generates to power its utility classes. Some builds also keep a “tailwindcss” license comment at the top of the CSS file.',
  },
  {
    detection: 'Bootstrap',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Bootstrap',
        role: 'CSS and JavaScript toolkit with a responsive grid and ready-made components',
        beginnerNote:
          'Bootstrap gives you pre-designed buttons, navbars, cards, forms and a grid for layout, so a site looks consistent and works on phones without designing everything from scratch.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-bootstrap-layout',
        title: 'A Bootstrap navbar and responsive grid',
        file: 'index.html',
        language: 'HTML',
        explanation:
          'Bootstrap’s classes do the styling: navbar builds a navigation bar that collapses into a menu button on small screens, and the grid splits a row into 12 columns. col-12 col-md-4 means “full width on phones, a third of the row from medium screens up”, so three cards sit side by side on a laptop. The data-bs-toggle attribute uses Bootstrap’s JavaScript bundle to open the mobile menu.',
        code: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand" href="/">Campus Eats</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
            aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="/menu">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="/order">Order</a></li>
      </ul>
    </div>
  </div>
</nav>

<!-- 12-column grid: full width on phones, 3 cards per row from md screens up -->
<main class="container py-4">
  <div class="row g-4">
    <div class="col-12 col-md-4">
      <div class="card h-100"><div class="card-body">
        <h5 class="card-title">Veggie Wrap</h5>
        <a href="/order/veggie-wrap" class="btn btn-primary">Add to order</a>
      </div></div>
    </div>
  </div>
</main>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`,
      },
    ],
    concepts: [
      {
        term: 'Grid system',
        meaning:
          'A layout method that divides the page width into equal columns (12 in Bootstrap), so you can say “this box takes 4 of 12 columns” and it resizes neatly on any screen.',
      },
    ],
    howWeKnow:
      'The page loads Bootstrap’s files (such as bootstrap.min.css or bootstrap.bundle.min.js) and its HTML uses Bootstrap’s recognisable class names like container, row, col-md-6, navbar-expand-lg and btn btn-primary.',
  },
  {
    detection: 'jQuery',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'jQuery',
        role: 'JavaScript library that simplifies selecting elements, handling events and AJAX',
        beginnerNote:
          'jQuery was created when browsers disagreed about how JavaScript should work, and it smoothed over those differences with a short, friendly syntax. Modern browsers have caught up, but jQuery is still on a huge number of sites, often loaded by plugins or older code.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Page interactions written with jQuery' },
    files: [{ path: 'js/main.js', note: 'Site script that wires up interactions using jQuery' }],
    code: [
      {
        id: 'fw-jquery-interactions',
        title: 'Classic jQuery: an FAQ toggle and an AJAX form',
        file: 'js/main.js',
        language: 'JavaScript',
        explanation:
          '$(function () { … }) waits until the page is ready. $(".faq-question") selects elements with a CSS selector, .on("click") attaches a handler, and slideToggle animates the answer open or closed. The form handler stops the normal page reload and sends the form data with $.ajax, then swaps in a thank-you message or shows an error.',
        code: `// Wait until the page is ready, then wire things up with $("css selector")
$(function () {
  // Open or close the answer under whichever question was clicked
  $('.faq-question').on('click', function () {
    $(this).next('.faq-answer').slideToggle(200);
    $(this).toggleClass('is-open');
  });

  // Send the newsletter form in the background instead of reloading the page
  $('#newsletter-form').on('submit', function (event) {
    event.preventDefault();
    const $form = $(this);

    $.ajax({
      url: $form.attr('action'),
      method: 'POST',
      data: $form.serialize(),
    })
      .done(function () {
        $form.replaceWith('<p class="success">Thanks for subscribing!</p>');
      })
      .fail(function () {
        $form.find('.error').text('Something went wrong. Please try again.').show();
      });
  });
});`,
      },
    ],
    concepts: [
      {
        term: 'DOM (Document Object Model)',
        meaning:
          'The browser’s live, tree-shaped model of the page. JavaScript changes what you see by finding elements in this tree and editing them, which is exactly what jQuery makes shorter to write.',
      },
      {
        term: 'AJAX',
        meaning:
          'Sending or fetching data in the background without reloading the page, like submitting a form and seeing “Thanks!” appear in place.',
      },
    ],
    howWeKnow: 'The page loads a jquery.js or jquery.min.js file, the library’s standard file names.',
  },
  {
    detection: 'Font Awesome',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Font Awesome',
        role: 'Icon library delivered as a web font or SVGs',
        beginnerNote:
          'Font Awesome provides thousands of ready-made icons (home, cart, social logos) that you add with a class name. Because icons behave like text, you can resize and recolor them with ordinary CSS.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-fontawesome-icons',
        title: 'Adding Font Awesome icons',
        file: 'index.html',
        language: 'HTML',
        explanation:
          'One stylesheet loads the free icon set. Each icon is an empty <i> tag whose classes pick the style (fa-solid, fa-regular, fa-brands) and the icon (fa-house). Extra classes change size or add a spin. aria-hidden hides decorative icons from screen readers, while icon-only buttons get an aria-label so they still make sense.',
        code: `<!-- Load Font Awesome's free icons: one CSS file plus the font files it points to -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<nav class="toolbar">
  <!-- Each icon is an empty <i> tag: classes choose the style and the icon -->
  <a href="/"><i class="fa-solid fa-house" aria-hidden="true"></i> Home</a>
  <a href="/cart"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> Cart</a>

  <!-- Icon-only buttons need a label for screen readers -->
  <button type="button" aria-label="Favourites">
    <i class="fa-regular fa-heart" aria-hidden="true"></i>
  </button>

  <!-- Brand logos have their own style; fa-lg and fa-spin change size and motion -->
  <a href="https://github.com/" aria-label="GitHub"><i class="fa-brands fa-github fa-lg" aria-hidden="true"></i></a>
  <span><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading…</span>
</nav>

<style>
  /* Icons behave like text, so color and font-size style them */
  .toolbar i { color: #1e3a8a; }
</style>`,
      },
    ],
    concepts: [
      {
        term: 'Icon font',
        meaning:
          'A font whose “letters” are pictures instead of characters. The browser draws icons the same way it draws text, so they stay sharp at any size and take their color from CSS.',
      },
    ],
    howWeKnow:
      'The page loads Font Awesome’s stylesheet or kit script (for example all.min.css, or a script from kit.fontawesome.com or use.fontawesome.com) and uses icon tags such as <i class="fa-solid fa-house">.',
  },
  {
    detection: 'Google Fonts',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Google Fonts',
        role: 'Free library of web fonts served from Google’s servers',
        beginnerNote:
          'Computers only come with a handful of fonts. Google Fonts lets a site use hundreds of free typefaces by linking to a stylesheet; visitors’ browsers download the font files the first time they visit.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-google-fonts',
        title: 'Loading and using Google Fonts',
        file: 'index.html',
        language: 'HTML',
        explanation:
          'The preconnect links let the browser start connecting to Google’s font servers early. The stylesheet link asks for two families, Inter in weights 400 to 700 and Playfair Display in bold, and display=swap shows a fallback font immediately, then swaps in the web font once it arrives. In CSS, the fonts after the comma are backups if the web font is not available yet.',
        code: `<!-- Start connecting to Google's font servers early so text appears sooner -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Two families: Inter (weights 400 to 700) and Playfair Display (bold) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

<style>
  body {
    /* Fallback fonts after the comma are used until Inter has loaded */
    font-family: 'Inter', system-ui, sans-serif;
  }

  h1, h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
  }
</style>

<h1>Welcome to the Campus Café</h1>
<p>This paragraph uses Inter, and the heading above uses Playfair Display.</p>`,
      },
    ],
    concepts: [
      {
        term: 'Web font',
        meaning:
          'A font file the browser downloads along with the page, so the site looks the same even if the visitor does not have that font installed. It costs an extra download, which is why sites limit how many they use.',
      },
    ],
    howWeKnow:
      'The page links to fonts.googleapis.com, the address Google Fonts uses to serve its font stylesheets (the font files themselves come from fonts.gstatic.com).',
  },
];
