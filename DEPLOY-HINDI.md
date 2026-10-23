# अधिवक्ता सुरक्षा आंदोलन — Ready to Deploy

## 1. GitHub पर अपलोड
1. ZIP को extract करें। अंदर `adhivakta-suraksha-main` folder की files अपने उसी GitHub repository में अपलोड करें, जिससे वर्तमान Vercel project जुड़ा है।
2. यदि GitHub पूछे तो existing files को replace/update करें। कोई नया Supabase project या database आवश्यक नहीं है।
3. GitHub Token या कोई पासवर्ड source code में न डालें।

## 2. Vercel Environment Variables
Vercel → Project → Settings → Environment Variables में इन variables को जांचें:
- `GITHUB_OWNER`: GitHub username/organization
- `GITHUB_REPO`: वही repository का नाम
- `GITHUB_TOKEN`: उस repository के लिए Contents Read/Write permission वाला token
- `GITHUB_BRANCH`: सामान्यतः `main`
- `ADMIN_PASSWORD`: मजबूत, निजी Admin password
- `SITE_URL`: `https://adhivakta-suraksha.vercel.app` (यदि custom domain हो तो अपना वास्तविक domain)
- `WRITER_PASSWORD`: वैकल्पिक अलग पासवर्ड; इसे सेट करने पर Writer केवल ड्राफ्ट लेख सेव कर सकता है।

Variables सेव करने के बाद Redeploy करें। GitHub token या passwords को किसी को न भेजें और न ही public repo में रखें।

## 3. Admin / Writer
- Admin: लेख प्रकाशित/ड्राफ्ट, कार्यक्रम और Google Form/contact settings नियंत्रित कर सकता है।
- Writer: `WRITER_PASSWORD` सेट होने पर Writer केवल ड्राफ्ट लेख बना/संपादित कर सकता है; प्रकाशित लेख, कार्यक्रम, सेटिंग, अपलोड और डिलीट Admin तक सीमित हैं।
- Writer सुविधा इस्तेमाल नहीं करनी हो तो `WRITER_PASSWORD` सेट करने की जरूरत नहीं।

## 4. Google Form और कार्यक्रम
Admin Panel (`/admin.html`) में लॉगिन करके Google Form का प्रकाशित URL, बटन का नाम और संपर्क विवरण सेव करें। कार्यक्रम जोड़ने के लिए नाम, सही तारीख, समय और स्थान भरें। वेबसाइट पर कोई कार्यक्रम तभी दिखेगा जब उसे Admin Panel से सेव किया जाएगा।

## 5. Deployment के बाद जाँच
- `/` — होमपेज
- `/blog.html` — लेख सूची और खोज
- `/terms.html`, `/privacy.html`, `/disclaimer.html` — नीति/शर्तें
- `/admin.html` — Admin/Writer login
- `/sitemap.xml` और `/robots.txt` — SEO files
- Admin से पहले एक test draft बनाएं, उसे public blog पर न दिखने की पुष्टि करें, फिर Admin से प्रकाशित करके जांचें।
- Google Search Console में sitemap submit करें। URL Inspection से महत्वपूर्ण पेजों की indexing request करें; indexing और ranking की गारंटी नहीं होती।

## 6. महत्त्वपूर्ण
यह पैकेज मौजूदा GitHub/Vercel संरचना पर आधारित है और नई database service नहीं जोड़ता। सहभागिता/हस्ताक्षर के लिए पहले से configured Google Form उपयोग होता है। व्यक्तिगत डेटा केवल आवश्यक सीमा तक लें और फॉर्म में उद्देश्य व गोपनीयता जानकारी स्पष्ट रखें।
