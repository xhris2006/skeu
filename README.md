# Skeu Landing Page

Single-page static website for `skeu` with:

- local sign up and login
- admin login with dashboard access
- logout and account info display
- section search
- custom SVG app icon and favicon

## Project Files

- `index.html`: main website
- `icon.svg`: favicon and brand icon

## Default Admin Access

Use these credentials in the login form:

- Email: `admin@skeu.com`
- Password: `Admin123!`

After login, the admin dashboard section becomes visible.

## How The Demo Auth Works

This project is static, so authentication is handled in the browser with `localStorage`.

- New users are saved locally in the browser
- The current logged-in user is saved locally
- The admin account is seeded automatically in JavaScript
- If you clear browser storage, demo accounts are removed and recreated fresh

## Run Locally

### Option 1: Open directly

1. Download or clone the repository.
2. Open the project folder.
3. Double-click `index.html`.

### Option 2: Use a local server

1. Open the folder in a terminal.
2. Run one of these commands:

```powershell
python -m http.server 8080
```

or

```powershell
npx serve .
```

3. Open `http://localhost:8080` or the URL shown in the terminal.

## How To Test The Main Features

### Sign up

1. Open the site.
2. Go to the `Account` section.
3. Fill in the `Sign Up` form.
4. Submit the form.
5. The user should be logged in automatically.

### Log in

1. Go to the `Account` section.
2. Fill in the `Log In` form.
3. Submit the form.
4. The saved user information should appear.

### Logout

1. Log in first.
2. Click `Logout`.
3. The guest forms should appear again.

### Admin dashboard

1. Open the `Account` section.
2. Log in with:
   `admin@skeu.com`
   `Admin123!`
3. The account card should show administrator access.
4. The `Admin Dashboard` section should become visible.

### Search

1. Use the search bar in the header or mobile menu area.
2. Type a keyword like `dashboard`, `pricing`, `developers`, or `account`.
3. Click `Search`.
4. Matching sections are highlighted and the page scrolls to the first result.

## Deployment Guide

## Deploy On GitHub Pages

1. Push the project to GitHub.
2. Open the repository on GitHub.
3. Click `Settings`.
4. In the left menu, click `Pages`.
5. Under `Build and deployment`, choose:
   `Source` = `Deploy from a branch`
6. Select:
   `Branch` = `main`
   `Folder` = `/ (root)`
7. Click `Save`.
8. Wait for GitHub to publish the site.
9. GitHub will show the public URL in the Pages section.

## Deploy On Netlify

1. Log in to Netlify.
2. Click `Add new site`.
3. Click `Import an existing project`.
4. Connect your GitHub account.
5. Select this repository.
6. For a static project, use:
   Build command: leave empty
   Publish directory: `.`
7. Click `Deploy site`.
8. Wait for deployment to finish.
9. Open the generated Netlify URL.

## Deploy On Vercel

1. Log in to Vercel.
2. Click `Add New...`
3. Click `Project`.
4. Import the GitHub repository.
5. Vercel detects it as a static site.
6. Keep the default settings.
7. Click `Deploy`.
8. Wait for the deployment URL.

## Update The Admin Credentials

If you want to change the admin login:

1. Open `index.html`.
2. Find `DEFAULT_ADMIN` in the script section.
3. Change:
   - `name`
   - `email`
   - `password`
   - `company`
4. Save the file.
5. Redeploy the site.

## Important Notes

- This is a browser-side demo only.
- It is not secure enough for production authentication.
- For real production login, use a backend, a database, hashed passwords, and secure sessions.

## Recommended Next Step For Production

If you want real authentication and a real admin dashboard, migrate this static page to:

- Next.js
- Supabase or PostgreSQL
- secure login sessions
- protected admin routes
