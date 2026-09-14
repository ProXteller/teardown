/**
 * Framework packs for back-end frameworks & servers, hosting / CDN / cloud providers and third-party services.
 * Each pack teaches what a detected technology is, how the scan could tell, and (where it helps) what code or
 * configuration built with it looks like. Infrastructure packs often have no code: a concept teaches more.
 *
 * Notes for editors:
 * - Code snippets pass through the builder's {{placeholder}} filler, so template syntax in snippets must never
 *   use a bare placeholder key ({{ name }}, {{ domain }}, {{ brand }}, {{ accent }}, {{ tagline }}, {{ frontend }}, {{ hosting }}).
 * - Snippets live in template literals: backslashes are doubled (\\) and backticks / dollar-braces are escaped.
 */

import type { FrameworkPack } from './types';

export const BACKEND_PACKS: FrameworkPack[] = [
  /* ------------------------------------------------------------------ */
  /* Back-end frameworks & servers                                       */
  /* ------------------------------------------------------------------ */
  {
    detection: 'PHP',
    stackItems: [
      {
        layer: 'Backend',
        name: 'PHP',
        role: 'Server-side language that builds web pages when they are requested',
        beginnerNote:
          'PHP code runs on the web server, never in your browser. When a page is requested, PHP can read from a database, mix the results into HTML and send back a finished page. WordPress, Laravel and a large share of the web are written in it.',
      },
    ],
    language: { name: 'PHP', usedFor: 'Server-side code that builds pages, handles forms and talks to the database' },
    files: [
      { path: 'public/index.php', note: 'Front controller: the web server sends every request to this one file, which decides what to show' },
      { path: 'composer.json', note: 'Lists the PHP libraries the project uses; the Composer tool installs them into vendor/' },
    ],
    code: [
      {
        id: 'fw-php-page',
        title: 'A PHP page that reads from a database',
        file: 'public/products.php',
        language: 'PHP',
        explanation:
          'Everything between <?php and ?> runs on the server; the rest is plain HTML sent to the browser. The page asks the database for products in a category using a prepared statement, which keeps the visitor’s input separate from the SQL so nobody can inject their own commands. session_start() gives the visitor a PHPSESSID cookie so PHP can remember them on the next request, and htmlspecialchars() makes sure text from the database is shown as text, never run as HTML or JavaScript.',
        code: `<?php
// Runs on the server each time someone visits /products.php?category=shoes

// Connect to the database (real apps keep these settings in a config file)
$pdo = new PDO('mysql:host=localhost;dbname=shop;charset=utf8mb4', 'shop_user', getenv('DB_PASSWORD') ?: '');

// A prepared statement keeps visitor input separate from the SQL, which blocks SQL injection
$category = $_GET['category'] ?? 'shoes';
$stmt = $pdo->prepare('SELECT name, price FROM products WHERE category = ? ORDER BY name');
$stmt->execute([$category]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Gives the visitor a PHPSESSID cookie so PHP can remember them between requests
session_start();
$_SESSION['last_category'] = $category;
?>
<!doctype html>
<html>
  <body>
    <!-- htmlspecialchars() shows text safely, so nobody can sneak a <script> into the page -->
    <h1>Products: <?= htmlspecialchars($category) ?></h1>
    <ul>
      <?php foreach ($products as $product): ?>
        <li><?= htmlspecialchars($product['name']) ?> costs $<?= number_format((float) $product['price'], 2) ?></li>
      <?php endforeach; ?>
    </ul>
  </body>
</html>`,
      },
    ],
    concepts: [
      {
        term: 'Request–response cycle',
        meaning:
          'The browser sends a request, the server runs code and sends back a response, and then the conversation is over. Like ordering at a counter: each order is handled on its own, so the server needs extra tricks (like cookies) to remember you.',
      },
      {
        term: 'Session cookie',
        meaning:
          'A small ID the server stores in your browser, such as PHPSESSID. Your browser sends it back with every request, so the server can look up “this is the same person who logged in a minute ago”, like a coat-check ticket.',
      },
    ],
    howWeKnow:
      'One of these clues showed up: the server’s x-powered-by header mentions PHP (PHP adds it unless it is switched off), the site set a PHPSESSID cookie (the default name for PHP’s session cookie), or we found Laravel, which is written in PHP.',
  },
  {
    detection: 'Laravel',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Laravel',
        role: 'PHP web framework with routing, database models, templates and logins built in',
        beginnerNote:
          'Writing every page in plain PHP gets messy fast. Laravel gives a project a clear structure: routes decide which code handles each URL, controllers hold the logic, Eloquent models talk to the database and Blade templates produce the HTML.',
      },
    ],
    language: { name: 'PHP', usedFor: 'Laravel routes, controllers, models and Blade templates' },
    files: [
      { path: 'routes/web.php', note: 'Maps URLs like /posts to the controller methods that handle them' },
      { path: 'app/Http/Controllers/PostController.php', note: 'Controller: receives a request, does the work and returns a page or redirect' },
      { path: 'app/Models/Post.php', note: 'Eloquent model: a PHP class that represents the posts table' },
      { path: 'resources/views/posts/index.blade.php', note: 'Blade template that turns the list of posts into HTML' },
      { path: 'database/migrations/2025_01_01_000000_create_posts_table.php', note: 'Migration: code that creates the posts table, so every copy of the database matches' },
    ],
    code: [
      {
        id: 'fw-laravel-controller',
        title: 'A Laravel controller with Eloquent and validation',
        file: 'app/Http/Controllers/PostController.php',
        language: 'PHP (Laravel)',
        explanation:
          'The routes file points GET /posts at index() and POST /posts at store(). In index(), Eloquent builds the SQL for you: published posts, newest first, 20 per page, with each post’s author loaded in the same trip. In store(), validate() checks the form; if something is missing Laravel automatically sends the user back with error messages. The auth middleware on the route means only logged-in users can reach store() at all.',
        code: `<?php
// routes/web.php connects URLs to these methods:
//   Route::get('/posts', [PostController::class, 'index']);
//   Route::post('/posts', [PostController::class, 'store'])->middleware('auth');
namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    public function index()
    {
        // Eloquent writes the SQL: published posts, newest first, 20 per page, authors loaded too
        $posts = Post::with('author')->where('published', true)->latest()->paginate(20);

        return view('posts.index', ['posts' => $posts]); // resources/views/posts/index.blade.php
    }

    public function store(Request $request)
    {
        // If a rule fails, Laravel sends the user back to the form with error messages
        $data = $request->validate(['title' => 'required|string|max:255', 'body' => 'required|string']);

        $post = $request->user()->posts()->create($data);

        return redirect("/posts/{$post->id}")->with('status', 'Post published!');
    }
}`,
      },
    ],
    concepts: [
      {
        term: 'ORM (object-relational mapper)',
        meaning:
          'A translator between your code and the database. Instead of writing SQL by hand you write Post::where(\'published\', true)->get(), and the ORM turns it into SQL and hands back ready-to-use objects.',
      },
      {
        term: 'Database migration',
        meaning:
          'A small file of code that changes the database structure, such as “create a posts table”. Migrations are saved in version control and run in order, so every developer’s laptop and the live server end up with the same tables.',
      },
    ],
    howWeKnow:
      'The site set a cookie called laravel_session. Laravel gives its session cookie that name by default (it is built from the app name, which most projects leave as “Laravel”).',
  },
  {
    detection: 'Ruby on Rails',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Ruby on Rails',
        role: 'Full-stack Ruby web framework known for building apps quickly with sensible defaults',
        beginnerNote:
          'Rails (first released in 2004) comes with everything a database-backed website needs: routing, database models, HTML templates, background jobs and security protections. It follows strong naming conventions, so a lot of code you would normally write is filled in for you.',
      },
    ],
    language: { name: 'Ruby', usedFor: 'Rails controllers, models, views and background jobs' },
    files: [
      { path: 'config/routes.rb', note: 'Maps URLs to controller actions; resources :articles creates all the standard ones' },
      { path: 'app/controllers/articles_controller.rb', note: 'Controller: handles requests for articles' },
      { path: 'app/models/article.rb', note: 'Active Record model: a Ruby class tied to the articles table' },
      { path: 'app/views/articles/index.html.erb', note: 'ERB template: HTML with Ruby mixed in to list the articles' },
      { path: 'app/views/layouts/application.html.erb', note: 'Page shell; its csrf_meta_tags helper adds the csrf-param meta tag the scan found' },
    ],
    code: [
      {
        id: 'fw-rails-controller',
        title: 'A Rails controller for articles',
        file: 'app/controllers/articles_controller.rb',
        language: 'Ruby (Rails)',
        explanation:
          'Notice how little is spelled out. Because the class is ArticlesController, the index action automatically renders app/views/articles/index.html.erb, and instance variables like @articles are available inside that template. Article.find raises an error for a missing id, which Rails turns into a 404 page. Strong parameters (article_params) only allow the title and body through, so a sneaky extra form field cannot change anything else.',
        code: `# app/controllers/articles_controller.rb
# config/routes.rb has one line, resources :articles, which creates the standard URLs below
class ArticlesController < ApplicationController
  # GET /articles → Rails automatically renders app/views/articles/index.html.erb
  def index
    @articles = Article.where(published: true).order(created_at: :desc).limit(20)
  end

  # GET /articles/42 → a missing id automatically becomes a 404 page
  def show
    @article = Article.find(params[:id])
  end

  # POST /articles (the "new article" form submits here)
  def create
    @article = Article.new(article_params)
    if @article.save
      redirect_to @article, notice: "Article published!"
    else
      render :new, status: 422 # show the form again, with error messages
    end
  end

  private

  # Strong parameters: only accept the fields we expect from the form
  def article_params
    params.require(:article).permit(:title, :body)
  end
end`,
      },
    ],
    concepts: [
      {
        term: 'MVC (Model–View–Controller)',
        meaning:
          'A way of splitting an app into three jobs. Models handle data, views handle what the page looks like, and controllers sit in between deciding what to do with each request, like a waiter (controller) taking your order to the kitchen (model) and bringing back a plated dish (view).',
      },
      {
        term: 'Convention over configuration',
        meaning:
          'If you follow the framework’s naming rules, it wires things together for you. Name a model Article and Rails assumes the table is called articles, with no settings file needed.',
      },
    ],
    howWeKnow:
      'The page has a <meta name="csrf-param" content="authenticity_token"> tag. Rails’ csrf_meta_tags helper adds exactly this so JavaScript can send the anti-forgery token with its requests, and authenticity_token is the Rails name for it.',
  },
  {
    detection: 'Django',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Django',
        role: 'Python web framework with a database ORM, templates, logins and an admin site built in',
        beginnerNote:
          'Django was built at a newspaper to publish stories on tight deadlines, and it is famous for being “batteries included”: user accounts, forms, security protections and a ready-made admin dashboard all come in the box, so you mostly write your own models and views.',
      },
    ],
    language: { name: 'Python', usedFor: 'Django models, views, forms and URL configuration' },
    files: [
      { path: 'blog/models.py', note: 'Python classes that Django turns into database tables' },
      { path: 'blog/views.py', note: 'View functions: take a request, return a response' },
      { path: 'blog/urls.py', note: 'Maps URL patterns like posts/<slug>/ to views' },
      { path: 'blog/templates/blog/post_list.html', note: 'Django template that renders the list of posts as HTML' },
      { path: 'mysite/settings.py', note: 'Project settings: installed apps, database connection, security options' },
    ],
    code: [
      {
        id: 'fw-django-views',
        title: 'Django views for a blog',
        file: 'blog/views.py',
        language: 'Python (Django)',
        explanation:
          'Each view is a normal Python function that receives the request and returns a response. Post.objects.filter(...) is Django’s ORM writing the SQL for you, and render() fills an HTML template with the data. get_object_or_404 shows a “not found” page instead of crashing, and @login_required sends logged-out visitors to the login page. When the form template includes {% csrf_token %}, Django adds a hidden csrfmiddlewaretoken field that proves the form really came from this site.',
        code: `# blog/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from .forms import PostForm
from .models import Post


def post_list(request):
    # The ORM turns this into SQL: the 20 newest published posts
    posts = Post.objects.filter(published=True).order_by("-created_at")[:20]
    return render(request, "blog/post_list.html", {"posts": posts})


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, published=True)  # missing post → 404 page
    return render(request, "blog/post_detail.html", {"post": post})


@login_required  # visitors who are not logged in are sent to the login page
def post_create(request):
    form = PostForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        post = form.save(commit=False)
        post.author = request.user
        post.save()
        return redirect("post_detail", slug=post.slug)
    # The template's {% csrf_token %} tag adds the hidden csrfmiddlewaretoken field
    return render(request, "blog/post_form.html", {"form": form})`,
      },
    ],
    concepts: [
      {
        term: 'CSRF protection',
        meaning:
          'CSRF (cross-site request forgery) is when a sneaky website makes your browser submit a form to another site you are logged in to. Frameworks stop it by putting a secret token in their own forms and rejecting any submission that does not include it.',
      },
      {
        term: 'Batteries included',
        meaning:
          'A framework that ships with most things a typical app needs, such as logins, an admin panel, forms and database tools, instead of making you pick and connect separate libraries for each.',
      },
    ],
    howWeKnow:
      'The site set a cookie named csrftoken, or its forms include a hidden field called csrfmiddlewaretoken. Both are the default names Django uses for its protection against forged form submissions.',
  },
  {
    detection: 'ASP.NET',
    stackItems: [
      {
        layer: 'Backend',
        name: 'ASP.NET',
        role: 'Microsoft’s web framework for building sites and APIs in C# on .NET',
        beginnerNote:
          'ASP.NET lets developers write server code in C#, a strongly typed language that is compiled before it runs. The older ASP.NET Framework only runs on Windows; the modern ASP.NET Core is open source, very fast, and runs on Windows, Linux and macOS.',
      },
    ],
    language: { name: 'C#', usedFor: 'ASP.NET controllers, APIs, Razor pages and business logic' },
    files: [
      { path: 'Program.cs', note: 'Starts the web app: registers services, middleware and endpoints' },
      { path: 'appsettings.json', note: 'Settings such as database connection strings and logging levels' },
      { path: 'Pages/Index.cshtml', note: 'Razor page: HTML mixed with C# for server-rendered pages' },
      { path: 'MyShop.csproj', note: 'Project file listing the .NET version and NuGet packages' },
    ],
    code: [
      {
        id: 'fw-aspnet-minimal-api',
        title: 'An ASP.NET Core web API',
        file: 'Program.cs',
        language: 'C# (ASP.NET Core)',
        explanation:
          'This is the “minimal API” style of ASP.NET Core. MapGet and MapPost connect a URL and HTTP method to a function. ASP.NET Core reads the {id:int} part of the URL, turns JSON request bodies into Product objects, and hands in the ProductStore service automatically because it was registered at the top. Because C# is strongly typed, mistakes like passing text where a number belongs are caught before the app even runs.',
        code: `// Program.cs: a small ASP.NET Core web API
using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<ProductStore>(); // one shared store, handed to endpoints automatically
var app = builder.Build();
app.UseHttpsRedirection(); // send http:// visitors to https://

// GET /api/products/42 → the product as JSON, or 404 if it does not exist
app.MapGet("/api/products/{id:int}", (int id, ProductStore store) =>
    store.Find(id) is Product product ? Results.Ok(product) : Results.NotFound());

// POST /api/products with a JSON body → ASP.NET Core turns the JSON into a Product
app.MapPost("/api/products", (Product product, ProductStore store) =>
{
    store.Add(product);
    return Results.Created($"/api/products/{product.Id}", product);
});

app.Run();

// A record is a compact C# type for plain data
public record Product(int Id, string Name, decimal Price);

public class ProductStore
{
    private readonly ConcurrentDictionary<int, Product> _items = new();
    public Product? Find(int id) => _items.TryGetValue(id, out var product) ? product : null;
    public void Add(Product product) => _items[product.Id] = product;
}`,
      },
    ],
    concepts: [
      {
        term: 'Static typing',
        meaning:
          'Every variable has a fixed type (number, text, Product…) that is checked before the program runs. It is like a form that will not let you type letters into the phone-number box: some bugs are caught instantly instead of by users.',
      },
      {
        term: 'View state',
        meaning:
          'In the older ASP.NET Web Forms, the page remembers what was on screen by packing it into a hidden form field called __VIEWSTATE, which travels to the server and back with every click. Modern frameworks usually avoid it because it makes pages heavier.',
      },
    ],
    howWeKnow:
      'One of these clues showed up: an x-powered-by header saying ASP.NET, an x-aspnet-version header, a session cookie named ASP.NET_SessionId or starting with .AspNetCore., or a hidden __VIEWSTATE form field, which only ASP.NET Web Forms pages have.',
  },
  {
    detection: 'Express (Node.js)',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Express (Node.js)',
        role: 'Minimal web framework for building servers and APIs in JavaScript on Node.js',
        beginnerNote:
          'Node.js lets JavaScript run on a server instead of in a browser. Express sits on top and makes the common jobs easy: “when someone sends GET /api/todos, run this function”. It is small on purpose, so developers add only the pieces they need.',
      },
    ],
    language: { name: 'JavaScript', usedFor: 'Node.js server code with Express (often written in TypeScript first)' },
    files: [
      { path: 'server.js', note: 'Creates the Express app, adds middleware and starts listening on a port' },
      { path: 'routes/todos.js', note: 'A router grouping all the /api/todos endpoints' },
      { path: 'middleware/requireLogin.js', note: 'Middleware that blocks requests from users who are not logged in' },
      { path: 'package.json', note: 'Lists express and other dependencies, plus the npm start script' },
    ],
    code: [
      {
        id: 'fw-express-api',
        title: 'A small Express API',
        file: 'server.js',
        language: 'JavaScript (Node.js)',
        explanation:
          'app.get and app.post connect a URL and HTTP method to a handler function that receives the request (req) and a response object (res) to reply with. app.use adds middleware: functions that run on every request before the handlers, here one that reads JSON bodies and one that logs each request and then calls next() to pass control along. Express adds an X-Powered-By: Express header by default, which is exactly the kind of clue a scan can spot.',
        code: `// server.js: a small Express web server
const express = require('express');

const app = express();
app.use(express.json()); // middleware: turns JSON request bodies into JavaScript objects

// Middleware can do anything before the route handlers run, like logging
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // hand the request to the next middleware or route
});

const todos = [{ id: 1, text: 'Learn Express', done: false }];

// GET /api/todos → send the list back as JSON
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos with { "text": "..." } → add a todo
app.post('/api/todos', (req, res) => {
  const text = req.body?.text;
  if (!text) return res.status(400).json({ error: 'text is required' });

  const todo = { id: todos.length + 1, text, done: false };
  todos.push(todo);
  res.status(201).json(todo); // 201 means "created"
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));`,
      },
    ],
    concepts: [
      {
        term: 'Middleware',
        meaning:
          'Functions that every request passes through on its way to your code, like checkpoints at an airport: one checks your ticket (login), one scans your bag (reads the body), one writes you in the log. Each can let the request continue or stop it.',
      },
      {
        term: 'Non-blocking I/O',
        meaning:
          'While Node.js waits for slow things like a database or a file, it keeps serving other requests instead of standing still. It is like a chef who puts pasta on to boil and chops salad meanwhile, so one server can juggle thousands of connections.',
      },
    ],
    howWeKnow:
      'The response had an x-powered-by: Express header. Express adds it to every response unless the developer turns it off with app.disable(\'x-powered-by\').',
  },
  {
    detection: 'nginx',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'nginx',
        role: 'High-performance web server, reverse proxy and load balancer',
        beginnerNote:
          'nginx (say “engine-x”) usually stands at the front door of a website. It hands out ready-made files like images and CSS very quickly, handles HTTPS, and forwards everything else to the app server running behind it. It can juggle huge numbers of connections with very little memory.',
      },
    ],
    files: [{ path: 'deploy/nginx.conf', note: 'nginx settings: domains, HTTPS certificates, caching and where to forward requests' }],
    code: [
      {
        id: 'fw-nginx-server-block',
        title: 'An nginx server block in front of an app',
        file: 'deploy/nginx.conf',
        language: 'nginx config',
        explanation:
          'Each server block describes one website. The first one catches plain http:// visits and redirects them to HTTPS. The second handles HTTPS: it serves anything under /assets/ straight from disk with a long cache time, and passes every other request to the application running on port 3000 (for example a Node.js, Python or PHP app). The proxy_set_header lines tell the app the original domain, visitor IP and protocol, which it would otherwise lose.',
        code: `# One "server block" per site. First: send plain HTTP visitors to HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Built files (images, CSS, JS) come straight from disk and are cached for a year
    location /assets/ {
        root /var/www/example;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Everything else is forwarded to the app server running on port 3000
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
      },
    ],
    concepts: [
      {
        term: 'Reverse proxy',
        meaning:
          'A server that receives visitors’ requests and passes them on to other servers hidden behind it, like a receptionist who takes every call and forwards it to the right desk. It can add HTTPS, caching and protection without the app knowing.',
      },
      {
        term: 'Load balancing',
        meaning:
          'Spreading incoming requests across several copies of an app so no single server gets overwhelmed, like opening more checkout lanes when the store gets busy.',
      },
    ],
    howWeKnow:
      'The response’s server header says nginx. Web servers announce their name in this header by default; many sites leave it on, sometimes with the version number removed.',
  },
  {
    detection: 'Apache HTTP Server',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Apache HTTP Server',
        role: 'Long-running, open-source web server that is extended with modules',
        beginnerNote:
          'Apache has served websites since 1995 and is still one of the most used web servers. Its features come as modules you switch on (HTTPS, URL rewriting, compression), and per-folder .htaccess files let apps like WordPress set their own rules without touching the main configuration.',
      },
    ],
    files: [{ path: 'public/.htaccess', note: 'Per-folder Apache rules, such as sending all URLs to index.php for pretty links' }],
    code: [
      {
        id: 'fw-apache-vhost',
        title: 'An Apache virtual host for a PHP site',
        file: '/etc/apache2/sites-available/example.conf',
        language: 'Apache config',
        explanation:
          'A single Apache server can host many websites; each VirtualHost block describes one. The first redirects plain HTTP to HTTPS. The second points the domain at a folder of files (DocumentRoot), turns on HTTPS with a certificate, allows .htaccess files in that folder, and hands any .php file to PHP-FPM, a separate program that runs PHP code and returns the HTML.',
        code: `# /etc/apache2/sites-available/example.conf: one "virtual host" per website
<VirtualHost *:80>
    ServerName example.com
    # Send every plain-HTTP visitor to the HTTPS version
    Redirect permanent / https://example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName example.com
    DocumentRoot /var/www/example/public

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

    <Directory /var/www/example/public>
        # Let .htaccess files in this folder add their own rules (WordPress and Laravel rely on this)
        AllowOverride All
        Require all granted
    </Directory>

    # Hand .php files to PHP-FPM, a separate program that runs PHP code
    <FilesMatch "\\.php$">
        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog \${APACHE_LOG_DIR}/example-error.log
    CustomLog \${APACHE_LOG_DIR}/example-access.log combined
</VirtualHost>`,
      },
    ],
    concepts: [
      {
        term: 'Virtual host',
        meaning:
          'Running many websites on one server. The browser says which domain it wants in the Host header, and the server picks the matching site, like one apartment building with many numbered doors.',
      },
    ],
    howWeKnow:
      'The response’s server header says Apache. Apache adds this header by default, and it often includes the version and operating system too unless the server is configured to hide them.',
  },
  {
    detection: 'Microsoft IIS',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Microsoft IIS',
        role: 'Microsoft’s web server for Windows Server, often hosting ASP.NET apps',
        beginnerNote:
          'IIS (Internet Information Services) comes built into Windows Server. Companies that run on Microsoft technology use it to serve websites and run ASP.NET applications, managing it through a graphical console or web.config files.',
      },
    ],
    files: [{ path: 'web.config', note: 'XML settings IIS reads from the site folder: handlers, redirects and headers' }],
    code: [
      {
        id: 'fw-iis-webconfig',
        title: 'A web.config for an ASP.NET Core app on IIS',
        file: 'web.config',
        language: 'XML (IIS config)',
        explanation:
          'IIS reads web.config from the site’s folder. The handlers section sends every request to the ASP.NET Core Module, which runs the compiled .NET app. The rewrite rule (from IIS’s URL Rewrite add-on) redirects http:// visitors to https://, and the customHeaders section removes the X-Powered-By header so the server gives away a little less about itself.',
        code: `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <!-- Send every request to the ASP.NET Core Module, which runs the .NET app -->
    <handlers>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
    </handlers>
    <aspNetCore processPath="dotnet" arguments=".\\MyShop.dll" stdoutLogEnabled="false" hostingModel="inprocess" />

    <!-- URL Rewrite (an IIS add-on): redirect http:// visitors to https:// -->
    <rewrite>
      <rules>
        <rule name="Redirect to HTTPS" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{HTTPS}" pattern="off" ignoreCase="true" />
          </conditions>
          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
        </rule>
      </rules>
    </rewrite>

    <!-- Stop advertising "X-Powered-By: ASP.NET" on every response -->
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`,
      },
    ],
    concepts: [
      {
        term: 'Server fingerprinting',
        meaning:
          'Working out what software a website runs from the clues it leaves, such as a server: Microsoft-IIS/10.0 header. It is exactly what this scan does. Many teams hide these headers so attackers cannot easily look up known weaknesses for that version.',
      },
    ],
    howWeKnow:
      'The response’s server header says Microsoft-IIS, usually followed by a version number such as 10.0. IIS sends this header by default.',
  },
  {
    detection: 'Envoy proxy',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Envoy proxy',
        role: 'Open-source proxy that routes, balances and monitors traffic between services',
        beginnerNote:
          'Big apps are often split into many small services that constantly call each other. Envoy, first built at Lyft, sits next to each service or at the edge and handles the networking: sending requests to healthy copies, retrying failures, encrypting traffic and recording how long everything takes.',
      },
    ],
    files: [{ path: 'envoy.yaml', note: 'Listeners (ports to accept traffic on), routes, and clusters (groups of servers to send it to)' }],
    code: [],
    concepts: [
      {
        term: 'Service mesh',
        meaning:
          'A layer of small proxies, one beside each service, that handles all traffic between services: retries, timeouts, encryption and metrics. Developers write business logic and the mesh takes care of the plumbing. Istio is a popular mesh built on Envoy.',
      },
      {
        term: 'Microservices',
        meaning:
          'Building one big app as many small programs, each owning one job (payments, search, notifications) and talking over the network. Teams can update their piece independently, at the cost of more moving parts to manage.',
      },
    ],
    howWeKnow:
      'The server header says envoy, or the response includes x-envoy-upstream-service-time, a header Envoy adds to report how many milliseconds the service behind it took to answer.',
  },
  {
    detection: 'Varnish',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Varnish',
        role: 'Caching reverse proxy that stores copies of pages to serve them instantly',
        beginnerNote:
          'Building a page can take a server hundreds of milliseconds. Varnish sits in front, keeps a copy of each response in memory, and hands that copy to the next visitors in a fraction of the time, so the real server only works when something changes or a copy expires.',
      },
    ],
    files: [{ path: 'default.vcl', note: 'Varnish rules, written in VCL, deciding what to cache and for how long' }],
    code: [
      {
        id: 'fw-varnish-vcl',
        title: 'Varnish caching rules in VCL',
        file: 'default.vcl',
        language: 'VCL (Varnish)',
        explanation:
          'VCL is Varnish’s small configuration language with hooks for each stage of a request. vcl_recv runs when a request arrives: here it removes cookies from images, CSS and JS so one cached copy can be shared by everyone. vcl_backend_response runs when the real server answers and sets how long to keep the copy (its TTL). vcl_deliver runs just before sending, and adds a header showing how many times this cached copy has been reused.',
        code: `vcl 4.1;

# The "backend" is the real web server that Varnish sits in front of
backend default {
    .host = "127.0.0.1";
    .port = "8080";
}

sub vcl_recv {
    # Images, CSS and JS are the same for everyone: drop cookies so they can be cached
    if (req.url ~ "\\.(png|jpe?g|webp|svg|css|js)(\\?.*)?$") {
        unset req.http.Cookie;
    }
}

sub vcl_backend_response {
    # How long to keep a copy: static files for a day, everything else for 2 minutes
    if (bereq.url ~ "\\.(png|jpe?g|webp|svg|css|js)(\\?.*)?$") {
        set beresp.ttl = 1d;
    } else {
        set beresp.ttl = 2m;
    }
}

sub vcl_deliver {
    # How many times this cached copy has been reused (0 means it was just fetched)
    set resp.http.X-Cache-Hits = obj.hits;
}`,
      },
    ],
    concepts: [
      {
        term: 'Cache hit and cache miss',
        meaning:
          'A hit means the cache already had a copy and answered instantly; a miss means it had to ask the real server first. Like a library: a hit is the book on the shelf, a miss is waiting while it is ordered from another branch.',
      },
      {
        term: 'TTL (time to live)',
        meaning:
          'How long a cached copy may be reused before it is considered stale and fetched again. A short TTL keeps content fresh; a long TTL makes the site faster and cheaper to run.',
      },
    ],
    howWeKnow:
      'The response includes an x-varnish header. Varnish adds it with a request ID, and on a cache hit it shows two IDs: this request’s and the one that originally stored the copy.',
  },
  {
    detection: 'Proxygen (Meta)',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Proxygen',
        role: 'Meta’s open-source C++ HTTP library, used to build its high-traffic web servers and load balancers',
        beginnerNote:
          'Proxygen is a set of C++ building blocks for speaking HTTP/1.1, HTTP/2 and HTTP/3. Meta open-sourced it in 2014 and uses it in the servers that first receive visitors’ connections and pass them to the right data center and service.',
      },
    ],
    language: { name: 'C++', usedFor: 'High-performance networking and server infrastructure' },
    files: [],
    code: [],
    concepts: [
      {
        term: 'Layer 7 load balancer',
        meaning:
          'A load balancer that understands HTTP itself (URLs, headers, cookies), not just raw network packets. That lets it make smart choices, like sending /video requests to video servers and everything else to web servers.',
      },
    ],
    howWeKnow:
      'The response’s server header says proxygen. That name is used by Meta’s edge servers built on the Proxygen library, so it strongly suggests the site runs on Meta’s infrastructure.',
  },

  /* ------------------------------------------------------------------ */
  /* Hosting, CDN & cloud                                                */
  /* ------------------------------------------------------------------ */
  {
    detection: 'Cloudflare',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Cloudflare',
        role: 'CDN, DNS and security network that sits in front of the website',
        beginnerNote:
          'Visitors do not connect to the site’s own servers directly; they reach the nearest of Cloudflare’s data centers around the world. Cloudflare serves cached files from there, blocks attacks and bots, and only passes the remaining requests on to the real servers. Its Workers product can also run code at those locations.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-cloudflare-worker',
        title: 'A Cloudflare Worker running at the edge',
        file: 'src/worker.js',
        language: 'JavaScript (Cloudflare Workers)',
        explanation:
          'A Worker is a small JavaScript program that runs in Cloudflare’s data centers, close to each visitor, before a request reaches the website’s servers. Its fetch function receives the request and returns a response. Here it answers one API route instantly using location details Cloudflare already knows (request.cf), redirects old links, and forwards everything else to the origin while adding a security header on the way back.',
        code: `// src/worker.js: runs in Cloudflare's data centers, close to each visitor
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Answer some requests right at the edge, without bothering the origin server
    if (url.pathname === '/api/where-am-i') {
      // request.cf holds details Cloudflare knows about the visitor's connection
      return Response.json({ country: request.cf?.country, city: request.cf?.city });
    }

    // 2. Redirect old links before they ever reach the origin
    if (url.pathname.startsWith('/old-blog/')) {
      url.pathname = url.pathname.replace('/old-blog/', '/blog/');
      return Response.redirect(url.toString(), 301);
    }

    // 3. Everything else: pass the request to the origin server, then adjust the response
    const originResponse = await fetch(request);
    const response = new Response(originResponse.body, originResponse); // copy so headers can change
    response.headers.set('X-Frame-Options', 'DENY');
    return response;
  },
};`,
      },
    ],
    concepts: [
      {
        term: 'DDoS attack',
        meaning:
          'A distributed denial-of-service attack floods a site with fake traffic from thousands of machines so real visitors cannot get in, like a mob blocking a shop door. Networks like Cloudflare absorb and filter that traffic before it reaches the site.',
      },
      {
        term: 'Edge computing',
        meaning:
          'Running code in data centers spread around the world, close to users, instead of in one central location. A visitor in Tokyo is answered from Tokyo, so responses arrive faster.',
      },
    ],
    howWeKnow:
      'The response has a cf-ray header, a unique ID Cloudflare stamps on every request it handles (ending in a code for the data center, like -LAX), or its server header simply says cloudflare.',
  },
  {
    detection: 'Vercel',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Vercel',
        role: 'Hosting platform for front-end frameworks with a global edge network and serverless functions',
        beginnerNote:
          'Vercel, the company behind Next.js, builds a site automatically every time code is pushed to Git and spreads it across its worldwide network. Static files are served from the edge, and small back-end functions spin up only when they are called, so there are no servers for the team to manage.',
      },
    ],
    files: [
      { path: 'vercel.json', note: 'Optional project settings: redirects, headers, rewrites and function options' },
      { path: 'api/subscribe.js', note: 'A serverless function: each file in api/ becomes its own URL' },
    ],
    code: [
      {
        id: 'fw-vercel-function',
        title: 'A Vercel serverless function',
        file: 'api/subscribe.js',
        language: 'JavaScript (Vercel Functions)',
        explanation:
          'On Vercel, a file in the api/ folder becomes a back-end endpoint at the matching URL, here /api/subscribe. Exporting a function named POST means it handles POST requests. It uses the standard Request and Response objects from the browser world, reads a secret API key from an environment variable set in the Vercel dashboard, and returns JSON. Vercel runs it on demand and scales it automatically.',
        code: `// api/subscribe.js
