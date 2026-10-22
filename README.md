# अधिवक्ता सुरक्षा आंदोलन | अधिवक्ता सुरक्षा अधिनियम अभियान

Static SEO-friendly Hindi website + Vercel serverless API. No separate database is used. Posts, events and settings are stored as JSON files in the connected GitHub repository; the API commits changes using a server-side GitHub token. A GitHub commit triggers a Vercel deployment.

## Branding and motion update
- Custom legal emblem logo and matching SVG favicon are included.
- Homepage and Admin Panel use subtle professional animations, animated legal-themed decoration, hover states, and reduced-motion accessibility support.
- Public brand name: **अधिवक्ता सुरक्षा आंदोलन**.

## Before deployment
1. Create a new GitHub repository and upload the contents of this folder to the repository root.
2. In GitHub, create a fine-grained Personal Access Token limited to this repository with **Contents: Read and write** permission. Keep it secret.
3. Import the repository into Vercel.
4. In Vercel → Project → Settings → Environment Variables, add:
   - `GITHUB_OWNER` = GitHub username/organization that owns the repository
   - `GITHUB_REPO` = repository name only
   - `GITHUB_TOKEN` = token created above
   - `GITHUB_BRANCH` = `main` (or your actual default branch)
   - `ADMIN_PASSWORD` = a long unique password, not used elsewhere
   - `SITE_URL` = `https://adhivakta-suraksha.vercel.app` (used for article canonical URLs)
5. Redeploy after adding variables.
6. Domain is already set to `https://adhivakta-suraksha.vercel.app` in canonical links, robots.txt and sitemap.xml. Keep the `SITE_URL` environment variable set to the same domain.
7. Open `/admin.html`, log in with `ADMIN_PASSWORD`, then create posts/events and add the Google Form URL.

## Admin panel features
- Create/edit posts, category, excerpt, full text and draft/published status.
- Publish a standalone HTML article page with title, description, canonical URL and Open Graph tags.
- Add event entries and Google Forms/contact settings.
- Every save creates GitHub commits. Vercel should redeploy from the connected repository.

## Important limitations / security
- No separate database. GitHub repository files are the source of truth; keep the repository private if you do not want the content source exposed, but ensure Vercel can deploy it.
- GitHub token and admin password must only exist in Vercel Environment Variables. Never put either in HTML/JS or commit them.
- Admin login uses a shared password header over HTTPS and does not implement user accounts, password reset, or rate limiting. Use a strong password and enable GitHub/Vercel account MFA. For a large public organization, use proper identity and rate limiting.
- Editing an existing post updates its HTML file and post index. Deleting a post removes it from the index but does not delete the old HTML file automatically; remove it from GitHub if needed.
- The generated article canonical uses `SITE_URL`; set it to `https://adhivakta-suraksha.vercel.app` in Vercel Environment Variables.
- Initial sample article is general awareness content and intentionally avoids claiming a particular law is already enacted. Verify all legal and event information before publishing.
- Google Forms are operated by Google and the form owner; provide a suitable privacy notice in the form itself.
- SEO cannot be guaranteed. Submit the sitemap in Google Search Console after deployment and add original, accurate, helpful articles over time.

## Local preview
You can open `index.html` for a visual preview, but `/api/posts` and Admin Panel writes require Vercel/serverless deployment and the environment variables above.


### पोस्ट में तस्वीर जोड़ना
1. `/admin.html` खोलकर Admin Password से लॉगिन करें।
2. लेख बनाते/संपादित करते समय “पोस्ट की मुख्य तस्वीर” में JPG, PNG, WebP या GIF चुनें (अधिकतम 3 MB)।
3. “तस्वीर अपलोड करें” दबाएं। तस्वीर `assets/uploads/` में GitHub पर सेव होगी।
4. तस्वीर अपलोड होने के बाद लेख को सेव/प्रकाशित करें।
5. होमपेज और लेख सूची में तस्वीर वाला कार्ड दिखेगा। तस्वीर या शीर्षक पर टैप करने से पूरा लेख खुलेगा; लेख पेज पर तस्वीर ऊपर दिखाई देगी।

तस्वीर अपलोड करने के लिए वही GitHub token आवश्यक है जिसमें repository के Contents read/write permissions हों।


## Image posts and feed behavior
- Admin Panel में JPG/PNG/WebP/GIF (अधिकतम 2 MB) चुनें, preview देखें और “तस्वीर अपलोड करें” दबाएँ।
- तस्वीर GitHub repository के `assets/uploads/` में सेव होती है। फिर पोस्ट सेव/प्रकाशित करें।
- होमपेज और `/blog.html` पर Blogger-style image cards दिखते हैं; तस्वीर या शीर्षक टैप करने पर पूरा article page खुलता है।
- नई पोस्ट मौजूदा पोस्टों के बाद feed में जुड़ती है; पुराने लेख edit करने पर उसी जगह अपडेट होता है।
- छह आवश्यक Vercel variables और उनके अर्थ `VERCEL-ENV-VARIABLES.txt` में हैं। `SITE_URL` में वास्तविक deployed domain डालें और static HTML और sitemap में domain पहले से सेट है। यदि आगे custom domain जोड़ें, तभी सभी canonical URLs, `SITE_URL`, robots.txt और sitemap को एक साथ बदलें।
- GitHub Contents API image upload के लिए token में `Contents: Read and write` permission अनिवार्य है।

### Image uploads (no Vercel Blob required)
Images are resized/compressed in the admin browser and uploaded through the existing GitHub Contents API into `uploads/`. The API returns a site-relative path such as `/uploads/image.jpg`; posts and article pages use that path, so images display from the same deployed website. No Vercel Blob store or `BLOB_READ_WRITE_TOKEN` is required. The existing `GITHUB_TOKEN` must have repository Contents read/write permission. Vercel automatically deploys after the image file is committed; publish/save the post after upload and wait for deployment to finish.