// On Vercel, each file in api/ becomes a serverless function at that URL: /api/subscribe
// It only runs when called, and Vercel starts more copies automatically when traffic grows.

export async function POST(request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Please send a valid email' }, { status: 400 });
  }

  // Secrets are set in the Vercel dashboard and arrive as environment variables
  const res = await fetch('https://api.example.com/v1/contacts', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.MAIL_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Could not subscribe right now' }, { status: 502 });
  }
  return Response.json({ ok: true }, { status: 201 });
}`,
      },
    ],
    concepts: [
      {
        term: 'Serverless function',
        meaning:
          'A small piece of back-end code that the hosting platform runs only when a request arrives. There are still servers, but you never set them up or keep them running, like using a taxi instead of owning a car.',
      },
      {
        term: 'Preview deployment',
        meaning:
          'A private, working copy of the site built for every proposed change (each pull request) with its own URL, so teammates can click around and review it before it goes live.',
      },
    ],
    howWeKnow:
      'The response has an x-vercel-id header, which Vercel adds to every request it serves (its value usually includes a code for the region that handled the request, such as iad1), or the server header simply says Vercel.',
  },
  {
    detection: 'Netlify',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Netlify',
        role: 'Hosting platform that builds sites from Git and serves them from a global CDN',
        beginnerNote:
          'Connect a Git repository and Netlify runs the build on every push, then publishes the finished files across its content delivery network. It adds conveniences like form handling, redirects, preview links for each change and serverless functions, which suits static and Jamstack sites well.',
      },
    ],
    files: [
      { path: 'netlify.toml', note: 'Build command, output folder, redirects and headers for Netlify' },
      { path: 'netlify/functions/subscribe.js', note: 'A Netlify Function: back-end code that runs on demand' },
    ],
    code: [
      {
        id: 'fw-netlify-toml',
        title: 'Netlify build and redirect settings',
        file: 'netlify.toml',
        language: 'TOML (Netlify config)',
        explanation:
          'netlify.toml lives in the repository, so the hosting setup is saved alongside the code. The build section tells Netlify which command to run and which folder of finished files to publish. Redirect rules are handled by Netlify’s servers before any page loads: the first moves old blog links, the second is the classic single-page-app fallback that serves index.html for unknown paths (status 200 means rewrite quietly, not redirect). The headers rule makes browsers cache built assets for a year.',
        code: `# netlify.toml: how Netlify builds and serves this site
[build]
  command = "npm run build"        # runs on every git push
  publish = "dist"                 # folder of finished files to put on the CDN
  functions = "netlify/functions"  # back-end functions live here

# Old URLs → new URLs, handled by Netlify before any page loads
[[redirects]]
  from = "/old-blog/*"
  to = "/blog/:splat"
  status = 301

# Single-page app: serve index.html for unknown paths so the JavaScript router can handle them
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Built assets have unique file names, so browsers can cache them for a year
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`,
      },
    ],
    concepts: [
      {
        term: 'Jamstack',
        meaning:
          'Building sites as pre-made files (JavaScript, APIs and markup) served from a CDN, instead of building every page on a server for each visit. Dynamic bits like forms and logins are handled by APIs and serverless functions.',
      },
      {
        term: 'Continuous deployment',
        meaning:
          'Every change merged into the main branch is automatically built, tested and put live, with no manual upload step. Shipping becomes routine instead of a stressful event.',
      },
    ],
    howWeKnow:
      'The response has an x-nf-request-id header (nf is short for Netlify), which Netlify adds to every request it serves, or the server header says Netlify.',
  },
  {
    detection: 'Amazon CloudFront',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Amazon CloudFront',
        role: 'Amazon Web Services’ content delivery network (CDN)',
        beginnerNote:
          'CloudFront keeps copies of a site’s files in hundreds of AWS edge locations worldwide, so visitors download them from somewhere nearby. When it does not have a copy yet, it fetches one from the origin, often an S3 bucket or a load balancer, and caches it for the next visitor.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-cloudfront-function',
        title: 'A CloudFront Function that fixes pretty URLs',
        file: 'cloudfront/rewrite-index.js',
        language: 'JavaScript (CloudFront Functions)',
        explanation:
          'CloudFront Functions are tiny JavaScript functions that run at CloudFront’s edge locations on every request, in well under a millisecond. A very common job: a static site stored in S3 has files like about/index.html, but visitors type /about. This function rewrites the request path before CloudFront checks its cache or asks S3, so pretty URLs just work.',
        code: `// A CloudFront Function: tiny JavaScript that runs at the edge on every viewer request.
// It fixes "pretty URLs" for a static site stored in S3.
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    // /blog/ → /blog/index.html
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    // /about → /about/index.html (paths with a dot, like /logo.png, are real files)
    request.uri += '/index.html';
  }

  // Continue to CloudFront's cache and, if needed, the S3 origin
  return request;
}`,
      },
    ],
    concepts: [
      {
        term: 'Origin server',
        meaning:
          'The original source of a website’s files and pages, sitting behind the CDN. The CDN keeps copies; the origin holds the real thing and is only asked when the CDN has no fresh copy.',
      },
    ],
    howWeKnow:
      'The response has an x-amz-cf-id header, a request ID CloudFront adds to every response, or a via header naming a cloudfront.net server.',
  },
  {
    detection: 'Amazon S3',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Amazon S3',
        role: 'AWS object storage for files such as images, videos, backups and static websites',
        beginnerNote:
          'S3 (Simple Storage Service) is like an endless, very reliable hard drive on the internet. Apps store files in “buckets” and read them back by name. A bucket can even serve a whole static website, often with CloudFront in front for speed.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-s3-presigned-upload',
        title: 'Letting users upload straight to S3',
        file: 'server/uploads.js',
        language: 'JavaScript (AWS SDK v3)',
        explanation:
          'Sending big photos through your own server is slow and costly. Instead, the server asks AWS for a presigned URL: a temporary link that allows exactly one upload to one place in the bucket for five minutes. The browser then sends the file directly to S3. The server’s AWS credentials never leave the server, and every file gets a unique key (its name inside the bucket).',
        code: `// server/uploads.js: let a browser upload a photo straight to S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

// Credentials come from the server's environment, never from code or the browser
const s3 = new S3Client({ region: 'us-east-1' });

export async function createUploadUrl(userId, contentType) {
  // Every file in S3 is an "object" stored under a key that looks like a file path
  const key = \`uploads/\${userId}/\${randomUUID()}\`;

  const command = new PutObjectCommand({
    Bucket: 'my-app-user-photos',
    Key: key,
    ContentType: contentType,
  });

  // The link works for 5 minutes and only allows this one upload
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key };
}

// Then, in the browser:
// await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });`,
      },
    ],
    concepts: [
      {
        term: 'Object storage',
        meaning:
          'Storing files as whole “objects” in a flat space, each found by a unique key, instead of in folders on one disk. It scales to billions of files and is how most apps store user uploads.',
      },
      {
        term: 'Presigned URL',
        meaning:
          'A temporary link with a built-in permission slip, letting someone upload or download one specific file for a short time without having any passwords of their own.',
      },
    ],
    howWeKnow:
      'The response’s server header says AmazonS3, or it includes x-amz-bucket-region, which names the AWS region where the storage bucket lives. That means the file came straight out of an S3 bucket.',
  },
  {
    detection: 'Amazon Web Services',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Amazon Web Services (AWS)',
        role: 'Amazon’s cloud platform: rented servers, databases, storage and hundreds of other services',
        beginnerNote:
          'Instead of buying and running their own computers, companies rent them from AWS by the hour or even per request. They can use virtual servers (EC2), serverless functions (Lambda), managed databases, load balancers and much more, adding capacity in minutes when traffic grows.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-aws-lambda',
        title: 'An AWS Lambda function behind an API',
        file: 'functions/getProduct.js',
        language: 'JavaScript (AWS Lambda)',
        explanation:
          'Lambda runs a function only when something triggers it, here an HTTP request routed by Amazon API Gateway to GET /products/{id}. The handler receives an event describing the request and returns a status code and body. The DynamoDB client is created outside the handler so it is reused while this copy of the function stays warm. The table name comes from an environment variable, so the same code can run against test and production tables.',
        code: `// functions/getProduct.js: runs on AWS Lambda when API Gateway receives GET /products/{id}
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

// Created once and reused for as long as this copy of the function stays warm
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
  const id = event.pathParameters?.id;

  const { Item } = await db.send(
    new GetCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { id },
    }),
  );

  if (!Item) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Item),
  };
};`,
      },
    ],
    concepts: [
      {
        term: 'Cloud computing',
        meaning:
          'Renting computing power, storage and services over the internet instead of owning hardware. Like electricity from the grid: you pay for what you use and can use more whenever you need it.',
      },
      {
        term: 'Regions and availability zones',
        meaning:
          'Cloud providers group data centers into regions (such as us-east-1 in Virginia), each with several separate zones. Running an app in more than one zone keeps it online even if one building loses power.',
      },
    ],
    howWeKnow:
      'The response carries an AWS request-tracking header (x-amz-request-id, x-amzn-RequestId or X-Amzn-Trace-Id) or a server header of awselb, which comes from AWS Elastic Load Balancing. These headers are added by AWS services themselves.',
  },
  {
    detection: 'Fastly',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Fastly',
        role: 'Edge cloud and CDN known for highly configurable caching and near-instant purges',
        beginnerNote:
          'Fastly caches a site’s pages and files in data centers around the world. Developers can program exactly how caching works, and when content changes they can clear the old copies everywhere in a fraction of a second, which makes it popular with news and fast-changing sites.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Cache purge',
        meaning:
          'Telling a CDN to throw away its stored copy of a page so the next visitor gets the fresh version. Fast purges let sites cache aggressively and still show updates, like corrections to a news story, almost immediately.',
      },
    ],
    howWeKnow:
      'The response has an x-fastly-request-id header, or an x-served-by header naming Fastly cache servers (they look like cache-lax-1234-LAX, where the letters are airport codes for the data center’s city).',
  },
  {
    detection: 'Akamai',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Akamai',
        role: 'One of the oldest and largest CDN and security networks',
        beginnerNote:
          'Akamai, founded in 1998, runs servers inside networks all over the world. Large companies, banks and media sites use it to deliver pages, downloads and video quickly and to block attacks before they reach their own servers.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Edge server',
        meaning:
          'A server placed physically close to users, often inside their internet provider’s network, that answers requests on behalf of the main site. Less distance means less waiting.',
      },
    ],
    howWeKnow:
      'The server header names an Akamai edge server (AkamaiGHost, short for Global Host, or AkamaiNetStorage), or the response includes Akamai-specific headers such as x-akamai-transformed or akamai-grn.',
  },
  {
    detection: 'Google Front End',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Google Front End (GFE)',
        role: 'Google’s front-door servers that terminate HTTPS and route traffic to Google services',
        beginnerNote:
          'When you connect to a Google service, or an app hosted on some Google Cloud products, the first machine you reach is a Google front-end server. It handles the encrypted connection, protects against floods of traffic, and forwards the request over Google’s private network to the right back-end service.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'TLS termination',
        meaning:
          'Unlocking an HTTPS connection at the front door. The front-end server does the heavy encryption work and checks certificates, so the services behind it can focus on building the response.',
      },
    ],
    howWeKnow:
      'The server header is one of the names Google’s front-end servers use: gws (Google Web Server), GFE, ESF or Google Frontend. Apps on Google Cloud services like App Engine and Cloud Run often show Google Frontend here.',
  },
  {
    detection: 'Google Cloud',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Google Cloud',
        role: 'Google’s cloud platform: servers, containers, databases, storage and AI services',
        beginnerNote:
          'Google Cloud rents out the same kind of infrastructure Google runs on. Teams can run apps as containers on Cloud Run or Kubernetes, store data in Cloud SQL or Firestore, and put a global load balancer in front so visitors connect to Google’s network near them.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Container',
        meaning:
          'A package holding an app plus everything it needs to run (language runtime, libraries, settings). It runs the same on a laptop and in the cloud, like a shipping container that fits any ship, train or truck.',
      },
    ],
    howWeKnow:
      'The via header says “1.1 google”, which Google Cloud’s load balancers add, or the response has an x-cloud-trace-context header used by Google Cloud’s request tracing.',
  },
  {
    detection: 'Microsoft Azure',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Microsoft Azure',
        role: 'Microsoft’s cloud platform, here with its global edge network in front of the site',
        beginnerNote:
          'Azure offers rented servers, app hosting, databases and AI services. Services such as Azure Front Door sit at Microsoft’s edge locations around the world, speeding up delivery, balancing traffic and filtering attacks before requests reach the app.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'PaaS (platform as a service)',
        meaning:
          'Hosting where you hand over your code and the provider handles the servers, operating system, scaling and patches for you, like renting a furnished apartment instead of building a house.',
      },
    ],
    howWeKnow:
      'The response has an x-azure-ref header, added by Azure Front Door, or an x-msedge-ref header from Microsoft’s edge network. Both are reference IDs Microsoft uses to trace a request.',
  },
  {
    detection: 'Firebase Hosting',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Firebase Hosting',
        role: 'Google’s hosting for web apps, serving files from a global CDN with automatic HTTPS',
        beginnerNote:
          'Firebase Hosting puts a site’s built files on Google’s CDN with one command (firebase deploy). It pairs with the rest of Firebase: requests can be rewritten to Cloud Functions or Cloud Run for dynamic pages, and special URLs give the app its Firebase settings automatically.',
      },
    ],
    files: [
      { path: 'firebase.json', note: 'Hosting settings: which folder to publish, rewrites, redirects and headers' },
      { path: '.firebaserc', note: 'Which Firebase project this folder deploys to' },
    ],
    code: [
      {
        id: 'fw-firebase-hosting-json',
        title: 'Firebase Hosting configuration',
        file: 'firebase.json',
        language: 'JSON (Firebase config)',
        explanation:
          'firebase.json tells Firebase Hosting what to publish and how to answer requests. public is the folder of built files. The headers rule caches JavaScript, CSS and images for a year. Rewrites are checked in order: any /api/ request is handed to a Cloud Function named api, and every other unknown path gets index.html so a single-page app’s router can take over.',
        code: `{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|webp)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ],
    "rewrites": [
      { "source": "/api/**", "function": "api" },
      { "source": "**", "destination": "/index.html" }
    ]
  }
}`,
      },
    ],
    concepts: [
      {
        term: 'Rewrite vs redirect',
        meaning:
          'A redirect tells the browser “go to this other URL instead”, and the address bar changes. A rewrite quietly serves different content for the same URL, so the visitor never notices.',
      },
    ],
    howWeKnow:
      'The page loads scripts from /__/firebase/. Firebase Hosting reserves URLs starting with /__/ for itself, and /__/firebase/ serves the Firebase SDK and the project’s settings to sites it hosts.',
  },
  {
    detection: 'GitHub Pages',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'GitHub Pages',
        role: 'Free static website hosting straight from a GitHub repository',
        beginnerNote:
          'GitHub Pages publishes the HTML, CSS and JavaScript files in a repository as a website, at username.github.io or a custom domain. It only serves ready-made files and cannot run server code, which makes it perfect for portfolios, documentation and project pages.',
      },
    ],
    files: [
      { path: '.github/workflows/deploy.yml', note: 'GitHub Actions workflow that builds the site and publishes it' },
      { path: 'CNAME', note: 'One line holding the custom domain, such as www.example.com' },
    ],
    code: [
      {
        id: 'fw-github-pages-workflow',
        title: 'Publishing to GitHub Pages with GitHub Actions',
        file: '.github/workflows/deploy.yml',
        language: 'YAML (GitHub Actions)',
        explanation:
          'This workflow runs on GitHub’s computers every time code is pushed to main. The build job downloads the code, installs Node.js, builds the site and packages the dist folder. The deploy job then publishes that package to GitHub Pages. The permissions block gives the workflow just enough access to publish, nothing more.',
        code: `# .github/workflows/deploy.yml: build the site and publish it on every push to main
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4`,
      },
    ],
    concepts: [
      {
        term: 'Static site',
        meaning:
          'A website made of files that are the same for every visitor, with no code running on the server per request. Static sites are fast, cheap and hard to hack, and interactivity comes from JavaScript in the browser.',
      },
    ],
    howWeKnow:
      'The response has an x-github-request-id header, which GitHub’s servers add. We ignore it on github.com itself, so on any other site it points to GitHub Pages hosting.',
  },
  {
    detection: 'Heroku',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Heroku',
        role: 'Platform as a service that runs apps from a Git push without managing servers',
        beginnerNote:
          'Heroku made deploying famously simple: push your code, and it detects the language, installs dependencies and runs the app in lightweight containers called dynos. Add-ons attach databases and other services in a click, and scaling up means adding more dynos.',
      },
    ],
    files: [{ path: 'Procfile', note: 'Tells Heroku which commands to run, e.g. web: npm start and worker: node jobs.js' }],
    code: [],
    concepts: [
      {
        term: 'Dyno',
        meaning:
          'Heroku’s name for a lightweight container running one process of your app. Web dynos answer requests and worker dynos run background jobs; more traffic means adding more dynos.',
      },
      {
        term: 'Twelve-factor app',
        meaning:
          'A set of guidelines, written by Heroku engineers, for apps that are easy to deploy and scale: keep settings in environment variables, treat databases as attached resources, and make processes disposable.',
      },
    ],
    howWeKnow:
      'The via header mentions vegur, the name of Heroku’s HTTP router, or the server header says Heroku. Both are added by Heroku’s routing layer that sits in front of every app.',
  },
  {
    detection: 'Fly.io',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Fly.io',
        role: 'Cloud platform that runs apps in lightweight virtual machines close to users worldwide',
        beginnerNote:
          'Fly.io takes an app packaged as a container and runs it on fast-starting virtual machines in regions you choose around the world. Visitors are routed to the nearest copy, so a full server-side app can feel as quick as a CDN.',
      },
    ],
    files: [
      { path: 'fly.toml', note: 'App settings for Fly.io: name, region, ports and scaling behaviour' },
      { path: 'Dockerfile', note: 'Recipe for building the container image Fly.io runs' },
    ],
    code: [
      {
        id: 'fw-fly-toml',
        title: 'Fly.io app configuration',
        file: 'fly.toml',
        language: 'TOML (Fly.io config)',
        explanation:
          'fly.toml describes how Fly.io should run the app. primary_region picks where machines start (iad is Ashburn, Virginia; more regions can be added). The http_service section says which port the app listens on inside its container and forces HTTPS. auto_stop_machines and auto_start_machines let idle machines shut down to save money and wake up again when a request arrives.',
        code: `# fly.toml: how Fly.io runs this app
app = "my-shop"
primary_region = "iad"   # Ashburn, Virginia. Copies can be added in other regions too

[build]
  dockerfile = "Dockerfile"   # the app runs as a container built from this file

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080          # the port the app listens on inside the container
  force_https = true
  auto_stop_machines = "stop"   # stop idle machines to save money...
  auto_start_machines = true    # ...and start them again when a request arrives
  min_machines_running = 1      # keep one always on so the first visitor is not kept waiting

[[vm]]
  memory = "512mb"
  cpus = 1`,
      },
    ],
    concepts: [
      {
        term: 'Anycast',
        meaning:
          'Announcing the same IP address from many locations at once, so the internet delivers each visitor’s request to the nearest one. Everyone uses one address, but people in London and Sydney reach different data centers.',
      },
    ],
    howWeKnow:
      'The response has a fly-request-id header, which Fly.io’s proxy adds to every request it routes to an app.',
  },
  {
    detection: 'Render',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Render',
        role: 'Cloud platform for web services, static sites, background workers and databases',
        beginnerNote:
          'Render builds and runs apps straight from a Git repository, much like Heroku. Web services, background workers, cron jobs and managed PostgreSQL databases can all be described in one render.yaml file, and every push triggers a new deploy.',
      },
    ],
    files: [{ path: 'render.yaml', note: 'Blueprint describing every service and database in the app' }],
    code: [
      {
        id: 'fw-render-blueprint',
        title: 'A Render Blueprint for an app with a database',
        file: 'render.yaml',
        language: 'YAML (Render Blueprint)',
        explanation:
          'A Blueprint describes the whole app as code. This one creates a Node.js web service (with a health check Render uses to know the app is up), a background worker for sending emails, and a PostgreSQL database. Instead of pasting passwords around, DATABASE_URL is filled in automatically from the database, and SESSION_SECRET is generated randomly by Render.',
        code: `# render.yaml: a Render "Blueprint" describing every piece of the app
services:
  - type: web
    name: shop-web
    runtime: node
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /healthz   # Render checks this URL to know the app is up
    envVars:
      - key: DATABASE_URL
        fromDatabase:           # filled in automatically from the database below
          name: shop-db
          property: connectionString
      - key: SESSION_SECRET
        generateValue: true     # Render creates a random secret

  - type: worker                # runs in the background, no public URL
    name: email-worker
    runtime: node
    buildCommand: npm ci
    startCommand: node workers/email.js

databases:
  - name: shop-db`,
      },
    ],
    concepts: [
      {
        term: 'Infrastructure as code',
        meaning:
          'Describing servers, databases and settings in files stored with the code, instead of clicking through a dashboard. The setup can be reviewed, versioned and recreated exactly, like a recipe instead of cooking from memory.',
      },
    ],
    howWeKnow:
      'The response has an rndr-id or x-render-origin-server header. Render’s routing layer adds these to requests it forwards to apps hosted on Render.',
  },
  {
    detection: 'Meta infrastructure',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Meta infrastructure',
        role: 'Meta’s own global network of data centers, edge servers and CDN',
        beginnerNote:
          'At the scale of billions of users, Meta does not rent a CDN or cloud; it builds its own. Visitors connect to Meta edge servers near them, which pass requests over Meta’s private network to huge data centers running its services.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Points of presence (PoPs)',
        meaning:
          'Smaller server sites spread around the world, often inside internet exchanges, where users’ connections first land. They make the long trip to a central data center happen over the company’s own fast network instead of the public internet.',
      },
    ],
    howWeKnow:
      'The response has an x-fb-debug header. Meta’s servers attach this encoded value to responses so its engineers can trace a request when debugging.',
  },
  {
    detection: 'Meta CDN (fbcdn)',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Meta CDN (fbcdn.net)',
        role: 'Meta’s content delivery network for scripts, styles, photos and videos',
        beginnerNote:
          'Files like JavaScript bundles, profile pictures and videos are served from fbcdn.net servers placed close to users, separate from the main website domain. That keeps pages fast and lets the heavy media load in parallel.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Asset domain',
        meaning:
          'A separate domain used only for static files. Browsers do not send the main site’s cookies to it, requests stay smaller, and the files can be cached and served by specialised servers.',
      },
    ],
    howWeKnow:
      'The page loads files from fbcdn.net, or its Content-Security-Policy header lists fbcdn.net as an allowed source. That domain belongs to Meta and serves assets for Facebook, Instagram and other Meta products, including when their content is embedded elsewhere.',
  },
  {
    detection: 'Google static CDN',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'Google static CDN (gstatic.com)',
        role: 'Google’s domain for serving static files like fonts, icons and scripts',
        beginnerNote:
          'gstatic.com holds files that never change per user: font files for Google Fonts, images and scripts for Google products, and parts of services like reCAPTCHA and Firebase. Seeing it means the page uses something from Google, not necessarily that Google hosts the whole site.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Cookieless domain',
        meaning:
          'Serving static files from a domain that never sets cookies, so the browser does not attach cookie data to every image or script request. Small savings add up across dozens of files per page.',
      },
    ],
    howWeKnow:
      'The page’s HTML references gstatic.com. That is often from Google Fonts (font files come from fonts.gstatic.com) or from Google services such as reCAPTCHA, Maps or Firebase loading their files.',
  },
  {
    detection: 'Public JS CDN',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Public JS CDN',
        role: 'Free CDN (jsDelivr, unpkg or cdnjs) serving open-source libraries to the page',
        beginnerNote:
          'Instead of bundling a library into the site’s own files, the page links to a copy hosted on a free public CDN. It is quick to set up and needs no build tools, but the site then depends on that CDN being online and serving the right file.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-public-cdn-script',
        title: 'Loading a library from jsDelivr safely',
        file: 'index.html',
        language: 'HTML',
        explanation:
          'The script tag loads the slugify library straight from jsDelivr, which mirrors every package published to npm. Writing @1.6.9 pins an exact version, so the file can never change without you knowing. The integrity attribute holds a fingerprint (hash) of that exact file: if the CDN ever served something different, the browser would refuse to run it. crossorigin="anonymous" is needed for that check on files from another domain.',
        code: `<!-- Load a small library from jsDelivr, a free CDN that mirrors every npm package -->
<!-- @1.6.9 pins an exact version, so the file and its fingerprint never change -->
<script
  src="https://cdn.jsdelivr.net/npm/slugify@1.6.9/slugify.js"
  integrity="sha384-EmBtodupOXkThRegc2Zhtvylx24O1hk8lFbUToSHnLpzZPjaT8FYSZbqYImhClGk"
  crossorigin="anonymous"
></script>

<label>Post title <input id="title" value="Hello World!" /></label>
<p>Link preview: /blog/<span id="slug"></span></p>

<script>
  // The CDN script created a global slugify() function we can call
  const title = document.getElementById('title');
  const slug = document.getElementById('slug');

  function update() {
    slug.textContent = slugify(title.value, { lower: true, strict: true }); // "hello-world"
  }

  title.addEventListener('input', update);
  update();
</script>`,
      },
    ],
    concepts: [
      {
        term: 'Subresource Integrity (SRI)',
        meaning:
          'An integrity attribute on a script or stylesheet containing a hash of the exact file you expect. If the file from the CDN has been changed, even by one character, the browser refuses to use it, like checking a seal on a medicine bottle.',
      },
      {
        term: 'Version pinning',
        meaning:
          'Asking for an exact version of a library (like 1.6.9) instead of “the latest”. Your site keeps working the same way until you choose to upgrade and test the new version.',
      },
    ],
    howWeKnow:
      'The page loads scripts from cdn.jsdelivr.net, unpkg.com or cdnjs.cloudflare.com, the three most common free CDNs for open-source JavaScript libraries.',
  },
  {
    detection: 'HTTP/3 (QUIC)',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'HTTP/3 (QUIC)',
        role: 'Newest version of HTTP, running over the QUIC protocol for faster, more reliable connections',
        beginnerNote:
          'Earlier versions of HTTP run over TCP; HTTP/3 (standardised in 2022) runs over QUIC, which is built on UDP with encryption included. Connections start faster, one lost packet does not stall everything else, and a download can survive switching from Wi-Fi to mobile data.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Head-of-line blocking',
        meaning:
          'When one lost piece of data holds up everything queued behind it, like one slow car on a single-lane road. With TCP, a single dropped packet pauses every file on the connection; QUIC keeps separate lanes so only the affected file waits.',
      },
      {
        term: 'QUIC',
        meaning:
          'A transport protocol, first developed at Google and now an internet standard, that combines connecting, encrypting (TLS 1.3) and multiplexing many streams into one quick handshake over UDP.',
      },
    ],
    howWeKnow:
      'The response has an alt-svc header advertising h3, for example h3=":443". It tells the browser “this server also speaks HTTP/3 on port 443”, so the browser can switch to HTTP/3 for its next requests.',
  },
  {
    detection: 'HSTS (HTTPS enforced)',
    stackItems: [
      {
        layer: 'Infrastructure',
        name: 'HSTS (HTTP Strict Transport Security)',
        role: 'Security policy telling browsers to always use HTTPS for this site',
        beginnerNote:
          'After a browser sees this header once over HTTPS, it remembers for the time the site specifies (often a year) and automatically upgrades any http:// link or typed address to https:// before sending anything. That closes the gap where an attacker on public Wi-Fi could intercept the first unencrypted request.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Downgrade attack',
        meaning:
          'An attacker between you and a site (say, on café Wi-Fi) quietly keeps your connection on plain HTTP so they can read or change it. HSTS blocks this because the browser refuses to use HTTP for that site at all.',
      },
      {
        term: 'HSTS preload list',
        meaning:
          'A list of domains built into browsers that must always use HTTPS, even on the very first visit. Sites opt in by adding preload to their header and submitting their domain.',
      },
    ],
    howWeKnow:
      'The response includes a strict-transport-security header, for example max-age=31536000; includeSubDomains. max-age is how many seconds (here, one year) the browser should remember to use HTTPS only.',
  },

  /* ------------------------------------------------------------------ */
  /* Third-party services                                                */
  /* ------------------------------------------------------------------ */
  {
    detection: 'Google Analytics / Tag Manager',
    stackItems: [
      {
        layer: 'Data',
        name: 'Google Analytics / Tag Manager',
        role: 'Measures visits and user actions; Tag Manager loads tracking scripts without code changes',
        beginnerNote:
          'Google Analytics records what visitors do, such as pages viewed, buttons clicked and purchases, and turns it into reports about where people come from and where they drop off. Google Tag Manager is a container that lets marketing teams add or change these tracking snippets from a dashboard instead of asking developers.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-google-analytics-gtag',
        title: 'Google Analytics 4 with a custom event',
        file: 'index.html',
        language: 'HTML',
        explanation:
          'The first script loads Google’s tag library. The inline script sets up a queue called dataLayer and a small gtag() helper that adds commands to it; the library processes them as soon as it arrives, so nothing is lost while it loads. gtag(\'config\', …) connects the page to an Analytics property and records a page view. The last script sends a custom sign_up event whenever the button is clicked, so the team can count sign-ups in their reports.',
        code: `<!-- Google tag (gtag.js): loads Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX'); // G-XXXXXXXXXX is the site's measurement ID; records a page view
</script>

<button id="signup">Create account</button>

<script>
  // A custom event: count how many visitors click the sign-up button
  document.getElementById('signup').addEventListener('click', () => {
    gtag('event', 'sign_up', { method: 'email' });
  });
</script>`,
      },
    ],
    concepts: [
      {
        term: 'Event tracking',
        meaning:
          'Recording specific actions (a click, a sign-up, a video play) as named events with details attached. Teams use the counts to see which features people actually use and where they give up.',
      },
    ],
    howWeKnow:
      'The page loads a script from googletagmanager.com or google-analytics.com, calls the gtag() function, or its Content-Security-Policy header allows those domains.',
  },
  {
    detection: 'Segment',
    stackItems: [
      {
        layer: 'Data',
        name: 'Segment',
        role: 'Customer data platform that collects events once and forwards them to many tools',
        beginnerNote:
          'Without Segment, a site might add separate tracking code for analytics, email marketing, ads and a data warehouse. With Segment, developers send each event once, and Segment copies it to every tool the team switches on in its dashboard.',
      },
    ],
    files: [{ path: 'src/lib/analytics.js', note: 'Sets up Segment once and exports helpers for tracking events' }],
    code: [
      {
        id: 'fw-segment-track',
        title: 'Tracking users and events with Segment',
        file: 'src/lib/analytics.js',
        language: 'JavaScript',
        explanation:
          'AnalyticsBrowser.load connects to Segment using the project’s write key and downloads its settings. page() records a page view, identify() links future events to a known user with some traits, and track() records a named action with properties. Segment then forwards these same calls to whichever destinations are enabled, such as an analytics tool, an email service and a data warehouse.',
        code: `// src/lib/analytics.js
import { AnalyticsBrowser } from '@segment/analytics-next';

// One write key per source; Segment forwards every call to the tools switched on in its dashboard
export const analytics = AnalyticsBrowser.load({ writeKey: 'YOUR_WRITE_KEY' });

// Record a page view
analytics.page();

// After someone logs in: connect their future events to their account
export function onLogin(user) {
  analytics.identify(user.id, { email: user.email, plan: user.plan });
}

// Something the business cares about happened
export function onOrderCompleted(order) {
  analytics.track('Order Completed', {
    order_id: order.id,
    total: order.total,
    currency: 'USD',
  });
}`,
      },
    ],
    concepts: [
      {
        term: 'Customer data platform (CDP)',
        meaning:
          'A hub that collects events about users from websites and apps and sends them on to other tools. Like a postal sorting office: every letter arrives in one place and is routed to all the right addresses.',
      },
    ],
    howWeKnow:
      'The page loads Segment’s script from cdn.segment.com or sends data to api.segment.io, or its Content-Security-Policy header allows those domains.',
  },
  {
    detection: 'Sentry',
    stackItems: [
      {
        layer: 'DevOps',
        name: 'Sentry',
        role: 'Error tracking and performance monitoring for apps',
        beginnerNote:
          'When something breaks in a visitor’s browser, the developers would normally never know. Sentry catches the error, records the stack trace, browser and steps that led to it, groups similar errors together and alerts the team, so bugs get fixed before many people complain.',
      },
    ],
    files: [{ path: 'src/lib/sentry.js', note: 'Starts Sentry as early as possible so it can catch errors from the rest of the app' }],
    code: [
      {
        id: 'fw-sentry-init',
        title: 'Setting up Sentry in a web app',
        file: 'src/lib/sentry.js',
        language: 'JavaScript',
        explanation:
          'Sentry.init connects the app to a Sentry project using its DSN, a public address that says where to send reports. From then on, uncaught errors are reported automatically. The release value lets Sentry show which deploy introduced a bug, and tracesSampleRate measures page speed for 10% of visits. For errors the app catches itself, captureException still sends a report, with tags to make filtering easy.',
        code: `// src/lib/sentry.js: start Sentry before the rest of the app runs
import * as Sentry from '@sentry/browser';
import { api } from './api';
import { showToast } from './toast';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // where to send reports
  environment: 'production',
  release: 'my-app@1.4.0', // shows which deploy introduced a bug
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1, // measure speed for 10% of page loads
});

// Uncaught errors are reported automatically. Errors you catch can be reported too:
export async function saveProfile(profile) {
  try {
    await api.saveProfile(profile);
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: 'profile' } });
    showToast('Could not save your profile, please try again');
  }
}

// Knowing who was affected shows how many users hit a bug
export function onLogin(user) {
  Sentry.setUser({ id: user.id });
}`,
      },
    ],
    concepts: [
      {
        term: 'Stack trace',
        meaning:
          'The list of function calls that were running when an error happened, from the crash point back to where it started. It is the breadcrumb trail that tells a developer exactly which line failed and how the code got there.',
      },
      {
        term: 'Source map',
        meaning:
          'A file that maps the minified, bundled JavaScript sent to browsers back to the original source code, so an error in “a.js line 1, column 48213” can be shown as the real file and line you wrote.',
      },
    ],
    howWeKnow:
      'The page loads Sentry from browser.sentry-cdn.com, sends reports to an ingest.sentry.io address, calls Sentry.init, or its Content-Security-Policy header allows Sentry’s domains.',
  },
  {
    detection: 'Hotjar',
    stackItems: [
      {
        layer: 'Data',
        name: 'Hotjar',
        role: 'Heatmaps, session recordings and feedback surveys that show how people use a site',
        beginnerNote:
          'Numbers say that people leave a page; Hotjar helps show why. It builds heatmaps of where visitors click and scroll, records anonymised replays of visits, and can pop up short surveys. Designers use it to spot confusing layouts and buttons people miss.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Heatmap',
        meaning:
          'A picture of a page coloured by activity: hot colours where many visitors click, move or stop scrolling, cool colours where few do. It quickly reveals whether people even see an important button.',
      },
      {
        term: 'Session recording',
        meaning:
          'A replay of one visit rebuilt from recorded clicks, scrolls and page changes, not a video of the screen. Tools like Hotjar hide typed text and sensitive fields by default to protect privacy.',
      },
    ],
    howWeKnow:
      'The page loads Hotjar’s script from static.hotjar.com or talks to another hotjar.com address, or its Content-Security-Policy header allows Hotjar’s domains.',
  },
  {
    detection: 'Intercom',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'Intercom',
        role: 'Customer messaging platform providing the chat bubble, help articles and support bots',
        beginnerNote:
          'The little chat bubble in the corner of many sites is often Intercom. It loads a messenger widget where visitors can ask questions, read help articles or chat with an AI or human support agent, while the company’s team answers from Intercom’s inbox.',
      },
    ],
    files: [],
    code: [],
    concepts: [
      {
        term: 'Third-party script',
        meaning:
          'Code loaded from another company’s servers, like a chat widget or analytics tag. It adds features without building them, but every one makes the page heavier and gives that company a view of your visitors, so teams choose them carefully.',
      },
    ],
    howWeKnow:
      'The page loads the Intercom messenger from widget.intercom.io or js.intercomcdn.com, or its Content-Security-Policy header allows those domains.',
  },
  {
    detection: 'Stripe',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Stripe',
        role: 'Payments platform: card checkout, subscriptions and payouts through an API',
        beginnerNote:
          'Handling credit cards yourself means strict security rules and bank contracts. With Stripe, the card details go straight from the shopper to Stripe (through its hosted checkout page or its secure form fields), and the site’s server only deals with safe references like “payment succeeded”.',
      },
    ],
    files: [
      { path: 'server/routes/checkout.js', note: 'Creates Stripe Checkout sessions using the secret API key' },
      { path: 'server/routes/stripe-webhook.js', note: 'Receives events from Stripe, like checkout.session.completed, to mark orders as paid' },
    ],
    code: [
      {
        id: 'fw-stripe-checkout-session',
        title: 'Creating a Stripe Checkout session',
        file: 'server/routes/checkout.js',
        language: 'JavaScript (Node.js)',
        explanation:
          'When the shopper clicks “Pay”, the browser calls this route. The server uses its secret key to ask Stripe for a Checkout Session describing what is being bought (amounts are in cents), and where to send the shopper afterwards. The response includes a URL to Stripe’s hosted payment page, and the server redirects the shopper there. Card numbers never touch this server; a webhook later confirms the payment.',
        code: `// server/routes/checkout.js
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // secret key: server only, never in the browser
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Trail Runner sneakers' },
          unit_amount: 8900, // amounts are in cents: $89.00
        },
        quantity: 1,
      },
    ],
    success_url: 'https://example.com/order/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cart',
  });

  // Send the shopper to Stripe's hosted payment page; card details never touch our server
  res.redirect(303, session.url);
});

export default router;`,
      },
    ],
    concepts: [
      {
        term: 'PCI compliance',
        meaning:
          'The card industry’s security rules for anyone who handles card numbers. Letting Stripe collect the card details on its own page or secure fields keeps those numbers off your servers, which makes following the rules far easier.',
      },
      {
        term: 'Webhook',
        meaning:
          'A message another service sends to your server when something happens, like Stripe calling “this payment succeeded”. Instead of asking over and over, you get a phone call when there is news.',
      },
    ],
    howWeKnow:
      'The page loads js.stripe.com, or its Content-Security-Policy header allows it. Stripe requires sites to load Stripe.js directly from that address rather than bundling their own copy, which makes it a reliable clue.',
  },
  {
    detection: 'PayPal',
    stackItems: [
      {
        layer: 'Backend',
        name: 'PayPal',
        role: 'Online payments: PayPal checkout buttons, cards and pay-later options',
        beginnerNote:
          'PayPal’s JavaScript SDK draws ready-made payment buttons on the page. Shoppers pay in a PayPal window using their PayPal account or a card, and the site’s server creates and confirms (“captures”) the order through PayPal’s API.',
      },
    ],
    files: [{ path: 'server/routes/orders.js', note: 'Creates and captures PayPal orders using the store’s secret credentials' }],
    code: [
      {
        id: 'fw-paypal-buttons',
        title: 'PayPal checkout buttons',
        file: 'checkout.html',
        language: 'HTML + JavaScript',
        explanation:
          'The SDK script, loaded with the store’s public client ID, creates a global paypal object. paypal.Buttons() draws the buttons. When the shopper clicks, createOrder asks the store’s own server to create the order, so the price is decided on the server and cannot be edited in the browser. After the shopper approves the payment in PayPal’s window, onApprove asks the server to capture it, which is when the money actually moves.',
        code: `<!-- PayPal's JavaScript SDK, loaded with the store's public client ID -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>

<div id="paypal-button-container"></div>

<script>
  paypal.Buttons({
    // 1. Our server creates the order, so the price can't be changed in the browser
    createOrder: async () => {
      const res = await fetch('/api/orders', { method: 'POST' });
      const order = await res.json();
      return order.id;
    },

    // 2. The shopper approved the payment in PayPal's window: ask our server to capture it
    onApprove: async (data) => {
      await fetch(\`/api/orders/\${data.orderID}/capture\`, { method: 'POST' });
      window.location.href = '/order/thanks';
    },

    onError: (err) => {
      console.error(err);
      alert('Payment could not be completed. Please try again.');
    },
  }).render('#paypal-button-container');
</script>`,
      },
    ],
    concepts: [
      {
        term: 'Sandbox environment',
        meaning:
          'A practice copy of a payment system with fake accounts and fake money, so developers can test the whole checkout without charging anyone. You switch to live keys only when everything works.',
      },
    ],
    howWeKnow:
      'The page loads PayPal’s checkout SDK from paypal.com/sdk/js or files from paypalobjects.com (PayPal’s static file domain), or its Content-Security-Policy header allows them.',
  },
  {
    detection: 'reCAPTCHA',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'reCAPTCHA',
        role: 'Google’s bot protection for forms such as sign-up, login and checkout',
        beginnerNote:
          'reCAPTCHA tries to tell humans from bots. Version 2 shows the “I’m not a robot” checkbox and sometimes image puzzles; version 3 is invisible and gives each visit a score. Either way, the site’s server must check the result with Google before trusting the form.',
      },
    ],
    files: [{ path: 'server/verifyCaptcha.js', note: 'Checks reCAPTCHA tokens with Google before accepting a form' }],
    code: [
      {
        id: 'fw-recaptcha-verify',
        title: 'Verifying a reCAPTCHA v3 token on the server',
        file: 'server/verifyCaptcha.js',
        language: 'JavaScript (Node.js)',
        explanation:
          'In the browser, reCAPTCHA gives the page a short-lived token when the form is submitted. That token means nothing until the server checks it: this function sends it to Google’s siteverify endpoint along with the secret key. For version 3, Google answers with a score from 0.0 (very likely a bot) to 1.0 (very likely a human) and the action name, and the site decides what score is good enough.',
        code: `// server/verifyCaptcha.js: check the token the browser got from reCAPTCHA v3
// In the browser (inside grecaptcha.ready):
//   const token = await grecaptcha.execute(SITE_KEY, { action: 'signup' });  → send it with the form

export async function isHuman(token, expectedAction) {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY, // the secret key stays on the server
      response: token,
    }),
  });
  const result = await res.json();

  // v3 never shows a puzzle: it scores the visit from 0.0 (likely a bot) to 1.0 (likely human)
  return result.success && result.action === expectedAction && result.score >= 0.5;
}

// In a sign-up route:
// if (!(await isHuman(req.body.captchaToken, 'signup'))) {
//   return res.status(403).json({ error: 'Suspicious request, please try again' });
// }`,
      },
    ],
    concepts: [
      {
        term: 'Never trust the client',
        meaning:
          'Anything that happens in the browser can be faked by someone with DevTools or a script. Important checks, like “was this a real human?” or “is this the right price?”, must be confirmed on the server.',
      },
    ],
    howWeKnow:
      'The page loads recaptcha/api.js from google.com or reCAPTCHA files from gstatic.com, or its Content-Security-Policy header allows reCAPTCHA.',
  },
  {
    detection: 'Algolia',
    stackItems: [
      {
        layer: 'Data',
        name: 'Algolia',
        role: 'Hosted search engine that powers fast search-as-you-type',
        beginnerNote:
          'Building good search (typo-tolerant, ranked, instant) is hard. Algolia keeps a copy of the site’s searchable data, like products or articles, in its own servers, and the search box sends each keystroke straight to Algolia, which answers in milliseconds.',
      },
    ],
    files: [{ path: 'scripts/sync-search-index.js', note: 'Pushes new and changed records from the database into the Algolia index' }],
    code: [
      {
        id: 'fw-algolia-search',
        title: 'Search-as-you-type with Algolia',
        file: 'src/search.js',
        language: 'JavaScript',
        explanation:
          'The lite client is Algolia’s small browser library for searching only. It uses a search-only API key, which is safe to publish because it cannot change data. Each time the visitor types, the query goes directly from the browser to Algolia, which returns the best matching records from the products index, typos included. Keeping the index up to date happens elsewhere, on the server, with a secret admin key.',
        code: `// src/search.js: instant search with Algolia
import { liteClient as algoliasearch } from 'algoliasearch/lite';

// A search-only key is safe in the browser: it can read the index but never change it
const client = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey');

const input = document.querySelector('#search');
const list = document.querySelector('#results');

input.addEventListener('input', async () => {
  // The query goes straight from the browser to Algolia, not to our own back end
  const { results } = await client.search({
    requests: [{ indexName: 'products', query: input.value, hitsPerPage: 5 }],
  });

  list.innerHTML = '';
  for (const hit of results[0].hits) {
    const li = document.createElement('li');
    li.textContent = \`\${hit.name}: $\${hit.price}\`;
    list.append(li);
  }
});

// On the server, with the secret admin key, changed products are saved to the index:
// await adminClient.saveObject({ indexName: 'products', body: { objectID: '42', name: 'Trail Runner', price: 89 } });`,
      },
    ],
    concepts: [
      {
        term: 'Search index',
        meaning:
          'A copy of your data reorganised for finding things fast, like the index at the back of a book. Instead of reading every record for each search, the engine looks up which records contain each word.',
      },
      {
        term: 'Typo tolerance',
        meaning:
          'Matching results even when the query is misspelled, so “iphnoe” still finds “iPhone”. Search engines do this by allowing a small number of letter changes between the query and a word.',
      },
    ],
    howWeKnow:
      'The page talks to Algolia’s servers (addresses ending in algolia.net or algolianet.com), loads the algoliasearch library, or its Content-Security-Policy header allows Algolia’s domains.',
  },
  {
    detection: 'Auth0',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Auth0',
        role: 'Hosted login and identity service (sign-up, social login, multi-factor authentication)',
        beginnerNote:
          'Getting logins right, with password storage, “Sign in with Google”, two-factor codes and account recovery, is hard and risky. Auth0 (part of Okta) hosts the login page and user accounts, then hands the app secure tokens that say who the user is.',
      },
    ],
    files: [{ path: 'src/auth.js', note: 'Sets up the Auth0 client and exposes login, logout and token helpers' }],
    code: [
      {
        id: 'fw-auth0-spa',
        title: 'Logging in with Auth0 in a single-page app',
        file: 'src/auth.js',
        language: 'JavaScript',
        explanation:
          'createAuth0Client connects to the app’s Auth0 tenant. loginWithRedirect sends the user to Auth0’s hosted login page; afterwards Auth0 redirects back with a one-time code in the URL, which handleRedirectCallback exchanges for tokens. The app can then read the user’s profile and get an access token (a JWT) to send to its own API, which checks the token instead of handling passwords itself.',
        code: `// src/auth.js (loaded as a module script, so top-level await works)
import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0 = await createAuth0Client({
  domain: 'your-tenant.us.auth0.com',
  clientId: 'YOUR_CLIENT_ID',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://api.example.com', // ask for a token our own API will accept
  },
});

// Coming back from Auth0's login page? Swap the one-time code in the URL for tokens
const params = new URLSearchParams(window.location.search);
if (params.has('code') && params.has('state')) {
  await auth0.handleRedirectCallback();
  window.history.replaceState({}, document.title, '/'); // tidy up the URL
}

document.querySelector('#login').addEventListener('click', () => auth0.loginWithRedirect());
document.querySelector('#logout').addEventListener('click', () =>
  auth0.logout({ logoutParams: { returnTo: window.location.origin } }),
);

if (await auth0.isAuthenticated()) {
  const user = await auth0.getUser(); // name, email, picture…
  const token = await auth0.getTokenSilently(); // a JWT that proves who is calling our API
  const res = await fetch('https://api.example.com/me/orders', { headers: { Authorization: \`Bearer \${token}\` } });
  console.log(\`Hi \${user.name}\`, await res.json());
}`,
      },
    ],
    concepts: [
      {
        term: 'OAuth 2.0 and OpenID Connect',
        meaning:
          'The standard handshake behind “Log in with…” buttons. The app sends you to a trusted login provider, you sign in there, and the provider sends you back with tokens, so the app never sees your password.',
      },
      {
        term: 'JWT (JSON Web Token)',
        meaning:
          'A compact, digitally signed pass holding facts like “this is user 42, valid for one hour”. Servers check the signature to trust it without looking anything up, like a tamper-proof wristband at a festival.',
      },
    ],
    howWeKnow:
      'The page loads files from cdn.auth0.com or talks to an auth0.com login address, or its Content-Security-Policy header allows Auth0’s domains.',
  },
  {
    detection: 'Firebase',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Firebase',
        role: 'Google’s backend-as-a-service: authentication, databases, file storage and functions',
        beginnerNote:
          'Firebase lets a front end talk directly to ready-made back-end services instead of a custom server. Apps can sign users in, store and sync data in Cloud Firestore or the Realtime Database, and upload files, with access controlled by security rules written by the developer.',
      },
    ],
    files: [
      { path: 'src/firebase.js', note: 'Initialises the Firebase app with the project’s public config' },
      { path: 'firestore.rules', note: 'Security rules deciding who may read and write each document' },
    ],
    code: [
      {
        id: 'fw-firebase-firestore',
        title: 'A live chat feed with Cloud Firestore',
        file: 'src/chat.js',
        language: 'JavaScript',
        explanation:
          'initializeApp connects to a Firebase project; its config is public by design, because protection comes from security rules on Firebase’s side. onSnapshot is a live listener: it runs once with the newest 50 messages and again every time a message is added, so every open browser updates instantly with no refresh and no custom server. addDoc saves a new message, and serverTimestamp() lets Firebase fill in the time so users’ clocks cannot fake it.',
        code: `// src/chat.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { renderMessages } from './ui';

// This config is public on purpose; Firebase Security Rules decide who can read or write
const app = initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'my-chat-app.firebaseapp.com',
  projectId: 'my-chat-app',
});
const db = getFirestore(app);
const auth = getAuth(app);

// Live listener: runs now, then again whenever a message is added, for every open browser
const latest = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
onSnapshot(latest, (snapshot) => {
  renderMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
});

export async function sendMessage(text) {
  await addDoc(collection(db, 'messages'), {
    text,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(), // Firebase fills in the time, so clients can't fake it
  });
}`,
      },
    ],
    concepts: [
      {
        term: 'Backend as a service (BaaS)',
        meaning:
          'Ready-made back-end features such as logins, a database and file storage that your app uses through an SDK, instead of writing and running your own server. Faster to start, with less control over the details.',
      },
      {
        term: 'Real-time listener',
        meaning:
          'Subscribing to data instead of asking for it once. The database pushes every change to all subscribed apps immediately, which is how chat messages and live scores appear without refreshing.',
      },
    ],
    howWeKnow:
      'The page talks to Firebase addresses: firebaseio.com (the Realtime Database), firebaseapp.com (a project’s default domain, also used for sign-in) or firebasestorage.googleapis.com (file storage), or its Content-Security-Policy header allows them.',
  },
  {
    detection: 'Supabase',
    stackItems: [
      {
        layer: 'Backend',
        name: 'Supabase',
        role: 'Open-source backend-as-a-service built on PostgreSQL: database, auth, storage and real-time',
        beginnerNote:
          'Supabase gives each project a full PostgreSQL database plus an automatic API, so a front end can read and write data directly. It also handles logins, file storage and live updates, and access is controlled by security policies written inside the database itself.',
      },
      {
        layer: 'Data',
        name: 'PostgreSQL (via Supabase)',
        role: 'Relational database behind every Supabase project',
        beginnerNote:
          'Every Supabase project is a real PostgreSQL database, so data lives in tables with rows and columns and can be queried with SQL, joined, indexed and backed up like any other Postgres database.',
      },
    ],
    language: { name: 'SQL', usedFor: 'PostgreSQL tables, queries and row-level security policies in Supabase' },
    files: [
      { path: 'src/lib/supabase.js', note: 'Creates the Supabase client with the project URL and public key' },
      { path: 'supabase/migrations/20250101000000_create_todos.sql', note: 'SQL that creates tables and their row-level security policies' },
    ],
    code: [
      {
        id: 'fw-supabase-client',
        title: 'Reading and writing data with Supabase',
        file: 'src/lib/supabase.js',
        language: 'JavaScript',
        explanation:
          'createClient connects to the project with its URL and public key, which is safe in the browser because row-level security in the database decides what each user may see. signInWithOtp emails the user a magic login link. The query builder reads like SQL (from, select, eq, order) and is turned into a request to Supabase’s automatic API. Every call returns data and error, so the code checks for errors explicitly.',
        code: `// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// The public key is meant to be visible; row-level security in Postgres decides what each user can access
export const supabase = createClient('https://your-project.supabase.co', 'YOUR_PUBLIC_ANON_KEY');

// Log in with a magic link sent by email
export async function login(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

// Like SQL: SELECT id, title, done FROM todos WHERE done = false ORDER BY created_at
export async function openTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('id, title, done')
    .eq('done', false)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addTodo(title) {
  const { error } = await supabase.from('todos').insert({ title });
  if (error) throw error;
}`,
      },
    ],
    concepts: [
      {
        term: 'Row-level security (RLS)',
        meaning:
          'Rules stored in the database that decide, row by row, who may read or change data, such as “users can only see todos where user_id matches their own id”. Even if someone calls the API directly, the database enforces the rule.',
      },
    ],
    howWeKnow:
      'The page talks to an address ending in .supabase.co, the unique URL every Supabase project gets, or its Content-Security-Policy header allows it.',
  },
  {
    detection: 'YouTube embeds',
    stackItems: [
      {
        layer: 'Frontend',
        name: 'YouTube embeds',
        role: 'Videos hosted on YouTube and shown inside the page with an embedded player',
        beginnerNote:
          'Streaming video is expensive: it needs huge storage, many file formats and lots of bandwidth. Embedding a YouTube player lets a site show videos while YouTube does all of that work, at the cost of loading YouTube’s code on the page.',
      },
    ],
    files: [],
    code: [
      {
        id: 'fw-youtube-embed',
        title: 'Embedding and controlling a YouTube video',
        file: 'lesson.html',
        language: 'HTML + JavaScript',
        explanation:
          'The iframe is a window that shows YouTube’s player inside the page. Using youtube-nocookie.com turns on privacy-enhanced mode, and loading="lazy" waits to load the player until it scrolls into view. For more control, YouTube’s IFrame Player API builds the player from JavaScript: YouTube’s script calls onYouTubeIframeAPIReady when it is ready, and the onStateChange event reports things like the video ending, so the page can react.',
        code: `<!-- Simple embed: an iframe shows YouTube's player inside this page -->
<iframe
  width="560" height="315"
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID?start=30"
  title="Product demo video"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

<!-- More control: the IFrame Player API -->
<div id="player"></div>
<script>
  // YouTube's script calls this function by name once it has loaded
  function onYouTubeIframeAPIReady() {
    new YT.Player('player', {
      videoId: 'VIDEO_ID',
      events: {
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) console.log('Video finished, show the quiz!');
        },
      },
    });
  }
</script>
<script src="https://www.youtube.com/iframe_api"></script>`,
      },
    ],
    concepts: [
      {
        term: 'iframe',
        meaning:
          'An HTML element that shows another web page inside a rectangle on your page, like a picture-in-picture window. The embedded page runs separately and cannot read your page’s content.',
      },
    ],
    howWeKnow:
      'The page embeds videos from youtube.com/embed/ or youtube-nocookie.com (YouTube’s privacy-enhanced embed domain), or its Content-Security-Policy header allows them.',
  },
];
