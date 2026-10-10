# Project Structure

```text
AutoFactory/
    ├── Alexandria.ttf
    ├── Tajawal.ttf
    ├── extract_code.py
    ├── package.json
    ├── project_structure.md
    ├── منصة شاملة.docx
├── autofactory-backend/
    ├── .env
    ├── Alexandria-Black.ttf
    ├── Alexandria-Bold.ttf
    ├── Alexandria-ExtraBold.ttf
    ├── Alexandria-ExtraLight.ttf
    ├── Alexandria-Light.ttf
    ├── Alexandria-Medium.ttf
    ├── Alexandria-Regular.ttf
    ├── Alexandria-SemiBold.ttf
    ├── Alexandria-Thin.ttf
    ├── Alexandria.ttf
    ├── Cairo-Black.ttf
    ├── Cairo-Bold copy.ttf
    ├── Cairo-Bold.ttf
    ├── Cairo-ExtraBold.ttf
    ├── Cairo-ExtraLight.ttf
    ├── Cairo-Light.ttf
    ├── Cairo-Medium.ttf
    ├── Cairo-Regular.ttf
    ├── Cairo-SemiBold.ttf
    ├── Cairo.ttf
    ├── Lead.js
    ├── Marhey-Bold.ttf
    ├── OFL.txt
    ├── Tajawal - Bold.ttf
    ├── Tajawal-Black.ttf
    ├── Tajawal-ExtraBold.ttf
    ├── Tajawal-ExtraLight.ttf
    ├── Tajawal-Light.ttf
    ├── Tajawal-Medium.ttf
    ├── Tajawal-Regular.ttf
    ├── Tajawal.ttf
    ├── check.js
    ├── check_gemini.js
    ├── ffmpeg-9.0.2.tar.xz
    ├── get_token.py
    ├── list_gemini_models.js
    ├── package.json
    ├── publish_carousel.js
    ├── server.js
    ├── test-email.js
    ├── test-token.js
    ├── test-webhook.jS
    ├── models/
        ├── Campaign.js
        ├── CommercialAd.js
    ├── pictures/
    ├── temp/
    ├── templates/
        ├── Alexandria-Black.ttf
        ├── Alexandria-Bold.ttf
        ├── Alexandria-ExtraBold.ttf
        ├── Alexandria-ExtraLight.ttf
        ├── Alexandria-Light.ttf
        ├── Alexandria-Medium.ttf
        ├── Alexandria-Regular.ttf
        ├── Alexandria-SemiBold.ttf
        ├── Alexandria-Thin.ttf
        ├── Alexandria.ttf
        ├── Cairo-Black.ttf
        ├── Cairo-Bold copy.ttf
        ├── Cairo-Bold.ttf
        ├── Cairo-ExtraBold.ttf
        ├── Cairo-ExtraLight.ttf
        ├── Cairo-Light.ttf
        ├── Cairo-Medium.ttf
        ├── Cairo-Regular.ttf
        ├── Cairo-SemiBold.ttf
        ├── Marhey-Bold.ttf
        ├── OFL.txt
        ├── Tajawal-Black.ttf
        ├── Tajawal-Bold.ttf
        ├── Tajawal-ExtraBold.ttf
        ├── Tajawal-ExtraLight.ttf
        ├── Tajawal-Light.ttf
        ├── Tajawal-Medium.ttf
        ├── Tajawal-Regular.ttf
        ├── Tajawal.ttf
        ├── ai_comparison.js
        ├── ai_roadmap.js
        ├── business_roadmap.js
        ├── drawStorySlide.js
        ├── terminal.js
        ├── triple_comparison.js
    ├── uploads/
        ├── 2cb6d61df7534e207f8990777a5c789b
        ├── 5ed08ea124dc1f13125f074e1463cfae
        ├── 7338043609c0e48eb1c5686291e7e9a5
        ├── 92f5599dca067ad5d41d7a45343ac156
        ├── cdfd397e54953f424669347b2840ff31
        ├── d60be90b72f910c76a9f0f6301e2b51d
        ├── e8ebb7f70eef936e513ed69c41dbb818
        ├── eaddc43c49f89f950387c28833916b3a
        ├── توقف عن التعلم!
        ├── توقف عن الكود
        ├── فول ستاك الخطوة الاولى
    ├── videos/
├── autofactory-serv/
    ├── .env
    ├── designer.js
    ├── index.js
    ├── index1.js
    ├── package.json
    ├── publish.js
    ├── reels.js
    ├── scheduler.js
    ├── upload.js
    ├── Pictures/
├── autofactory-ui/
    ├── .oxlintrc.json
    ├── README.md
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    ├── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
        ├── layouts/
            ├── MainLayout.jsx
        ├── pages/
            ├── AcademyLab.jsx
            ├── BusinessLab.jsx
            ├── CampaignManager.jsx
            ├── CommercialLab.jsx
            ├── LeadsDashboard.jsx
            ├── PromptStudio.jsx
            ├── ReelLab.jsx
            ├── RoadmapLab.jsx
            ├── StoryLab.jsx
            ├── TemplateLab.jsx
            ├── TrendHub.jsx
            ├── TripleTemplateLab.jsx
        ├── store/
            ├── useIdeaStore.js
```


---

# Source Code

## `extract_code.py`

```python
import os

# ==============================
# الإعدادات
# ==============================

OUTPUT_FILE = "project_structure.md"
MAX_DEPTH = 3                 # أقصى عمق للشجرة
MAX_FILE_SIZE = 200 * 1024    # 200KB

IGNORE_DIRS = {
    ".git",
    ".github",
    ".idea",
    ".vscode",
    "node_modules",
    "fet-engine",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    "build",
    "dist",
    "release",
    "out",
    "target",
    "bin",
    "obj",
    "coverage",
    ".next"
}

IGNORE_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".gitignore",
    ".DS_Store",
    "Thumbs.db"
}

IGNORE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".ico",
    ".pdf",
    ".zip", ".rar", ".7z",
    ".mp3", ".mp4", ".wav",
    ".exe", ".dll",
    ".pyc",
    ".log"
}

CODE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".css",
    ".html",
    ".md",
    ".sql"
}


def language(ext):
    ext = ext.lower()

    if ext == ".py":
        return "python"

    if ext in [".js", ".jsx"]:
        return "javascript"

    if ext in [".ts", ".tsx"]:
        return "typescript"

    if ext == ".css":
        return "css"

    if ext == ".html":
        return "html"

    if ext == ".json":
        return "json"

    if ext == ".sql":
        return "sql"

    if ext == ".md":
        return "markdown"

    return "text"


def generate(directory):

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:

        ##################################################
        # Project Tree
        ##################################################

        f.write("# Project Structure\n\n")
        f.write("```text\n")

        for root, dirs, files in os.walk(directory):

            dirs[:] = sorted([d for d in dirs if d not in IGNORE_DIRS])

            level = os.path.relpath(root, directory).count(os.sep)

            if level > MAX_DEPTH:
                dirs.clear()
                continue

            indent = "    " * level

            folder = os.path.basename(root)

            if root == directory:
                f.write(f"{os.path.basename(directory)}/\n")
            else:
                f.write(f"{indent}├── {folder}/\n")

            sub = "    " * (level + 1)

            for file in sorted(files):

                if file in IGNORE_FILES:
                    continue

                ext = os.path.splitext(file)[1].lower()

                if ext in IGNORE_EXTENSIONS:
                    continue

                f.write(f"{sub}├── {file}\n")

        f.write("```\n\n")

        ##################################################
        # Source Code
        ##################################################

        f.write("\n---\n\n")
        f.write("# Source Code\n\n")

        for root, dirs, files in os.walk(directory):

            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in sorted(files):

                if file in IGNORE_FILES:
                    continue

                ext = os.path.splitext(file)[1].lower()

                if ext not in CODE_EXTENSIONS:
                    continue

                path = os.path.join(root, file)

                if os.path.getsize(path) > MAX_FILE_SIZE:
                    continue

                relative = os.path.relpath(path, directory)

                f.write(f"## `{relative}`\n\n")

                f.write(f"```{language(ext)}\n")

                try:
                    with open(path, "r", encoding="utf-8") as code:
                        f.write(code.read())
                except UnicodeDecodeError:
                    f.write("// Unable to read file (encoding).")
                except Exception as e:
                    f.write(f"// {e}")

                f.write("\n```\n\n---\n\n")

    print("Done!")
    print("Output:", OUTPUT_FILE)


if __name__ == "__main__":
    generate(os.getcwd())
```

---

## `package.json`

```json
{
  "dependencies": {
    "axios": "^1.20.0"
  }
}

```

---

## `project_structure.md`

```markdown

```

---

## `autofactory-backend\Lead.js`

```javascript
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    username: { type: String, required: true },
    instagram_id: { type: String, required: true, unique: true },
    last_keyword: { type: String },
    interaction_count: { type: Number, default: 0 },
    last_interaction: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
```

---

## `autofactory-backend\check.js`

```javascript
require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listMyModels() {
    try {
        console.log("⏳ جاري الاتصال بخوادم Groq لجلب النماذج المتاحة لك...");
        const response = await groq.models.list();
        
        console.log("\n✅ هذه هي النماذج (Model IDs) التي يدعمها مفتاحك حالياً:");
        console.log("---------------------------------------------------");
        
        response.data.forEach(model => {
            console.log(`📌 ${model.id}`);
        });
        
        console.log("---------------------------------------------------");
        console.log("انسخ أي اسم من هذه الأسماء وضعه في ملف server.js!");
    } catch (error) {
        console.error("❌ حدث خطأ:", error.message);
    }
}

listMyModels();
```

---

## `autofactory-backend\check_gemini.js`

```javascript
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkAllGeminiKeys() {
    console.log("==========================================");
    console.log("🔍 أداة فحص ترسانة مفاتيح Google Gemini (الـ 7 مفاتيح)");
    console.log("==========================================\n");

    // جلب كل المفاتيح من ملف .env وتجاهل الفارغ منها
    const geminiKeys = [
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
        process.env.GEMINI_API_KEY_4,
        process.env.GEMINI_API_KEY_5,
        process.env.GEMINI_API_KEY_6,
        process.env.GEMINI_API_KEY_7
    ].filter(Boolean); 

    if (geminiKeys.length === 0) {
        console.log("❌ خطأ: لم يتم العثور على أي مفتاح GEMINI في ملف .env!");
        return;
    }

    console.log(`🎯 تم العثور على ${geminiKeys.length} مفاتيح في ملف البيئة. جاري الفحص...\n`);

    let validCount = 0;

    for (let i = 0; i < geminiKeys.length; i++) {
        const apiKey = geminiKeys[i];
        // إخفاء جزء من المفتاح للأمان عند الطباعة
        const keyPreview = apiKey.substring(0, 10) + "********"; 
        
        console.log(`[المفتاح رقم ${i + 1}] (${keyPreview})`);
        
    try {
            const genAI = new GoogleGenerativeAI(apiKey);
            // 🌟 التعديل هنا: استخدام نموذج gemini-pro بدلاً من gemini-1.5-flash
             const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
            // حساب وقت الاستجابة
            const startTime = Date.now();
            
            // إرسال طلب صغير
            const result = await model.generateContent("Respond with exactly one word: 'READY'.");
            const responseText = result.response.text().trim();
            
            const ping = Date.now() - startTime;

            console.log(`   ✅ [نجاح] صالح ويعمل (السرعة: ${ping}ms) - الرد: ${responseText}`);
            validCount++;
        } catch (error) {
            console.log(`   ❌ [فشل]`);
            
            if (error.message.includes("API key not valid")) {
                console.log(`      ⚠️ السبب: المفتاح غير صالح (تأكد من النسخ الصحيح).`);
            } else if (error.status === 429 || error.message.includes("quota")) {
                console.log(`      ⚠️ السبب: تم تجاوز الحد المسموح (Rate Limit).`);
            } else {
                console.log(`      ⚠️ السبب التقني: ${error.message}`);
            }
        }
        console.log("------------------------------------------");
    }

    console.log(`\n📊 النتيجة النهائية: ${validCount} من أصل ${geminiKeys.length} مفاتيح تعمل بكفاءة!`);
    
    if(validCount > 0) {
        console.log("🚀 بمجرد دمج هذه الترسانة في السيرفر، ستتمكن من توليد مئات الشرائح دفعة واحدة!");
    }
}

checkAllGeminiKeys();
```

---

## `autofactory-backend\get_token.py`

```python
import requests

# ضع بيانات تطبيقك هنا مرة واحدة فقط
APP_ID = "1662030362170059"
APP_SECRET = "ddf2fd8962847f57507836fa69ace7b1"
CURRENT_USER_TOKEN = "EAAXnm5lX0ssBSrILqj3BZBKRPPq7lLX5ebh80Xprm5VKbs3V1WJ8G7FQJZBS6unnj3QZCRsyZC219uUZArgQ42nBfUexTTTri9uJR2PZByZCqO54MZCovx28LgIGf3KnXjZCa3QcSc8bq7YJsUQL4Jtum0leIN1mg3QaTBdHX5UzLxZCQ2XOzZBglwj5y9C0xAf0XaYm8Hq5E3OsMPBAsZAZBDZCsAcXuS3VThy8Ks2jHp1kiqCQgWufaZCjJrifNuqzNvrU9Vz4ZBiJZAgdX68K5J3oL9g4w"

# صانع الرابط
url = f"https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={CURRENT_USER_TOKEN}"

print("\n🔗 الرابط الخاص بك جاهز:")
print("=" * 70)
print(url)
print("=" * 70)
print("\n💡 انسخ هذا الرابط بالكامل وافتحه في المتصفح للحصول على التوكن الطويل.")

def get_permanent_page_token():
    print("⏳ جاري تحويل التوكن إلى طويل المدى...")
    
    # الخطوة 1: استبدال التوكن بآخر طويل المدى
    exchange_url = f"https://graph.facebook.com/v19.0/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": APP_ID,
        "client_secret": APP_SECRET,
        "fb_exchange_token": CURRENT_USER_TOKEN
    }
    
    response = requests.get(exchange_url, params=params)
    data = response.json()
    
    if "access_token" not in data:
        print("❌ حدث خطأ في استخراج التوكن طويل المدى:", data)
        return
    
    long_lived_user_token = data["access_token"]
    print("✅ تم الحصول على رمز المستخدم طويل المدى بنجاح!")

    print("⏳ جاري البحث عن صفحاتك وجلب التوكن الدائم للصفحة...")
    
    # الخطوة 2: جلب صفحات المستخدم والتوكن الدائم لكل صفحة
    accounts_url = f"https://graph.facebook.com/v19.0/me/accounts"
    accounts_params = {
        "access_token": long_lived_user_token
    }
    
    acc_response = requests.get(accounts_url, params=accounts_params)
    acc_data = acc_response.json()
    
    if "data" in acc_data and len(acc_data["data"]) > 0:
        print("\n" + "="*50)
        print("🎉 تم استخراج التوكنات الدائمة لصفحاتك بنجاح:")
        print("="*50)
        for page in acc_data["data"]:
            page_name = page.get("name")
            page_id = page.get("id")
            page_token = page.get("access_token")
            print(f"📄 اسم الصفحة: {page_name}")
            print(f"🆔 معرف الصفحة (Page ID): {page_id}")
            print(f"🔑 التوكن الدائم (PAGE_ACCESS_TOKEN):\n{page_token}\n")
        print("="*50)
        print("💡 قم بنسخ التوكن الخاص بصفحتك وضعه في ملف .env ولن تنتهي صلاحيته أبداً!")
    else:
        print("❌ لم يتم العثور على صفحات مربوطة بهذا الحساب:", acc_data)

if __name__ == "__main__":
    get_permanent_page_token()
```

---

## `autofactory-backend\list_gemini_models.js`

```javascript
require('dotenv').config();
const axios = require('axios');

async function listGeminiModels() {
    console.log("==========================================");
    console.log("🔍 أداة استكشاف نماذج Google Gemini المتاحة");
    console.log("==========================================\n");

    // جلب المفاتيح من ملف .env
    const geminiKeys = [
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
        process.env.GEMINI_API_KEY_4,
        process.env.GEMINI_API_KEY_5,
        process.env.GEMINI_API_KEY_6,
        process.env.GEMINI_API_KEY_7
    ].filter(Boolean);

    if (geminiKeys.length === 0) {
        console.log("❌ خطأ: لم يتم العثور على أي مفتاح GEMINI في ملف .env!");
        return;
    }

    // سنستخدم أول مفتاح صالح لطلب القائمة (لأن القائمة هي نفسها لجميع المفاتيح)
    const apiKey = geminiKeys[0];
    console.log("⏳ جاري الاتصال بخوادم Google لجلب النماذج المدعومة...\n");

    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const models = response.data.models;

        console.log("✅ النماذج المتاحة الصالحة لتوليد النصوص والأكواد (generateContent):");
        console.log("------------------------------------------------------------------");

        let count = 0;
        models.forEach(model => {
            // نحن نهتم فقط بالنماذج التي تدعم توليد المحتوى (generateContent)
            if (model.supportedGenerationMethods.includes("generateContent")) {
                // إزالة كلمة 'models/' من الاسم ليكون جاهزاً للنسخ
                const cleanName = model.name.replace('models/', '');
                console.log(`📌 ${cleanName}`);
                console.log(`   📝 الوصف: ${model.description}`);
                console.log(`   📏 أقصى عدد توكنز للإدخال: ${model.inputTokenLimit}`);
                console.log(`   📏 أقصى عدد توكنز للإخراج: ${model.outputTokenLimit}`);
                console.log("------------------------------------------------------------------");
                count++;
            }
        });

        console.log(`\n🎉 تم العثور على ${count} نماذج قوية يمكنك استخدامها في مصفوفة الطوارئ!`);

    } catch (error) {
        console.error("\n❌ حدث خطأ أثناء جلب النماذج:");
        if (error.response && error.response.data) {
            console.error(error.response.data.error.message);
        } else {
            console.error(error.message);
        }
    }
}

listGeminiModels();
```

---

## `autofactory-backend\package.json`

```json
{
  "name": "autofactory-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "axios": "^1.20.0",
    "canvas": "^3.2.3",
    "cloudinary": "^2.11.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "fluent-ffmpeg": "^2.1.3",
    "groq-sdk": "^1.6.0",
    "mongoose": "^9.10.4",
    "multer": "^2.4.0",
    "node-cron": "^4.6.0",
    "nodemailer": "^10.0.14"
  }
}

```

---

## `autofactory-backend\publish_carousel.js`

```javascript
require('dotenv').config();
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// 1. إعداد الاتصال بالسحابة (كما في أكوادك السابقة)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // معرّفك الخاص
const VERSION = 'v20.0';

async function publishCarousel(imagePaths, caption) {
    try {
        console.log('\n======================================');
        console.log('🚀 بدء دورة نشر الألبوم (Carousel) عبر AutoFactory');
        console.log('======================================');
        
// ----------------------------------------------------
        // المرحلة الأولى: الرفع السحابي المتعدد مع التحويل الإجباري
        // ----------------------------------------------------
        console.log('\n☁️ 1. جاري رفع الصور إلى السحابة...');
        let imageUrls = [];
        for (let i = 0; i < imagePaths.length; i++) {
            
            // 💡 السلاح الأقوى: نجبر السحابة على تحويل الصور إلى JPG ليرضى إنستغرام
            const uploadRes = await cloudinary.uploader.upload(imagePaths[i], { 
                folder: 'AutoFactory_Carousel',
                format: 'jpg' 
            });
            
            imageUrls.push(uploadRes.secure_url);
            console.log(`   ✅ الصورة ${i + 1} تم رفعها بنجاح`);
        }

        console.log('⏳ ننتظر 8 ثوانٍ لضمان انتشار الروابط في السحابة...');
        await new Promise(resolve => setTimeout(resolve, 8000));

// ----------------------------------------------------
        // المرحلة الثانية: إنشاء الحاويات الفرعية في Meta (مع نظام الإنقاذ الهادئ)
        // ----------------------------------------------------
        console.log('\n📦 2. إنشاء حاويات فرعية (Carousel Items) في Meta...');
        let creationIds = [];
        
        for (let i = 0; i < imageUrls.length; i++) {
            let success = false;
            let attempts = 0; 
            let itemId = null;
            
            // 💡 زدنا عدد المحاولات إلى 4
            while (!success && attempts < 4) {
                attempts++;
                
                // 💡 التعديل الأهم: نستخدم الرابط النقي تماماً بدون ?t= لكي لا نوقظ جدار الحماية
                const pureUrl = imageUrls[i];
                
                try {
                    if (attempts > 1) {
                        console.log(`   🔄 إعادة المحاولة (${attempts}/4) للصورة ${i + 1}...`);
                    }
                    
                    const itemRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
                        params: {
                            image_url: pureUrl,
                            is_carousel_item: true,
                            access_token: TOKEN
                        }
                    });
                    
                    itemId = itemRes.data.id;
                    success = true; 
                    creationIds.push(itemId);
                    console.log(`   ✅ تم إنشاء حاوية للصورة ${i + 1} (ID: ${itemId})`);
                    
                } catch (err) {
                    console.error(`   ⚠️ فشلت المحاولة ${attempts} للصورة ${i + 1}.`);
                    
                    if (attempts === 4) { 
                        console.error('\n❌ استنفدنا جميع المحاولات! التفاصيل:');
                        console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                        throw err; 
                    }
                    
                    // 💡 استراحة 15 ثانية عند الفشل لتهدئة خوادم Cloudinary و Meta
                    console.log('   ⏳ ننتظر 15 ثانية قبل المحاولة مجدداً لتهدئة السيرفرات...');
                    await new Promise(resolve => setTimeout(resolve, 15000));
                }
            }

            // 💡 استراحة 12 ثانية كاملة بين نجاح صورة والبدء في الصورة التي تليها
            if (i < imageUrls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 12000));
            }
        }
        // ----------------------------------------------------
        // المرحلة الثالثة: دمج الحاويات في ألبوم واحد
        // ----------------------------------------------------
        console.log('\n📚 3. دمج الحاويات في ألبوم (Carousel Container)...');
        const carouselRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
            params: {
                media_type: 'CAROUSEL',
                children: creationIds.join(','), // نرسل المعرّفات مفصولة بفاصلة
                caption: caption,
                access_token: TOKEN
            }
        });
        const carouselId = carouselRes.data.id;
        console.log(`   ✅ تم إنشاء حاوية الألبوم بنجاح (ID: ${carouselId})`);

        // ----------------------------------------------------
        // المرحلة الرابعة: النشر الفعلي على إنستغرام
        // ----------------------------------------------------
        console.log('\n📢 4. إرسال أمر النشر النهائي لحساب إنستغرام...');
        const publishRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media_publish`, null, {
            params: {
                creation_id: carouselId,
                access_token: TOKEN
            }
        });

        console.log('\n🎉 نجاح ساحق! تم نشر الألبوم بجميع شرائحه على حسابك.');
        console.log('🆔 معرّف المنشور (Post ID):', publishRes.data.id);
        
} catch (error) {
        console.error('\n❌ حدث خطأ في إحدى المراحل:');
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error);
    }
}

// ==========================================
// 🧪 قسم الاختبار (التشغيل اليدوي)
// ==========================================
const myGeneratedImages = [
    'pictures/post_🎙️ فن الصوت_slide_1.png', 
    'pictures/post_🎙️ فن الصوت_slide_2.png',
    'pictures/post_🎙️ فن الصوت_slide_3.png',
    'pictures/post_🎙️ فن الصوت_slide_4.png',
    'pictures/post_🎙️ فن الصوت_slide_5.png',
    'pictures/post_🎙️ فن الصوت_slide_6.png' // لاحظ الصيغة هنا jpg
];

const postCaption = 'أول ألبوم صور (Carousel) يتم توليده وتصميمه ونشره برمجياً بالكامل عبر الذكاء الاصطناعي! 🤖✨\n#أتمتة #AutoFactory #NodeJS';

// تشغيل الدالة
publishCarousel(myGeneratedImages, postCaption);
```

---

## `autofactory-backend\test-email.js`

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

const runTest = async () => {
    console.log("⏳ جاري فحص بيانات الاعتماد والاتصال بسيرفرات Google...");
    console.log(`- الإيميل المستخدم: ${process.env.EMAIL_USER}`);
    // طباعة أول 4 حروف فقط من الباسورد للتأكد من أنه يقرأ الملف
    console.log(`- كلمة المرور تبدأ بـ: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) : 'غير موجودة'}***`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // تأكد أن الباسورد في .env بدون أي مسافات
        }
    });

    try {
        // 1. اختبار صحة كلمة المرور والاتصال
        await transporter.verify();
        console.log("✅ المصادقة نجحت! كلمة مرور التطبيقات صحيحة.");

        // 2. محاولة إرسال إيميل لنفسك
        console.log("⏳ جاري محاولة إرسال رسالة اختبار...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // سيرسل رسالة من إيميلك إلى إيميلك نفسه
            subject: "🚀 فحص نظام AutoFactory",
            text: "إذا وصلت هذه الرسالة، فهذا يعني أن Nodemailer يعمل بشكل مثالي 100%!"
        });

        console.log("✅ تم إرسال رسالة الاختبار بنجاح! تفقد صندوق الوارد الخاص بك.");
        console.log("ID الرسالة:", info.messageId);

    } catch (error) {
        console.error("\n❌ فشل الاختبار! السبب هو:");
        console.error(error.message);
    }
};

runTest();
```

---

## `autofactory-backend\test-token.js`

```javascript
require('dotenv').config();
const axios = require('axios');

const extractCorrectToken = async () => {
    const userToken = process.env.PAGE_ACCESS_TOKEN;
    console.log("🕵️‍♂️ جاري فحص نوع التوكن واستكشاف الصفحات المرتبطة...");

    try {
        // نطلب من Meta جلب كل الصفحات التي يديرها هذا التوكن مع توكناتها الخاصة وحسابات إنستغرام
        const response = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userToken}`);
        
        const pages = response.data.data;
        
        if (pages && pages.length > 0) {
            console.log("\n✅ نجحنا! التوكن الخاص بك هو توكن مستخدم، وقد وجدنا صفحاتك:");
            
            pages.forEach(page => {
                console.log(`\n📘 صفحة فيسبوك: ${page.name}`);
                
                if (page.instagram_business_account) {
                    console.log(`📸 إنستغرام المرتبط: @${page.instagram_business_account.username}`);
                    console.log(`\n🔑 **التوكن الصحيح الذي تحتاجه (انسخه وضعه في .env):**`);
                    console.log("==================================================");
                    console.log(page.access_token);
                    console.log("==================================================");
                } else {
                    console.log("⚠️ هذه الصفحة غير مربوطة بحساب إنستغرام احترافي.");
                }
            });
        } else {
            console.log("\n❌ التوكن صحيح، لكن هذا الحساب لا يملك أو يدير أي صفحات فيسبوك!");
        }
        
    } catch (error) {
        console.error("\n❌ فشل الاتصال بسيرفرات Meta:");
        if (error.response && error.response.data) {
            console.error(error.response.data.error.message);
        } else {
            console.error(error.message);
        }
    }
};

extractCorrectToken();
```

---

## `autofactory-backend\test-webhook.jS`

```javascript
// هذا السكربت يحاكي سيرفرات شركة Meta (إنستغرام)

const testWebhook = async () => {
    const payload = {
        object: 'instagram',
        entry: [
            {
                changes: [
                    {
                        field: 'comments',
                        value: {
                            text: "شرح أسطوري يا هندسة! كيف أحصل على كود بوت التداول؟",
                            from: { id: "9876543210" } // آيدي وهمي للعميل
                        }
                    }
                ]
            }
        ]
    };

    try {
        console.log("🚀 جاري إرسال التعليق الوهمي إلى سيرفرك...");
const response = await fetch('http://localhost:5000/webhook', {            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.text();
        console.log("✅ رد سيرفرك:", result);
    } catch (error) {
        console.error("❌ حدث خطأ في الاتصال:", error.message);
    }
};

testWebhook();
```

---

## `autofactory-backend\models\Campaign.js`

```javascript
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    keyword: { type: String, required: true, unique: true }, // الكلمة التي سيصطادها البوت
    public_reply: { type: String, required: true },          // الرد على التعليق
    dm_message: { type: String, required: true },            // رسالة الخاص
    is_active: { type: Boolean, default: true },             // هل الحملة شغالة حالياً؟
    usage_count: { type: Number, default: 0 },               // كم شخص استخدم هذه الكلمة؟
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
```

---

## `autofactory-backend\models\CommercialAd.js`

```javascript
const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema({
    sceneNumber: Number,
    duration: String,
    shotType: String,
    cameraMovement: String,
    videoPrompt: String,
    imagePrompt: String,
    imageToVideoPrompt: String,
    narration: String,
    onScreenText: String,
    sfx: String
});

const commercialAdSchema = new mongoose.Schema({
    productIdea: { type: String, required: true },
    targetAudience: String,
    adVibe: String,
    brandColors: String,
    adTitle: { type: String, required: true },
    marketingAngle: String,
    soundtrackVibe: String,
    scenes: [sceneSchema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommercialAd', commercialAdSchema);
```

---

## `autofactory-backend\templates\ai_comparison.js`

```javascript
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        currentY += lineHeight;
    }
    return currentY;
}

// 🚀 الدالة الجديدة: رسم العنوان مع تلوين الكلمة الأخيرة (Highlighting)
function drawSmartTitleRTL(ctx, text, x, y, maxWidth, lineHeight, mainColor, highlightColor) {
    if (!text) return y;
    
    const words = text.trim().split(/\s+/);
    let lines = [];
    let currentLine = words[0];

    // تقسيم النص إلى أسطر حسب عرض الشاشة
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    ctx.save();
    ctx.textAlign = 'right'; 
    ctx.direction = 'rtl'; 
    
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineWidth = ctx.measureText(line).width;
        let startX = x + (lineWidth / 2); // التوسيط الهندسي

        // إذا كان هذا هو السطر الأخير، نلصق التلوين على الكلمة الأخيرة
        if (i === lines.length - 1) {
            const lineWords = line.split(' ');
            const lastWord = lineWords.pop();
            const restOfLine = lineWords.join(' ');

            if (restOfLine.length > 0) {
                ctx.fillStyle = mainColor;
                ctx.fillText(restOfLine + ' ', startX, currentY);
                
                // حساب المسافة لطباعة الكلمة الأخيرة الملونة
                const restWidth = ctx.measureText(restOfLine + ' ').width;
                ctx.fillStyle = highlightColor;
                ctx.fillText(lastWord, startX - restWidth, currentY);
            } else {
                ctx.fillStyle = highlightColor;
                ctx.fillText(lastWord, startX, currentY);
            }
        } else {
            ctx.fillStyle = mainColor;
            ctx.fillText(line, startX, currentY);
        }
        currentY += lineHeight;
    }
    ctx.restore();
    return currentY;
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 15;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

function drawCheckmark(ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 5, y + 20); ctx.lineTo(x + 30, y - 25);
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}

function drawCross(ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 20, y - 20); ctx.lineTo(x + 20, y + 20);
    ctx.moveTo(x + 20, y - 20); ctx.lineTo(x - 20, y + 20);
    ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
}

function drawArrowLeft(ctx, x, y) {
    ctx.beginPath(); 
    ctx.moveTo(x, y); 
    ctx.lineTo(x + 20, y - 12); 
    ctx.lineTo(x + 20, y - 4);
    ctx.lineTo(x + 50, y - 4); 
    ctx.lineTo(x + 50, y + 4); 
    ctx.lineTo(x + 20, y + 4);
    ctx.lineTo(x + 20, y + 12); 
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; 
    ctx.fill();
}

function drawCircuitLines(ctx, width, height) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 2;
    
    ctx.beginPath(); ctx.moveTo(0, height - 200); ctx.lineTo(150, height - 200); ctx.lineTo(250, height - 300); ctx.stroke();
    ctx.beginPath(); ctx.arc(150, height - 200, 5, 0, Math.PI*2); ctx.stroke();
    
    ctx.beginPath(); ctx.moveTo(0, height - 250); ctx.lineTo(100, height - 250); ctx.lineTo(200, height - 350); ctx.stroke();
    ctx.beginPath(); ctx.arc(100, height - 250, 5, 0, Math.PI*2); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(width - 200, 0); ctx.lineTo(width - 200, 150); ctx.lineTo(width - 300, 250); ctx.stroke();
    ctx.beginPath(); ctx.arc(width - 200, 150, 5, 0, Math.PI*2); ctx.stroke();
}

async function drawToolBox(ctx, x, y, size, toolName, toolDomain, isGood) {
    drawRoundedRect(ctx, x, y, size, size, 35, '#FFFFFF', true);
    
    ctx.strokeStyle = isGood ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    let logoLoaded = false;

    let finalDomain = toolDomain ? toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    try {
        const logoUrl = `https://logo.clearbit.com/${finalDomain}`;
        const logo = await loadImage(logoUrl);
        const logoSize = 110;
        ctx.drawImage(logo, x + (size - logoSize) / 2, y + 40, logoSize, logoSize);
        logoLoaded = true;
    } catch (e) {
        try {
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`;
            const logo = await loadImage(fallbackUrl);
            const logoSize = 90; 
            ctx.drawImage(logo, x + (size - logoSize) / 2, y + 50, logoSize, logoSize);
            logoLoaded = true;
        } catch (err) {
            logoLoaded = false;
        }
    }

    if (!logoLoaded) {
        const firstLetter = toolName.replace(/[^a-zA-Zأ-ي]/g, '').charAt(0).toUpperCase() || toolName.charAt(0).toUpperCase();
        
        ctx.beginPath();
        ctx.arc(x + size / 2, y + 95, 55, 0, Math.PI * 2);
        ctx.fillStyle = isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.fill();

        ctx.font = '65px "CairoBoldHack"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isGood ? '#059669' : '#DC2626';
        ctx.fillText(firstLetter, x + size / 2, y + 100);
    }

    ctx.font = '26px "CairoBoldHack"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#0F172A';
    wrapText(ctx, toolName, x + size / 2, y + 210, size - 20, 35);
}

// 🚀 تمت إضافة globalTopic كمعامل أخير
async function drawAiComparisonSlide(slide, totalSlides, batchId, platform = 'instagram', globalTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);
    drawCircuitLines(ctx, width, height);

    ctx.direction = 'rtl';
    
    if (platform === 'instagram') {
        const dotSpacing = 45;
        const dotRadius = 12;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        ctx.lineWidth = 2;
        for(let i = 0; i < totalSlides; i++) {
            ctx.beginPath(); 
            // 🚀 تم رفع النقاط للأعلى لمنع التداخل مع العنوان
            ctx.arc(startCX + (i * dotSpacing), 35, dotRadius, 0, Math.PI*2); 
            
            if (i + 1 === slide.slideNumber) {
                ctx.fillStyle = '#0F766E';
                ctx.fill();
                ctx.strokeStyle = '#0F766E';
            } else {
                ctx.strokeStyle = '#CBD5E1';
            }
            ctx.stroke();
        }
    }

    // --------------------------------------------------
    // 1. مربع رقم الصفحة
    // --------------------------------------------------
    const snX = width - 130; 
    drawRoundedRect(ctx, snX, 40, 90, 80, 15, '#FFFFFF', true);
    ctx.strokeStyle = 'rgba(15, 118, 110, 0.2)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '45px "CairoBoldHack"';
    ctx.fillStyle = '#0F766E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${slide.slideNumber}`, snX + 45, 85);
    ctx.textBaseline = 'alphabetic';

    // --------------------------------------------------
    // 2. زر SAVE THE POST 
    // --------------------------------------------------
    ctx.save();
    const saveX = 50;
    const saveY = 80; 
    
    ctx.beginPath();
    ctx.moveTo(saveX, saveY - 14);
    ctx.lineTo(saveX + 18, saveY - 14);
    ctx.lineTo(saveX + 18, saveY + 16);
    ctx.lineTo(saveX + 9, saveY + 8);
    ctx.lineTo(saveX, saveY + 16);
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; 
    ctx.fill();

    ctx.direction = 'ltr'; 
    ctx.font = 'bold 22px "CairoBoldHack"';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", saveX + 30, saveY);
    ctx.restore();

    // --------------------------------------------------
    // 🚀 3. رسم العنوان العام للمنشور (باستثناء الشريحتين الأخيرتين)
    // --------------------------------------------------
    if (globalTopic && slide.slideNumber <= totalSlides - 1) {
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = '24px "CairoRegularHack"'; 
        ctx.fillStyle = '#94A3B8'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(globalTopic).width;
        const centerX = width / 2;
        const centerY = 95; // مناسب للابتعاد عن النقاط في إنستغرام
        
        ctx.fillText(globalTopic, centerX, centerY);
        
        ctx.strokeStyle = '#E2E8F0'; 
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(centerX - textWidth/2 - 25, centerY); ctx.lineTo(centerX - textWidth/2 - 10, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(centerX + textWidth/2 + 10, centerY); ctx.lineTo(centerX + textWidth/2 + 25, centerY); ctx.stroke();
        ctx.restore();
    }

    // ==========================================
    // شريحة المقارنة
    // ==========================================
    if (slide.type === 'comparison') {
        ctx.font = '85px "CairoBoldHack"'; 
        
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; 
        ctx.shadowBlur = 10; 
        ctx.shadowOffsetY = 5;
        
        drawSmartTitleRTL(ctx, slide.title, width / 2, 230, 950, 110, '#0F172A', '#EF4444');
        
        ctx.shadowColor = 'transparent';

        drawCross(ctx, width / 2 + 200, 440);
        drawCheckmark(ctx, width / 2 - 200, 440);

        const boxY = 510;
        const boxSize = 300;
        await drawToolBox(ctx, width / 2 + 60, boxY, boxSize, slide.badTool, slide.badToolDomain, false);
        await drawToolBox(ctx, width / 2 - 360, boxY, boxSize, slide.goodTool, slide.goodToolDomain, true);   

        if (slide.nextTeaser) {
            ctx.font = '35px "CairoBoldHack"';
            ctx.fillStyle = '#334155';
            ctx.textAlign = 'center';
            ctx.fillText(slide.nextTeaser, width / 2, 1080);
            
            const textWidth = ctx.measureText(slide.nextTeaser).width;
            drawArrowLeft(ctx, (width / 2) - (textWidth / 2) - 70, 1070);
        }
    } 
    // ==========================================
    // شريحة الختام (CTA)
    // ==========================================
    else if (slide.type === 'cta') {
        ctx.save();

        const imgX = width / 2;
        const imgY = 280; 
        const imgRadius = 120; 

        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(15, 23, 42, 0.4)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 15;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.lineWidth = 10;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2;
            const sy = (avatar.height - s) / 2;
            
            const destSize = imgRadius * 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, destSize, destSize);
        } catch (err) {
            console.log("⚠️ الصورة الشخصية غير موجودة.");
        }
        ctx.restore();
        
        ctx.font = '45px "CairoBoldHack"'; 
        ctx.textAlign = 'right';

        let part1, part2, part3, part4;

        if (platform === 'facebook') {
            part1 = "الروابط كاملة في ";
            part2 = '"أول تعليق"';
            part3 = " 👇 شارك المنشور";
            part4 = "لتعود إليه لاحقاً وتفيد غيرك ↪️";
        } else {
            part1 = "علق بكلمة ";
            part2 = '"أدوات"';
            part3 = " وراح أرسلك أفضل الأدوات";
            part4 = "والمقارنات لسنة 2026";
        }

        const w1 = ctx.measureText(part1).width;
        const w2 = ctx.measureText(part2).width;
        const w3 = ctx.measureText(part3).width;
        
        const totalWidthLine1 = w1 + w2 + w3;
        let currentX = (width / 2) + (totalWidthLine1 / 2);

        ctx.fillStyle = '#0F172A';
        ctx.fillText(part1, currentX, 580);
        currentX -= w1;

        ctx.fillStyle = platform === 'facebook' ? '#2563EB' : '#0F766E'; 
        ctx.fillText(part2, currentX, 580);
        currentX -= w2;

        ctx.fillStyle = '#0F172A';
        ctx.fillText(part3, currentX, 580);

        ctx.textAlign = 'center';
        ctx.fillText(part4, width / 2, 650);

        const iconY = 820; 
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        
        const btnGap = 200; 
        const startX = width / 2 - (btnGap * 1.5); 
        
        ctx.beginPath();
        ctx.moveTo(startX, iconY); 
        ctx.lineTo(startX + 30, iconY); 
        ctx.lineTo(startX + 30, iconY + 40); 
        ctx.lineTo(startX + 15, iconY + 25); 
        ctx.lineTo(startX, iconY + 40); 
        ctx.closePath(); 
        ctx.stroke();

        if (platform === 'facebook') {
            ctx.beginPath();
            ctx.moveTo(startX + btnGap + 15, iconY + 15);
            ctx.lineTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 35, iconY + 35);
            ctx.moveTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 10, iconY + 40);
            ctx.stroke();
        } else {
            ctx.beginPath(); 
            ctx.moveTo(startX + btnGap, iconY + 35); 
            ctx.lineTo(startX + btnGap + 30, iconY); 
            ctx.lineTo(startX + btnGap + 15, iconY + 40); 
            ctx.lineTo(startX + btnGap + 10, iconY + 20); 
            ctx.closePath(); 
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(startX + (btnGap * 2) + 15, iconY + 25, 20, 0, Math.PI * 2);
        if (platform === 'facebook') {
            ctx.moveTo(startX + (btnGap * 2), iconY + 40);
            ctx.lineTo(startX + (btnGap * 2) - 10, iconY + 50);
            ctx.lineTo(startX + (btnGap * 2) + 5, iconY + 43);
        }
        ctx.stroke();

        if (platform === 'facebook') {
            ctx.beginPath();
            const thumbX = startX + (btnGap * 3) + 15;
            const thumbY = iconY + 25;
            ctx.moveTo(thumbX, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY - 5); ctx.lineTo(thumbX, thumbY - 5);
            ctx.moveTo(thumbX, thumbY - 5); ctx.lineTo(thumbX + 5, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 5);
            ctx.lineTo(thumbX + 20, thumbY - 5); ctx.lineTo(thumbX + 15, thumbY + 15); ctx.closePath();
            ctx.stroke();
        } else {
            ctx.beginPath(); 
            ctx.arc(startX + (btnGap * 3) + 15, iconY + 25, 20, 0, Math.PI * 2); 
            ctx.stroke();
        }

        ctx.font = '24px "CairoBoldHack"';
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'center';
        
        if (platform === 'facebook') {
            ctx.fillText("احفظه لتعود", startX + 15, iconY + 80); ctx.fillText("إليه لاحقاً", startX + 15, iconY + 110);
            ctx.fillText("شارك المنشور", startX + btnGap + 15, iconY + 80); ctx.fillText("لتفيد غيرك", startX + btnGap + 15, iconY + 110);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 15, iconY + 80); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 15, iconY + 110);
            ctx.fillText("إعجاب", startX + (btnGap * 3) + 15, iconY + 80); ctx.fillText("ما يضر", startX + (btnGap * 3) + 15, iconY + 110);
        } else {
            ctx.fillText("احفظه يمكن", startX + 15, iconY + 80); ctx.fillText("تحتاجه بيوم", startX + 15, iconY + 110);
            ctx.fillText("شاركه مع", startX + btnGap + 15, iconY + 80); ctx.fillText("اللي تحبه", startX + btnGap + 15, iconY + 110);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 15, iconY + 80); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 15, iconY + 110);
            ctx.fillText("لايك واحد", startX + (btnGap * 3) + 15, iconY + 80); ctx.fillText("ما يضر", startX + (btnGap * 3) + 15, iconY + 110);
        }
    }

    // ==========================================
    // الفوتر 
    // ==========================================
    drawRoundedRect(ctx, 40, height - 120, 360, 90, 45, '#FFFFFF', true);
    
    ctx.save();
    
    ctx.beginPath();
    ctx.arc(320, height - 75, 30, 0, Math.PI * 2);
    ctx.clip();
    
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2;
        const sy = (avatar.height - s) / 2;
        
        ctx.drawImage(avatar, sx, sy, s, s, 290, height - 105, 60, 60);
    } catch (e) {
        console.log("⚠️ الصورة الشخصية المصغرة غير موجودة.");
    }
    
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = '24px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", 270, height - 85);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px "CairoRegularHack"';
    ctx.fillText("مستشار وخبير أتمتة و AI", 270, height - 55);

    const fileName = `post_${batchId}_slide_${slide.slideNumber}.jpg`;
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawAiComparisonSlide;
```

---

## `autofactory-backend\templates\ai_roadmap.js`

```javascript
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // 👈 أضف هذا السطر هنا لكي تعمل دالة جلب الصور
try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

// دالة تكسير النصوص (محدثة لدعم النصوص المختلطة)
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                // استخدام الدالة الجديدة لرسم السطر المكتمل
                fillMixedText(ctx, line.trim(), x, currentY, maxWidth);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        // استخدام الدالة الجديدة لرسم السطر الأخير
        fillMixedText(ctx, line.trim(), x, currentY, maxWidth);
        currentY += lineHeight;
    }
    return currentY;
}
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN; 
// 1. دالة التوليد عبر Pollinations (مجانية 100%، بدون توكن، ولا تنقطع أبداً)
async function generateImagePollinations(keyword) {
    console.log(`🎨 جاري توليد صورة لـ: ${keyword}...`);
    // نطلب من الذكاء الاصطناعي رسم العنصر على خلفية بيضاء نقية لتسهيل تفريغها
    const prompt = encodeURIComponent(`3d icon of ${keyword}, solid pure white background, highly detailed, high quality, isolated single object`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=800&nologo=true`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error("⚠️ فشل التوليد:", error.message);
        return null;
    }
}

// 2. دالة السحر المحلي: تفريغ الخلفية البيضاء باستخدام Canvas (بدون API!)
async function makeWhiteTransparent(imageBuffer) {
    console.log(`✂️ جاري إزالة الخلفية البيضاء محلياً...`);
    const img = await loadImage(imageBuffer);
    
    // إنشاء لوحة مؤقتة لمعالجة بكسلات الصورة
    const tempCanvas = require('canvas').createCanvas(img.width, img.height);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // مسح كل بكسل لونه قريب من الأبيض لجعله شفافاً تماماً
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        // إذا كان البكسل شديد البياض، اجعل الشفافية (Alpha) تساوي 0
        if (r > 230 && g > 230 && b > 230) {
            data[i+3] = 0; 
        }
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas; // نرجع الـ Canvas المفرغ لطباعته مباشرة كصورة شفافة!
}


// 3. الدالة الرئيسية التي يطلبها كود الشريحة
async function fetchTransparentCoverImage(keyword) {
    // الخطوة الأولى: التوليد
    const generatedBuffer = await generateImageHF(keyword);
    
    if (!generatedBuffer) {
         console.log("⚠️ تم الرجوع للصورة الاحتياطية (التوليد فشل).");
         return null;
    }

    // الخطوة الثانية: إزالة الخلفية
    const transparentBuffer = await removeBackgroundHF(generatedBuffer);
    
    if (transparentBuffer) {
        console.log("✅ تمت العملية بنجاح! لدينا صورة شفافة.");
        return { buffer: transparentBuffer, isTransparent: true };
    } else {
        console.log("⚠️ فشلت الإزالة، سنستخدم الصورة كما هي بخلفيتها.");
        return { buffer: generatedBuffer, isTransparent: false };
    }
}


// دالة احترافية لرسم النصوص المختلطة (عربي/إنجليزي) بشكل سليم ومحصن
function fillMixedText(ctx, text, x, y, maxWidth) {
    ctx.save(); // حماية الإعدادات الأصلية للشريحة (مثل التوسيط)

    const parts = text.split(/([a-zA-Z0-9\-_]+)/);
    let totalWidth = 0;

    // حساب العرض الكلي لتوسيط النص بدقة
    for (let i = 0; i < parts.length; i++) {
        totalWidth += ctx.measureText(parts[i]).width;
    }

    // تحديد نقطة البداية (أقصى اليمين) لأننا نكتب في سياق عربي (من اليمين لليسار)
    let currentX = x + (totalWidth / 2);

    // 🔴 السر هنا: إجبار المحاذاة لليمين مؤقتاً داخل هذه الدالة فقط
    // لكي تعمل الحسابات الرياضية (currentX) بدقة تامة دون تداخل
    ctx.textAlign = 'right';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;

        const isEnglish = /[a-zA-Z0-9\-_]+/.test(part);
        const partWidth = ctx.measureText(part).width;

        ctx.save();
        ctx.direction = isEnglish ? 'ltr' : 'rtl';
        
        // رسم الجزء الحالي بحيث ينتهي عند currentX ويمتد يساراً
        ctx.fillText(part, currentX, y);
        ctx.restore();

        // تحريك نقطة النهاية لليسار بمقدار عرض الكلمة التي تم رسمها
        currentX -= partWidth;
    }

    ctx.restore(); // استرجاع الإعدادات الأصلية لتكمل الشريحة رسم باقي العناصر بشكل طبيعي
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor; ctx.fill();
    ctx.shadowColor = 'transparent';
}

// 🌟 الدالة المفقودة: رسم الشارة التسويقية البارزة (3D Badge)
function draw3DBadge(ctx, text, x, y, bgColor, textColor) {
    ctx.save();
    ctx.font = 'bold 80px "CairoBoldHack"';
    const textWidth = ctx.measureText(text).width;
    const paddingX = 60;
    const paddingY = 40;
    
    // رسم الظل الداكن (البُعد الثالث)
    drawRoundedRect(ctx, x - (textWidth/2) - paddingX, y - 10, (textWidth + paddingX*2), 120 + 15, 30, '#064E3B', false);
    
    // رسم الواجهة المضيئة
    drawRoundedRect(ctx, x - (textWidth/2) - paddingX, y - 20, (textWidth + paddingX*2), 120, 30, bgColor, false);
    
    // رسم النص
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 40);
    ctx.restore();
} 



function drawMacWindow(ctx, x, y, width, height) {
    drawRoundedRect(ctx, x, y, width, height, 25, '#1E293B', true);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 25, y); ctx.lineTo(x + width - 25, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + 25);
    ctx.lineTo(x + width, y + 60); ctx.lineTo(x, y + 60);
    ctx.lineTo(x, y + 25); ctx.quadraticCurveTo(x, y, x + 25, y);
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; ctx.fill();

    const dotY = y + 30;
    ctx.beginPath(); ctx.arc(x + 35, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#EF4444'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 65, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#F59E0B'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 95, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#10B981'; ctx.fill();
}

function drawDarkTechBackground(ctx, width, height) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#020617'); grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 800);
    glow.addColorStop(0, 'rgba(16, 185, 129, 0.15)'); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let j = 0; j < height; j += 60) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke(); }
}

// دالة لتوليد صورة 3D فورية بالذكاء الاصطناعي (مجانية ولا تحتاج API Key)
async function fetchAiCoverImage(keyword) {
    console.log(`🎨 جاري توليد صورة 3D بالذكاء الاصطناعي لموضوع: ${keyword}...`);
    
    // هندسة الأوامر (Prompt Engineering) لإجبار الـ AI على رسم 3D بخلفية بيضاء
    const prompt = `3d illustration of ${keyword}, high quality, vibrant colors, modern tech style, isolated on pure white background`;
    
    // استخدام API التوليد المجاني
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data; // نعيد الصورة كـ Buffer
    } catch (error) {
        console.error("⚠️ فشل توليد الصورة بالذكاء الاصطناعي:", error.message);
        return null;
    }
}
// دالة لجلب صورة ديناميكية بناءً على الموضوع
// دالة هجينة مضادة للأعطال: (AI -> Pixabay -> Local)
async function fetchDynamicCoverImage(keyword) {
    console.log(`🎨 جاري محاولة توليد صورة 3D بالذكاء الاصطناعي لموضوع: ${keyword}...`);
    const prompt = `3d illustration of ${keyword}, high quality, vibrant colors, modern tech style, isolated on pure white background`;
    const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;

    try {
        // المحاولة 1: الذكاء الاصطناعي (نعطيه 15 ثانية كحد أقصى)
        const response = await axios.get(aiUrl, { 
            responseType: 'arraybuffer',
            timeout: 15000 
        });
        console.log('✅ تم توليد الصورة بالذكاء الاصطناعي بنجاح!');
        // نعيد الصورة كبيانات مع إشارة (isMultiply: true) لتفعيل خدعة إخفاء الخلفية
        return { buffer: response.data, isMultiply: true }; 
        
    } catch (error) {
        console.error(`⚠️ فشل الـ AI (${error.code}). جاري الانتقال للخطة ب (Pixabay)...`);
        
        // المحاولة 2: Pixabay (البديل الآمن)
        const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
        if (PIXABAY_API_KEY) {
            try {
                const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keyword)}&image_type=illustration&orientation=horizontal&per_page=3`;
                const pixabayRes = await axios.get(pixabayUrl, { timeout: 8000 });
                
                if (pixabayRes.data.hits && pixabayRes.data.hits.length > 0) {
                    const imgUrl = pixabayRes.data.hits[0].largeImageURL;
                    const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                    console.log('✅ تم جلب صورة بديلة من Pixabay بنجاح!');
                    // صور بيكساباي غالباً مفرغة، لا نحتاج خدعة الـ Multiply
                    return { buffer: imgResponse.data, isMultiply: false }; 
                }
            } catch (pixError) {
                console.error("⚠️ فشل جلب الصورة من Pixabay أيضاً.");
            }
        }
        
        return null; // سيؤدي هذا لتشغيل الصورة الاحتياطية المحلية
    }
}
async function drawAiRoadmapSlide(slide, totalSlides, batchId, platform = 'instagram', mainTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // توحيد حالة الحروف لتجنب أخطاء الذكاء الاصطناعي
    const slideType = slide.type ? slide.type.toLowerCase() : '';

    // 1. الخلفية الداكنة
    drawDarkTechBackground(ctx, width, height);

// 2. رسم شريط التقدم الزمني (Timeline)
    if (platform !== 'facebook') {
        const dotSpacing = 50; // وسعنا المسافة لتبدو أرقى
        const dotRadius = 8;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        const dotsY = 70; 

        // رسم الخط الخلفي (الداكن)
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1E293B';
        ctx.beginPath();
        ctx.moveTo(startCX, dotsY);
        ctx.lineTo(startCX + totalDotsWidth, dotsY);
        ctx.stroke();

        // رسم الخط الأخضر (مستوى التقدم الحالي)
        const currentProgressWidth = (slide.slideNumber - 1) * dotSpacing;
        if (currentProgressWidth > 0) {
            ctx.strokeStyle = '#10B981';
            ctx.beginPath();
            ctx.moveTo(startCX, dotsY);
            ctx.lineTo(startCX + currentProgressWidth, dotsY);
            ctx.stroke();
        }

        // رسم المحطات (الدوائر) فوق الخط
        for(let i = 0; i < totalSlides; i++) {
            const cx = startCX + (i * dotSpacing);
            ctx.beginPath();
            ctx.arc(cx, dotsY, dotRadius, 0, Math.PI*2);
            
            if (i + 1 === slide.slideNumber) {
                // المحطة الحالية: خضراء مع توهج نيون
                ctx.fillStyle = '#10B981';
                ctx.shadowColor = '#10B981'; ctx.shadowBlur = 12;
                ctx.fill(); ctx.strokeStyle = '#10B981';
            } else if (i + 1 < slide.slideNumber) {
                // المحطات السابقة: خضراء مكتملة بدون توهج
                ctx.fillStyle = '#10B981'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#10B981';
            } else {
                // المحطات القادمة: داكنة وفارغة
                ctx.fillStyle = '#0F172A'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#334155';
            }
            ctx.stroke();
            ctx.shadowColor = 'transparent'; // إعادة ضبط الظل
        }
    }

    // ==========================================
    // 🎨 شريحة الخطاف (Hook - الصفحة الأولى)
    // ==========================================
if (slideType === 'hook') {


        // 2. زر الحفظ (Save the Post) في أعلى اليسار
        ctx.save();
        const saveX = 60; const saveY = 80; 
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#87898d'; ctx.fill(); // لون رمادي أنيق
        ctx.direction = 'ltr'; ctx.font = 'bold 22px "CairoBoldHack"'; ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THE POST", saveX + 30, saveY);
        ctx.restore();

        // 3. رسم الصورة الشخصية المفرغة (The Hero)
        try {

            
            // حساب الأبعاد لجعل الصورة ضخمة ومتمركزة في النصف العلوي
            const heroW = 750; // عرض الصورة الشخصية
            const heroH = heroImage.height * (heroW / heroImage.width);
            const heroX = (width - heroW) / 2;
            const heroY = 150; // تبدأ من الأعلى قليلاً

            ctx.drawImage(heroImage, heroX, heroY, heroW, heroH);
        } catch(e) {
            console.log("⚠️ الصورة الشخصية المفرغة (my-hook-photo.png) غير موجودة.");
        }

// 4. تجهيز المسرح (مساحة فارغة للذكاء الاصطناعي)
        // تم إيقاف التوليد التلقائي هنا عمداً.
        // سيتم ترك المساحة فوق صورتك الشخصية فارغة لتقوم بدمج عنصر 3D لاحقاً عبر Gemini.
// ==========================================
        // 💎 إضافة شارة القيمة (في الموضع العلوي)
        // ==========================================
        const stepsCount = totalSlides > 2 ? totalSlides - 2 : totalSlides;
        const valueBadgeText = `✨ خريطة طريق من ${stepsCount} خطوات`; 
        
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = 'bold 24px "CairoBoldHack"'; // 👈 صغرنا الخط قليلاً للأناقة
        const badgeTextWidth = ctx.measureText(valueBadgeText).width;
        const badgeWidth = badgeTextWidth + 60; 
        const badgeHeight = 50;
        
        // 📍 نقل الشارة للأعلى تحت النقاط مباشرة
        const badgeY = 160; // 👈 هذا الرقم هو الذي يحدد ارتفاعها
        const badgeX = (width - badgeWidth) / 2;

        // 1. رسم خلفية الشارة (زجاجية خفيفة)
        drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2, 'rgba(16, 185, 129, 0.1)', false);
        
        // 2. رسم الإطار مع توهج خفيف
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
        ctx.shadowBlur = 15;
        ctx.stroke();

        // 3. كتابة النص باللون الأخضر المتوهج
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#10B981';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(valueBadgeText, width / 2, badgeY + (badgeHeight / 2) + 2);
        ctx.restore();
        
        // 5. العنوان العريض (الخطاف) في النصف السفلي
        // نستخدم خطاً أسود عريضاً جداً مع تظليل بعض الكلمات
        ctx.font = '900 80px "CairoBoldHack"'; 
        ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'center'; 
        


        // نقطة بداية العنوان (تحت الصورة الشخصية)
        let textY = 850; 
        
        // الخدعة: يمكننا استخدام دالة رسم النصوص المختلطة التي برمجناها سابقاً، 
        // أو دالة wrapText العادية، مع إضافة لون مختلف لاسم الأداة (toolName)
        textY = wrapText(ctx, slide.title, width/2, textY, 950, 100); 


// ------------------------------------------
        // 6. مؤشر الحركة (The Action Cue) الديناميكي
        // ------------------------------------------
        const btnY = 1100; // قللنا الرقم ليرتفع الزر للأعلى (يمكنك تغييره لـ 1080 إذا أردته أعلى أكثر)
        ctx.save();
        
        // تحديد النص بناءً على المنصة
        let actionText = platform === 'facebook' ? "اضغط على الصور للتفاصيل 👆" : "اسحب للبدء 👉";
        
        ctx.font = 'bold 32px "CairoBoldHack"';
        const textWidth = ctx.measureText(actionText).width;
        
        // حساب أبعاد الزر بناءً على طول النص (ديناميكي)
        const paddingX = 50;
        const btnWidth = textWidth + (paddingX * 2);
        const btnHeight = 75;
        
        // توسيط الزر في المنتصف السفلي تماماً
        const btnX = (width / 2) - (btnWidth / 2);
        
        // رسم خلفية الزر (أخضر فاقع للفت الانتباه مع ظل خفيف)
        drawRoundedRect(ctx, btnX, btnY - (btnHeight / 2), btnWidth, btnHeight, 35, '#10B981', true);
        
        // رسم النص داخل الزر (بلون كحلي داكن لتباين بصري يريح العين)
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(actionText, width / 2, btnY);
        
        ctx.restore();
    }

    
    // ==========================================
    // شريحة الخطوة (Step)
    // ==========================================
    else if (slideType === 'step') {
        
// ------------------------------------------
        // زر الحفظ (تم نقله للأسفل يميناً لعمل توازن بصري)
        // ------------------------------------------
        ctx.save();
        
        // تحديد موقع الزر: مقابل للفوتر الشخصي (height - 80) ومحاذٍ للطرف الأيمن للمستطيل
        const saveY = height - 80; 
        
        ctx.direction = 'ltr'; 
        ctx.font = 'bold 24px "CairoBoldHack"'; 
        const textWidth = ctx.measureText("SAVE THE POST").width;
        
        // محاذاة النص مع الحافة اليمنى للمستطيل الداكن (التي تنتهي عند 1000 بكسل)
        const textEndX = 1000; 
        const saveX = textEndX - textWidth - 35; // 35 هي مسافة الأيقونة والفراغ
        
        // رسم الأيقونة (Ribbon)
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); 
        ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); 
        ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); 
        ctx.closePath();
        ctx.fillStyle = '#94A3B8'; 
        ctx.fill();
        
        // رسم النص
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THE POST", saveX + 30, saveY);
        ctx.restore();

        ctx.save();
        ctx.direction = 'ltr'; ctx.font = '280px "CairoBoldHack"'; ctx.fillStyle = '#10B981'; 
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)'; ctx.shadowBlur = 40;
        ctx.fillText(slide.slideNumber, 100, 300);
        ctx.shadowColor = 'transparent';
        const numWidth = ctx.measureText(slide.slideNumber).width;
        ctx.restore();

        const toolStartX = 100 + numWidth + 40;
        const logoSize = 100;
        let finalDomain = slide.toolDomain ? slide.toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${slide.toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        
        let logoLoaded = false;
        try {
            const logo = await loadImage(`https://logo.clearbit.com/${finalDomain}`);
            ctx.drawImage(logo, toolStartX, 180, logoSize, logoSize);
            logoLoaded = true;
        } catch (e) {
            try {
                const logo = await loadImage(`https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`);
                ctx.drawImage(logo, toolStartX, 180, logoSize, logoSize);
                logoLoaded = true;
            } catch (err) {}
        }

        if (!logoLoaded) {
            drawRoundedRect(ctx, toolStartX, 180, logoSize, logoSize, 20, '#1E293B', false);
            ctx.font = '50px "CairoBoldHack"'; ctx.fillStyle = '#10B981'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(slide.toolName.charAt(0).toUpperCase(), toolStartX + logoSize/2, 180 + logoSize/2);
        }

        ctx.save();
        ctx.direction = 'ltr'; ctx.font = '90px "CairoBoldHack"'; ctx.fillStyle = '#F8FAFC'; 
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
// جدار حماية: نأخذ الكلمة الأولى فقط في حال هلوس الذكاء الاصطناعي وكتب جملة
        const safeToolName = slide.toolName ? slide.toolName.split(' ')[0] : 'Tool';
        ctx.fillText(safeToolName, toolStartX + logoSize + 30, 230, 580);
        ctx.restore();

        ctx.save();
        ctx.direction = 'rtl'; ctx.font = '45px "CairoBoldHack"';
        const titleWidth = ctx.measureText(slide.title).width;
        const badgeWidth = titleWidth + 80; const badgeHeight = 90;
        const badgeX = (width / 2) - (badgeWidth / 2); const badgeY = 380;
        
        drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 45, '#10B981', true);
        ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(slide.title, width / 2, badgeY + (badgeHeight / 2));
        ctx.restore();

        const windowX = 80; const windowY = 530; const windowW = 920; const windowH = 450;
        drawMacWindow(ctx, windowX, windowY, windowW, windowH);

        if (slide.explanation) {
            ctx.save();
            ctx.direction = 'rtl'; ctx.font = '35px "CairoRegularHack"'; ctx.fillStyle = '#F1F5F9'; ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 5;
            wrapText(ctx, slide.explanation, width / 2, windowY + 130, windowW - 120, 60); 
            ctx.restore();
        }
    } 
    // ==========================================
    // شريحة الختام (CTA)
    // ==========================================
    else if (slideType === 'cta') {
        const imgX = width / 2;
        const imgY = 320; 
        const imgRadius = 160; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#1E293B'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.lineWidth = 10; ctx.strokeStyle = '#10B981'; ctx.stroke();
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
            const destSize = imgRadius * 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, destSize, destSize);
        } catch (err) {}
        ctx.restore();
        
        ctx.font = '50px "CairoBoldHack"'; ctx.textAlign = 'right';

        let part1, part2, part3, part4;
        if (platform === 'facebook') {
            part1 = "الروابط كاملة في "; part2 = '"أول تعليق"';
            part3 = " 👇 شارك المنشور"; part4 = "لتعود إليه لاحقاً وتفيد غيرك ↪️";
        } else {
            part1 = "علق بكلمة "; part2 = '"فكرة"';
            part3 = " وراح أرسلك الدليل الكامل"; part4 = "وكل الروابط في رسالة خاصة";
        }

        const w1 = ctx.measureText(part1).width; const w2 = ctx.measureText(part2).width; const w3 = ctx.measureText(part3).width;
        let currentX = (width / 2) + ((w1 + w2 + w3) / 2);

        ctx.fillStyle = '#F8FAFC'; ctx.fillText(part1, currentX, 620); currentX -= w1;
        ctx.fillStyle = '#10B981'; ctx.fillText(part2, currentX, 620); currentX -= w2;
        ctx.fillStyle = '#F8FAFC'; ctx.fillText(part3, currentX, 620);
        ctx.textAlign = 'center'; ctx.fillText(part4, width / 2, 700);

        const iconY = 880; ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 4; 
        
        if (platform === 'facebook') {
            ctx.fillStyle = '#F8FAFC'; ctx.font = '30px "CairoBoldHack"'; ctx.textAlign = 'center';
            ctx.fillText("↪️ مشاركة", width/2 - 200, iconY + 50);
            ctx.fillText("💬 تعليق", width/2, iconY + 50);
            ctx.fillText("👍 إعجاب", width/2 + 200, iconY + 50);
        } else {
            ctx.beginPath(); ctx.moveTo(width/2 - 260, iconY); ctx.lineTo(width/2 - 220, iconY); ctx.lineTo(width/2 - 220, iconY+50); ctx.lineTo(width/2 - 240, iconY+35); ctx.lineTo(width/2 - 260, iconY+50); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(width/2 - 100, iconY+10); ctx.lineTo(width/2 - 60, iconY-10); ctx.lineTo(width/2 - 80, iconY+40); ctx.lineTo(width/2 - 90, iconY+20); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 80, iconY+20, 25, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 240, iconY+20, 22, 0, Math.PI*2); ctx.stroke();

            ctx.font = '24px "CairoBoldHack"'; ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'center';
            ctx.fillText("احفظه يمكن", width/2 - 240, iconY + 90); ctx.fillText("تحتاجه بيوم", width/2 - 240, iconY + 120);
            ctx.fillText("شاركه مع", width/2 - 80, iconY + 90);   ctx.fillText("اللي تحبه", width/2 - 80, iconY + 120);
            ctx.fillText("رأيك يهمني", width/2 + 80, iconY + 90); ctx.fillText("بالتعليقات", width/2 + 80, iconY + 120);
            ctx.fillText("لايك واحد", width/2 + 240, iconY + 90);  ctx.fillText("ما يضر", width/2 + 240, iconY + 120);
        }
    }

    // ==========================================
    // الفوتر (تعديل الألوان للنمط الداكن)
    // ==========================================
    drawRoundedRect(ctx, 40, height - 130, 400, 100, 50, '#1E293B', true);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2;
    drawRoundedRect(ctx, 40, height - 130, 400, 100, 50, 'transparent', false);

    ctx.save();
    ctx.beginPath(); ctx.arc(380, height - 80, 35, 0, Math.PI * 2); ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
        ctx.drawImage(avatar, sx, sy, s, s, 345, height - 115, 70, 70);
    } catch (e) {}
    ctx.restore();

// ------------------------------------------
    // الفوتر (مع إصلاح مشكلة تداخل اللغات)
    // ------------------------------------------
    ctx.textAlign = 'right'; 
    ctx.fillStyle = '#F8FAFC'; 
    ctx.font = '26px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", 330, height - 90);
    
    ctx.fillStyle = '#94A3B8'; 
    ctx.font = '18px "CairoRegularHack"';
    // حل مشكلة RTL/LTR بتجنب دمج اللغات في سطر واحد بدون تنظيم
    ctx.fillText("خبير أتمتة وذكاء اصطناعي", 330, height - 60);

    const fileName = `roadmap_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawAiRoadmapSlide;
```

---

## `autofactory-backend\templates\business_roadmap.js`

```javascript
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

try {
    // خطوطنا القديمة كاحتياط
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
    // 💰 خطوط البيزنس الفخمة الجديدة
    registerFont(path.join(__dirname, '../Alexandria-Bold.ttf'), { family: 'AlexandriaHack' });
    registerFont(path.join(__dirname, '../Tajawal-Bold.ttf'), { family: 'TajawalHack' });
} catch (error) {
    console.log("⚠️ مشكلة في تحميل الخطوط، تأكد من مسارها.");
}

// ==========================================
// الدوال المساعدة (نفس دوالك القوية السابقة)
// ==========================================

function wrapText(ctx, text, x, y, maxWidth, lineHeight, draw = true) {
    if (!text) return y;
    
    const paragraphs = text.split('\n');
    let currentY = y;
    
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let lineWords = [];
        let lineWidth = 0;
        
        for (let n = 0; n < words.length; n++) {
            const word = words[n];
            // نضيف مسافة تجريبية لقياس عرض الكلمة
            const testWidth = ctx.measureText(word + ' ').width; 
            
            if (lineWidth + testWidth > maxWidth && lineWords.length > 0) {
                if (draw) {
                    // نستخدم الدالة الذكية لرسم السطر المدمج
                    fillMixedText(ctx, lineWords.join(' '), x, currentY, maxWidth);
                }
                currentY += lineHeight;
                lineWords = [word];
                lineWidth = testWidth;
            } else {
                lineWords.push(word);
                lineWidth += testWidth;
            }
        }
        if (lineWords.length > 0) {
            if (draw) {
                fillMixedText(ctx, lineWords.join(' '), x, currentY, maxWidth);
            }
            currentY += lineHeight;
        }
    }
    return currentY;
}

function fillMixedText(ctx, text, x, y, maxWidth) {
    ctx.save();
    // هذه الصيغة تفصل الكلمات العربية عن الإنجليزية والأرقام والرموز بشكل أدق
    const parts = text.split(/([a-zA-Z0-9$]+)/).filter(Boolean); 
    
    let totalWidth = 0;
    // حساب العرض الكلي للسطر لتوسيطه
    for (let i = 0; i < parts.length; i++) {
        totalWidth += ctx.measureText(parts[i]).width;
    }
    
    // بما أننا نبدأ الرسم من اليمين إلى اليسار، نحدد نقطة البداية لتتوسط الشاشة
    let currentX = x + (totalWidth / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part.trim() && part !== ' ') {
             currentX -= ctx.measureText(part).width;
             continue; 
        }
        
        // التحقق إذا كان الجزء إنجليزي أو رقم/دولار
        const isEnglishOrNumber = /^[a-zA-Z0-9$]+$/.test(part.trim());
        const partWidth = ctx.measureText(part).width;
        
        ctx.save();
        if(isEnglishOrNumber) {
             ctx.fillStyle = '#EAB308'; // تلوين الكلمات الأجنبية والأرقام ($) بالذهبي
             ctx.direction = 'ltr'; 
        } else {
             ctx.fillStyle = '#FFFFFF';
             ctx.direction = 'rtl';
        }
        
        ctx.fillText(part, currentX, y);
        ctx.restore();
        
        currentX -= partWidth;
    }
    ctx.restore(); 
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true, borderColor = null) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 15;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor; ctx.fill();
    ctx.shadowColor = 'transparent';
    
    if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawMacWindow(ctx, x, y, width, height) {
    // 💼 تعديل نافذة الماك لتصبح كـ "لوحة تحكم مالية" (Financial Dashboard)
    drawRoundedRect(ctx, x, y, width, height, 25, 'rgba(15, 23, 42, 0.85)', true, 'rgba(234, 179, 8, 0.2)'); // إطار ذهبي خفيف
    ctx.beginPath();
    ctx.moveTo(x + 25, y); ctx.lineTo(x + width - 25, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + 25);
    ctx.lineTo(x + width, y + 60); ctx.lineTo(x, y + 60);
    ctx.lineTo(x, y + 25); ctx.quadraticCurveTo(x, y, x + 25, y);
    ctx.closePath();
    ctx.fillStyle = '#05070A'; ctx.fill();

    const dotY = y + 30;
    ctx.beginPath(); ctx.arc(x + 35, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#EF4444'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 65, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#F59E0B'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 95, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#10B981'; ctx.fill();
}

function drawPremiumBackground(ctx, width, height) {
    // 💼 خلفية ليلية عميقة جداً (Obsidian) مع توهج ذهبي خفي
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#020617'); grad.addColorStop(1, '#05070A');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
    
    const glow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 900);
    glow.addColorStop(0, 'rgba(234, 179, 8, 0.08)'); // توهج ذهبي خافت
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let j = 0; j < height; j += 60) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke(); }
}

// ==========================================
// الدالة الرئيسية
// ==========================================
async function drawBusinessRoadmapSlide(slide, totalSlides, batchId, platform = 'instagram', mainTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const slideType = slide.type ? slide.type.toLowerCase() : '';

    // 1. الخلفية الفخمة
    drawPremiumBackground(ctx, width, height);

// ==========================================
    // 🔵 2. شريط التقدم الزمني والنقاط (مخفي في الغلاف)
    // ==========================================
    // يتم التنفيذ فقط إذا لم نكن في الشريحة الأولى ولم نكن على فيسبوك
    if (platform !== 'facebook' && slide.slideNumber > 1) {
        
    let dotSpacing = 50; 
        if (totalSlides >= 9) dotSpacing = 38; 
        if (totalSlides >= 13) dotSpacing = 28; 
        if (totalSlides >= 16) dotSpacing = 22; // 👈 تم الضبط لاستيعاب 17 نقطة بأناقة وبدون الخروج من الشاشة

        const dotRadius = 8;
        const dotsY = 70;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        // --- أ. رسم الخط الخلفي الداكن الأساسي ---
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1E293B'; 
        ctx.beginPath();
        ctx.moveTo(startCX, dotsY);
        ctx.lineTo(startCX + totalDotsWidth, dotsY);
        ctx.stroke();

        // --- ب. رسم الخط الذهبي للتقدم (Progress Line) ---
        const currentProgressWidth = (slide.slideNumber - 1) * dotSpacing;
        if (currentProgressWidth > 0) {
            ctx.strokeStyle = '#EAB308'; // خط ذهبي
            ctx.beginPath(); 
            ctx.moveTo(startCX, dotsY); 
            ctx.lineTo(startCX + currentProgressWidth, dotsY); 
            ctx.stroke();
        }
        
        // --- ج. رسم النقاط فوق الخطوط ---
        ctx.lineWidth = 2; // إعادة تعيين سمك الخط للنقاط
        for(let i = 0; i < totalSlides; i++) {
            const cx = startCX + (i * dotSpacing);
            ctx.beginPath();
            ctx.arc(cx, dotsY, dotRadius, 0, Math.PI*2);
            
            if (i + 1 === slide.slideNumber) {
                // النقطة الحالية
                ctx.fillStyle = '#EAB308'; ctx.shadowColor = '#EAB308'; ctx.shadowBlur = 15;
                ctx.fill(); ctx.strokeStyle = '#EAB308';
            } else if (i + 1 < slide.slideNumber) {
                // النقاط السابقة
                ctx.fillStyle = '#EAB308'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#EAB308';
            } else {
                // النقاط القادمة
                ctx.fillStyle = '#0F172A'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#334155';
            }
            
            ctx.stroke(); 
            ctx.shadowColor = 'transparent'; 
        }
    }
    

    // ==========================================
    // 🎨 شريحة الخطاف (Hook) - الغلاف الجشع
    // ==========================================
    if (slideType === 'hook') {

        // زر الحفظ (الذهبي)
        ctx.save();
        const saveX = 60; const saveY = 80; 
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#94A3B8'; ctx.fill(); 
        ctx.direction = 'ltr'; ctx.font = 'bold 20px "TajawalHack"'; ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THE BLUEPRINT", saveX + 30, saveY);
        ctx.restore();

        // 💎 شارة الـ VIP (Business Blueprint)
        const stepsCount = totalSlides > 2 ? totalSlides - 2 : totalSlides;
        const valueBadgeText = `💼 خطة عمل من ${stepsCount} مراحل`; 
        
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = 'bold 24px "TajawalHack"'; 
        const badgeTextWidth = ctx.measureText(valueBadgeText).width;
        const badgeWidth = badgeTextWidth + 60; 
        const badgeHeight = 50;
        const badgeY = 160; 
        const badgeX = (width - badgeWidth) / 2;

        drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2, 'rgba(234, 179, 8, 0.1)', false, '#EAB308');
        ctx.fillStyle = '#EAB308';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(valueBadgeText, width / 2, badgeY + (badgeHeight / 2) + 2);
        ctx.restore();
        

        // 5. العنوان العريض (مع خوارزمية التصغير التلقائي للعناوين الطويلة)
        // ==========================================
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center'; 
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; 
        ctx.shadowBlur = 15;
        
        let titleText = slide.title;
        let fontSize = 85; 
        let lineHeight = 110;
        let textY = 810; // رفعنا نقطة البداية الأساسية للأعلى لتوفير مساحة

        // 🧠 خوارزمية التصغير: تقييم طول النص وتعديل الحجم ليتسع بأناقة
        if (titleText.length > 70) {
            fontSize = 55;
            lineHeight = 75;
            textY = 840; // ننزله قليلاً لأن الحجم صغير
        } else if (titleText.length > 45) {
            fontSize = 65;
            lineHeight = 85;
            textY = 830;
        } else if (titleText.length > 30) {
            fontSize = 75;
            lineHeight = 95;
            textY = 820;
        }

        ctx.font = `900 ${fontSize}px "AlexandriaHack"`; 
        wrapText(ctx, titleText, width/2, textY, 950, lineHeight); 
        ctx.shadowColor = 'transparent';

        // 6. مؤشر الحركة (The Action Cue) الديناميكي الأخضر الزمردي
        const btnY = 1130; 
        ctx.save();
        let actionText = platform === 'facebook' ? "اضغط على الصور للتفاصيل 👆" : "اكتشف خريطة الأرباح 👉";
        ctx.font = 'bold 32px "TajawalHack"';
        const textWidthAction = ctx.measureText(actionText).width;
        const btnWidth = textWidthAction + 100;
        const btnHeight = 75;
        const btnX = (width / 2) - (btnWidth / 2);
        
        // لون أخضر زمردي فاخر (للدلالة على المال/الانطلاق)
        drawRoundedRect(ctx, btnX, btnY - (btnHeight / 2), btnWidth, btnHeight, 35, '#10B981', true);
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(actionText, width / 2, btnY);
        ctx.restore();
    }
    
// ==========================================
    // شريحة الخطوة (Step) أو التمهيد (Setup) - Dashboard Style
    // ==========================================
    else if (slideType === 'step' || slideType === 'setup') {
        
        // زر الحفظ
        ctx.save();
        const saveY = height - 80; 
        ctx.direction = 'ltr'; ctx.font = 'bold 24px "TajawalHack"'; 
        const textWidthSave = ctx.measureText("SAVE THIS").width;
        const textEndX = 1000; 
        const saveX = textEndX - textWidthSave - 35; 
        
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#f6f7f9'; ctx.fill();
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THIS", saveX + 30, saveY);
        ctx.restore();

        // الرقم العملاق (مفرغ بالذهبي)
        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.font = '280px "AlexandriaHack"'; // 👈 خط الإسكندرية
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)'; // ذهبي مفرغ
        ctx.lineWidth = 4;
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.strokeText(slide.slideNumber, 100, 300);
        const numWidth = ctx.measureText(slide.slideNumber).width;
        ctx.restore();

        const toolStartX = 100 + numWidth + 40;
        const logoSize = 100;
        let textStartX = toolStartX; // نقطة البداية الافتراضية للنص
        
        // ==========================================
        // 5. رسم الشعار (يظهر فقط في شرائح الأدوات Step)
        // ==========================================
        if (slideType === 'step') {
            let finalDomain = slide.toolDomain ? slide.toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${slide.toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
            
            let logoLoaded = false;
            try {
                const logo = await loadImage(`https://logo.clearbit.com/${finalDomain}`);
                ctx.drawImage(logo, toolStartX, 180, logoSize, logoSize);
                logoLoaded = true;
            } catch (e) {
                try {
                    const logo = await loadImage(`https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`);
                    ctx.drawImage(logo, toolStartX, 180, logoSize, logoSize);
                    logoLoaded = true;
                } catch (err) {}
            }

            if (!logoLoaded) {
                drawRoundedRect(ctx, toolStartX, 180, logoSize, logoSize, 20, '#1E293B', false);
                ctx.font = '50px "AlexandriaHack"'; ctx.fillStyle = '#EAB308'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(slide.toolName.charAt(0).toUpperCase(), toolStartX + logoSize/2, 180 + logoSize/2);
            }
            
            // إزاحة النص لليمين ليترك مساحة للوجو
            textStartX = toolStartX + logoSize + 30;
        }

        // ==========================================
        // ✍️ رسم العنوان أو اسم الأداة (مع التصغير الديناميكي المتناسق)
        // ==========================================
        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'middle';
        
        let toolFontSize = 90; // الحجم الأساسي الفخم
        
        if (slideType === 'setup') {
            // 🌟 تنسيق الشريحة التمهيدية (بدون لوجو، لون ذهبي، عبارة عربية كاملة)
            ctx.fillStyle = '#F59E0B'; // لون ذهبي/كهرماني للتميز
            ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
            ctx.shadowBlur = 15;
            
            const strategyName = slide.toolName ? slide.toolName : 'المخطط السري 🗺️';
            const maxAllowedWidthSetup = 650; // مساحة أكبر لأن اللوجو غير موجود
            
            ctx.font = `${toolFontSize}px "AlexandriaHack"`; 
            while (ctx.measureText(strategyName).width > maxAllowedWidthSetup && toolFontSize > 35) {
                toolFontSize -= 2;
                ctx.font = `${toolFontSize}px "AlexandriaHack"`;
            }
            ctx.fillText(strategyName, textStartX, 230);
            
        } else {
            // 🔧 تنسيق شريحة الأداة (مع لوجو، لون أبيض، الكلمة الأولى فقط)
            ctx.fillStyle = '#FFFFFF'; 
            ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';
            ctx.shadowBlur = 15;
            
            const safeToolName = slide.toolName ? slide.toolName.split(' ')[0] : 'Tool';
            const maxAllowedWidthStep = 550; // مساحة أقل بسبب وجود اللوجو
            
            ctx.font = `${toolFontSize}px "AlexandriaHack"`; 
            while (ctx.measureText(safeToolName).width > maxAllowedWidthStep && toolFontSize > 35) {
                toolFontSize -= 2;
                ctx.font = `${toolFontSize}px "AlexandriaHack"`;
            }
            ctx.fillText(safeToolName, textStartX, 230);
        }
        
        ctx.restore();

        // عنوان الخطوة (الشارة البرتقالية/الذهبية)
        ctx.save();
        ctx.direction = 'rtl'; ctx.font = '40px "TajawalHack"';
        const titleWidth = ctx.measureText(slide.title).width;
        const badgeWidthStep = titleWidth + 80; const badgeHeightStep = 80;
        const badgeXStep = (width / 2) - (badgeWidthStep / 2); const badgeYStep = 380;
        
        drawRoundedRect(ctx, badgeXStep, badgeYStep, badgeWidthStep, badgeHeightStep, 40, '#EAB308', true); // شارة ذهبية
        ctx.fillStyle = '#05070A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(slide.title, width / 2, badgeYStep + (badgeHeightStep / 2));
        ctx.restore();

        

        // نافذة الشرح (Dashboard)
// ==========================================
        // 🖥️ نافذة الشرح الذكية (تتمدد حسب النص)
        // ==========================================
        const windowX = 80; 
        const windowY = 510; 
        const windowW = 920; 
        let windowH = 480; // الارتفاع الافتراضي الأدنى

        if (slide.explanation) {
            ctx.save();
            ctx.direction = 'rtl'; 
            ctx.font = '38px "TajawalHack"';
            
        // 1. حساب الارتفاع المطلوب (بدون رسم، draw = false)
            const textStartX = width / 2;
            const textStartY = windowY + 130;
            const textMaxWidth = windowW - 120;
            const lineHeight = 70;
            
            // finalY هو آخر إحداثي صله النص
            const finalY = wrapText(ctx, slide.explanation, textStartX, textStartY, textMaxWidth, lineHeight, false);
            
            // 2. تحديث ارتفاع النافذة إذا كان النص طويلاً
            // 👈 رفعنا مسافة التنفس السفلية من 60 لـ 120 بكسل لمنع خروج الأسطر السفلية تماماً
            const requiredHeight = (finalY - windowY) + 120; 
            if (requiredHeight > windowH) {
                windowH = requiredHeight;
            }

            // 3. رسم النافذة بالارتفاع المحسوب
            drawMacWindow(ctx, windowX, windowY, windowW, windowH);

            // 4. رسم النص الفعلي داخل النافذة (draw = true)
            ctx.fillStyle = '#F8FAFC'; 
            ctx.textAlign = 'center';
            wrapText(ctx, slide.explanation, textStartX, textStartY, textMaxWidth, lineHeight, true); 
            
            ctx.restore();
        } else {
            // رسم النافذة الافتراضية إذا لم يكن هناك نص
            drawMacWindow(ctx, windowX, windowY, windowW, windowH);
        }
    } 
// ==========================================
    // شريحة الختام (CTA) - [النسخة الاحترافية المضبوطة]
    // ==========================================
    else if (slideType === 'cta') {
        const imgX = width / 2;
        const imgY = 320; 
        const imgRadius = 160; 

        // 1. رسم الصورة الشخصية (الأفاتار)
        ctx.save();
        ctx.beginPath(); ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(234, 179, 8, 0.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#05070A'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.lineWidth = 10; ctx.strokeStyle = '#EAB308'; ctx.stroke();
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
            const destSize = imgRadius * 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, destSize, destSize);
        } catch (err) {}
        ctx.restore();
        
        // ==========================================
        // 2. كتابة النص الديناميكي (مفصول حسب المنصة)
        // ==========================================
        const textStartY = 640;

        if (platform === 'facebook') {
            // 📘 تنسيق فيسبوك (سطرين لمنع خروج النص وتصغير الخط)
            const part1FB = "الروابط كاملة في "; 
            const part2FB = '"أول تعليق"';
            
            // السطر الأول (ديناميكي ليتوسط الشاشة بدقة)
            ctx.font = 'bold 45px "AlexandriaHack"'; // خط أصغر ومناسب
            const w1FB = ctx.measureText(part1FB).width;
            const w2FB = ctx.measureText(part2FB).width;
            let currentX_FB = (width / 2) + ((w1FB + w2FB) / 2);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#F8FAFC'; 
            ctx.fillText(part1FB, currentX_FB, textStartY - 20); 
            currentX_FB -= w1FB;
            
            ctx.fillStyle = '#EAB308'; 
            ctx.fillText(part2FB, currentX_FB, textStartY - 20); // الكلمة الذهبية

            // السطر الثاني (نص المشاركة)
            ctx.font = 'bold 38px "TajawalHack"';
            ctx.fillStyle = '#E2E8F0'; 
            ctx.textAlign = 'center';
            ctx.fillText("شارك المنشور 🔄 لتعود إليه لاحقاً وتفيد غيرك", width / 2, textStartY + 60);

        } else {
            // 📸 تنسيق إنستغرام (النص الأصلي)
            const part1IG = "علق بكلمة "; 
            const part2IG = '"أرباح"';
            const part3IG = " وراح أرسلك الدليل الكامل"; 
            const part4IG = "وكل الروابط في رسالة خاصة";

            ctx.font = '50px "AlexandriaHack"'; 
            ctx.textAlign = 'right';
            const w1 = ctx.measureText(part1IG).width; 
            const w2 = ctx.measureText(part2IG).width; 
            const w3 = ctx.measureText(part3IG).width;
            let currentX = (width / 2) + ((w1 + w2 + w3) / 2);

            ctx.fillStyle = '#F8FAFC'; ctx.fillText(part1IG, currentX, textStartY); currentX -= w1;
            ctx.fillStyle = '#EAB308'; ctx.fillText(part2IG, currentX, textStartY); currentX -= w2;
            ctx.fillStyle = '#F8FAFC'; ctx.fillText(part3IG, currentX, textStartY);
            
            ctx.textAlign = 'center'; 
            ctx.fillText(part4IG, width / 2, textStartY + 80);
        }

        // ==========================================
        // 3. رسم الأيقونات السفلية
        // ==========================================
        const iconY = 900; 
        ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 4; 
        
        if (platform === 'facebook') {
            ctx.fillStyle = '#F8FAFC'; ctx.font = '30px "TajawalHack"'; ctx.textAlign = 'center';
            ctx.fillText("↪️ مشاركة", width/2 - 200, iconY + 50);
            ctx.fillText("💬 تعليق", width/2, iconY + 50);
            ctx.fillText("👍 إعجاب", width/2 + 200, iconY + 50);
        } else {
            ctx.beginPath(); ctx.moveTo(width/2 - 260, iconY); ctx.lineTo(width/2 - 220, iconY); ctx.lineTo(width/2 - 220, iconY+50); ctx.lineTo(width/2 - 240, iconY+35); ctx.lineTo(width/2 - 260, iconY+50); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(width/2 - 100, iconY+10); ctx.lineTo(width/2 - 60, iconY-10); ctx.lineTo(width/2 - 80, iconY+40); ctx.lineTo(width/2 - 90, iconY+20); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 80, iconY+20, 25, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 240, iconY+20, 22, 0, Math.PI*2); ctx.stroke();

            ctx.font = '24px "TajawalHack"'; ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'center';
            ctx.fillText("احفظه يمكن", width/2 - 240, iconY + 90); ctx.fillText("تحتاجه بيوم", width/2 - 240, iconY + 120);
            ctx.fillText("شاركه مع", width/2 - 80, iconY + 90);   ctx.fillText("اللي تحبه", width/2 - 80, iconY + 120);
            ctx.fillText("رأيك يهمني", width/2 + 80, iconY + 90); ctx.fillText("بالتعليقات", width/2 + 80, iconY + 120);
            ctx.fillText("لايك واحد", width/2 + 240, iconY + 90);  ctx.fillText("ما يضر", width/2 + 240, iconY + 120);
        }
    }

    // ==========================================
    // الفوتر (معلومات الخبير بالنمط المالي)
    // ==========================================
    drawRoundedRect(ctx, 40, height - 130, 420, 100, 50, 'rgba(15, 23, 42, 0.5)', true, 'rgba(234, 179, 8, 0.2)');

    ctx.save();
    ctx.beginPath(); ctx.arc(400, height - 80, 35, 0, Math.PI * 2); ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
        ctx.drawImage(avatar, sx, sy, s, s, 365, height - 115, 70, 70);
    } catch (e) {}
    ctx.restore();

    ctx.textAlign = 'right'; 
    ctx.fillStyle = '#F8FAFC'; 
    ctx.font = '24px "AlexandriaHack"'; // اسمك بخط فخم
    ctx.fillText("غربي محمد الشريف", 340, height - 90);
    
    ctx.fillStyle = '#EAB308'; // المسمى الوظيفي بالذهبي
    ctx.font = '18px "TajawalHack"';
    ctx.fillText("خبير أتمتة واستشاري أعمال", 340, height - 60);

    const fileName = `business_${batchId}_${platform}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawBusinessRoadmapSlide;
```

---

## `autofactory-backend\templates\drawStorySlide.js`

```javascript
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// تحميل الخطوط
try {
    registerFont(path.join(__dirname, '../Alexandria.ttf'), { family: 'Alexandria' });
    registerFont(path.join(__dirname, '../Tajawal.ttf'), { family: 'Tajawal' });
    registerFont(path.join(__dirname, '../Cairo.ttf'), { family: 'Cairo' }); 
} catch (e) {
    console.log('⚠️ تأكد من وجود ملفات الخطوط.');
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor; ctx.fill();
}

function drawBookmark(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y);
    ctx.lineTo(x + 20, y + 28);
    ctx.lineTo(x + 10, y + 20);
    ctx.lineTo(x, y + 28);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function cleanArabicText(text) {
    // إزالة النجمات والنقاط للتأكد من نظافة النص في الحسابات العادية
    return text ? text.replace(/\*/g, '').replace(/\.$/, '').trim() : '';
}

function getLinesCount(ctx, text, maxWidth) {
    if (!text) return 0;
    const words = text.split(' ');
    let line = '';
    let count = 1;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            count++;
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    return count;
}

// الدالة الكلاسيكية للوصف الطويل (آمنة)
function wrapTextDynamic(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight; 
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight; 
}

// 🧠 الاختراع الجديد: دالة تلوين العناوين مع الهندسة العكسية للاتجاه (RTL)
// 🧠 الاختراع الجديد: دالة تلوين العناوين مع الهندسة العكسية للاتجاه (RTL) المضادة للأخطاء
function drawHighlightedTitleRTL(ctx, text, centerX, y, maxWidth, lineHeight, baseColor, highlightColor) {
    if (!text) return y;
    const words = text.split(' ');
    let currentLine = [];
    let currentY = y;

    ctx.textAlign = 'right';

    const drawLine = (wordsArray, yPos) => {
        let lineWidth = 0;
        const spaceWidth = ctx.measureText(' ').width;
        
        wordsArray.forEach((w, index) => {
            const cleanW = w.replace(/\*/g, '');
            lineWidth += ctx.measureText(cleanW).width;
            if (index < wordsArray.length - 1) lineWidth += spaceWidth;
        });

        let currentX = centerX + (lineWidth / 2);

        wordsArray.forEach((word) => {
            // 🌟 التحديث هنا: نستخدم includes لكي نلون الكلمة حتى لو كان معها علامة استفهام أو تعجب
            const isHighlight = word.includes('*'); 
            const cleanWord = word.replace(/\*/g, '');
            const wordWidth = ctx.measureText(cleanWord).width;

            ctx.fillStyle = isHighlight ? highlightColor : baseColor;
            
            if (isHighlight) {
                ctx.shadowColor = highlightColor;
                ctx.shadowBlur = 25;
            } else {
                ctx.shadowColor = 'rgba(16, 185, 129, 0.2)';
                ctx.shadowBlur = 10;
            }

            ctx.fillText(cleanWord, currentX, yPos);
            currentX -= (wordWidth + spaceWidth); 
        });
    };

    let testLineWidth = 0;
    const spaceWidth = ctx.measureText(' ').width;

    for (let n = 0; n < words.length; n++) {
        const word = words[n];
        const cleanWord = word.replace(/\*/g, '');
        const wordWidth = ctx.measureText(cleanWord).width;

        if (testLineWidth + wordWidth > maxWidth && currentLine.length > 0) {
            drawLine(currentLine, currentY);
            currentLine = [word];
            testLineWidth = wordWidth + spaceWidth;
            currentY += lineHeight;
        } else {
            currentLine.push(word);
            testLineWidth += wordWidth + spaceWidth;
        }
    }

    if (currentLine.length > 0) {
        drawLine(currentLine, currentY);
    }

    return currentY + lineHeight;
}

async function stampStoryDesign(slideData, totalSlides, uploadedImagePath, batchId) {
    const baseImage = await loadImage(uploadedImagePath);
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const scale = Math.max(width / baseImage.width, height / baseImage.height);
    const x = (width / 2) - (baseImage.width / 2) * scale;
    const y = (height / 2) - (baseImage.height / 2) * scale;
    ctx.drawImage(baseImage, x, y, baseImage.width * scale, baseImage.height * scale);

    const topGradient = ctx.createLinearGradient(0, 0, 0, 200);
    topGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)'); 
    topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');   
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, width, 200);

    const bottomGradient = ctx.createLinearGradient(0, height * 0.35, 0, height);
    bottomGradient.addColorStop(0, 'rgba(5, 7, 10, 0)');
    bottomGradient.addColorStop(0.35, 'rgba(5, 7, 10, 0.85)');
    bottomGradient.addColorStop(1, 'rgba(5, 7, 10, 1)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, 0, width, height);

    const topY = 80;

    drawBookmark(ctx, 45, topY - 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.direction = 'ltr';
    ctx.font = 'bold 26px "Alexandria", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", 85, topY - 8);

    ctx.textAlign = 'right';
    ctx.font = 'bold 36px "Alexandria", sans-serif';
    const slideNumStr = slideData.slideNumber < 10 ? `0${slideData.slideNumber}` : slideData.slideNumber;
    ctx.fillText(slideNumStr, width - 45, topY - 8);

    const dotSpacing = 22;
    const dotsWidth = (totalSlides - 1) * dotSpacing;
    const startX = (width - dotsWidth) / 2;
    for(let i=0; i<totalSlides; i++) {
        ctx.beginPath();
        ctx.arc(startX + (i * dotSpacing), topY - 8, 6, 0, Math.PI * 2);
        ctx.fillStyle = (i + 1 === slideData.slideNumber) ? '#10B981' : 'rgba(255,255,255,0.3)';
        ctx.fill();
    }

    const centerX = width / 2;
    const footerY = height - 150; 
    ctx.direction = 'rtl'; 

    // حساب الارتفاع باستخدام النص النظيف خالي من النجمات
    const cleanTitleForCount = cleanArabicText(slideData.title);
    const rawTextForCalc = cleanArabicText(slideData.text);
    
    const isCTA = rawTextForCalc.includes('علق') || rawTextForCalc.includes('احفظ') || rawTextForCalc.includes('تابعني');

    ctx.font = '900 100px "Alexandria", sans-serif';
    const titleLines = getLinesCount(ctx, cleanTitleForCount, width * 0.9);

    ctx.font = isCTA ? 'bold 46px "Cairo", sans-serif' : '600 42px "Cairo", sans-serif';
    const textLines = getLinesCount(ctx, rawTextForCalc, width * 0.85);

    const pillHeightSpace = slideData.mainTopicTitle ? 95 : 0; 
    const titleHeightSpace = titleLines * 125; 
    const gapBetween = 45; 
    const textHeightSpace = textLines * 65; 

    const totalTextHeight = pillHeightSpace + titleHeightSpace + gapBetween + textHeightSpace;

    let currentY = footerY - totalTextHeight - 40;

    // 1. رسم الكبسولة
    if (slideData.mainTopicTitle) {
        ctx.font = 'bold 28px "Tajawal", sans-serif';
        const topicWidth = ctx.measureText(slideData.mainTopicTitle).width + 80;

        drawRoundedRect(ctx, centerX - topicWidth/2, currentY - 35, topicWidth, 60, 30, 'rgba(16, 185, 129, 0.15)');
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2.5; ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.textAlign = 'center';
        ctx.fillText(slideData.mainTopicTitle, centerX, currentY + 5); 
        currentY += 100; 
    } else {
        currentY += 20;
    }

    // ==========================================
    // 🎨 2. رسم العنوان الرئيسي الملون
    // ==========================================
    ctx.font = '900 100px "Alexandria", sans-serif';
    
    // نمرر العنوان الأصلي (الذي يحتوي على النجمات) لدالة التلوين المخصصة
    currentY = drawHighlightedTitleRTL(
        ctx, 
        slideData.title, 
        centerX, 
        currentY, 
        width * 0.9, 
        125, 
        '#FFFFFF', // اللون الأبيض للكلمات العادية
        '#10B981'  // اللون الزمردي للكلمة المظللة بين النجمتين
    );

    ctx.shadowBlur = 0; // إعادة ضبط الظلال
    currentY += gapBetween; 

    // ==========================================
    // 📝 3. رسم النص التوضيحي 
    // ==========================================
    if (isCTA || slideData.slideNumber === totalSlides) {
        ctx.font = 'bold 46px "Cairo", sans-serif';
        ctx.fillStyle = '#FBBF24'; // ذهبي
        ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
        ctx.shadowBlur = 15;
    } else {
        ctx.font = '600 42px "Cairo", sans-serif';
        ctx.fillStyle = '#E2E8F0'; // رمادي أنيق
        ctx.shadowBlur = 0;
    }

    ctx.textAlign = 'center'; // إعادة الإعدادات العادية
    wrapTextDynamic(ctx, rawTextForCalc, centerX, currentY, width * 0.85, 65);
    ctx.shadowBlur = 0;

    // ==========================================
    // 👤 4. الفوتر
    // ==========================================
    ctx.direction = 'ltr'; 

    try {
        const profileImg = await loadImage(path.resolve(process.cwd(), 'profile.png'));
        const avatarSize = 90;

        ctx.save();
        ctx.beginPath();
        ctx.arc(45 + avatarSize/2, footerY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const s = Math.min(profileImg.width, profileImg.height);
        const sx = (profileImg.width - s) / 2;
        const sy = (profileImg.height - s) / 2;
        ctx.drawImage(profileImg, sx, sy, s, s, 45, footerY, avatarSize, avatarSize);
        ctx.restore();
    } catch(e) {
        console.log('لم يتم العثور على صورة الهوية.');
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Alexandria", sans-serif';
    ctx.fillText("غربي محمد الشريف", 160, footerY + 40);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px "Tajawal", sans-serif';
    ctx.fillText("خبير أتمتة واستشاري أعمال", 160, footerY + 80);

    ctx.textAlign = 'right';
    if (slideData.slideNumber < totalSlides) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px "Alexandria", sans-serif';
        ctx.fillText("NEXT ➔", width - 45, footerY + 60);
    } else {
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 32px "Alexandria", sans-serif';
        ctx.fillText("اقرأ الوصف 👇", width - 45, footerY + 60);
    }

    const fileName = `pro_story_${batchId}_slide_${slideData.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = stampStoryDesign;
```

---

## `autofactory-backend\templates\terminal.js`

```javascript
const { loadImage } = require('canvas');
const path = require('path');

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        currentY += lineHeight + 5; // تقليل المسافة بين الفقرات
    }
    return currentY;
}

function drawRoundedRect(ctx, x, y, width, height, radius, withShadow = false) {
    if (withShadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 15;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    if (withShadow) ctx.shadowColor = 'transparent';
}

async function drawTerminalSlide(ctx, width, height, slide, totalSlides, categoryBadge) {
    const theme = {
        bg: '#0F172A',
        grid: 'rgba(255, 255, 255, 0.04)',
        glow: 'rgba(59, 130, 246, 0.12)',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        accent: '#3B82F6'
    };

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);
    
    const glow = ctx.createRadialGradient(width/2, height/2, 100, width/2, height/2, 900);
    glow.addColorStop(0, theme.glow);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for(let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for(let i = 0; i < height; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    if (slide.type === 'hook') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        
        ctx.save(); 
        ctx.beginPath();
        ctx.arc(width / 2, 260, 60, 0, Math.PI * 2); 
        ctx.clip(); 
        try {
            const avatar = await loadImage(path.join(__dirname, '..', 'profile.png'));
            const size = Math.min(avatar.width, avatar.height); 
            const sx = (avatar.width - size) / 2; 
            const sy = (avatar.height - size) / 2; 
            ctx.drawImage(avatar, sx, sy, size, size, width / 2 - 60, 260 - 60, 120, 120);
        } catch (err) {}
        ctx.restore(); 

        ctx.beginPath();
        ctx.arc(width / 2, 260, 60, 0, Math.PI * 2); 
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '26px "CairoBoldHack"'; 
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText("غربي محمد الشريف", width / 2, 365);

        const pillWidth = 200;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        drawRoundedRect(ctx, (width - pillWidth) / 2, 410, pillWidth, 45, 22);
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.font = '20px "CairoBoldHack"'; 
        ctx.fillStyle = '#60A5FA';
        ctx.fillText(categoryBadge, width / 2, 440);

        ctx.font = '80px "CairoBoldHack"'; 
        ctx.fillStyle = theme.textPrimary;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        wrapText(ctx, slide.title, width / 2, 600, 900, 100);
        ctx.shadowColor = 'transparent';

        ctx.font = '40px "CairoRegularHack"'; 
        ctx.fillStyle = theme.accent;
        ctx.fillText("اسحب لتعرف السر 👈", width / 2, height - 130);
    }
    
    else if (slide.type === 'content') {
        ctx.save();
        ctx.font = '280px "CairoBoldHack"';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.textAlign = 'left';
        ctx.direction = 'ltr';
        ctx.fillText(`0${slide.slideNumber}`, 30, 260);
        ctx.restore();

        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        drawRoundedRect(ctx, 80, 70, 130, 50, 25);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.font = '22px "CairoBoldHack"';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`0${slide.slideNumber} / 0${totalSlides}`, 108, 103);
        ctx.restore();

        ctx.font = '28px "CairoBoldHack"';
        ctx.fillStyle = theme.accent;
        ctx.textAlign = 'right';
        ctx.fillText('AutoFactory ⚡', width - 80, 105);

        ctx.direction = 'rtl';
        ctx.textAlign = 'right';

        const hasCode = slide.codeSnippet && slide.codeSnippet.trim() !== "" && slide.codeSnippet !== "لا يوجد";
        
        // 🚀 تعديل 1: رفعنا نقطة الانطلاق إلى الأعلى جداً لترك مساحة شاسعة
        let startY = 220; 

        // 🚀 تعديل 2: تصغير خط العنوان ليتسع للنصوص الضخمة
        ctx.font = 'bold 55px "CairoBoldHack"';
        ctx.fillStyle = theme.textPrimary;
        const titleY = wrapText(ctx, slide.title || "", width - 80, startY, 850, 75);

        let bodyY = titleY + 30; 
        // 🚀 تعديل 3: تصغير خط المحتوى وتصغير المسافة بين الأسطر
        ctx.font = '35px "CairoRegularHack"';
        ctx.fillStyle = theme.textSecondary;
        if (slide.content) {
            bodyY = wrapText(ctx, slide.content, width - 80, bodyY, 850, 55);
        }

        let finalElementY = bodyY;

        if (hasCode) {
            const cardY = bodyY + 40; 
            const codeLines = slide.codeSnippet.split('\n');
            
            // 🚀 تعديل 4: ارتفاع المربع يعتمد 100% على عدد الأسطر (لن يختفي الكود بعد الآن)
            const cardHeight = (codeLines.length * 45) + 80;
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
            drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 24);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
            dotColors.forEach((color, i) => {
                ctx.beginPath(); ctx.arc(120 + (i * 32), cardY + 30, 8, 0, Math.PI * 2);
                ctx.fillStyle = color; ctx.fill();
            });

            ctx.save();
            ctx.direction = 'ltr';
            ctx.textAlign = 'left';
            ctx.font = '28px "Consolas", monospace'; // تصغير خط الكود
            let codeY = cardY + 80;

            codeLines.forEach(line => {
                if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
                    ctx.fillStyle = '#6A9955';
                } else if (/\b(const|let|var|function|return|if|else|import|from)\b/.test(line)) {
                    ctx.fillStyle = '#C586C0';
                } else if (/\b(print|def|for|in|elif)\b/.test(line)) {
                    ctx.fillStyle = '#569CD6';
                } else {
                    ctx.fillStyle = '#E2E8F0';
                }
                ctx.fillText(line, 130, codeY);
                codeY += 45;
            });
            ctx.restore();
            finalElementY = cardY + cardHeight;
        }

        if (slide.handwrittenNote) {
            ctx.save();
            const noteY = finalElementY + 60;
            // 🚀 تعديل 5: ضمان عدم نزول الملاحظة أسفل الشاشة مطلقاً (1200 بيكسل كحد أقصى)
            ctx.translate(width - 250, Math.min(noteY, 1200)); 
            ctx.rotate(-10 * Math.PI / 180); 
            ctx.direction = 'rtl';
            ctx.textAlign = 'right';
            ctx.font = '45px "MarheyBoldHack"'; 
            ctx.fillStyle = '#FBBF24'; // أصفر فاقع وممتاز
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.fillText(slide.handwrittenNote, 0, 0);
            ctx.restore();
        }
    }

else if (slide.type === 'cta') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';

        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.save(); 
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.clip(); 
        try {
            const avatar = await loadImage(path.join(__dirname, '..', 'profile.png'));
            const size = Math.min(avatar.width, avatar.height); 
            const sx = (avatar.width - size) / 2; 
            const sy = (avatar.height - size) / 2; 
            ctx.drawImage(avatar, sx, sy, size, size, width / 2 - 110, 280 - 110, 220, 220);
        } catch (err) {}
        ctx.restore();

        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.font = '45px "CairoBoldHack"';
        ctx.fillStyle = theme.textPrimary;
        ctx.fillText("غربي محمد الشريف", width / 2, 460);

        ctx.font = '30px "CairoRegularHack"';
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText("مهندس برمجيات ومطور أتمتة", width / 2, 520);

        // 🚀 الإصلاح 1: دفعنا العنوان للأسفل (650 بدلاً من 580) ليترك مسافة واسعة تحت اسمك
        ctx.font = '60px "CairoBoldHack"';
        ctx.fillStyle = theme.textPrimary;
        const ctaTitleY = wrapText(ctx, slide.title || "", width / 2, 650, 950, 80);

        // 🚀 الإصلاح 2: دفعنا الشرح ليكون أسفل العنوان بمسافة مريحة
        ctx.font = '32px "CairoRegularHack"';
        ctx.fillStyle = theme.accent;
        wrapText(ctx, slide.content || "", width / 2, ctaTitleY + 50, 900, 50); 

        // 🚀 الإصلاح 3: تثبيت الملاحظة الوردية فوق الأزرار بشكل دائم (1000 بيكسل) وفصلها عن النصوص تماماً
        ctx.save();
        ctx.translate(width / 2 + 300, 1000); 
        ctx.rotate(10 * Math.PI / 180);
        ctx.font = '40px "MarheyBoldHack"'; 
        ctx.fillStyle = '#F472B6'; 
        ctx.fillText("لا تنسَ الحفظ! 📍", 0, 0);
        ctx.restore();

        const btnY = 1080;
        const btnWidth = 180;
        const btnHeight = 150;
        const gap = 30;
        const startX = (width - (4 * btnWidth + 3 * gap)) / 2;

        const actions = [
            { label: 'إعجاب', isPrimary: false },
            { label: 'رأيك', isPrimary: false },
            { label: 'شارك', isPrimary: false },
            { label: 'احفظ', isPrimary: true }
        ];

        actions.forEach((act, idx) => {
            const bx = startX + idx * (btnWidth + gap);
            ctx.fillStyle = act.isPrimary ? 'rgba(37, 99, 235, 0.9)' : 'rgba(30, 41, 59, 0.6)';
            drawRoundedRect(ctx, bx, btnY, btnWidth, btnHeight, 20, true);
            ctx.strokeStyle = act.isPrimary ? theme.accent : 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = '32px "CairoBoldHack"';
            ctx.fillStyle = act.isPrimary ? '#FFFFFF' : '#CBD5E1';
            ctx.fillText(act.label, bx + btnWidth / 2, btnY + 85);
        });
    }

    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.font = '22px "CairoBoldHack"';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'; 
    ctx.fillText("غربي محمد الشريف © مهندس برمجيات", width / 2, 1310);
}

module.exports = drawTerminalSlide;
```

---

## `autofactory-backend\templates\triple_comparison.js`

```javascript
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

function drawLightBackground(ctx, width, height) {
    ctx.fillStyle = '#F8FAFC'; 
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.lineWidth = 15;
    
    ctx.beginPath();
    ctx.moveTo(0, height * 0.1);
    ctx.bezierCurveTo(width * 0.3, height * 0.05, width * 0.7, height * 0.15, width, height * 0.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height * 0.15);
    ctx.bezierCurveTo(width * 0.3, height * 0.1, width * 0.7, height * 0.2, width, height * 0.15);
    ctx.stroke();
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 12;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

function drawArrowRight(ctx, ix, iy, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(ix, iy - 12); ctx.lineTo(ix, iy + 12); ctx.lineTo(ix + 18, iy); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ix + 26, iy - 18); ctx.lineTo(ix + 26, iy + 18); ctx.lineTo(ix + 46, iy); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ix + 56, iy - 26); ctx.lineTo(ix + 56, iy + 26); ctx.lineTo(ix + 84, iy); ctx.closePath(); ctx.fill();
}

function drawRatingRow(ctx, y, level, text) {
    let color = level === 'bad' ? '#EF4444' : level === 'good' ? '#F59E0B' : '#10B981';

    ctx.save();
    ctx.direction = 'rtl';
    ctx.fillStyle = color;
    ctx.textAlign = 'right'; 
    ctx.textBaseline = 'middle';
    ctx.font = '65px "CairoBoldHack"';
    
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, 400, y);
    ctx.restore();

    drawArrowRight(ctx, 470, y, color);
}

function drawMainTitle(ctx, title, x, y) {
    ctx.save();
    ctx.font = '70px "CairoBoldHack"';
    
    ctx.direction = 'rtl';
    const textWidth = ctx.measureText(title).width;
    ctx.direction = 'ltr'; 

    const paddingX = 140; 
    const boxWidth = textWidth + paddingX;
    const boxHeight = 130;

    drawRoundedRect(ctx, x - boxWidth/2, y - boxHeight/2, boxWidth, boxHeight, 25, '#FFFFFF', true);
    
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl'; 
    ctx.fillStyle = '#EA580C'; 
    ctx.shadowColor = 'rgba(234, 88, 12, 0.25)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    ctx.fillText(title, x, y + 5);
    ctx.restore();
}

async function drawToolBox(ctx, x, y, size, toolName, toolDomain) {
    drawRoundedRect(ctx, x - (size/2), y - (size/2), size, size, 30, '#FFFFFF', true);
    
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    let logoLoaded = false;
    let finalDomain = toolDomain ? toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    try {
        const logoUrl = `https://logo.clearbit.com/${finalDomain}`;
        const logo = await loadImage(logoUrl);
        const logoSize = size * 0.65;
        ctx.drawImage(logo, x - (logoSize / 2), y - (logoSize / 2) - 10, logoSize, logoSize);
        logoLoaded = true;
    } catch (e) {
        try {
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`;
            const logo = await loadImage(fallbackUrl);
            const logoSize = size * 0.55; 
            ctx.drawImage(logo, x - (logoSize / 2), y - (logoSize / 2) - 10, logoSize, logoSize);
            logoLoaded = true;
        } catch (err) {
            logoLoaded = false;
        }
    }

    if (!logoLoaded) {
        const firstLetter = toolName.replace(/[^a-zA-Zأ-ي]/g, '').charAt(0).toUpperCase() || toolName.charAt(0).toUpperCase();
        ctx.beginPath();
        ctx.arc(x, y - 10, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#F1F5F9';
        ctx.fill();

        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.font = '55px "CairoBoldHack"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#475569';
        ctx.fillText(firstLetter, x, y - 5);
        ctx.restore();
    }

    ctx.save();
    ctx.direction = 'rtl'; 
    ctx.font = 'bold 30px "CairoBoldHack"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#0F172A';
    const cleanToolName = toolName.trim();
    ctx.fillText(cleanToolName, x, y + (size/2) + 15);
    ctx.restore();
}

async function drawTripleComparisonSlide(slide, totalSlides, batchId, platform = 'instagram', globalTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    drawLightBackground(ctx, width, height);

    // --------------------------------------------------
    // نقاط التنقل العلوية (حصرياً للإنستغرام) 🚀
    // --------------------------------------------------
    if (platform === 'instagram') {
        const dotSpacing = 45;
        const dotRadius = 12;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        ctx.lineWidth = 2;
        for(let i = 0; i < totalSlides; i++) {
            ctx.beginPath(); 
            ctx.arc(startCX + (i * dotSpacing), 30, dotRadius, 0, Math.PI*2); 
            
            if (i + 1 === slide.slideNumber) {
                ctx.fillStyle = '#0F766E';
                ctx.fill();
                ctx.strokeStyle = '#0F766E';
            } else {
                ctx.strokeStyle = '#CBD5E1';
            }
            ctx.stroke();
        }
    }

    // --------------------------------------------------
    // Header
    // --------------------------------------------------
    ctx.direction = 'ltr';
    ctx.font = '35px "CairoBoldHack"';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'right';
    const slideNumStr = slide.slideNumber.toString().padStart(2, '0');
    ctx.fillText(slideNumStr, width - 60, 80);

    ctx.save();
    const saveX = 60;
    const saveY = 80; 
    ctx.beginPath();
    ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
    ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
    ctx.lineTo(saveX, saveY + 16); ctx.closePath();
    ctx.fillStyle = '#1E293B'; 
    ctx.fill();

    ctx.font = 'bold 24px "CairoRegularHack"';
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", saveX + 30, saveY);
    ctx.restore();

    // 🚀 رسم العنوان العام للمنشور (Top Center Header)
   
    if (globalTopic && slide.slideNumber <= totalSlides - 1) {
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = '24px "CairoRegularHack"'; // استخدام الخط العادي للأناقة
        ctx.fillStyle = '#64748B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(globalTopic).width;
        const centerX = width / 2;
        const centerY = 80;
        
        ctx.fillText(globalTopic, centerX, centerY);
        
        // شرطات جمالية على الجانبين
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(centerX - textWidth/2 - 25, centerY); ctx.lineTo(centerX - textWidth/2 - 10, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(centerX + textWidth/2 + 10, centerY); ctx.lineTo(centerX + textWidth/2 + 25, centerY); ctx.stroke();
        ctx.restore();
    }
    // --------------------------------------------------
    // المحتوى
    // --------------------------------------------------
    if (slide.type === 'comparison') {
        
        drawMainTitle(ctx, slide.title, width / 2, 250);

        const toolsStartX = 820; 
        const row1Y = 480;
        const row2Y = 770;
        const row3Y = 1060;

        drawRatingRow(ctx, row1Y, 'bad', 'سيئ');
        await drawToolBox(ctx, toolsStartX, row1Y, 210, slide.badTool, slide.badToolDomain);

        drawRatingRow(ctx, row2Y, 'good', 'جيد');
        await drawToolBox(ctx, toolsStartX, row2Y, 210, slide.goodTool, slide.goodToolDomain);

        drawRatingRow(ctx, row3Y, 'pro', 'احترافي');
        await drawToolBox(ctx, toolsStartX, row3Y, 210, slide.proTool, slide.proToolDomain);

        if (slide.nextTeaser) {
            ctx.save();
            ctx.direction = 'ltr';
            ctx.font = 'bold 28px "CairoBoldHack"';
            ctx.fillStyle = '#0F172A';
            ctx.textAlign = 'right';
            ctx.fillText("NEXT", width - 85, height - 70);
            
            const arrowX = width - 50;
            const arrowY = height - 70;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY - 12); ctx.lineTo(arrowX + 20, arrowY - 12);
            ctx.lineTo(arrowX + 20, arrowY - 22); ctx.lineTo(arrowX + 40, arrowY);
            ctx.lineTo(arrowX + 20, arrowY + 22); ctx.lineTo(arrowX + 20, arrowY + 12);
            ctx.lineTo(arrowX, arrowY + 12); ctx.closePath();
            ctx.fillStyle = '#0F172A';
            ctx.fill();
            ctx.restore();
        }

    } else if (slide.type === 'cta') {
        const imgX = width / 2;
        const imgY = 320; 
        const imgRadius = 180; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#0F172A';
        ctx.stroke();
        
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2;
            const sy = (avatar.height - s) / 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, imgRadius * 2, imgRadius * 2);
        } catch (err) {}
        ctx.restore();

        // 🚀 التفريق الذكي في شريحة الختام بناءً على المنصة
        ctx.save();
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        
        if (platform === 'facebook') {
            ctx.font = '50px "CairoBoldHack"';
            ctx.fillStyle = '#0F172A';
            ctx.fillText("الروابط كاملة موجودة في", width/2, 630);
            
            ctx.font = '55px "CairoBoldHack"';
            ctx.fillStyle = '#2563EB'; // أزرق فيسبوك
            ctx.fillText('"أول تعليق" 👇', width/2, 700);
        } else {
            ctx.font = '50px "CairoBoldHack"';
            ctx.fillStyle = '#0F172A';
            ctx.fillText("اكتب كلمة أدوات في التعليقات", width/2, 630);
            
            ctx.font = '55px "CairoBoldHack"';
            ctx.fillStyle = '#EA580C'; // برتقالي مميز
            ctx.fillText("وراح ابعثلك الروابط في الخاص", width/2, 700);
        }
        ctx.restore();
        
        const iconY = 920; 
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 4;
        const btnGap = 200; 
        const startX = width / 2 - (btnGap * 1.5); 
        
        // Save
        ctx.beginPath(); ctx.moveTo(startX, iconY); ctx.lineTo(startX + 35, iconY); 
        ctx.lineTo(startX + 35, iconY + 45); ctx.lineTo(startX + 17.5, iconY + 30); 
        ctx.lineTo(startX, iconY + 45); ctx.closePath(); ctx.stroke();

        // Share
        if (platform === 'facebook') {
            ctx.beginPath(); ctx.moveTo(startX + btnGap + 15, iconY + 15); ctx.lineTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 35, iconY + 35); ctx.moveTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 10, iconY + 40); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(startX + btnGap, iconY + 40); ctx.lineTo(startX + btnGap + 35, iconY); 
            ctx.lineTo(startX + btnGap + 20, iconY + 45); ctx.lineTo(startX + btnGap + 10, iconY + 25); 
            ctx.closePath(); ctx.stroke();
        }

        // Comment
        ctx.beginPath(); ctx.arc(startX + (btnGap * 2) + 15, iconY + 25, 22, 0, Math.PI * 2);
        if (platform === 'facebook') {
            ctx.moveTo(startX + (btnGap * 2), iconY + 42); ctx.lineTo(startX + (btnGap * 2) - 10, iconY + 52); ctx.lineTo(startX + (btnGap * 2) + 5, iconY + 45);
        }
        ctx.stroke();

        // Like
        if (platform === 'facebook') {
            ctx.beginPath(); const thumbX = startX + (btnGap * 3) + 15; const thumbY = iconY + 25;
            ctx.moveTo(thumbX, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY - 5); ctx.lineTo(thumbX, thumbY - 5);
            ctx.moveTo(thumbX, thumbY - 5); ctx.lineTo(thumbX + 5, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 5);
            ctx.lineTo(thumbX + 20, thumbY - 5); ctx.lineTo(thumbX + 15, thumbY + 15); ctx.closePath(); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.arc(startX + (btnGap * 3) + 15, iconY + 25, 22, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.font = '26px "CairoBoldHack"';
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'center';
        
        // 🚀 الأيقونات السفلية: تغيير النصوص بناءً على المنصة
        if (platform === 'facebook') {
            ctx.fillText("احفظه لتعود", startX + 17.5, iconY + 90); ctx.fillText("إليه لاحقاً", startX + 17.5, iconY + 125);
            ctx.fillText("شارك المنشور", startX + btnGap + 17.5, iconY + 90); ctx.fillText("لتفيد غيرك", startX + btnGap + 17.5, iconY + 125);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 17.5, iconY + 90); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 17.5, iconY + 125);
            ctx.fillText("إعجاب", startX + (btnGap * 3) + 17.5, iconY + 90); ctx.fillText("ما يضر", startX + (btnGap * 3) + 17.5, iconY + 125);
        } else {
            ctx.fillText("احفظه يمكن", startX + 17.5, iconY + 90); ctx.fillText("تحتاجه بيوم", startX + 17.5, iconY + 125);
            ctx.fillText("شاركه مع", startX + btnGap + 17.5, iconY + 90); ctx.fillText("اللي تحبه", startX + btnGap + 17.5, iconY + 125);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 17.5, iconY + 90); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 17.5, iconY + 125);
            ctx.fillText("لايك واحد", startX + (btnGap * 3) + 17.5, iconY + 90); ctx.fillText("ما يضر", startX + (btnGap * 3) + 17.5, iconY + 125);
        }
    }

    // --------------------------------------------------
    // الفوتر (معلومات الحساب - تصميم الكبسولة الاحترافية) 
    // --------------------------------------------------
    const badgeHeight = 90;
    const badgeWidth = 430; 
    const badgeX = 50;
    const badgeY = height - 115; 
    
    drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2, '#FFFFFF', true);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#F1F5F9';
    ctx.stroke();

    const profileX = badgeX + (badgeHeight / 2);
    const profileY = badgeY + (badgeHeight / 2);
    const avatarRadius = (badgeHeight / 2) - 8; 

    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX, profileY, avatarRadius + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#EA580C'; 
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX, profileY, avatarRadius, 0, Math.PI * 2);
    ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        ctx.drawImage(avatar, (avatar.width - s)/2, (avatar.height - s)/2, s, s, profileX - avatarRadius, profileY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    } catch (e) {}
    ctx.restore();

    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    const textRightEdge = badgeX + badgeWidth - 30; 
    
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", textRightEdge, profileY - 12);
    
    ctx.fillStyle = '#64748B';
    ctx.font = '18px "CairoRegularHack"';
    ctx.fillText("مستشار وخبير أتمتة و AI", textRightEdge, profileY + 20);
    ctx.restore();

// حفظ الصورة النهائية مع تمييز اسم المنصة (platform) لمنع التداخل
    const fileName = `post_${batchId}_${platform}_slide_${slide.slideNumber}.jpg`;
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 1.0 });
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawTripleComparisonSlide;
```

---

## `autofactory-serv\designer.js`

```javascript
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');

// تسجيل الخط (تأكد من وجود الملف في المجلد!)
try {
    registerFont('./Cairo-Bold.ttf', { family: 'Cairo' });
} catch (e) {
    console.warn("⚠️ تنبيه: لم يتم العثور على ملف الخط. التصميم سيفقد 50% من جماليته.");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    return y;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function generateAutoFactorySlide(slideNumber, totalSlides, title, bodyText) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // ----------------------------------------------------
    // 1. الخلفية الداكنة (Dark Mode)
    // ----------------------------------------------------
    ctx.fillStyle = '#0F172A'; // لون كحلي داكن جداً (Slate 900)
    ctx.fillRect(0, 0, width, height);

    // إضافة تدرج لوني خفيف (Glow) في الزاوية
    const glow = ctx.createRadialGradient(width, 0, 100, width, 0, 800);
    glow.addColorStop(0, 'rgba(59, 130, 246, 0.15)'); // أزرق مضيء
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 2. شبكة النقط البرمجية (Dot Matrix)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 30; x < width; x += 40) {
        for (let y = 30; y < height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ----------------------------------------------------
    // 3. الهيدر (شريط التقدم وهوية المصنع)
    // ----------------------------------------------------
    // كبسولة رقم الشريحة (Pill)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    drawRoundedRect(ctx, 80, 80, 140, 50, 25);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '24px "Cairo", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText(`${slideNumber} of ${totalSlides}`, 150, 113);

    // اسم النظام أعلى اليمين
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.fillStyle = '#3B82F6'; // أزرق تقني
    ctx.textAlign = 'right';
    ctx.fillText('AutoFactory ⚡', width - 80, 115);

    // ----------------------------------------------------
    // 4. النصوص (مريحة، بيضاء، وواضحة)
    // ----------------------------------------------------
    ctx.direction = 'rtl';
    
    // العنوان
    ctx.font = 'bold 80px "Cairo", sans-serif';
    ctx.fillStyle = '#F8FAFC'; // أبيض ساطع
    const titleY = wrapText(ctx, title, width - 80, 260, 800, 100);

    // الخط الفاصل التجميلي تحت العنوان
    const gradientLine = ctx.createLinearGradient(width - 80, titleY + 30, width - 280, titleY + 30);
    gradientLine.addColorStop(0, '#3B82F6');
    gradientLine.addColorStop(1, '#8B5CF6'); // بنفسجي
    ctx.fillStyle = gradientLine;
    drawRoundedRect(ctx, width - 280, titleY + 30, 200, 6, 3);
    ctx.fill();

    // المحتوى
    ctx.font = '42px "Cairo", sans-serif';
    ctx.fillStyle = '#94A3B8'; // رمادي فاتح
    const bodyY = wrapText(ctx, bodyText, width - 80, titleY + 120, 850, 70);

    // ----------------------------------------------------
    // 5. بطاقة الزجاج (Glassmorphism Card)
    // ----------------------------------------------------
    const cardY = bodyY + 120;
    const cardHeight = 450;
    
    // خلفية البطاقة شبه شفافة
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)'; // لون داكن شفاف
    drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 40);
    ctx.fill();

    // إطار مضيء خفيف يعطي إحساس الزجاج
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // محتوى البطاقة (وهمي حالياً)
    ctx.font = 'bold 50px "Cairo", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.fillText("</ Code Snippet Or UI goes here >", width / 2, cardY + 220);

    // ----------------------------------------------------
    // حفظ الصورة
    // ----------------------------------------------------
    const buffer = canvas.toBuffer('image/png');
    const fileName = `autofactory_slide_${slideNumber}.png`;
    fs.writeFileSync(fileName, buffer);
    console.log(`✅ تمت طباعة هوية AutoFactory: ${fileName}`);
}

// تشغيل الاختبار
generateAutoFactorySlide(
    1, 
    5, 
    "أتمتة إنستغرام بـ Node.js", 
    "تعلم كيف تبني خادماً برمجياً يولد المحتوى بالذكاء الاصطناعي، ويقوم بنشره تلقائياً دون أي تدخل بشري باستخدام Graph API."
);
```

---

## `autofactory-serv\index.js`

```javascript
require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERSION = 'v20.0';

async function deepScanInstagram() {
    try {
        console.log('🔍 بدء الفحص الشامل لحسابات إنستغرام...');

        // 1. الفحص الأول: اختبار الرمز بشكل مباشر كصفحة (Page Token)
        console.log('\n⏳ الفحص الأول: اختبار الرمز المباشر...');
        try {
            const directRes = await axios.get(`https://graph.facebook.com/${VERSION}/me`, {
                params: {
                    // نطلب الحقلين معاً لتجنب أي أخطاء في تسمية ميتا
                    fields: 'id,name,instagram_business_account,connected_instagram_account',
                    access_token: TOKEN
                }
            });
            console.log('📝 تم الدخول كـ:', directRes.data.name);
            
            if (directRes.data.instagram_business_account) {
                console.log('✅ تم العثور على IG Business ID:', directRes.data.instagram_business_account.id);
                return; // إيقاف البحث إذا نجحنا
            } else if (directRes.data.connected_instagram_account) {
                console.log('✅ تم العثور على IG Connected ID:', directRes.data.connected_instagram_account.id);
                return; 
            } else {
                console.log('⚠️ لا يوجد إنستغرام مرتبط مباشرة في هذا المسار.');
            }
        } catch (e) {
            console.log('⚠️ مسار الصفحة المباشر لم يعمل (الرمز قد يكون User Token). ننتقل للفحص الثاني...');
        }

        // 2. الفحص الثاني: جلب جميع الحسابات والبحث العميق بداخلها
        console.log('\n⏳ الفحص الثاني: البحث العميق في كل الصفحات...');
        const pagesRes = await axios.get(`https://graph.facebook.com/${VERSION}/me/accounts`, {
            params: {
                fields: 'id,name,instagram_business_account,connected_instagram_account',
                access_token: TOKEN
            }
        });

        const pages = pagesRes.data.data;
        let found = false;

        for (const page of pages) {
            console.log(`\n- جاري فحص صفحة: ${page.name}`);
            if (page.instagram_business_account) {
                console.log(`🎉 نجاح! (IG Business ID): ${page.instagram_business_account.id}`);
                found = true;
            } else if (page.connected_instagram_account) {
                console.log(`🎉 نجاح! (IG Connected ID): ${page.connected_instagram_account.id}`);
                found = true;
            }
        }

        if (!found) {
            console.log('\n❌ النتيجة النهائية: لم يعثر الكود على إنستغرام في أي مسار.');
        }

    } catch (error) {
        console.error('\n❌ خطأ في الاتصال بالخادم:');
        console.error(error.response ? error.response.data.error.message : error.message);
    }
}

deepScanInstagram();
```

---

## `autofactory-serv\index1.js`

```javascript
require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERSION = 'v20.0';

async function deepScanFacebook() {
    try {
        console.log('🔍 بدء الفحص الشامل لصفحات فيسبوك...');

        // 1. الفحص الأول: اختبار الرمز بشكل مباشر كصفحة (Page Token)
        console.log('\n⏳ الفحص الأول: اختبار الرمز المباشر...');
        try {
            const directRes = await axios.get(`https://graph.facebook.com/${VERSION}/me`, {
                params: {
                    fields: 'id,name,category',
                    access_token: TOKEN
                }
            });
            
            console.log('📝 تم الدخول كـ:', directRes.data.name);
            
            // إذا أعاد الفحص تصنيفاً (category) فهذا يعني أنه توكن صفحة بنسبة 100%
            if (directRes.data.category) {
                console.log(`✅ هذا توكن صفحة سليم!`);
                console.log(`📌 معرّف الصفحة (FB_PAGE_ID): ${directRes.data.id}`);
                return; // إيقاف البحث، أنت في السليم!
            } else {
                console.log('⚠️ الرمز يخص حساباً شخصياً (User Profile). ننتقل للفحص الثاني...');
            }
        } catch (e) {
            console.log('⚠️ مسار الصفحة المباشر لم يعمل (الرمز قد يكون User Token منتهي أو ناقص الصلاحيات). ننتقل للفحص الثاني...');
        }

        // 2. الفحص الثاني: جلب جميع الصفحات والبحث العميق بداخلها
        console.log('\n⏳ الفحص الثاني: البحث العميق في كل الصفحات المرتبطة بحسابك...');
        const pagesRes = await axios.get(`https://graph.facebook.com/${VERSION}/me/accounts`, {
            params: {
                fields: 'id,name,category,access_token',
                access_token: TOKEN
            }
        });

        const pages = pagesRes.data.data;
        let found = false;

        for (const page of pages) {
            console.log(`\n- جاري فحص صفحة: ${page.name} (${page.category})`);
            console.log(`🎉 نجاح! معرّف الصفحة (FB_PAGE_ID): ${page.id}`);
            
            // سحر إضافي: استخراج توكن الصفحة المباشر!
            if (page.access_token) {
                console.log(`🔑 توكن هذه الصفحة (انسخه وضعه كـ PAGE_ACCESS_TOKEN):`);
                console.log(`   ${page.access_token}`);
            }
            found = true;
        }

        if (!found) {
            console.log('\n❌ النتيجة النهائية: لم يعثر الكود على أي صفحات تديرها بهذا التوكن.');
        }

    } catch (error) {
        console.error('\n❌ خطأ في الاتصال بالخادم:');
        console.error(error.response ? error.response.data.error.message : error.message);
    }
}

deepScanFacebook();
```

---

## `autofactory-serv\package.json`

```json
{
  "name": "autofactory",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "axios": "^1.20.0",
    "canvas": "^3.2.3",
    "cloudinary": "^2.11.0",
    "dotenv": "^17.4.2",
    "node-cron": "^4.6.0"
  }
}

```

---

## `autofactory-serv\publish.js`

```javascript
require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
// المعرّف الذي حصلنا عليه لصفحة "القرآن"
const IG_ID = '17841404465286460'; 

// رابط صورة تجريبية (يجب أن تكون الصورة برابط مباشر URL وليس من جهازك حالياً)
const IMAGE_URL = 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; 
const CAPTION = 'تجربة النشر التلقائي عبر Node.js و Graph API 🚀🤖\n#برمجة #أتمتة';

async function publishToInstagram() {
    try {
        console.log('⏳ الخطوة 1: رفع الصورة إلى سيرفرات ميتا...');
        
        const mediaResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, null, {
            params: {
                image_url: IMAGE_URL,
                caption: CAPTION,
                access_token: TOKEN
            }
        });

        const creationId = mediaResponse.data.id;
        console.log('✅ تم تجهيز الصورة بنجاح! معرّف الحاوية:', creationId);

        console.log('\n⏳ الخطوة 2: إرسال أمر النشر الفعلي لحساب إنستغرام...');
        
        const publishResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, null, {
            params: {
                creation_id: creationId,
                access_token: TOKEN
            }
        });

        console.log('\n🎉 نجاح ساحق! تم نشر الصورة بنجاح على حسابك.');
        console.log('🆔 معرّف المنشور (Post ID):', publishResponse.data.id);
        console.log('قم بفتح تطبيق إنستغرام الآن من هاتفك وتأكد من وجود المنشور الجديد!');

    } catch (error) {
        console.error('\n❌ حدث خطأ أثناء النشر:');
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

publishToInstagram();
```

---

## `autofactory-serv\reels.js`

```javascript
require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // المعرّف الخاص بك

// رابط فيديو تجريبي (يجب أن يكون MP4 برابط مباشر)
const VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'; 
const CAPTION = 'أول تجربة لنشر فيديو Reels تلقائياً عبر مصنع AutoFactory 🎬🤖\n#برمجة #أتمتة_إنستغرام';

// دالة ذكية لفحص حالة معالجة الفيديو
async function waitForProcessing(containerId) {
    let status = 'IN_PROGRESS';
    console.log('⏳ جاري معالجة الفيديو في سيرفرات ميتا... (قد يستغرق بضع ثوانٍ)');
    
    while (status === 'IN_PROGRESS') {
        // ننتظر 5 ثوانٍ قبل كل فحص لتخفيف الضغط على السيرفر
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        
        const response = await axios.get(`https://graph.facebook.com/v20.0/${containerId}`, {
            params: {
                fields: 'status_code',
                access_token: TOKEN
            }
        });
        
        status = response.data.status_code;
        console.log(`🔄 حالة المعالجة الحالية: ${status}`);
        
        if (status === 'ERROR') {
            throw new Error('❌ فشلت سيرفرات ميتا في معالجة الفيديو.');
        }
    }
    return status;
}

async function publishReelToInstagram() {
    try {
        console.log('🚀 الخطوة 1: رفع الفيديو إلى سيرفرات ميتا كـ Reel...');
        
        // لاحظ إضافة media_type: 'REELS'
        const mediaResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, null, {
            params: {
                media_type: 'REELS',
                video_url: VIDEO_URL,
                caption: CAPTION,
                access_token: TOKEN
            }
        });

        const creationId = mediaResponse.data.id;
        console.log('✅ تم إنشاء الحاوية بنجاح! معرّف الحاوية:', creationId);

        // الخطوة 2: الانتظار حتى تنتهي المعالجة
        await waitForProcessing(creationId);

        console.log('\n🚀 الخطوة 3: إرسال أمر النشر الفعلي...');
        
        const publishResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, null, {
            params: {
                creation_id: creationId,
                access_token: TOKEN
            }
        });

        console.log('\n🎉 نجاح ساحق! تم نشر مقطع الـ Reel بنجاح على حسابك.');
        console.log('🆔 معرّف المنشور (Post ID):', publishResponse.data.id);

    } catch (error) {
        console.error('\n❌ حدث خطأ أثناء نشر الفيديو:');
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

publishReelToInstagram();
```

---

## `autofactory-serv\scheduler.js`

```javascript
require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// 1. إعداد الاتصال بالسحابة
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // معرّف إنستغرام لصفحة القرآن

// 2. الدالة الشاملة: ترفع للسحابة ثم تنشر على إنستغرام
async function uploadAndPublish(localFilePath, captionText) {
    try {
        console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 بدء دورة النشر الآلي...`);
        
        // المرحلة الأولى: الرفع السحابي
        console.log('☁️ 1. جاري رفع الصورة من الحاسوب إلى السحابة...');
        const uploadResult = await cloudinary.uploader.upload(localFilePath, { 
            folder: 'AutoFactory' 
        });
        const secureUrl = uploadResult.secure_url;
        console.log('✅ تم الرفع بنجاح! الرابط:', secureUrl);

        // المرحلة الثانية: إنشاء الحاوية في سيرفرات ميتا
        console.log('📦 2. جاري إنشاء حاوية المنشور في Meta...');
        const mediaRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, null, {
            params: { image_url: secureUrl, caption: captionText, access_token: TOKEN }
        });
        const creationId = mediaRes.data.id;

        // المرحلة الثالثة: النشر الفعلي
        console.log('📢 3. إرسال أمر النشر النهائي لحساب إنستغرام...');
        const publishRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, null, {
            params: { creation_id: creationId, access_token: TOKEN }
        });

        console.log(`[${new Date().toLocaleTimeString()}] 🎉 نجاح ساحق! تم نشر الصورة. Post ID:`, publishRes.data.id);
        
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ حدث خطأ في إحدى المراحل:`);
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

// ---------------------------------------------------------
// إعداد الجدولة الزمنية (Cron Jobs)
// ---------------------------------------------------------

// ⚠️ تأكد من تعديل هذا المسار ليكون مساراً حقيقياً لصورة في جهازك
const LOCAL_IMAGE_PATH = 'E:/AutoFactory/Pictures/test.jpg'; 
const POST_CAPTION = 'تجربة النشر المتكامل: من الحاسوب 💻 -> إلى السحابة ☁️ -> إلى إنستغرام 🚀\n#أتمتة #NodeJS';

console.log('⏳ نظام الجدولة الشامل يعمل الآن في الخلفية. بانتظار الموعد المحدد...');

// مضبوط حالياً للعمل كل دقيقة لأغراض الاختبار
cron.schedule('* * * * *', () => {
    console.log('\n⏰ حان موعد النشر المجدول!');
    uploadAndPublish(LOCAL_IMAGE_PATH, POST_CAPTION);
});
```

---

## `autofactory-serv\upload.js`

```javascript
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// إعداد الاتصال بالسحابة
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadLocalImage(filePath) {
    try {
        console.log('⏳ جاري رفع الصورة من جهازك إلى السحابة...');
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'AutoFactory' // سيتم إنشاء هذا المجلد تلقائياً في حسابك
        });
        
        console.log('✅ تم الرفع بنجاح! هذا هو الرابط النظيف الذي تعشقه ميتا:');
        console.log(result.secure_url);
        return result.secure_url;
        
    } catch (error) {
        console.error('❌ خطأ في الرفع السحابي:', error.message);
    }
}

// اختبار الدالة - ضع هنا مسار صورة حقيقية موجودة في حاسوبك
// انتبه لطريقة كتابة المسار: استخدم الشرطة المائلة (/)
uploadLocalImage('E:/AutoFactory/Pictures/test.jpg');
```

---

## `autofactory-ui\.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}

```

---

## `autofactory-ui\README.md`

```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

```

---

## `autofactory-ui\index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>autofactory-ui</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

---

## `autofactory-ui\package.json`

```json
{
  "name": "autofactory-ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "lucide-react": "^1.47.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.3",
    "recharts": "^3.10.1",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "autoprefixer": "^10.6.0",
    "oxlint": "^1.81.0",
    "postcss": "^8.5.28",
    "tailwindcss": "^3.4.19",
    "vite": "^8.3.0"
  }
}

```

---

## `autofactory-ui\postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

---

## `autofactory-ui\tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## `autofactory-ui\vite.config.js`

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

---

## `autofactory-ui\src\App.css`

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

```

---

## `autofactory-ui\src\App.jsx`

```javascript
import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import PromptStudio from './pages/PromptStudio';
import TrendHub from './pages/TrendHub';
import TemplateLab from './pages/TemplateLab';
import TripleTemplateLab from './pages/TripleTemplateLab';
import RoadmapLab from './pages/RoadmapLab';
import BusinessLab from './pages/BusinessLab';
import StoryLab from './pages/StoryLab';
import ReelLab from './pages/ReelLab';
import LeadsDashboard from './pages/LeadsDashboard'; 
// 👈 استيراد مدير الحملات الجديد
import CampaignManager from './pages/CampaignManager'; 
import CommercialLab from './pages/CommercialLab';
import AcademyLab from './pages/AcademyLab';


function App() {
  const [activeTab, setActiveTab] = useState('trend-hub');

  const renderContent = () => {
    switch (activeTab) {
      case 'prompt':
        return <PromptStudio />;
      case 'trend-hub':
         return <TrendHub setActiveTab={setActiveTab} />;
      case 'template-lab':
        return <TemplateLab setActiveTab={setActiveTab} />;
      case 'triple-template-lab':
        return <TripleTemplateLab setActiveTab={setActiveTab} />;
      case 'roadmap-lab':
        return <RoadmapLab setActiveTab={setActiveTab} />;
      case 'business-lab':
        return <BusinessLab setActiveTab={setActiveTab} />;
      case 'story-lab':
        return <StoryLab setActiveTab={setActiveTab} />;
      case 'reel-lab':
        return <ReelLab setActiveTab={setActiveTab} />;
      case 'leads': 
        return <LeadsDashboard setActiveTab={setActiveTab} />;
      // 👈 ربط مسار مدير الحملات بالمكون الخاص به
      case 'campaigns':
        return <CampaignManager setActiveTab={setActiveTab} />;
      case 'commercial-lab':
        return <CommercialLab setActiveTab={setActiveTab} />;
      case 'academy-lab':
        return <AcademyLab setActiveTab={setActiveTab} />;
      case 'history':
      case 'dashboard':
      case 'settings':
        return <div className="text-gray-500 text-center mt-20 text-xl">جاري تطوير هذا القسم...</div>;
      default:
        return <TrendHub setActiveTab={setActiveTab} />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}> 
      {renderContent()} 
    </MainLayout> 
  );
}

export default App;
```

---

## `autofactory-ui\src\index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## `autofactory-ui\src\main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. استيراد الموجه
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. تغليف التطبيق بالموجه */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

---

## `autofactory-ui\src\layouts\MainLayout.jsx`

```javascript
import React from 'react'; //[cite: 2]
// تم إضافة أيقونة Users لقاعدة العملاء
import { LayoutDashboard, PenTool, TrendingUp, History, Settings, FlaskConical, Layers, Map, Briefcase, BookOpen, Clapperboard, Users, Megaphone, Video } from 'lucide-react'; 

const menuItems = [ //[cite: 2]
  { id: 'dashboard', name: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> }, //[cite: 2]
  { id: 'trend-hub', name: 'مركز الترند والذكاء', icon: <TrendingUp size={20} /> }, //[cite: 2]
  { id: 'template-lab', name: 'مختبر القوالب', icon: <FlaskConical size={20} /> }, //[cite: 2]
  { id: 'triple-template-lab', name: 'المقارنة الثلاثية', icon: <Layers size={20} /> }, //[cite: 2]
  { id: 'roadmap-lab', name: 'صانع الخطوات', icon: <Map size={20} /> }, //[cite: 2]
  { id: 'business-lab', name: 'مصنع الأرباح', icon: <Briefcase size={20} /> }, //[cite: 2]
  { id: 'story-lab', name: 'استوديو القصص', icon: <BookOpen size={20} /> }, //[cite: 2]
  { id: 'leads', name: 'قاعدة العملاء', icon: <Users size={20} /> },
  // داخل مصفوفة menuItems:
{ id: 'commercial-lab', name: 'استوديو الإعلانات', icon: <Video size={20} /> },
{ id: 'academy-lab', name: 'استوديو الأكاديمية', icon: <BookOpen size={20} /> },
  // 👈 إضافة زر استوديو الفيديوهات الجديد
  { id: 'campaigns', name: 'مدير الحملات', icon: <Megaphone size={20} /> },
  { id: 'reel-lab', name: 'استوديو الفيديوهات', icon: <Clapperboard size={20} /> }, 
  { id: 'prompt', name: 'استوديو الأوامر', icon: <PenTool size={20} /> }, //[cite: 2]
  { id: 'history', name: 'أرشيف النشر', icon: <History size={20} /> }, //[cite: 2]
  { id: 'settings', name: 'الإعدادات', icon: <Settings size={20} /> }, //[cite: 2]
];

export default function MainLayout({ activeTab, setActiveTab, children }) { //[cite: 2]
  // دالة مساعدة لتحديد ستايل الزر النشط بناءً على المسار
  const getActiveStyle = (id) => { //[cite: 2]
    if (id === 'business-lab') return 'bg-gradient-to-r from-yellow-600 to-emerald-600 text-white shadow-lg'; //[cite: 2]
    if (id === 'story-lab') return 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-900/30'; //[cite: 2]
    if (id === 'reel-lab') return 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-900/30'; //[cite: 2]
    // 👈 إضافة ستايل مميز لزر مدير الحملات
    if (id === 'campaigns') return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30';
    if (id === 'commercial-lab') return 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/30';
    if (id === 'academy-lab') return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30';
    // 👈 إضافة ستايل مميز لزر قاعدة العملاء
    if (id === 'leads') return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30';
    return 'bg-blue-600 text-white shadow-lg'; //[cite: 2]
  };

  return ( //[cite: 2]
    <div dir="rtl" className="flex h-screen bg-gray-900 text-white font-sans"> 
      {/* Sidebar */} 
      <div className="w-64 bg-gray-800 p-5 flex flex-col border-l border-gray-700 shrink-0"> 
        <div className="flex items-center gap-3 mb-10"> 
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50"> 
            AF 
          </div> 
          <h1 className="text-2xl font-bold tracking-wider text-blue-400">AutoFactory</h1> 
        </div> 
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar"> 
          {menuItems.map((item) => ( //[cite: 2]
            <button //[cite: 2]
              key={item.id} //[cite: 2]
              onClick={() => setActiveTab(item.id)} //[cite: 2]
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${ //[cite: 2]
                activeTab === item.id  //[cite: 2]
                ? getActiveStyle(item.id)  //[cite: 2]
                : 'text-gray-400 hover:bg-gray-700 hover:text-white' //[cite: 2]
              }`} //[cite: 2]
            >
              {item.icon} 
              <span className="font-medium">{item.name}</span> 
            </button> //[cite: 2]
          ))}
        </nav> 
        
        {/* توقيعك الشخصي في أسفل القائمة */} 
        <div className="mt-auto pt-4 border-t border-gray-700 text-center"> 
            <p className="text-xs text-gray-500 font-bold">م/ غربي محمد الشريف</p> 
        </div> 
      </div> 

      {/* Main Content Area */} 
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar"> 
        <header className="mb-8"> 
          <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3"> 
            {menuItems.find(i => i.id === activeTab)?.icon} 
            {menuItems.find(i => i.id === activeTab)?.name} 
          </h2> 
        </header> 
        
        {/* هنا سيتم حقن محتوى الصفحة النشطة */} 
        {children} 
      </div> 
    </div> 
  ); //[cite: 2]
}
```

---

## `autofactory-ui\src\pages\AcademyLab.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { BookOpen, Wand2, Layers, CheckCircle, BrainCircuit, Play, Server, ChevronLeft, FileText, Code, HelpCircle, Lightbulb, Zap, TrendingUp, GraduationCap, Download } from 'lucide-react';


const AcademyLab = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('متوسط (B-Rank)');
  const [blueprint, setBlueprint] = useState(null);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [loadingIdea, setLoadingIdea] = useState(false);

  const [forgingStatus, setForgingStatus] = useState('idle'); 
  const [forgeProgress, setForgeProgress] = useState({ current: 0, total: 0, currentLessonName: '' });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [syncing, setSyncing] = useState(false); // حالة زر المزامنة



// ===========
// ===============================
  // 💡 1. محرك الإلهامات الذكي (Ideas Engine)
  // ==========================================
  const generateIdea = async (type) => {
    setLoadingIdea(true);
    // إفراغ حقل النص أثناء التفكير ليعرف المستخدم أن هناك عملية تحدث
    setTopic('جاري العصف الذهني واستخراج فكرة... 🧠'); 

try {
      const res = await axios.post('http://localhost:5000/api/academy/suggest-topic', { type });
      if (res.data.success && res.data.idea) {
        setTopic(res.data.idea);
      }
    } catch (err) {
      const fallbacks = [
        type === 'bootcamp' ? 'معسكر MERN Stack الشامل: 4 شهادات فرعية لبناء تطبيقات مؤسسية' : 'الذكاء الاصطناعي للمطورين: من الصفر إلى إطلاق أول Agent'
      ];
      setTopic(fallbacks[0]);
    } finally {
      setLoadingIdea(false);
    }
  };

  // ==========================================
  // 📐 2. هندسة الهيكل (Blueprint)
  // ==========================================
  const handleGenerateBlueprint = async () => {
    if (!topic) return alert('يرجى إدخال أو توليد موضوع الدورة!');
    setLoadingBlueprint(true);
    try {
      const res = await axios.post('http://localhost:5000/api/academy/blueprint', { topic, difficulty });
      if (res.data.success) {
        setBlueprint(res.data.data);
        setForgingStatus('idle'); // إعادة تعيين الحالة
        setSelectedLesson(null);
      }
    } catch (err) {
      alert('حدث خطأ أثناء هندسة الهيكل.');
    } finally {
      setLoadingBlueprint(false);
    }
  };

  // ==========================================
  // ✍️ 3. تأليف الكورس (The Forge)
  // ==========================================
  const handleForgeAllLessons = async () => {
    if (!blueprint) return;
    
    let totalLessons = 0;
    blueprint.blueprint.forEach(sec => totalLessons += sec.lessons.length);
    
    setForgingStatus('forging');
    let completedCount = 0;
    let updatedBlueprint = JSON.parse(JSON.stringify(blueprint));

    for (let sIdx = 0; sIdx < updatedBlueprint.blueprint.length; sIdx++) {
      const section = updatedBlueprint.blueprint[sIdx];
      for (let lIdx = 0; lIdx < section.lessons.length; lIdx++) {
        const lesson = section.lessons[lIdx];
        setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: lesson.title });

        try {
          const res = await axios.post('http://localhost:5000/api/academy/forge-lesson', {
            courseTopic: updatedBlueprint.courseTitle,
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            difficulty: difficulty
          });

          if (res.data.success) {
            updatedBlueprint.blueprint[sIdx].lessons[lIdx] = {
              ...lesson,
              content: res.data.data.content,
              codeSnippet: res.data.data.codeSnippet,
              quiz: res.data.data.quiz,
              isForged: true
            };
            setBlueprint({...updatedBlueprint}); 
          }
        } catch (error) {
          console.error(`خطأ في تأليف درس: ${lesson.title}`);
        }
        
        completedCount++;
        setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: lesson.title });
      }
    }
    setForgingStatus('complete');
    alert('🎉 اكتمل تأليف الكورس بالكامل! يمكنك الآن مراجعته.');
  };

  // ==========================================
  // 🚀 4. المزامنة مع المنصة (The API Bridge)
  // ==========================================
  const handleSyncToPlatform = async () => {
    if (!blueprint || forgingStatus !== 'complete') return;
    
    const confirmSync = window.confirm('هل أنت متأكد من رفع هذا الكورس بالكامل إلى قاعدة بيانات منصتك؟');
    if (!confirmSync) return;

    setSyncing(true);
    try {
      // ⚠️ أرسل البيانات إلى السيرفر الخاص بـ CherifPlatform! 
      // (تأكد من أن السيرفر يعمل على بورت 5001 أو البورت الذي تستخدمه المنصة)
      const res = await axios.post('http://localhost:5001/api/courses/auto-import', {
        courseTitle: blueprint.courseTitle,
        courseDescription: blueprint.courseDescription,
        difficulty: difficulty,
        blueprint: blueprint.blueprint
      });

      if (res.data.success) {
        alert('🎉 تم إطلاق الكورس بنجاح! اذهب الآن لـ CherifPlatform وستجده هناك مع كل دروسه!');
      }
    } catch (error) {
      console.error(error);
      alert('❌ حدث خطأ في المزامنة. تأكد من أن سيرفر CherifPlatform يعمل (على البورت 5001).');
    } finally {
      setSyncing(false);
    }
  };

// ==========================================
  // 💾 5. تصدير الكورس كملف (فكرتك العبقرية)
  // ==========================================
  const handleDownloadJSON = () => {
    if (!blueprint) return;
    
    // تحويل الكائن إلى نص JSON منسق
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    
    // تسمية الملف باسم الكورس مع استبدال المسافات
    const safeTitle = blueprint.courseTitle.replace(/[^a-zA-Z0-9أ-ي]/g, '_');
    downloadAnchorNode.setAttribute("download", `CourseExport_${safeTitle}.json`);
    
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };


  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      
      {/* الهيدر */}
      <div className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BrainCircuit className="text-emerald-500" size={40} /> مختبر الأكاديمية <span className="text-emerald-500 bg-emerald-500/10 text-lg px-3 py-1 rounded-lg border border-emerald-500/20">Auto-Course AI</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold">مصنع توليد الكورسات وهيكلة المناهج التعليمية بضغطة زر ونقلها لـ CherifPlatform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================================================== */}
        {/* العمود الأيمن */}
        {/* ================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. إعدادات وإلهامات التوليد */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="text-blue-500" /> هندسة المنهج
            </h2>

            {/* أزرار الإلهام السريعة */}
{/* أزرار الإلهام السريعة */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => generateIdea('crash')} className="flex-1 bg-slate-800 hover:bg-yellow-900/30 border border-slate-700 hover:border-yellow-500/50 text-slate-400 hover:text-yellow-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Zap size={14}/> كراش كورس
              </button>
              <button onClick={() => generateIdea('money')} className="flex-1 bg-slate-800 hover:bg-emerald-900/30 border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <TrendingUp size={14}/> مهارة للربح
              </button>
              <button onClick={() => generateIdea('trend')} className="flex-1 bg-slate-800 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500/50 text-slate-400 hover:text-purple-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Lightbulb size={14}/> تريند ومطلوب
              </button>
              {/* 🆕 الزر الجديد للتخصصات الكبرى */}
              <button onClick={() => generateIdea('bootcamp')} className="flex-1 bg-slate-800 hover:bg-rose-900/30 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <GraduationCap size={14}/> معسكر شامل
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">الموضوع المراد تدريسه (اكتب أو اختر من الإلهامات)</label>
                <input type="text" placeholder="مثال: احتراف بناء تطبيقات بـ Electron.js" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white transition-colors" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
<div>
                <label className="block text-sm font-bold text-slate-400 mb-2">مستوى الصعوبة المستهدف</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white appearance-none" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="مبتدئ تماماً (E-Rank)">مبتدئ تماماً (E-Rank)</option>
                  <option value="متوسط (B-Rank)">متوسط (B-Rank)</option>
                  <option value="خبير متقدم (S-Rank)">خبير متقدم (S-Rank)</option>
                  {/* 🆕 الخيار الخاص بالمعسكرات والشهادات المصغرة */}
                  <option value="معسكر شامل (Bootcamp - شهادات مصغرة)">معسكر شامل (Bootcamp - شهادات مصغرة)</option>
                </select>
              </div>
              
              <button onClick={handleGenerateBlueprint} disabled={loadingBlueprint || forgingStatus === 'forging'} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingBlueprint ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div> : <><Wand2 size={20} /> هندسة خريطة المنهج</>}
              </button>
            </div>
          </div>

          {/* 2. عرض شجرة المنهج (Blueprint Tree) */}
          {blueprint && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-2">{blueprint.courseTitle}</h2>
              <p className="text-sm text-slate-400 mb-6 border-b border-slate-800 pb-4">{blueprint.courseDescription}</p>
              
              <div className="space-y-4">
                {blueprint.blueprint.map((section, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-black text-emerald-400 mb-3 text-sm flex items-center gap-2"><ChevronLeft size={16}/> {section.sectionName}</h3>
                    <div className="space-y-2">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} onClick={() => lesson.isForged && setSelectedLesson(lesson)} className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-between transition-colors ${lesson.isForged ? 'bg-emerald-900/10 border-emerald-500/30 text-white cursor-pointer hover:bg-emerald-900/30' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          <div className="flex items-center gap-2 truncate">
                            <Play size={14} className={lesson.isForged ? 'text-emerald-500' : 'text-slate-600'} />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {lesson.isForged && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {forgingStatus === 'idle' && (
                <button onClick={handleForgeAllLessons} className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2">
                  <BrainCircuit size={20} /> تأليف محتوى جميع الدروس
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* العمود الأيسر */}
        {/* ================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* حالة التأليف المباشرة */}
          {forgingStatus !== 'idle' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {forgingStatus === 'forging' ? <div className="animate-pulse w-3 h-3 bg-purple-500 rounded-full"></div> : <CheckCircle className="text-emerald-500" />}
                {forgingStatus === 'forging' ? 'الذكاء الاصطناعي يقوم بالتأليف الآن...' : 'تم اكتمال تأليف الكورس'}
              </h3>
              
              <div className="w-full bg-slate-950 rounded-full h-4 mb-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(forgeProgress.current / forgeProgress.total) * 100}%` }}></div>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span className="truncate w-3/4">{forgingStatus === 'forging' ? `جاري تأليف: ${forgeProgress.currentLessonName}` : 'جميع الدروس جاهزة!'}</span>
                <span>{forgeProgress.current} / {forgeProgress.total}</span>
              </div>
            </div>
          )}

          {/* شاشة معاينة الدرس (Preview) */}
          <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col max-h-[600px]">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
              <BookOpen className="text-emerald-500" /> معاينة محتوى الدرس
            </h2>

            {!selectedLesson ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
                <BookOpen size={64} className="opacity-20" />
                <p className="font-bold">اضغط على أي درس (مكتمل باللون الأخضر) لرؤية محتواه هنا.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                <h1 className="text-2xl font-black text-white">{selectedLesson.title}</h1>
                
                {/* 1. الشرح النظري */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><FileText size={16}/> الشرح النظري</h4>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedLesson.content}
                  </div>
                </div>

                {/* 2. الكود البرمجي */}
                {selectedLesson.codeSnippet && selectedLesson.codeSnippet.trim() !== '' && (
                  <div className="bg-[#0d1117] border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2"><Code size={16}/> الكود البرمجي</h4>
                    <pre className="text-emerald-400 text-sm overflow-x-auto" dir="ltr">
                      <code>{selectedLesson.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* 3. الاختبار التفاعلي */}
                {selectedLesson.quiz && selectedLesson.quiz.question && (
                  <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-xl">
                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2"><HelpCircle size={16}/> اختبار نهاية الدرس</h4>
                    <p className="text-white font-bold text-sm mb-4">{selectedLesson.quiz.question}</p>
                    <div className="space-y-2">
                      {selectedLesson.quiz.options.map((opt, i) => (
                        <div key={i} className={`p-3 rounded-lg border text-sm font-bold ${selectedLesson.quiz.correctAnswerIndex === i ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                          {opt} {selectedLesson.quiz.correctAnswerIndex === i && '(إجابة صحيحة)'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

{/* 🚀 أزرار النقل والحفظ (تظهر بعد اكتمال التأليف) */}
          {forgingStatus === 'complete' && (
            <div className="flex gap-4 animate-fade-in-up">
              
              {/* زر فكرتك (تصدير كملف) */}
              <button onClick={handleDownloadJSON} className="flex-1 bg-slate-800 hover:bg-blue-900/30 border border-slate-700 hover:border-blue-500/50 text-blue-400 hover:text-white font-bold py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-lg">
                <Download size={24} /> تحميل كملف (JSON)
              </button>

              {/* زر المزامنة المباشرة (بعد إصلاح السيرفر) */}
              <button onClick={handleSyncToPlatform} disabled={syncing} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 text-lg disabled:opacity-50">
                {syncing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                ) : (
                  <><Server size={24} className="animate-pulse" /> مزامنة لـ CherifPlatform</>
                )}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AcademyLab;
```

---

## `autofactory-ui\src\pages\BusinessLab.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, Loader2, Image as ImageIcon, Share2, Send, CheckCircle, TrendingUp, Copy, Smartphone, Globe, Wand2, UserSquare2, MonitorPlay } from 'lucide-react';

export default function BusinessLab() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  const [coverOptions, setCoverOptions] = useState([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0); // الافتراضي هو الغلاف الأول
  const [images, setImages] = useState({ instagram: [], facebook: [] });
  
  // نصوص السوشيال ميديا
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  
  // برومبتات جيميني
  const [magicPrompt3D, setMagicPrompt3D] = useState('');
  const [magicPromptAvatar, setMagicPromptAvatar] = useState('');
  const [magicPromptLifestyle, setMagicPromptLifestyle] = useState(''); // 👈 أضفنا متغير البرومبت الثالث
  const [magicPromptFounder, setMagicPromptFounder] = useState('');
  const [magicPromptTechVisionary, setMagicPromptTechVisionary] = useState('');
  const [magicPromptMastermind, setMagicPromptMastermind] = useState('');
  const [magicPromptVIP, setMagicPromptVIP] = useState('');

// حالات أزرار النسخ
  const [copiedStates, setCopiedStates] = useState({
    ig: false, fb: false, prompt3D: false, promptAvatar: false, promptLifestyle: false, promptFounder: false, promptTechVisionary: false, promptMastermind: false, promptVIP: false
  });

  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // دالة النسخ مع تغيير حالة الزر مؤقتاً
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
  };

  const suggestBusinessTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-business-roadmap');
      if (res.data.success) setTopic(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  const generateBusinessRoadmap = async () => {
    if (!topic) return alert('اكتب الموضوع التجاري أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    
    try {
      const res = await axios.post('http://localhost:5000/api/generate-business-roadmap', { 
        topic, 
        slideCount, 
        platform 
      });
      
      if (res.data.success) {
        setImages(res.data.images);
        setCoverOptions(res.data.coverOptions); // 👈 إضافة هذا السطر
        setSelectedCoverIndex(0); // إعادة التعيين
        // استلام النصوص من السيرفر
        setIgCaption(res.data.igCaption || 'اكتب هنا وصف إنستغرام...');
        setFbCaption(res.data.fbCaption || 'اكتب هنا وصف فيسبوك...');
        
        // توليد البرومبتات السحرية ديناميكياً بناءً على الموضوع
        const p3D = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".\nمرفق مع هذه الرسالة صورة الغلاف غير المكتملة.\n\nالمطلوب منك كخبير دمج وتصميم ثلاثي الأبعاد (3D Artist & Compositor):\n1. التجسيد الحرفي للفكرة: قم بتوليد مجسم 3D معقد ومذهل في "النصف العلوي فقط" من المساحة الفارغة، يعبر حرفياً عن فكرة الموضوع (مثلاً: آلة تستخرج البيانات، أو واجهة API، أو روبوت ذكي).\n2. الطابع البصري (Tech meets Wealth): أريد دمجاً عبقرياً بين "التكنولوجيا المتقدمة" و"الأرباح الطائلة". أضف عناصر توحي بالثراء المباشر (مثل: عملات ذهبية تتطاير من الكود، علامة الدولار $ مشعة ومجسمة، أو رسومات بيانية خضراء نيون تتصاعد بقوة). اجعل المشهد يثير "طمعاً إيجابياً" ويوحي بأن هذه التقنية هي آلة لطباعة الأموال!\n3. التفاصيل والمواد: اجعل المجسم فخماً جداً (Premium) وغالي الثمن. استخدم مواد مثل الزجاج الأسود اللامع، المعدن الكربوني، والذهب الخالص، مع خطوط بيانات نيون تتحول إلى أموال.\n4. الإضاءة: إضاءة درامية (Dark Moody Lighting) تناسب الـ Dark Mode، مع توهج (Glow) ذهبي وزمردي (أخضر فاقع) يشع من قلب المجسم ليفصله عن الخلفية الداكنة بأناقة.\n5. **قاعدة الحدود الجغرافية (حرج جداً):** المجسم والأموال المتطايرة يجب أن تكون محصورة تماماً في "النصف العلوي المظلم". إياك أن تجعل أي جزء يمتد للأسفل ليتداخل أو يغطي النص الأبيض الضخم (مثل "اكسب 5000$...") أو الزر الأخضر. لا تمسح أو تشوه أي نصوص أو شارات موجودة أصلاً.`;

        const pAvatar = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".\nمرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع للوجه.\n\nالمطلوب كخبير دمج (Compositor):\n1. توليد صورة واقعية (Photorealistic) لي في "النصف العلوي فقط" من المساحة الفارغة في الغلاف.\n2. **قاعدة صارمة للوجه:** حافظ على ملامح وجهي وشكل رأسي بنسبة 100% (استخدم صورتي كمرجع دقيق).\n3. **الوضعية:** اجعلني أرتدي بدلة احترافية حديثة، وأقوم بفعل يعبر عن: "${topic}". (مثال: أنظر بثقة للجمهور وبجانبي مجسم 3D مشع يمثل الفكرة).\n4. **الحدود الجغرافية (حرج جداً):** يجب أن يكون جسدي والمجسم الـ 3D محصورين تماماً في "المساحة المظلمة العلوية". إياك أن تجعل يدي، جسدي، أو أي عنصر يمتد للأسفل ليغطي أو يتداخل مع النص الأبيض الكبير (مثل "كيف تكسب...") أو الزر الأخضر في الأسفل.\n5. الإضاءة: إضاءة حواف (Edge Lighting) درامية تتناسب مع الـ Dark Mode.`;

        const pLifestyle = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق مع هذه الرسالة صورة الغلاف غير المكتملة.

المطلوب منك كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. التجسيد الواقعي (Lifestyle & Tech): قم بملء "النصف العلوي فقط" من المساحة الفارغة بمشهد "بيئة عمل فاخرة جداً" (Luxury Workspace) تعبر عن فكرة الموضوع. (مثلاً: حاسوب محمول فخم مفتوح بزاوية سينمائية على طاولة من الرخام الأسود الداكن، وتنبثق من شاشته واجهات شفافة أنيقة (Holographic UI) أو رسومات بيانية خضراء توحي بالنجاح وتدفق الأرباح).
2. الطابع البصري (بيع الحلم): المشهد يجب أن يبدو كصورة فوتوغرافية حقيقية (Photorealistic) مأخوذة بكاميرا احترافية، وليس تصميماً كرتونياً. أضف عناصر توحي بالحرية المالية والاحترافية (مثلاً: كوب قهوة فاخر بجانب اللابتوب، نظارات، أو خلفية ضبابية "Bokeh" لنافذة تطل على أضواء ناطحات سحاب في مدينة حديثة ليلاً).
3. الإضاءة والتفاصيل: إضاءة سينمائية هادئة (Moody Cinematic Lighting) تتناغم مع الـ Dark Mode. ركز على انعكاس توهج الشاشة (أزرق/أخضر) على سطح الطاولة الرخامي الداكن لإعطاء واقعية مطلقة وفخامة.
4. **قاعدة الحدود الجغرافية (حرج جداً):** الطاولة، اللابتوب، وكل تفاصيل المشهد الواقعي يجب أن تكون محصورة تماماً في "النصف العلوي المظلم". إياك أن تجعل أي جزء يمتد للأسفل ليتداخل أو يغطي النص الأبيض الضخم أو الزر الأخضر. لا تمسح أو تشوه أي نصوص أو شارات موجودة أصلاً في الغلاف.`;

const pFounder = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب منك كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. التجسيد الواقعي المدمج (The Founder Lifestyle): قم بملء "النصف العلوي فقط" من المساحة الفارغة بمشهد يجمعني أنا شخصياً داخل "بيئة عمل فاخرة جداً". اجعلني (بنسخة واقعية Photorealistic) أجلس بثقة أو أقف خلف طاولة من الرخام الأسود الداكن.
2. الطابع البصري والتفاعل: ألبسني بدلة احترافية حديثة وأنيقة. على الطاولة أمامي، ضع حاسوباً محمولاً فخماً تنبثق منه واجهات شفافة أنيقة (Holographic UI) أو رسومات بيانية خضراء توحي بالنجاح (تعبر عن الموضوع). أضف خلفية ضبابية "Bokeh" لمدينة ليلية حديثة.
3. قاعدة صارمة للوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100% (استخدم صورتي المرفقة كمرجع دقيق ولا تغير ملامحي).
4. الإضاءة والدمج السلس (الحل السحري): إضاءة سينمائية هادئة (Moody Cinematic) تتناغم مع الـ Dark Mode. **حرج جداً: يجب أن تتلاشى الحافة السفلية للصورة (والمكتب) تدريجياً إلى السواد التام (Smooth Gradient Fade to Black) بحيث تندمج بسلاسة مطلقة مع خلفية الغلاف الداكنة دون أي خطوط قص حادة أو حواف مربعة مرئية.**
5. **قاعدة الحدود الجغرافية (حرج جداً):** جسدي، الطاولة، وكل تفاصيل المشهد يجب أن تكون محصورة تماماً في "النصف العلوي المظلم". إياك أن تجعل أي جزء يمتد للأسفل ليتداخل أو يغطي النص الأبيض الضخم أو الزر الأخضر. لا تمسح أو تشوه أي نصوص أو شارات موجودة أصلاً.`;


const pTechVisionary = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. المشهد (The Tech Visionary): املأ "النصف العلوي فقط". اجعلني أقف بوضعية الثقة والقيادة (مثلاً: ذراعان متقاطعان).
2. الطابع البصري: ألبسني بدلة 'سمارت كاجوال' أنيقة (مثل سويتر بياقة عالية داكن وسترة). أمامي أو بجانبي، ارسم شاشة هولوغرامية شفافة ضخمة تعرض هندسة معمارية لـ SaaS وتدفقات مالية خضراء (تعبر عن الفكرة). الخلفية: مركز بيانات متطور (Data Center) أو قاعة مؤتمرات تقنية مظلمة مع إضاءة نيون.
3. الوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100%.
4. الدمج السلس: إضاءة سينمائية تتناغم مع الـ Dark Mode. **يجب أن تتلاشى الحافة السفلية للصورة تدريجياً إلى السواد التام (Gradient Fade to Black) لتندمج مع الخلفية بلا حواف حادة.**
5. الحدود الجغرافية: كل شيء يجب أن يكون في النصف العلوي المظلم، دون تغطية أي نصوص أو أزرار في الأسفل.`;

        const pMastermind = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. المشهد (The Mastermind): املأ "النصف العلوي فقط". اجعلني في حالة تركيز شديد وعمل جاد.
2. الطابع البصري: ألبسني قميصاً أبيض احترافياً مع أكمام مطوية. اجعلني أنظر وأتفاعل (مثلاً: أكتب أو أشير) نحو لوح زجاجي شفاف ومضيء (Smart Board) يعرض مخططات مالية وأكواد برمجية (تعبر عن الفكرة). الخلفية: ضبابية لمكتب فاخر في طابق علوي يطل على المدينة.
3. الوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100%.
4. الدمج السلس: إضاءة سينمائية تتناغم مع الـ Dark Mode. **تلاشي الحافة السفلية تدريجياً إلى السواد التام (Gradient Fade to Black) ضروري جداً.**
5. الحدود الجغرافية: التزم بصرامة بالنصف العلوي فقط، دون المساس بالعناوين والأزرار.`;

        const pVIP = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. المشهد (The VIP Lifestyle): املأ "النصف العلوي فقط". ركز على الرفاهية والعمل بذكاء.
2. الطابع البصري: ألبسني ملابس كاجوال فاخرة ومريحة. اجعلني أجلس باسترخاء في صالة انتظار طيران فخمة (VIP Lounge) أو على شرفة زجاجية حديثة ليلاً. أعمل على لابتوب أنيق، وتنبثق منه إشعارات أرباح ومخططات خضراء (تعبر عن الفكرة).
3. الوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100%.
4. الدمج السلس: إضاءة خافتة (Moody) توحي بالحرية المالية. **تأكد من تلاشي الحافة السفلية تدريجياً إلى السواد (Gradient Fade to Black) لدمج مثالي.**
5. الحدود الجغرافية: حافظ على نظافة النصف السفلي من أي تداخل مع النصوص الأصلية للغلاف.`;

        setMagicPromptFounder(pFounder);
        setMagicPromptTechVisionary(pTechVisionary);
        setMagicPromptMastermind(pMastermind);
        setMagicPromptVIP(pVIP);
        setMagicPrompt3D(p3D);
        setMagicPromptAvatar(pAvatar);
        setMagicPromptLifestyle(pLifestyle);
        setMagicPromptFounder(pFounder);
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  // 🔥 مستشار التسويق الذكي - منطق تحليل الموضوع والنصيحة
const getMarketingAdvice = (topic, options) => {
    let recommendation = '';
    let reasoning = '';
    const topicLower = topic.toLowerCase();

 // تحليل الكلمات المفتاحية للموضوع (دعم ثنائي اللغة)
    const isRegional = topicLower.includes('algeria') || topicLower.includes('dz') || topicLower.includes('جزائر');
    const isEcom = topicLower.includes('ecommerce') || topicLower.includes('تجار') || topicLower.includes('سلع') || topicLower.includes('متاجر');
    const isTech = topicLower.includes('saas') || topicLower.includes('منصة') || topicLower.includes('برمج') || topicLower.includes('موقع') || topicLower.includes('ذكاء');
    const isIncome = topicLower.includes('$') || topicLower.includes('income') || topicLower.includes('أرباح') || topicLower.includes('اشتراك') || topicLower.includes('بيع');
    const isExpert = topicLower.includes('professional') || topicLower.includes('احترافي') || topicLower.includes('خبراء');


    // منطق التوصية التسويقية المطورة
    if (isRegional && isEcom && isTech) {
        // موضوعك الحالي تماماً
        recommendation = '🏆 الخيار 6: المُخطط الاستراتيجي (لوح الزجاج)';
        reasoning = `الموضوع تقني إقليمي بامتياز. سيكولوجياً، المتابع الجزائري بحاجة لرؤية "العمل الفعلي". لقطة لوح الزجاج وهيئة "المبرمج الجاد" مع الكود الجزائرى المخصص تخلق ثقة (Credibility) لا تُقاوم وتثبت أنك تبني الحل بأذنك.`;
    } else if (isTech && isExpert && !isIncome) {
        // موضوعات الهندسة المعمارية والـ APIs
        recommendation = '💡 الخيار 5: المُحاضر التقني (الهولوغرام)';
        reasoning = `أنت تتحدث لجمهور تقني محترف. وقفة الخوارزميات وهياكل البيانات أمام الخوادم تبنيك كمرجعية تقنية (Authority) وتثبت قوة الأنظمة المعقدة التي تبنيها.`;
    } else if (isIncome && isEcom) {
        // موضوعات جني الأرباح بصمت
        recommendation = '✈️ الخيار 7: الرفاهية والـ VIP';
        reasoning = `هنا أنت تبيع "النتيجة النهائية". المتابع يريد أن يرى الحياة التي سيحصل عليها. إشعارات الأرباح الجزائرية المنبثقة من اللابتوب في جو من الرفاهية تضرب عصب "الرغبة" (Desire) وتجلب أعلى معدلات نقر (CTR) من الطموحين.`;
    } else if (isRegional && isExpert) {
        // موضوعات الاستشارات واللقاءات الرسمية
        recommendation = '💼 الخيار 4: هالة المؤسس (المكتب الكلاسيكي)';
        reasoning = `عندما تتحدث عن استشارات تجارية أو إطلاق منصة رسمية في السوق الجزائري، فإن الكلاسيكية هي الأفضل لبناء "الموثوقية" (Trust) في المقام الأول. نظرتك المباشرة للكاميرا من خلف مكتب فاخر تبنيك كشخصية قيادية موثوقة.`;
    } else {
        // النصيحة الافتراضية لأي موضوع آخر
        recommendation = '🏆 الخيار 6: المُخطط الاستراتيجي (لوح الزجاج)';
        reasoning = `هذا هو الخيار الأقوى بشكل عام لمحتوى SaaS. إنه يجمع بين الاحترافية والديناميكية، ويظهرك في قمة التركيز وأنت تبني الحل.`;
    }

    return { recommendation, reasoning };
};


  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/publish-omni', { platform, images, igCaption, fbCaption });
      if (res.data.success) setPublishSuccess(true);
    } catch (error) {
      console.error(error); alert('فشل النشر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#05070A]" dir="rtl">
      {/* 💼 الهيدر الفخم */}
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center gap-3">
        <Briefcase className="text-yellow-500" size={38} />
        مصنع الأرباح والـ SaaS (Business Blueprint)
      </h1>
      
      {/* 🟢 محدد المنصة */}
      <div className="bg-slate-900 p-4 rounded-xl border border-yellow-500/20 flex gap-2 mb-8 mx-auto max-w-2xl text-sm shadow-[0_0_20px_rgba(234,179,8,0.05)]">
        <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-pink-500/50'}`}>إنستغرام</button>
        <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-blue-500/50'}`}>فيسبوك</button>
        <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'both' ? 'bg-emerald-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-emerald-500/50'}`}>كلاهما معاً</button>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-yellow-500/30 flex flex-col shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-emerald-400" size={32} />
            <h2 className="text-2xl font-bold text-slate-100">هندسة الفكرة التجارية</h2>
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            <textarea 
              placeholder="عن أي منتج SaaS أو مهارة مربحة ستتحدث؟ (مثال: بناء منصة ذكاء اصطناعي لكتابة المحتوى وبيعها باشتراكات)" 
              className="w-full p-5 bg-[#020408] border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder:text-slate-600 resize-none h-32 text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-4 w-full">
              <button 
                onClick={suggestBusinessTopic} 
                disabled={isSuggesting} 
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#05070A] p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-yellow-600/20 text-lg"
              >
                {isSuggesting ? <Loader2 size={24} className="animate-spin" /> : <Briefcase size={24} />}
                <span>إلهام خطة أرباح 💰</span>
              </button>

              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-1/3 p-4 bg-[#020408] border border-slate-700 rounded-xl text-yellow-500 outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer font-bold transition-all text-lg text-center"
              >
                <option value="5">5 شرائح (سريع)</option>
                <option value="6">6 شرائح (أساسي)</option>
                <option value="7">7 شرائح (احترافي)</option>
                <option value="8">8 شرائح (خبير)</option>
                <option value="9">9 شرائح (ماستر)</option>
                <option value="10">10 شرائح</option>
                <option value="11">11 شريحة</option>
                <option value="12">12 شريحة</option>
                <option value="13">13 شريحة</option>
                <option value="14">14 شريحة</option>
                <option value="15">15 شريحة</option>
                <option value="16">16 شريحة</option>
                <option value="17">17 شريحة (أسطوري 👑)</option>
              </select>
            </div>
          </div>

          <button onClick={generateBusinessRoadmap} disabled={loading || !topic} className="w-full p-5 mt-8 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 flex justify-center items-center gap-3 text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
            {loading ? <><Loader2 size={26} className="animate-spin" /> جاري تخطيط البيزنس...</> : '⚡ صمم خريطة الأرباح الآن'}
          </button>
        </div>
      </div>

      {/* 👁️ غرفة المراجعة (Review Studio) */}
{/* 👁️ غرفة المراجعة (Review Studio) */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-3xl font-bold mb-8 text-slate-100 flex items-center justify-center gap-3">
            👁️ استوديو المراجعة والأدوات
          </h3>

          {/* 🧠 صندوق مستشار الأرباح الذكي (The Profit Advisor) */}
          {magicPromptFounder && (
            <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 mb-10 shadow-[0_0_30px_rgba(16,185,129,0.15)] mx-auto max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-500 text-slate-900 p-3 rounded-full text-xl font-bold">
                  <TrendingUp size={24}/>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">🏆 مستشار الأرباح الذكي (The Profit Advisor)</h2>
                  <p className="text-sm text-emerald-300">تحليل تسويقي مستقل لأفضل غلاف لمنشورك</p>
                </div>
              </div>
              
              {/* استدعاء دالة النصيحة المطورة وعرض النتائج */}
              {(() => {
                const { recommendation, reasoning } = getMarketingAdvice(topic, {});
                return (
                  <div className="space-y-4">
                    <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-700 shadow-inner">
                      <p className="text-sm text-slate-400 mb-2">توصيتنا النهائية:</p>
                      <p className="text-xl font-extrabold text-emerald-400">{recommendation}</p>
                    </div>
                    <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-700 shadow-inner">
                      <p className="text-sm text-slate-400 mb-2">التحليل التسويقي والسيكولوجي (Developed Logic):</p>
                      <p className="text-base text-slate-300 leading-relaxed">{reasoning}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* 📸 قسم الصور المنتجة */}
            <div className="space-y-8">
              {(platform === 'instagram' || platform === 'both') && (
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-pink-500/20 shadow-2xl">
                  {/* 🎯 قسم اختيار الغلاف الأقوى (A/B/C Testing) */}
                  {coverOptions && coverOptions.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                        <TrendingUp size={20}/> اختر أقوى غلاف (الخطاف الأفضل):
                      </h4>
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {coverOptions.map((optImg, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                                setSelectedCoverIndex(idx);
                                // تحديث المصفوفة الرئيسية بالصورة المختارة
                                const newImages = {...images};
                                if(newImages.instagram.length > 0) newImages.instagram[0] = coverOptions[idx];
                                if(newImages.facebook.length > 0) newImages.facebook[0] = coverOptions[idx]; // بافتراض التسمية تتطابق أو تكفي للإشارة
                                setImages(newImages);
                            }}
                            className={`cursor-pointer transition-all duration-300 rounded-xl border-4 ${selectedCoverIndex === idx ? 'border-yellow-500 scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={`http://localhost:5000/${optImg}`} className="h-64 rounded-lg" alt={`Hook Option ${idx+1}`}/>
                            <div className="text-center mt-2 text-sm font-bold text-slate-300">
                                {idx === 0 ? '💰 الرغبة' : idx === 1 ? '🤫 الفضول' : '⚡ التحدي'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* عرض الكاروسيل النهائي */}
                  <h4 className="font-bold text-pink-400 mb-4 flex items-center gap-2"><ImageIcon size={22}/> الكاروسيل النهائي:</h4>
                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    {images.instagram.map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt={`Slide ${idx+1}`}/>
                    ))}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    {images.instagram.map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt="IG Slide"/>
                    ))}
                  </div>
                </div>
              )}

              {(platform === 'facebook' || platform === 'both') && (
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-blue-500/20 shadow-2xl">
                  <h4 className="font-bold text-blue-400 mb-6 flex items-center gap-2"><Share2 size={22}/> شرائح فيسبوك</h4>
                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    {images.facebook.map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt="FB Slide"/>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 📝 قسم النصوص والبرومبتات */}
            <div className="space-y-6">
              
              {/* 📱 صندوق وصف إنستغرام */}
              {(platform === 'instagram' || platform === 'both') && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-pink-500/40 relative shadow-[0_0_15px_rgba(219,39,119,0.1)]">
                  <h4 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
                    <Smartphone size={18} /> كابشن إنستغرام (خوارزمية الحفظ)
                  </h4>
                  <textarea readOnly value={igCaption} className="w-full h-32 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"/>
                  <button onClick={() => handleCopy(igCaption, 'ig')} className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs">
                    {copiedStates.ig ? <><CheckCircle size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ</>}
                  </button>
                </div>
              )}

              {/* 📘 صندوق وصف فيسبوك */}
              {(platform === 'facebook' || platform === 'both') && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-blue-500/40 relative shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                  <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Globe size={18} /> كابشن فيسبوك (خوارزمية المشاركة)
                  </h4>
                  <textarea readOnly value={fbCaption} className="w-full h-32 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"/>
                  <button onClick={() => handleCopy(fbCaption, 'fb')} className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs">
                    {copiedStates.fb ? <><CheckCircle size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ</>}
                  </button>
                </div>
              )}

              {/* 🪄 البرومبت الأول (عنصر 3D) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-yellow-500/40 relative shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  <Wand2 size={18} /> الخيار 1: إضافة مجسم 3D
                </h4>
                <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع الصورة الأولى لملء المساحة بمجسم 3D فخم.</p>
                <textarea readOnly value={magicPrompt3D} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPrompt3D, 'prompt3D')} className="absolute bottom-6 left-6 bg-yellow-600 hover:bg-yellow-500 text-slate-900 p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.prompt3D ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* 👤 البرومبت الثاني (الأفاتار الشخصي) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/40 relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <UserSquare2 size={18} /> الخيار 2: صورتك تتفاعل مع الفكرة
                </h4>
                <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع <span className="font-bold text-emerald-300">الصورة الأولى + صورتك الشخصية</span> ليضعك في الغلاف.</p>
                <textarea readOnly value={magicPromptAvatar} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptAvatar, 'promptAvatar')} className="absolute bottom-6 left-6 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptAvatar ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>
              
              {/* 💻 البرومبت الثالث (بيئة العمل الفاخرة) - الجديد */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-blue-500/40 relative shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <MonitorPlay size={18} /> الخيار 3: بيئة عمل فاخرة (Lifestyle)
                </h4>
                <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع الصورة الأولى للحصول على مشهد مكتب فخم وواقعي.</p>
                <textarea readOnly value={magicPromptLifestyle} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptLifestyle, 'promptLifestyle')} className="absolute bottom-6 left-6 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptLifestyle ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>



               {/* 👑 البرومبت الرابع (المدير التنفيذي - هالة المؤسس) */}
<div className="bg-slate-900 p-5 rounded-2xl border border-purple-500/40 relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
  <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
    <Briefcase size={18} /> الخيار 4: هالة المؤسس (أنت + الرفاهية) 👑
  </h4>
  <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع <span className="font-bold text-purple-300">صورتك + الغلاف</span> لتظهر كمدير تنفيذي في مكتب فاخر.</p>
  <textarea readOnly value={magicPromptFounder} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
  <button onClick={() => handleCopy(magicPromptFounder, 'promptFounder')} className="absolute bottom-6 left-6 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
    {copiedStates.promptFounder ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
  </button>
</div>


{/* ... (الصناديق السابقة) ... */}

              {/* 👑 الخيار 4: هالة المؤسس (المكتب) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-purple-500/40 relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <Briefcase size={18} /> الخيار 4: هالة المؤسس (المكتب الكلاسيكي)
                </h4>
                <textarea readOnly value={magicPromptFounder} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptFounder, 'promptFounder')} className="absolute bottom-6 left-6 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptFounder ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* 💡 الخيار 5: المُحاضر التقني */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-cyan-500/40 relative shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <MonitorPlay size={18} /> الخيار 5: المُحاضر التقني (الهولوغرام)
                </h4>
                <textarea readOnly value={magicPromptTechVisionary} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptTechVisionary, 'promptTechVisionary')} className="absolute bottom-6 left-6 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptTechVisionary ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* 🧠 الخيار 6: المُخطط الاستراتيجي */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-orange-500/40 relative shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                  <TrendingUp size={18} /> الخيار 6: المُخطط الاستراتيجي (لوح الزجاج)
                </h4>
                <textarea readOnly value={magicPromptMastermind} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptMastermind, 'promptMastermind')} className="absolute bottom-6 left-6 bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptMastermind ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* ✈️ الخيار 7: الرفاهية والـ VIP */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-rose-500/40 relative shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2">
                  <Globe size={18} /> الخيار 7: الرفاهية والـ VIP (العمل من أي مكان)
                </h4>
                <textarea readOnly value={magicPromptVIP} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptVIP, 'promptVIP')} className="absolute bottom-6 left-6 bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptVIP ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>


            </div>
          </div>

          {/* زر النشر النهائي */}
          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-emerald-900/40 text-emerald-400 border border-emerald-500 p-5 rounded-2xl font-bold flex items-center gap-3 text-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle size={32} /> تمت إطلاق المشروع بنجاح على {platform === 'both' ? 'المنصتين!' : platform}
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-yellow-500 to-emerald-600 hover:from-yellow-400 hover:to-emerald-500 text-white px-14 py-5 rounded-2xl font-bold text-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {publishing ? <><Loader2 size={32} className="animate-spin" /> جاري الإطلاق...</> : <><Send size={32} /> اعتمد خطة الأرباح وانشر 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## `autofactory-ui\src\pages\CampaignManager.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Plus, Trash2, Power, MessageCircle, Send, Loader2, Activity } from 'lucide-react';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // حالة النموذج (Form State)
  const [formData, setFormData] = useState({
    keyword: '',
    public_reply: 'تم يا {username} 🚀 تفقد رسائلك في الخاص!',
    dm_message: 'مرحباً {username}! تفضل الرابط الذي طلبته: \n\nhttps://your-link.com'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/campaigns');
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الحملات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.keyword) return alert('الرجاء كتابة الكلمة المفتاحية!');
    
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/campaigns', {
        keyword: formData.keyword.toLowerCase().trim(),
        public_reply: formData.public_reply,
        dm_message: formData.dm_message
      });
      
      if (res.data.success) {
        setShowForm(false);
        setFormData({ ...formData, keyword: '' }); // تصفير الكلمة فقط
        fetchCampaigns(); // تحديث القائمة
      }
    } catch (error) {
      console.error(error);
      alert('خطأ! ربما الكلمة المفتاحية مستخدمة في حملة أخرى.');
    }
    setIsSubmitting(false);
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/campaigns/${id}/toggle`);
      fetchCampaigns();
    } catch (error) {
      alert('خطأ في تغيير حالة الحملة');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الحملة؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
      fetchCampaigns();
    } catch (error) {
      alert('خطأ في الحذف');
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gray-900" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* الترويسة */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
            <Megaphone size={36} className="text-purple-500" />
            مدير الحملات والردود الذكية
          </h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-900/40"
          >
            {showForm ? 'إلغاء' : <><Plus size={20} /> إضافة حملة جديدة</>}
          </button>
        </div>

        {/* نموذج الإضافة */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-2xl border border-purple-500/30 mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-6 text-purple-300">🎯 إنشاء حملة تسويقية جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-gray-400 font-bold mb-2 text-sm">الكلمة المفتاحية (Keyword):</label>
                <input 
                  type="text" 
                  value={formData.keyword}
                  onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                  placeholder="مثال: تداول، أدوات، استوديو"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">
                    <MessageCircle size={16} className="inline mr-1 text-blue-400"/> الرد على التعليق (العام):
                  </label>
                  <p className="text-xs text-gray-500 mb-2">استخدم <span className="text-purple-400">{"{username}"}</span> لذكر اسم العميل.</p>
                  <textarea 
                    value={formData.public_reply}
                    onChange={(e) => setFormData({...formData, public_reply: e.target.value})}
                    className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">
                    <Send size={16} className="inline mr-1 text-emerald-400"/> رسالة الخاص (DM):
                  </label>
                  <p className="text-xs text-gray-500 mb-2">استخدم <span className="text-purple-400">{"{username}"}</span> لجعل الرسالة شخصية.</p>
                  <textarea 
                    value={formData.dm_message}
                    onChange={(e) => setFormData({...formData, dm_message: e.target.value})}
                    className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
                  إطلاق الحملة وحفظها
                </button>
              </div>
            </form>
          </div>
        )}

        {/* قائمة الحملات (Cards Grid) */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">⏳ جاري تحميل الحملات...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign._id} className={`p-6 rounded-2xl border transition-all ${campaign.is_active ? 'bg-gray-800 border-gray-700 hover:border-purple-500/50' : 'bg-gray-800/50 border-red-900/30 opacity-75'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${campaign.is_active ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30'}`}>
                      {campaign.is_active ? 'نشطة 🟢' : 'متوقفة 🔴'}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-3 flex items-center gap-2">
                      "{campaign.keyword}"
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2" title="عدد الأشخاص الذين استخدموا الكلمة">
                      <Activity size={16} className="text-blue-400"/>
                      <span className="text-xl font-bold text-white">{campaign.usage_count}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleToggle(campaign._id)} className={`p-2 rounded-lg transition-colors ${campaign.is_active ? 'bg-gray-700 hover:bg-red-600 text-gray-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`} title={campaign.is_active ? "إيقاف الحملة" : "تشغيل الحملة"}>
                        <Power size={16} />
                      </button>
                      <button onClick={() => handleDelete(campaign._id)} className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-300 transition-colors" title="حذف نهائي">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4 text-sm">
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-blue-400 font-bold mb-1 flex items-center gap-1"><MessageCircle size={12}/> الرد العام:</p>
                    <p className="text-gray-300">{campaign.public_reply}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-emerald-400 font-bold mb-1 flex items-center gap-1"><Send size={12}/> رسالة الخاص:</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{campaign.dm_message}</p>
                  </div>
                </div>

              </div>
            ))}
            {campaigns.length === 0 && !showForm && (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-gray-500 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                لا توجد حملات حالياً. ابدأ بإنشاء حملتك الأولى! 🚀
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CampaignManager;
```

---

## `autofactory-ui\src\pages\CommercialLab.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Video,
  Sparkles,
  Loader2,
  Music,
  Clapperboard,
  Copy,
  CheckCircle,
  Store,
  HeartPulse,
  ShoppingCart,
  GraduationCap,
  Building,
  Truck,
  Sprout,
  CalendarDays,
  Image as ImageIcon,
  Wind,
  BookmarkPlus,
  Archive,
  Trash2,
  Eye,
  X,
  Edit3, Wand2

} from 'lucide-react';

const CommercialLab = () => {
  const [productIdea, setProductIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [adVibe, setAdVibe] = useState('Cinematic & Emotional'); 
  const [brandColors, setBrandColors] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [adData, setAdData] = useState(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // حالات الأرشيف
  const [showArchive, setShowArchive] = useState(false);
  const [savedAds, setSavedAds] = useState([]);
  const [loadingArchive, setLoadingArchive] = useState(false);
  

  // حالات تعديل المشاهد
  const [editingSceneIndex, setEditingSceneIndex] = useState(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEnhancingScene, setIsEnhancingScene] = useState(false);



  useEffect(() => {
    fetchSavedAds();
  }, []);

  const fetchSavedAds = async () => {
    setLoadingArchive(true);
    try {
      const res = await axios.get('http://localhost:5000/api/commercial-ads');
      if (res.data.success) {
        setSavedAds(res.data.data);
      }
    } catch (err) {
      console.error('خطأ في جلب الأرشيف:', err);
    } finally {
      setLoadingArchive(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const fetchAlgerianIdea = async (category) => {
    setIsSuggesting(true);
    setProductIdea('⏳ جاري ابتكار فكرة مشروع للسوق الجزائري...');
    setTargetAudience('⏳ جاري التحليل...');
    
    try {
      const res = await axios.post('http://localhost:5000/api/suggest-commercial-idea', { category });
      if (res.data.success) {
        const { productIdea, targetAudience, adVibe } = res.data.ideaData;
        setProductIdea(productIdea);
        setTargetAudience(targetAudience);
        
        const pureVibe = adVibe.split('(')[0].trim();
        setAdVibe(pureVibe);
        
        if(!brandColors) {
            const colorsMap = {
                healthcare: 'أزرق طبي وأبيض',
                ecommerce: 'برتقالي وأسود',
                local_business: 'أخضر داكن وذهبي',
                youth_edu: 'بنفسجي وأصفر',
                real_estate: 'رمادي داكن وفضي',
                logistics: 'أصفر فاقع وأسود',
                agriculture: 'أخضر طبيعي وترابي',
                tourism_events: 'وردي دافئ وذهبي'
            };
            setBrandColors(colorsMap[category] || 'أزرق داكن وذهبي');
        }
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء جلب الفكرة.');
      setProductIdea('');
      setTargetAudience('');
    } finally {
      setIsSuggesting(false);
    }
  };

  const generateCommercial = async () => {
    if (!productIdea) {
        setError('الرجاء كتابة فكرة المنتج/البرنامج أولاً!');
        return;
    }
    
    setIsGenerating(true);
    setError('');
    setAdData(null);
    setSaveSuccess(false);

    try {
      const res = await axios.post('http://localhost:5000/api/generate-commercial', { 
          productIdea,
          targetAudience,
          adVibe,
          brandColors
      });
      
      if (res.data.success) {
        setAdData(res.data.commercial);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء توليد السيناريو.');
    } finally {
      setIsGenerating(false);
    }
  };

  // دالة حفظ الإعلان الحالي في الأرشيف
  const handleSaveToVault = async () => {
    if (!adData) return;
    setIsSaving(true);
    try {
      const payload = {
        productIdea,
        targetAudience,
        adVibe,
        brandColors,
        ...adData
      };
      const res = await axios.post('http://localhost:5000/api/commercial-ads/save', payload);
      if (res.data.success) {
        setSaveSuccess(true);
        fetchSavedAds(); // تحديث القائمة
      }
    } catch (err) {
      console.error(err);
      alert('فشل حفظ الإعلان.');
    }
    setIsSaving(false);
  };

  // دالة حذف إعلان من الأرشيف
  const handleDeleteAd = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان من الأرشيف؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/commercial-ads/${id}`);
      fetchSavedAds();
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };


  const handleEnhanceScene = async (index) => {
    if (!editInstruction.trim()) return;
    setIsEnhancingScene(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/enhance-scene', {
        originalScene: adData.scenes[index],
        userInstruction: editInstruction,
        brandColors: brandColors
      });

      if (res.data.success) {
        // تحديث المشهد المحدد فقط في الواجهة
        const updatedScenes = [...adData.scenes];
        updatedScenes[index] = res.data.updatedScene;
        setAdData({ ...adData, scenes: updatedScenes });
        
        // إغلاق وضع التعديل
        setEditingSceneIndex(null);
        setEditInstruction('');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تطوير المشهد.');
    } finally {
      setIsEnhancingScene(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#05070A] text-gray-100 p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-2 flex items-center gap-3">
              <Video className="text-red-500" size={36} />
              استوديو الإعلانات التجارية (CommercialLab)
            </h1>
            <p className="text-gray-400 text-sm">بناء إعلانات بجودة كوكاكولا وأبل بالذكاء الاصطناعي 🎥✨</p>
          </div>
          
          <button 
            onClick={() => setShowArchive(true)}
            className="bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-500/30 px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
          >
            <Archive size={20} /> أرشيف الإعلانات المحفوظة ({savedAds.length})
          </button>
        </header>

        <div className="bg-gray-900 p-8 rounded-2xl border border-red-900/30 shadow-2xl mb-10">
          
          <div className="mb-8">
            <label className="text-gray-300 font-bold mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500"/> الإلهام المزدوج (فكرة مشروع + إعلان للسوق الجزائري 🇩🇿):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => fetchAlgerianIdea('local_business')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-amber-500/50">
                <Store size={24} className="text-amber-500"/><span className="text-xs font-bold text-center">رقمنة المحلات والخدمات</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('ecommerce')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-orange-500/50">
                <ShoppingCart size={24} className="text-orange-500"/><span className="text-xs font-bold text-center">حلول التجارة الإلكترونية</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('healthcare')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-blue-500/50">
                <HeartPulse size={24} className="text-blue-500"/><span className="text-xs font-bold text-center">القطاع الطبي والعيادات</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('youth_edu')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-emerald-500/50">
                <GraduationCap size={24} className="text-emerald-500"/><span className="text-xs font-bold text-center">الطلبة والتعليم الحديث</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('real_estate')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-slate-400/50">
                <Building size={24} className="text-slate-400"/><span className="text-xs font-bold text-center">العقارات والمقاولات</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('logistics')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-yellow-400/50">
                <Truck size={24} className="text-yellow-400"/><span className="text-xs font-bold text-center">النقل واللوجستيك</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('agriculture')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-lime-500/50">
                <Sprout size={24} className="text-lime-500"/><span className="text-xs font-bold text-center">الفلاحة والإنتاج</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('tourism_events')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-pink-500/50">
                <CalendarDays size={24} className="text-pink-500"/><span className="text-xs font-bold text-center">السياحة والفعاليات</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                  <label className="block text-red-400 font-bold mb-2 text-sm">عن ماذا الإعلان؟ (المنتج / البرنامج):</label>
                  <textarea
                    className="w-full bg-gray-950 text-white p-4 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all resize-none"
                    rows="2"
                    placeholder="اضغط على أحد الأزرار بالأعلى لاستلهام فكرة، أو اكتب فكرتك هنا..."
                    value={productIdea}
                    onChange={(e) => setProductIdea(e.target.value)}
                  />
              </div>

              <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">الجمهور المستهدف:</label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all"
                    placeholder="مثال: أصحاب الشركات والمشاريع الصغيرة"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
              </div>

              <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">ألوان هويتك البصرية (لدمجها في الفيديو):</label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all"
                    placeholder="مثال: أخضر زمردي وأسود"
                    value={brandColors}
                    onChange={(e) => setBrandColors(e.target.value)}
                  />
              </div>

               <div className="md:col-span-2">
                  <label className="block text-gray-400 font-bold mb-2 text-sm">النمط السينمائي (Vibe):</label>
                  <select
                    className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all cursor-pointer"
                    value={adVibe}
                    onChange={(e) => setAdVibe(e.target.value)}
                  >
                      <option value="Cinematic & Emotional">سينمائي وعاطفي (النمط الكلاسيكي الفخم)</option>
                      <option value="Fast Paced & Energetic">سريع وحماسي (مثل إعلانات الرياضة والسيارات)</option>
                      <option value="Tech Minimalist">تقني بسيط (مثل إعلانات أبل، خلفيات مظلمة وتركيز على المنتج)</option>
                      <option value="Humorous & Relatable">كوميدي وواقعي (يجذب الانتباه بالضحك)</option>
                      
                      {/* 🚀 النمط الجديد الذي ابتكرته أنت */}
                      <option value="Personal Storytelling (Founder Story - Relatable POV)">سرد قصصي شخصي (Founder Story - البطل هو أنت)</option>
                  </select>
              </div>
          </div>

          {error && <p className="text-red-500 mb-4 font-semibold text-sm">{error}</p>}
          
          <button
            onClick={generateCommercial}
            disabled={isGenerating || isSuggesting}
            className={`w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center transition-all ${
              isGenerating 
                ? 'bg-gray-800 text-gray-400 cursor-wait' 
                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            }`}
          >
            {isGenerating ? <><Loader2 size={24} className="animate-spin ml-2" /> جاري التخطيط مع المخرج السينمائي...</> : '🎬 هندسة الإعلان الآن'}
          </button>
        </div>

        {/* عرض النتائج وزر الحفظ */}
        {adData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="bg-gradient-to-br from-red-900/40 to-gray-900 p-6 rounded-2xl border border-red-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{adData.adTitle}</h2>
                  <div className="flex flex-wrap gap-3 mt-4">
                      <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-sm font-bold border border-orange-500/30 flex items-center gap-1">
                          <Sparkles size={14}/> زاوية التسويق: {adData.marketingAngle}
                      </span>
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-bold border border-blue-500/30 flex items-center gap-1">
                          <Music size={14}/> الموسيقى: {adData.soundtrackVibe}
                      </span>
                  </div>
                </div>

                {/* زر حفظ الإعلان */}
                <button
                  onClick={handleSaveToVault}
                  disabled={isSaving || saveSuccess}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    saveSuccess 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
                  }`}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20}/> : saveSuccess ? <CheckCircle size={20}/> : <BookmarkPlus size={20}/>}
                  {saveSuccess ? 'تم الحفظ في الأرشيف ✅' : 'حفظ في الأرشيف 📚'}
                </button>
            </div>

            <h3 className="text-xl font-bold text-red-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                <Clapperboard size={20}/> لوحة القصة والمشاهد (The Storyboard):
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {adData.scenes.map((scene, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-red-500/50 transition-all flex flex-col lg:flex-row gap-6">
                  
<div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center justify-center bg-gray-950 w-24 h-24 rounded-xl border border-gray-800">
                        <span className="text-3xl font-black text-gray-600">0{scene.sceneNumber}</span>
                        <span className="text-xs font-bold text-red-500 mt-1 bg-red-900/30 px-2 py-1 rounded-md">{scene.duration}</span>
                    </div>
                    {/* زر فتح وضع التعديل */}
                    <button 
                        onClick={() => { setEditingSceneIndex(index); setEditInstruction(''); }}
                        className="text-gray-400 hover:text-blue-400 bg-gray-800 p-2 rounded-lg w-full flex justify-center transition-all"
                        title="تعديل هذا المشهد"
                    >
                        <Edit3 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-grow space-y-4 w-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">🎥 {scene.shotType}</span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">🔄 {scene.cameraMovement}</span>
                        <span className="text-[11px] bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded border border-indigo-700/50">🎧 SFX: {scene.sfx}</span>
                    </div>
{/* واجهة تعديل المشهد (تظهر عند الضغط) */}
                    {editingSceneIndex === index && (
                        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/50 mb-4 animate-in fade-in">
                            <label className="text-blue-300 font-bold text-sm mb-2 flex items-center gap-2">
                                <Wand2 size={16} /> تطوير هذا المشهد (أعطِ تعليماتك للمخرج):
                            </label>
                            <textarea
                                className="w-full bg-gray-950 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none resize-none text-sm mb-3"
                                rows="2"
                                placeholder="مثال: اجعل البطل يشرب القهوة وهو يبتسم بدلاً من الجلوس فقط..."
                                value={editInstruction}
                                onChange={(e) => setEditInstruction(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingSceneIndex(null)} className="text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-sm">إلغاء</button>
                                <button 
                                    onClick={() => handleEnhanceScene(index)} 
                                    disabled={isEnhancingScene}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm flex items-center gap-2"
                                >
                                    {isEnhancingScene ? <Loader2 size={14} className="animate-spin"/> : 'تطوير المشهد ✨'}
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 relative group">
                            <span className="text-xs text-orange-400 font-bold uppercase flex items-center gap-2 mb-2"><Video size={14}/> نص-إلى-فيديو:</span>
                            <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">{scene.videoPrompt}</p>
                            <button onClick={() => handleCopy(scene.videoPrompt, `v-${index}`)} className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                {copiedIndex === `v-${index}` ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-900/30 relative group">
                                <span className="text-xs text-purple-400 font-bold uppercase flex items-center gap-2 mb-2"><ImageIcon size={14}/> صورة ثابتة (Midjourney):</span>
                                <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">{scene.imagePrompt}</p>
                                <button onClick={() => handleCopy(scene.imagePrompt, `i-${index}`)} className="absolute top-4 right-4 bg-purple-900/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    {copiedIndex === `i-${index}` ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="bg-cyan-900/10 p-4 rounded-xl border border-cyan-900/30 relative group">
                                <span className="text-xs text-cyan-400 font-bold uppercase flex items-center gap-2 mb-2"><Wind size={14}/> تحريك الصورة (Luma/Veo):</span>
                                <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">{scene.imageToVideoPrompt}</p>
                                <button onClick={() => handleCopy(scene.imageToVideoPrompt, `m-${index}`)} className="absolute top-4 right-4 bg-cyan-900/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    {copiedIndex === `m-${index}` ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
                            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-2">🎙️ التعليق الصوتي:</span>
                            <p className="text-sm text-white font-medium">"{scene.narration}"</p>
                        </div>
                        {scene.onScreenText && scene.onScreenText !== "None" && scene.onScreenText !== "لا يوجد" && (
                            <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-900/30">
                                <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider block mb-2">👁 نص الشاشة:</span>
                                <p className="text-lg font-black text-yellow-400">{scene.onScreenText}</p>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نافذة أرشيف الإعلانات (Modal / Drawer) */}
        {showArchive && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end animate-in fade-in">
            <div className="w-full max-w-2xl bg-gray-900 h-full p-6 overflow-y-auto border-r border-gray-800 flex flex-col">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Archive className="text-red-500" /> أرشيف الإعلانات المحفوظة
                </h2>
                <button onClick={() => setShowArchive(false)} className="text-gray-400 hover:text-white p-2 rounded-lg bg-gray-800">
                  <X size={20} />
                </button>
              </div>

              {loadingArchive ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">⏳ جاري تحميل الأرشيف...</div>
              ) : (
                <div className="space-y-4 flex-1">
                  {savedAds.map((ad) => (
                    <div key={ad._id} className="bg-gray-800/80 p-5 rounded-2xl border border-gray-700 hover:border-red-500/50 transition-all flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-red-900/30 text-red-400 px-2.5 py-1 rounded-md border border-red-500/30 font-bold">
                            {new Date(ad.created_at).toLocaleDateString('ar-DZ')}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">{ad.adTitle}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setAdData(ad); setProductIdea(ad.productIdea); setShowArchive(false); }}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all" title="استعراض الإعلان"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteAd(ad._id, e)}
                            className="bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white p-2.5 rounded-xl transition-all" title="حذف نهائي"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">💡 الفكرة: {ad.productIdea}</p>
                    </div>
                  ))}
                  {savedAds.length === 0 && (
                    <div className="text-center py-20 text-gray-500">لا توجد إعلانات محفوظة في الأرشيف حتى الآن.</div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CommercialLab;
```

---

## `autofactory-ui\src\pages\LeadsDashboard.jsx`

```javascript
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Trash2, Download, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ألوان المخططات الدائرية (متناسقة مع ثيم الموقع الداكن)
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios.get('http://localhost:5000/api/leads')
      .then(response => {
        if (response.data.success) {
          setLeads(response.data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ خطأ في جلب بيانات العملاء:", error);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("⚠️ هل أنت متأكد من حذف هذا العميل نهائياً؟");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      setLeads(leads.filter(lead => lead._id !== id));
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  const exportToCSV = () => {
    const headers = ['اسم المستخدم', 'الكلمة المفتاحية', 'عدد التفاعلات', 'تاريخ آخر تفاعل'];
    const rows = leads.map(lead => [
      lead.username,
      lead.last_keyword || 'بدون',
      lead.interaction_count,
      new Date(lead.last_interaction).toLocaleString('ar-EG')
    ]);

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AutoFactory_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // 🧠 المحرك التحليلي للبيانات (يحدث تلقائياً)
  // ==========================================
  
  // 1. تحليل الكلمات المفتاحية (للمخطط الدائري)
  const keywordData = useMemo(() => {
    const counts = leads.reduce((acc, lead) => {
      const key = lead.last_keyword ? lead.last_keyword.trim() : 'بدون';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // 2. تحليل نشاط الأيام (للمخطط الشريطي)
  const activityData = useMemo(() => {
    const counts = leads.reduce((acc, lead) => {
      // استخراج اليوم والشهر فقط (مثال: 4 أكتوبر)
      const date = new Date(lead.last_interaction).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    // عكس المصفوفة لتظهر الأيام بترتيب زمني صحيح (من الأقدم للأحدث)
    return Object.entries(counts).reverse().map(([date, count]) => ({ date, count }));
  }, [leads]);

  // تصميم نافذة المعلومات (Tooltip) لتناسب الثيم الداكن
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-right dir-rtl">
          <p className="text-gray-300 mb-1">{label || payload[0].name}</p>
          <p className="text-emerald-400 font-bold">العدد: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white dir-rtl" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* الترويسة والأزرار */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">📊 قاعدة بيانات العملاء</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/50"
            >
              <Download size={18} />
              تصدير الإحصائيات
            </button>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              إجمالي المهتمين: <span className="text-emerald-400 font-bold">{leads.length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20 animate-pulse text-xl">
            ⏳ جاري تحليل الخزنة السرية...
          </div>
        ) : (
          <>
            {/* قسم الرسوم البيانية */}
            {leads.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* 1. مخطط الكلمات المفتاحية (Pie Chart) */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                    <PieChartIcon className="text-blue-400" /> توزيع الكلمات المفتاحية
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={keywordData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {keywordData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. مخطط التفاعلات اليومية (Bar Chart) */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                    <BarChart2 className="text-emerald-400" /> التفاعل اليومي
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#374151', opacity: 0.4 }} />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* جدول البيانات */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
              <table className="w-full text-right">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-4">اسم المستخدم (Instagram)</th>
                    <th className="p-4">الكلمة المفتاحية</th>
                    <th className="p-4 text-center">عدد التفاعلات</th>
                    <th className="p-4">تاريخ آخر تفاعل</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-750 transition-colors">
                      <td className="p-4 font-medium text-emerald-300">@{lead.username}</td>
                      <td className="p-4">
                        <span className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600">
                          {lead.last_keyword || 'بدون'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full font-bold">
                          {lead.interaction_count}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(lead.last_interaction).toLocaleString('ar-EG')}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(lead._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                          title="حذف العميل"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        لا يوجد عملاء حتى الآن. بانتظار أول تعليق! 🎣
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadsDashboard;
```

---

## `autofactory-ui\src\pages\PromptStudio.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Zap, Film, Wand2, Loader2, Copy, CheckCircle, Trash2, Image as ImageIcon, FileText, Hash, Sparkles } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import axios from 'axios';

export default function PromptStudio() {
    // 1. جلب البيانات من المخزن السحابي (Zustand)
    const { viralData, clearViralData } = useIdeaStore();

    // 2. إدارة حالة الواجهة
    // إذا كان هناك بيانات فيروسية، افتح الوضع السينمائي تلقائياً، وإلا افتح السريع
    const [activeMode, setActiveMode] = useState(viralData ? 'cinematic' : 'quick');
    const [postType, setPostType] = useState('carousel'); // reel أو carousel
    const [quickTopic, setQuickTopic] = useState('');
    
    // 3. حالات التوليد والنتائج
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    // مراقب التغييرات: إذا جاءت بيانات جديدة، انقل المستخدم للوضع السينمائي
    useEffect(() => {
        if (viralData) setActiveMode('cinematic');
    }, [viralData]);

const handleGenerate = async () => {
        setIsGenerating(true);
        setResult(null);
        
        try {
            const payload = activeMode === 'cinematic' 
                ? { mode: 'cinematic', type: postType, viralData } 
                : { mode: 'quick', topic: quickTopic };

            const response = await axios.post('http://localhost:5000/api/generate-content', payload);
            
            if (response.data?.success) {
                setResult(response.data.content);
                setIsGenerating(false); // 👈 السطر الذي كان مفقوداً لإيقاف التحميل
            }
        } catch (error) {
            console.error("Error generating content:", error);
            // بيانات وهمية مؤقتة للحماية في حالة الخطأ
            setTimeout(() => {
                setResult({
                    script: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.",
                    prompts: "Error...",
                    caption: "Error..."
                });
                setIsGenerating(false); // إيقاف التحميل في حالة الخطأ أيضاً
            }, 2000);
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
            
            {/* القسم الأيمن: إعدادات التوليد */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* مبدل الأوضاع */}
                <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-700 shadow-inner">
                    <button 
                        onClick={() => setActiveMode('quick')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'quick' ? 'bg-amber-500 text-gray-900 shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Zap size={20}/> التوليد السريع
                    </button>
                    <button 
                        onClick={() => setActiveMode('cinematic')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'cinematic' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Film size={20}/> الإنتاج السينمائي
                    </button>
                </div>

                {/* واجهة التوليد السريع */}
                {activeMode === 'quick' && (
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-white mb-2">منشور سريع</h3>
                        <p className="text-gray-400 text-sm mb-6">أدخل عنواناً أو فكرة بسيطة وسنتكفل بالباقي.</p>
                        
                        <textarea
                            value={quickTopic}
                            onChange={(e) => setQuickTopic(e.target.value)}
                            placeholder="مثال: تحديثات React 19 الجديدة..."
                            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 resize-none mb-6"
                        ></textarea>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !quickTopic.trim()}
                            className="w-full py-4 bg-amber-500 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            توليد المحتوى
                        </button>
                    </div>
                )}

                {/* واجهة الإنتاج السينمائي */}
                {activeMode === 'cinematic' && (
                    <div className="bg-gradient-to-br from-gray-800 to-purple-900/30 rounded-2xl p-6 border border-purple-500/30 shadow-xl animate-fade-in-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">المخطط الفيروسي</h3>
                                <p className="text-purple-300/70 text-sm">توليد نصوص وأوامر صور بناءً على المختبر.</p>
                            </div>
                            {viralData && (
                                <button onClick={clearViralData} className="text-red-400 hover:text-red-300 p-2 bg-red-900/20 rounded-lg tooltip" title="مسح بيانات المختبر">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        {viralData ? (
                            <div className="bg-gray-900/80 rounded-xl p-4 mb-6 border border-purple-500/20">
                                <div className="mb-3">
                                    <span className="text-xs text-purple-400 font-bold block mb-1">الخطاف المستورد:</span>
                                    <p className="text-sm text-white line-clamp-2">{viralData.hook}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-blue-400 font-bold block mb-1">أسلوب التقديم:</span>
                                    <p className="text-sm text-gray-300 line-clamp-2">{viralData.presentation}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/80 rounded-xl p-6 mb-6 border border-dashed border-gray-600 text-center">
                                <Film className="mx-auto text-gray-500 mb-2" size={32} />
                                <p className="text-gray-400 text-sm">لا توجد بيانات مستوردة. اذهب إلى "مختبر الأفكار" لتجهيز فكرة فيروسية أولاً.</p>
                            </div>
                        )}

<div className="mb-6">
    <label className="text-sm font-bold text-gray-300 block mb-2">نوع المنشور المطلوب:</label>
    <select 
        value={postType} 
        onChange={(e) => setPostType(e.target.value)}
        className="w-full bg-gray-900 text-white border border-gray-600 rounded-xl p-3"
    >
        {/* 👇 تم تعديل النص هنا ليعكس الديناميكية */}
        <option value="carousel">ألبوم صور (ديناميكي: من 3 إلى 10 شرائح)</option>
        <option value="reel">فيديو قصير (Reel Script)</option>
    </select>
</div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !viralData}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            بدء الإنتاج السينمائي 🎬
                        </button>
                    </div>
                )}
            </div>

            {/* القسم الأيسر: شاشة النتائج المتعددة */}
            <div className="lg:col-span-7 bg-gray-800 rounded-2xl p-6 border border-gray-700 flex flex-col min-h-[600px]">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-white">مخرجات الاستوديو</h3>
                    {result && (
                        <button onClick={() => copyToClipboard(JSON.stringify(result))} className="text-sm flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-white transition-all">
                            {copied ? <CheckCircle size={16} className="text-green-400"/> : <Copy size={16}/>} 
                            {copied ? 'تم النسخ' : 'نسخ الكل'}
                        </button>
                    )}
                </div>

                {!result && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <Wand2 size={64} className="mb-4" />
                        <p className="text-lg">الاستوديو جاهز لتوليد المحتوى...</p>
                    </div>
                )}

                {isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-purple-400">
                        <Loader2 className="animate-spin mb-4 text-purple-500" size={64} />
                        <p className="animate-pulse text-lg font-bold">جاري كتابة السيناريو وتوليد الأوامر البصرية...</p>
                    </div>
                )}

                {result && (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar animate-fade-in-up">
                        
{/* 1. قسم محتوى الشرائح (البيانات الجديدة) */}
<div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
        <FileText size={18}/> محتوى الشرائح ({result.categoryBadge})
    </h4>
    <div className="space-y-4 mt-4">
        {result.slides && result.slides.map((slide, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <span className="text-xs font-bold text-gray-500 mb-1 block">شريحة {slide.slideNumber} - {slide.type}</span>
                <h5 className="text-white font-bold text-lg mb-2">{slide.title}</h5>
                {slide.content && <p className="text-gray-300 text-sm mb-2">{slide.content}</p>}
                {slide.codeSnippet && (
                    <div className="bg-gray-950 p-3 rounded-md text-left dir-ltr mt-2">
                        <code className="text-green-400 text-sm font-mono">{slide.codeSnippet}</code>
                    </div>
                )}
                {slide.handwrittenNote && (
                    <p className="text-amber-400 text-sm font-bold mt-2 font-mono">✍️ {slide.handwrittenNote}</p>
                )}
            </div>
        ))}
    </div>
</div>

{/* 2. زر تشغيل محرك القوالب (Canvas) الفعلي */}
<div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mt-4 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
        <ImageIcon size={32} className="text-blue-400" />
    </div>
    <h4 className="text-lg font-bold text-gray-200 mb-2">محرك القوالب البصرية جاهز</h4>
    <p className="text-sm text-gray-400 mb-6 max-w-md">
        النصوص والأكواد جاهزة للطباعة على قالب "AutoFactory" المخصص الخاص بك.
    </p>
    <button 
        onClick={async () => {
            if (!result.slides) return;
            setIsPrinting(true);
            try {
                const res = await axios.post('http://localhost:5000/api/print-studio', {
                    slides: result.slides,
                    categoryBadge: result.categoryBadge
                });
                if (res.data.success) {
                    alert('✅ تم طباعة الصور بنجاح! راجع مجلد المشروع.');
                }
            } catch (err) {
                console.error(err);
                alert('❌ حدث خطأ أثناء الطباعة.');
            } finally {
                setIsPrinting(false);
            }
        }}
        disabled={isPrinting || !result.slides}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-900/50 transition-all disabled:opacity-50"
    >
        {isPrinting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        {isPrinting ? 'جاري رسم الصور...' : 'بدء طباعة الصور الآن'}
    </button>
</div>

                        {/* 3. قسم الكابشن والهاشتاجات */}
                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                            <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2"><Hash size={18}/> نص المنشور (Caption)</h4>
                            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                                {result.caption}
                            </pre>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
```

---

## `autofactory-ui\src\pages\ReelLab.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';

const ReelLab = () => {
  // ==========================================
  // 1. حالات (States) توليد السيناريو
  // ==========================================
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reelData, setReelData] = useState(null);
  const [error, setError] = useState('');
  
  // ==========================================
  // 2. حالات (States) الهوية البصرية المزدوجة (Persona)
  // ==========================================
  const [personaImageUrl, setPersonaImageUrl] = useState(''); 

  // ==========================================
  // 3. حالات (States) الإلهامات الديناميكية
  // ==========================================
  const [inspirations, setInspirations] = useState([]);
  const [isLoadingInspirations, setIsLoadingInspirations] = useState(false);

  // ==========================================
  // 4. حالات (States) توليد الصوت وقائمة الأصوات
  // ==========================================
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState('');

  const availableVoices = [
    { id: 'en-US-ChristopherNeural', name: 'Christopher', desc: 'صوت سينمائي فخم، عميق، وهادئ جداً' },
    { id: 'en-US-SteffanNeural', name: 'Steffan', desc: 'صوت شاب واثق، سريع ومناسب للتقنية' },
    { id: 'en-US-GuyNeural', name: 'Guy', desc: 'صوت إخباري وثائقي، دافئ ومريح' },
    { id: 'en-US-AriaNeural', name: 'Aria', desc: 'صوت نسائي راقي، واثق ومقنع' },
    { id: 'en-US-JennyNeural', name: 'Jenny', desc: 'صوت طبيعي جداً، دافئ ومناسب للسرد' }
  ];

  const [selectedVoice, setSelectedVoice] = useState(availableVoices[0].id);

  // ==========================================
  // 5. 🌟 جديد: حالات (States) الفيديوهات المرفوعة للمونتاج
  // ==========================================
  const [sceneVideos, setSceneVideos] = useState({});
  const [sceneVideoPreviews, setSceneVideoPreviews] = useState({});
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    fetchInspirations();
  }, []);

  const fetchInspirations = async () => {
    setIsLoadingInspirations(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-reel-topics');
      if (res.data.success) {
        setInspirations(res.data.inspirations);
      }
    } catch (err) {
      console.error('فشل جلب الإلهامات:', err);
    } finally {
      setIsLoadingInspirations(false);
    }
  };

  const handleGenerateReel = async () => {
    if (!topic) {
        setError('الرجاء كتابة فكرة الفيديو أولاً!');
        return;
    }
    
    setIsGenerating(true);
    setError('');
    setReelData(null);
    setAudioUrl(null); 
    setSceneVideos({});
    setSceneVideoPreviews({});

    try {
      const res = await axios.post('http://localhost:5000/api/generate-reel-script', { topic });
      if (res.data.success) {
        setReelData(res.data.reel);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء توليد السيناريو.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!reelData || !reelData.scenes) return;
    
    setIsGeneratingAudio(true);
    setAudioError('');
    setAudioUrl(null);

    const fullNarration = reelData.scenes
      .map(scene => scene.narration)
      .join(' ... '); 

    try {
      const res = await axios.post('http://localhost:5000/api/generate-voiceover', { 
        text: fullNarration,
        voiceId: selectedVoice 
      });
      
      if (res.data.success) {
        setAudioUrl(res.data.audioUrl);
      }
    } catch (err) {
      console.error(err);
      setAudioError(err.response?.data?.error || 'حدث خطأ أثناء توليد الصوت.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // 🎥 دالة معالجة رفع الفيديوهات لكل مشهد
  const handleVideoUpload = (index, file) => {
    if (file && file.type.startsWith('video/')) {
      setSceneVideos(prev => ({ ...prev, [index]: file }));
      setSceneVideoPreviews(prev => ({ ...prev, [index]: URL.createObjectURL(file) }));
    } else {
      alert('الرجاء رفع ملف فيديو صالح (مثل MP4)');
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleVideoUpload(index, file);
  };

  // 🎬 دالة الرندرة النهائية للمونتاج
  const handleRenderFinalVideo = async () => {
    for (let i = 0; i < reelData.scenes.length; i++) {
      if (!sceneVideos[i]) {
        alert(`❌ الرجاء رفع الفيديو الخاص بالمشهد رقم ${i + 1} قبل الرندرة!`);
        return;
      }
    }

    setIsRendering(true);
    setAudioError('');

    try {
      const formData = new FormData();
      formData.append('scenes', JSON.stringify(reelData.scenes));
      formData.append('voiceId', selectedVoice);

      // إرفاق جميع الفيديوهات مع النموذج
      Object.keys(sceneVideos).forEach(key => {
        formData.append(`video_${key}`, sceneVideos[key]);
      });

      const response = await axios.post('http://localhost:5000/api/render-video', formData, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Raw_DocuReel_AutoFactory.mp4');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      alert('✅ تم تصدير الفيديو بنجاح! جاري التحميل...');

    } catch (err) {
      console.error(err);
      setAudioError('حدث خطأ أثناء مونتاج الفيديو. تأكد من أن السيرفر يعمل.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-3">
            استوديو الفيديوهات القصيرة (ReelLab)
          </h1>
          <p className="text-gray-400 text-lg">مصنع المحتوى الوثائقي الواقعي 🎬</p>
        </header>

        {/* 🌟 إعدادات الهوية */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-purple-900/50 shadow-lg mb-6">
          <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
            <span>🦸‍♂️</span> إعدادات الهوية البصرية (Persona):
          </h3>
          <p className="text-gray-400 text-xs mb-3">
            للحفاظ على هويتك، ضع رابط صورتك لتوليد اللقطة الأساسية في Midjourney، ثم حركها في Veo.
          </p>
          <input
            type="text"
            className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-purple-500 outline-none transition-all text-sm font-mono text-left"
            dir="ltr"
            placeholder="https://cdn.discordapp.com/attachments/..."
            value={personaImageUrl}
            onChange={(e) => setPersonaImageUrl(e.target.value)}
          />
        </div>

        {/* منطقة الإدخال والإلهام */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl mb-10">
          <div className="mb-5 border-b border-gray-800 pb-5 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400 font-bold">💡 أفكار فيروسية (وثائقية خامة):</span>
              <button 
                onClick={fetchInspirations} 
                disabled={isLoadingInspirations}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-900/50"
              >
                <RefreshCw size={14} className={isLoadingInspirations ? "animate-spin" : ""} />
                توليد أفكار جديدة
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {isLoadingInspirations ? (
                <div className="w-full col-span-1 md:col-span-2 text-center py-8 text-emerald-500 animate-pulse text-lg font-bold">
                  🧠 جاري استخراج الأفكار...
                </div>
              ) : (
                inspirations.map((insp) => (
                  <div
                    key={insp.id}
                    onClick={() => setTopic(`${insp.hook} ${insp.coreLesson}`)}
                    className="bg-gray-950/80 hover:bg-emerald-900/20 text-right p-5 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all shadow-sm group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{insp.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-900 px-2 py-1 rounded-md border border-gray-800">{insp.category}</span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">{insp.title}</h4>
                    <p className="text-emerald-400 text-sm font-bold mb-2">🪝 {insp.hook}</p>
                    <p className="text-gray-400 text-xs mb-3 leading-relaxed">💡 {insp.coreLesson}</p>
                    <div className="text-blue-400 text-xs font-bold bg-blue-900/20 p-2 rounded-lg border border-blue-900/50 inline-block">
                      🗣️ {insp.cta}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <label className="block text-emerald-400 font-bold mb-2 text-lg">فكرة الفيديو (Topic):</label>
          <textarea
            className="w-full bg-gray-950 text-white p-4 rounded-xl border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none leading-relaxed"
            rows="3"
            placeholder="اكتب فكرتك هنا..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          ></textarea>
          
          {error && <p className="text-red-500 mt-3 font-semibold text-sm">{error}</p>}
          
          <button
            onClick={handleGenerateReel}
            disabled={isGenerating}
            className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
              isGenerating 
                ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isGenerating ? '⏳ جاري كتابة السيناريو الوثائقي...' : '🎬 إخراج السيناريو الآن'}
          </button>
        </div>

        {/* منطقة عرض النتائج ولوحة القصة */}
        {reelData && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
              <h2 className="text-2xl font-bold text-white mb-3">📌 {reelData.reelTitle}</h2>
              <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/80">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">📱 كابشن إنستغرام / تيك توك:</span>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">{reelData.caption}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-emerald-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                <span>🎬</span> لوحة القصة والمونتاج (Storyboard & Assembly):
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {reelData.scenes.map((scene, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 relative hover:border-emerald-500/50 transition-all flex flex-col lg:flex-row gap-6 group">
                  
                  {/* رقم المشهد */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-950 w-24 h-24 rounded-xl border border-gray-800">
                    <span className="text-3xl font-black text-gray-600 group-hover:text-emerald-500 transition-colors">0{scene.sceneNumber}</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 bg-emerald-900/30 px-2 py-1 rounded-md">{scene.durationHint}</span>
                  </div>
                  
                  {/* محتوى المشهد */}
                  <div className="flex-grow space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">🎙️ التعليق الصوتي:</span>
                        {scene.deliveryStyle && (
                          <span className="text-xs font-bold bg-purple-900/40 text-purple-300 px-3 py-1 rounded-lg border border-purple-700/50 flex items-center gap-2">
                            🎭 الأداء: {scene.deliveryStyle}
                          </span>
                        )}
                      </div>
                      <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
                        <p dir="ltr" className="text-xl text-white font-medium leading-relaxed font-serif tracking-wide text-left">
                          {scene.narration}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider block mb-2">👁 الكلمات الخاطفة:</span>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-md">
                        {scene.onScreenText}
                      </p>
                    </div>

                    {/* 🎥 البرومبت الحركي المزدوج (عام / شخصي) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* البرومبت العام */}
                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                        <span className="text-xs text-gray-500 font-bold uppercase block mb-2">🎬 برومبت حركة وثائقي (Veo/Runway):</span>
                        <p dir="ltr" className="text-sm text-gray-400 font-mono select-all cursor-text text-left">
                          {scene.videoPromptStandard || scene.visualPromptStandard}
                        </p>
                      </div>
                      
                      {/* برومبت الهوية */}
                      <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-900/50">
                        <span className="text-xs text-purple-400 font-bold uppercase block mb-2">🦸‍♂️ برومبت الهوية الوثائقي (Persona):</span>
                        <p dir="ltr" className="text-sm text-purple-300/80 font-mono select-all cursor-text text-left">
                          {scene.videoPromptPersona || scene.visualPromptPersona}
                        </p>
                      </div>
                    </div>

                    {/* 🎥 منطقة رفع وإسقاط الفيديو الخاص بالمشهد */}
                    <div 
                      className={`mt-4 border-2 border-dashed rounded-xl p-2 transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${
                        sceneVideoPreviews[index] ? 'border-emerald-500/50 bg-gray-950' : 'border-gray-700 hover:border-emerald-500 bg-gray-950/50 hover:bg-gray-900'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(index, e)}
                    >
                      {sceneVideoPreviews[index] ? (
                        <div className="relative group w-full flex justify-center">
                          <video 
                            src={sceneVideoPreviews[index]} 
                            autoPlay 
                            loop 
                            muted 
                            className="max-h-48 rounded-lg object-contain shadow-lg" 
                          />
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg gap-2">
                            <span className="text-emerald-400 font-bold text-sm">✅ تم ربط الفيديو بنجاح</span>
                            <label className="cursor-pointer text-white text-xs font-bold bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 border border-gray-600 transition-colors">
                              🔄 تغيير الفيديو
                              <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" onChange={(e) => handleVideoUpload(index, e.target.files[0])} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center">
                          <span className="text-4xl mb-3 opacity-80">🎥</span>
                          <span className="text-gray-300 font-bold text-sm mb-1">أسقط فيديو (Veo/Luma) هنا</span>
                          <span className="text-xs text-gray-500">أو اضغط لاختيار ملف MP4</span>
                          <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" onChange={(e) => handleVideoUpload(index, e.target.files[0])} />
                        </label>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* 🎬 غرفة المونتاج والإنتاج النهائي */}
            <div className="mt-12 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-600"></div>
              
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="bg-purple-600/20 p-2 rounded-lg text-purple-400">🎬</span>
                غرفة المونتاج والإخراج النهائي
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                تأكد من رفع جميع الفيديوهات في المشاهد بالأعلى، ثم اختر المعلق الصوتي واضغط على زر الإخراج.
              </p>

              <div className="mb-6 bg-gray-950 p-4 rounded-xl border border-gray-800">
                <label className="block text-sm font-bold text-gray-400 mb-3">🎭 اختر المعلق الصوتي (Edge TTS):</label>
                <div className="relative">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-gray-900 text-white font-medium p-3 pr-10 rounded-lg border border-gray-700 focus:border-purple-500 outline-none appearance-none cursor-pointer transition-all"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.desc}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-purple-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={handleRenderFinalVideo}
                  disabled={isRendering}
                  className={`w-full py-5 rounded-xl font-black text-xl flex items-center justify-center transition-all border-2 shadow-2xl ${
                    isRendering 
                      ? 'bg-gray-800 text-purple-400 border-purple-900/50 cursor-wait' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-purple-400 hover:scale-[1.02]'
                  }`}
                >
                  {isRendering ? (
                    <span className="flex items-center gap-3 animate-pulse">
                      <RefreshCw className="animate-spin" size={24} /> جاري دمج الفيديوهات والنصوص... (يستغرق وقتاً)
                    </span>
                  ) : (
                    '📥 إخراج وتحميل الفيديو النهائي (MP4)'
                  )}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-xs mb-4 font-bold">خيارات ثانوية للاختبار:</p>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={isGeneratingAudio || isRendering}
                    className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center transition-all w-full md:w-auto ${
                      isGeneratingAudio ? 'bg-gray-800 text-gray-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                    }`}
                  >
                    {isGeneratingAudio ? '⏳ جاري التسجيل...' : '🎧 تجربة المقطع الصوتي فقط'}
                  </button>

                  {audioUrl && (
                    <div className="flex-grow w-full bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center gap-4">
                      <span className="text-xs font-bold text-green-400 uppercase whitespace-nowrap">✅ الصوت جاهز</span>
                      <audio controls className="w-full h-10" autoPlay>
                        <source src={audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>
                {audioError && <p className="text-red-500 mt-3 font-semibold text-xs">{audioError}</p>}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelLab;
```

---

## `autofactory-ui\src\pages\RoadmapLab.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { Copy, CheckCircle2, Wand2, Share2, ImageIcon, Smartphone, Globe } from 'lucide-react';
const RoadmapLab = () => {
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false); 
  const [images, setImages] = useState([]); 
  
  // 🚀 حالات مخصصة لكل وصف بشكل منفصل
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  const [magicPrompt, setMagicPrompt] = useState('');
  
  // حالات أزرار النسخ
  const [copiedIgCaption, setCopiedIgCaption] = useState(false);
  const [copiedFbCaption, setCopiedFbCaption] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // دالة النسخ مع تغيير حالة الزر مؤقتاً
  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // دالة جلب الإلهام
  const fetchInspiration = async (type) => {
    setIsInspiring(true);
    setTopic('⏳ جاري استخراج فكرة عبقرية...'); 
    
    try {
      const res = await axios.post('http://localhost:5000/api/inspire-roadmap', { type });
      if (res.data.success) {
        setTopic(res.data.idea);
      }
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      setTopic('');
      alert('حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي');
    }
    
    setIsInspiring(false);
  };

  // دالة التوليد الرئيسية
  const handleGenerate = async () => {
    setIsLoading(true);
    setImages([]); 
    setIgCaption(''); // تصفير وصف IG
    setFbCaption(''); // تصفير وصف FB
    setMagicPrompt(''); // تصفير البرومبت

    try {
      const res = await axios.post('http://localhost:5000/api/generate-roadmap', { 
          topic, 
          platform,
          slideCount: 6 
      });
      
      if (res.data.success) {
        // جمع الصور من المنصتين وعرضها
        setImages([
            ...(res.data.images.instagram || []), 
            ...(res.data.images.facebook || [])
        ]);        
        
        // 🚀 استقبال النصوص الوصفية (إن لم يرسل السيرفر ig/fb سيستخدم caption العادي كاحتياطي)
        setIgCaption(res.data.igCaption || res.data.caption || 'لم يتم توليد وصف لإنستغرام.');
        setFbCaption(res.data.fbCaption || res.data.caption || 'لم يتم توليد وصف لفيسبوك.');
        
        // 🚀 توليد البرومبت السحري 
        const generatedPrompt = `إليك صورة غلاف لمنشور كاروسيل (Carousel) غير مكتملة بخلفية داكنة (Dark Mode).\nموضوع المنشور هو: "${topic}".\n\nمهمتك هي العمل كخبير دمج وتصميم ثلاثي الأبعاد (3D Artist & Compositor):\n1. قم بتوليد عنصر 3D أيقوني، فخم، وحديث يعبر بدقة عن هذا الموضوع.\n2. يجب أن يكون العنصر 3D معزولاً ومركّزاً ببراعة في "المساحة الفارغة" الموجودة في منتصف الصورة.\n3. **قواعد صارمة جداً لتناسب الوضع الداكن:**\n   - حافظ على لون الخلفية الداكن الأصلي (لا تقم بتفتيحه أو إضافة سماء أو خلفيات معقدة).\n   - اجعل إضاءة العنصر الـ 3D (Lighting) تتناسب مع البيئة الداكنة لتبدو سينمائية وجذابة.\n   - أضف ظلالاً أرضية (Drop Shadow) خفيفة أو توهجاً (Glow) حول المجسم ليفصله عن الخلفية الداكنة باحترافية.\n   - لا تقم بتغيير، مسح، أو تشويه أي نص موجود في الصورة أو صورتي الشخصية الموجودة بالأسفل.`;
        setMagicPrompt(res.data.magicPrompt || generatedPrompt);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التوليد والتصميم');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 text-white min-h-screen" dir="rtl">
      <h2 className="text-3xl font-bold mb-8 text-emerald-400">🗺️ صانع خرائط الطريق (Roadmap Lab)</h2>
      
      {/* اختيار المنصة */}
      <div className="flex gap-4 mb-8">
          <button 
            className={`px-6 py-2 rounded-md font-bold transition-all ${platform === 'instagram' ? 'bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setPlatform('instagram')}
          >إنستغرام</button>
          <button 
            className={`px-6 py-2 rounded-md font-bold transition-all ${platform === 'facebook' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setPlatform('facebook')}
          >فيسبوك</button>
          <button 
            className={`px-6 py-2 rounded-md font-bold transition-all ${platform === 'both' ? 'bg-teal-600 shadow-[0_0_15px_rgba(13,148,136,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setPlatform('both')}
          >كلاهما معاً</button>
      </div>

      {/* حقل الإدخال والأزرار */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 mb-8">
          <input 
            type="text" 
            placeholder="أدخل فكرتك أو مجالك (مثال: بناء تطبيق SaaS، أو تحضير مقابلة عمل)"
            className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white mb-4 outline-none focus:border-emerald-500 transition-colors"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          
          {/* أزرار الإلهام */}
          <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => fetchInspiration('simple')} disabled={isInspiring} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm">
                 {isInspiring ? '⏳' : 'إلهام بسيط 🎯'}
              </button>
              
              <button onClick={() => fetchInspiration('viral')} disabled={isInspiring} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm">
                 {isInspiring ? '⏳' : 'إلهام فيروسي ✨'}
              </button>

              <button onClick={() => fetchInspiration('trend')} disabled={isInspiring} className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm shadow-[0_0_10px_rgba(234,88,12,0.4)]">
                 {isInspiring ? 'جاري البحث...' : 'التريند اليومي 🔥'}
              </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic || topic.includes('جاري')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold text-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
          >
            {isLoading ? '⏳ جاري هندسة وتصميم الكاروسيل...' : '⚡ صمم خريطة الطريق الآن'}
          </button>
      </div>

      {/* ==========================================
          👁️ عرض النتائج (الصور + النصوص)
          ========================================== */}
      {images.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* القسم الأيمن: استوديو الصور (يأخذ ثلثي المساحة) */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
                <ImageIcon size={24} /> الصور المنتجة:
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar">
                {images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={`http://localhost:5000/${img}`} 
                    alt={`Slide ${idx+1}`} 
                    className="h-[450px] rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] border border-slate-700 flex-shrink-0 hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>
            </div>

            {/* القسم الأيسر: النصوص والبرومبت السحري */}
            <div className="space-y-6">
              
              {/* 📱 صندوق وصف إنستغرام (IG) */}
              <div className="bg-slate-800 p-5 rounded-2xl border border-pink-500/40 relative shadow-[0_0_15px_rgba(219,39,119,0.1)]">
                <h4 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
                  <Smartphone size={18} /> وصف إنستغرام (Instagram)
                </h4>
                <textarea 
                  readOnly 
                  value={igCaption} 
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"
                />
                <button 
                  onClick={() => handleCopy(igCaption, setCopiedIgCaption)}
                  className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs"
                >
                  {copiedIgCaption ? <><CheckCircle2 size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ النص</>}
                </button>
              </div>

              {/* 📘 صندوق وصف فيسبوك (FB) */}
              <div className="bg-slate-800 p-5 rounded-2xl border border-blue-500/40 relative shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Globe size={18} /> وصف فيسبوك (Facebook)
                </h4>
                <textarea 
                  readOnly 
                  value={fbCaption} 
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"
                />
                <button 
                  onClick={() => handleCopy(fbCaption, setCopiedFbCaption)}
                  className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs"
                >
                  {copiedFbCaption ? <><CheckCircle2 size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ النص</>}
                </button>
              </div>

              {/* 🪄 صندوق البرومبت السحري لجيميني */}
              <div className="bg-slate-800 p-5 rounded-2xl border border-purple-500/40 relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Wand2 size={18} /> البرومبت السحري (لـ Gemini)
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  انسخ النص والصقه في Gemini مع صورة الغلاف لإضافة المجسم 3D.
                </p>
                <textarea 
                  readOnly 
                  value={magicPrompt} 
                  className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar font-mono leading-relaxed"
                />
                <button 
                  onClick={() => handleCopy(magicPrompt, setCopiedPrompt)}
                  className="absolute bottom-6 left-6 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                >
                  {copiedPrompt ? <><CheckCircle2 size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ البرومبت</>}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapLab;
```

---

## `autofactory-ui\src\pages\StoryLab.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { Copy, CheckCircle2, Upload, ImageIcon, Wand2, PenTool, Zap, TrendingUp, Loader2, Eye, RefreshCw } from 'lucide-react';

const StoryLab = () => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(8); // الافتراضي 8 شرائح
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const [storySlides, setStorySlides] = useState([]);
  const [uploadedImages, setUploadedImages] = useState({});

  const [imagePreviews, setImagePreviews] = useState({}); // 🌟 State جديد لحفظ صور المعاينة
  const [finalImages, setFinalImages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
// --- States للتحرير اليدوي وإعادة الصياغة ---
  const [editingSlideIndex, setEditingSlideIndex] = useState(null); // من هي الشريحة المفتوحة للتحرير؟
  const [editForm, setEditForm] = useState({ title: '', text: '' }); // بيانات النموذج المؤقتة
  const [isRewriting, setIsRewriting] = useState(false);
// تتبع أي شريحة يتم تحديث صورها حالياً لإظهار أيقونة التحميل
  const [regeneratingPromptsIndex, setRegeneratingPromptsIndex] = useState(null);

  // 🔄 دالة تحديث اللقطات لشريحة محددة
  const handleRegenerateSinglePrompts = async (slideIndex) => {
    setRegeneratingPromptsIndex(slideIndex);
    try {
      const slide = storySlides[slideIndex];
      const res = await axios.post('http://localhost:5000/api/regenerate-single-prompts', { 
        slideTitle: slide.title,
        slideText: slide.text
      });
      
      if (res.data.success) {
        const updatedSlides = [...storySlides];
        updatedSlides[slideIndex] = { 
            ...updatedSlides[slideIndex], 
            vibePrompt: res.data.prompts.vibePrompt,
            facePrompt: res.data.prompts.facePrompt,
            povPrompt: res.data.prompts.povPrompt,
            emotionPrompt: res.data.prompts.emotionPrompt,
            technicalPrompt: res.data.prompts.technicalPrompt
        };
        setStorySlides(updatedSlides);
        
        // مسح نصيحة المستشار القديمة لأنها لم تعد صالحة للبرومبتات الجديدة
        const updatedAdvice = { ...expertAdvice };
        delete updatedAdvice[slide.slideNumber];
        setExpertAdvice(updatedAdvice);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تحديث اللقطات. حاول مجدداً.');
    }
    setRegeneratingPromptsIndex(null);
  };
  // فتح وضع التحرير
  const handleEditClick = (slideIndex, slide) => {
    setEditingSlideIndex(slideIndex);
    setEditForm({ title: slide.title, text: slide.text });
  };

  // إغلاق وضع التحرير بدون حفظ
  const handleCancelEdit = () => {
    setEditingSlideIndex(null);
  };

  // حفظ التعديلات اليدوية
  const handleSaveEdit = (slideIndex) => {
    const updatedSlides = [...storySlides];
    updatedSlides[slideIndex] = { 
        ...updatedSlides[slideIndex], 
        title: editForm.title, 
        text: editForm.text 
    };
    setStorySlides(updatedSlides);
    setEditingSlideIndex(null);
  };

  // 🪄 زر السحر الاصطناعي لإعادة الصياغة
  const handleAiRewrite = async (slideIndex) => {
    setIsRewriting(true);
    try {
      const slideToRewrite = storySlides[slideIndex];
      const res = await axios.post('http://localhost:5000/api/rewrite-slide', { 
        slideTitle: slideToRewrite.title,
        slideText: slideToRewrite.text,
        slideType: slideIndex === 0 ? 'hook' : (slideIndex === storySlides.length - 1 ? 'cta' : 'content')
      });
      
      if (res.data.success) {
        // تحديث الـ Form المؤقت لكي ترى النتيجة فوراً
        setEditForm({ title: res.data.newTitle, text: res.data.newText });
        
        // أو حفظها مباشرة في الـ State الرئيسي
        const updatedSlides = [...storySlides];
        updatedSlides[slideIndex] = { 
            ...updatedSlides[slideIndex], 
            title: res.data.newTitle, 
            text: res.data.newText 
        };
        setStorySlides(updatedSlides);
        // نغلق وضع التحرير بعد نجاح السحر
        setEditingSlideIndex(null);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إعادة الصياغة بالذكاء الاصطناعي.');
    }
    setIsRewriting(false);
  };

  
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ==========================================
  // دوال الإلهام الاستراتيجي (The Growth Engine)
  // ==========================================
  
  // 1. دالة الإلهام الشخصي (Personal Arsenal) - لبناء الثقة
  const handlePersonalInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-personal');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  // 2. دالة الإلهام الترندي (Viral Trends) - للانتشار
  const handleViralInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-viral');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  // 3. دالة خرائط الطريق (Roadmaps & Tools) - قنابل الحفظ
  const handleRoadmapInspiration = async () => {
    setIsSuggesting(true);
    try {
      // ⚠️ تأكد من إنشاء هذا المسار في server.js لاحقاً
      const res = await axios.get('http://localhost:5000/api/suggest-story-roadmap');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('تحتاج إلى إنشاء مسار /api/suggest-story-roadmap في السيرفر.');
    }
    setIsSuggesting(false);
  };

  // 4. دالة إثارة الجدل (Controversial) - لزيادة التعليقات
  const handleControversialInspiration = async () => {
    setIsSuggesting(true);
    try {
      // ⚠️ تأكد من إنشاء هذا المسار في server.js لاحقاً
      const res = await axios.get('http://localhost:5000/api/suggest-story-controversial');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('تحتاج إلى إنشاء مسار /api/suggest-story-controversial في السيرفر.');
    }
    setIsSuggesting(false);
  };

  // 5. دالة دراسات الحالة (Case Studies) - لصيد العملاء
  const handleCaseStudyInspiration = async () => {
    setIsSuggesting(true);
    try {
      // ⚠️ تأكد من إنشاء هذا المسار في server.js لاحقاً
      const res = await axios.get('http://localhost:5000/api/suggest-story-casestudy');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('تحتاج إلى إنشاء مسار /api/suggest-story-casestudy في السيرفر.');
    }
    setIsSuggesting(false);
  };

  const handleGeneratePrompts = async () => {
    setIsLoading(true);
    try {
      // 🌟 التغيير هنا: نرسل topic و slideCount صراحةً
      const res = await axios.post('http://localhost:5000/api/generate-story-prompts', { 
        topic: topic, 
        slideCount: slideCount 
      });
      if (res.data.success) {
        setStorySlides(res.data.slides);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء توليد السيناريو.');
    }
    setIsLoading(false);
  };


  // 6. دالة كفاح وإنتاجية (Hero's Journey) - لربط الجمهور عاطفياً
  const handleJourneyInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-journey');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  
// 7. دالة خرائط الإتقان (Zero to Hero)
  const handleMasteryInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-mastery');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  const [expertAdvice, setExpertAdvice] = useState({});
  const [isConsulting, setIsConsulting] = useState(false);

  // دالة طلب نصيحة المستشار
  const handleGetExpertAdvice = async () => {
    setIsConsulting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/suggest-best-shots', { 
        slides: storySlides 
      });
      
      if (res.data.success) {
        // تحويل المصفوفة إلى كائن (Object) يسهل الوصول إليه عبر رقم الشريحة
        const adviceObj = {};
        res.data.expert_advice.forEach(item => {
          adviceObj[item.slideNumber] = item;
        });
        setExpertAdvice(adviceObj);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء استشارة الخبير.');
    }
    setIsConsulting(false);
  };


  // التعامل مع اختيار الصور من المستخدم وإنشاء معاينة
  const handleImageUpload = (slideNumber, file) => {
    if (file) {
      // حفظ الملف الفعلي للإرسال للسيرفر
      setUploadedImages(prev => ({
        ...prev,
        [`image_${slideNumber}`]: file
      }));
      
      // إنشاء رابط معاينة فوري لعرضه في الواجهة
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [`image_${slideNumber}`]: previewUrl
      }));
    }
  };

  const [isGeneratingCinematics, setIsGeneratingCinematics] = useState(false);
// دالة مساعدة لإنشاء تأخير زمني (Sleep)
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🎬 دالة طلب اللقطات السينمائية (تعمل الآن عبر Gemini لجميع الشرائح دفعة واحدة)
  const handleGenerateCinematics = async () => {
    setIsGeneratingCinematics(true);
    try {
      // إرسال المصفوفة كاملة للسيرفر بدون أي تأخير زمني
      const res = await axios.post('http://localhost:5000/api/generate-cinematic-prompts', { 
        slides: storySlides 
      });
      
      if (res.data.success) {
        const cinematicData = res.data.cinematic_slides;
        const updatedSlides = storySlides.map(slide => {
          const matchingCinematic = cinematicData.find(c => c.slideNumber === slide.slideNumber);
          if (matchingCinematic) {
             return { 
                 ...slide, 
                 vibePrompt: matchingCinematic.vibePrompt,
                 facePrompt: matchingCinematic.facePrompt,
                 povPrompt: matchingCinematic.povPrompt,
                 emotionPrompt: matchingCinematic.emotionPrompt,
                 technicalPrompt: matchingCinematic.technicalPrompt
             };
          }
          return slide;
        });
        
        setStorySlides(updatedSlides);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء توليد اللقطات السينمائية.');
    }
    setIsGeneratingCinematics(false);
  };



  const handleStampImages = async () => {
    if (Object.keys(uploadedImages).length !== storySlides.length) {
        alert('الرجاء رفع صورة لكل شريحة من Gemini قبل الطباعة!');
        return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('slidesData', JSON.stringify(storySlides));
    
    storySlides.forEach(slide => {
        const file = uploadedImages[`image_${slide.slideNumber}`];
        formData.append(`image_${slide.slideNumber}`, file);
    });

    try {
      const res = await axios.post('http://localhost:5000/api/stamp-story-images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFinalImages(res.data.images);
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء طباعة التصميم.');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#05070A]" dir="rtl">
      <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center gap-3">
        <Wand2 size={36} className="text-purple-500" /> استوديو القصص (Story Lab - Pro)
      </h2>

      {/* ==========================================
          المرحلة 1: إدخال الفكرة وأزرار الإلهام
          ========================================== */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
              1. هندسة القصة والسيناريو
            </h3>

            {/* ==========================================
                لوحة التحكم الاستراتيجية (The Growth Engine)
                ========================================== */}
 {/* ==========================================
                لوحة التحكم الاستراتيجية (The Growth Engine)
                ========================================== */}
            <div className="mb-6">
              <label className="text-slate-300 font-bold mb-3 flex items-center gap-2">
                <Wand2 size={18} className="text-purple-400"/> اختر الاستراتيجية النفسية للمنشور:
              </label>
              
              {/* شبكة متوازنة من 6 أزرار (3 أعمدة) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                
                {/* 1. بناء الثقة */}
                <button 
                  onClick={handlePersonalInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-purple-300 py-3 px-3 rounded-xl font-medium border border-purple-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يبني الثقة والولاء مع جمهورك عبر مشاركة تجاربك."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  <div className="text-right">
                    <div className="text-sm font-bold">تجارب شخصية</div>
                    <div className="text-[10px] text-purple-400/70">لبناء الثقة والولاء</div>
                  </div>
                </button>

                {/* 2. الانتشار السريع */}
                <button 
                  onClick={handleViralInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-emerald-300 py-3 px-3 rounded-xl font-medium border border-emerald-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يستغل المواضيع الرائجة لجلب مشاهدات سريعة."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                  <div className="text-right">
                    <div className="text-sm font-bold">ترند وسوق</div>
                    <div className="text-[10px] text-emerald-400/70">للانتشار السريع (Reach)</div>
                  </div>
                </button>

                {/* 3. قنابل الحفظ */}
                <button 
                  onClick={handleRoadmapInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-amber-400 py-3 px-3 rounded-xl font-medium border border-amber-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يقدم قيمة مركزة تجبر المتابع على حفظ المنشور للعودة إليه."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">🗺️</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">خرائط وأدوات</div>
                    <div className="text-[10px] text-amber-400/70">لرفع نسبة الحفظ (Saves)</div>
                  </div>
                </button>

                {/* 4. إثارة الجدل */}
                <button 
                  onClick={handleControversialInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-rose-400 py-3 px-3 rounded-xl font-medium border border-rose-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يهاجم فكرة شائعة لإشعال خانة التعليقات."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">🔥</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">كسر المسلمات</div>
                    <div className="text-[10px] text-rose-400/70">لزيادة التعليقات (Comments)</div>
                  </div>
                </button>

                {/* 5. صائد العملاء */}
                <button 
                  onClick={handleCaseStudyInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-blue-400 py-3 px-3 rounded-xl font-medium border border-blue-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يعرض أرقاماً ونتائج حقيقية لجذب العملاء المحتملين."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">📊</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">دراسات حالة</div>
                    <div className="text-[10px] text-blue-400/70">لجذب العملاء (Leads)</div>
                  </div>
                </button>

                {/* 🌟 6. الزر الجديد: كفاح وإنتاجية (Hero's Journey) */}
                <button 
                  onClick={handleJourneyInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-indigo-400 py-3 px-3 rounded-xl font-medium border border-indigo-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يشارك كواليس تعلمك، تقسيم وقتك، وكيفية إنجاز المشاريع لربط المتابع بك عاطفياً."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">⏳</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">كفاح وإنتاجية</div>
                    <div className="text-[10px] text-indigo-400/70">لصناعة جمهور وفي (Super Fans)</div>
                  </div>
                </button>
{/* 🌟 7. الزر المَلَكي: خرائط الإتقان من الصفر للاحتراف */}
                <button 
                  onClick={handleMasteryInspiration} 
                  disabled={isSuggesting}
                  className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-medium border border-indigo-500/50 transition-all flex items-center justify-between gap-4 disabled:opacity-50 md:col-span-2 lg:col-span-3 shadow-[0_0_20px_rgba(79,70,229,0.2)] mt-2"
                  title="خلاصات مكثفة وخطوات عملية لتعلم مهاراتك التقنية المعقدة في وقت قياسي."
                >
                  <div className="flex items-center gap-3">
                    {isSuggesting ? <Loader2 size={24} className="animate-spin text-indigo-300" /> : <span className="text-2xl">🚀</span>}
                    <div className="text-right">
                      <div className="text-base font-bold text-indigo-100">خرائط الإتقان (Zero to Hero)</div>
                      <div className="text-xs text-indigo-300/80">خطوات عملية لتعلم (Full-Stack, AI, Trading) في وقت قياسي</div>
                    </div>
                  </div>
                  <span className="hidden md:inline-block bg-indigo-500/30 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/50">
                    الأكثر طلباً 🔥
                  </span>
                </button>


              </div>
            </div>
            
            <textarea 
              placeholder="اكتب فكرتك هنا أو اضغط على أحد الأزرار العلوية لجلب فكرة استراتيجية..." 
              className="w-full p-5 bg-[#020408] border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600 resize-none h-32 text-lg mb-6 shadow-inner"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            {/* 🌟 شريط التحكم بعدد الشرائح */}
            <div className="mb-8 bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <label className="text-slate-200 font-bold flex items-center gap-2">
                  <PenTool size={18} className="text-purple-400"/> اختر عدد شرائح القصة:
                </label>
                <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-lg">
                  {slideCount} شرائح
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold">
                <span>5 (قصير)</span>
                <span>8 (فيروسي مثالي)</span>
                <span>10 (دسم جداً)</span>
              </div>
            </div>

            <button 
              onClick={handleGeneratePrompts}
              disabled={isLoading || !topic}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-5 rounded-2xl font-bold text-xl transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(147,51,234,0.3)] flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? <><Loader2 size={26} className="animate-spin" /> جاري كتابة السيناريو السري...</> : '⚡ توليد السيناريو والبرومبتات'}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          المرحلة 2: استوديو الإخراج (اختيار البرومبت ورفع الصور)
          ========================================== */}
      {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-xl mb-8 flex items-start gap-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <span className="text-2xl">🎬</span>
                  <div>
                      <h4 className="font-bold text-purple-300">كرسي المخرج: اختر لقطاتك!</h4>
                      <p className="text-sm text-purple-200/80 mt-1">
                          لكل شريحة، وفرنا لك زاوية تصوير (جمالية/غامضة) وزاوية (واقعية بوجهك). انسخ البرومبت الذي يخدم قصتك بشكل أفضل، ولده في Gemini، ثم ارفع الصورة هنا.
                      </p>
                  </div>
              </div>
{/* قسم أزرار الذكاء الاصطناعي والصور */}
              <div className="mb-8 p-6 bg-slate-900/60 border border-slate-700 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                  
                  {!storySlides[0]?.technicalPrompt ? (
                      // زر التوليد السينمائي يظهر أولاً
                      <div className="flex-1 flex items-center justify-between w-full">
                          <div>
                              <h4 className="text-xl font-bold text-indigo-300">النصوص جاهزة!</h4>
                              <p className="text-sm text-indigo-200/70">اضغط لتوليد 5 زوايا إخراجية لكل شريحة.</p>
                          </div>
                          <button onClick={handleGenerateCinematics} disabled={isGeneratingCinematics} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                              {isGeneratingCinematics ? <Loader2 size={20} className="animate-spin" /> : <span className="text-xl">🎬</span>}
                              توليد اللقطات السينمائية
                          </button>
                      </div>
                  ) : (
                      // زر المستشار يظهر بعد توليد اللقطات
                      <div className="flex-1 flex items-center justify-between w-full">
                          <div>
                              <h4 className="text-xl font-bold text-amber-400">حائر بين اللقطات؟ 👑</h4>
                              <p className="text-sm text-amber-200/70">اسمح لمستشار Growth Hacking باختيار اللقطة الفيروسية الأفضل لك.</p>
                          </div>
                          <button onClick={handleGetExpertAdvice} disabled={isConsulting} className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                              {isConsulting ? <Loader2 size={20} className="animate-spin" /> : <span className="text-xl">🧠</span>}
                              استشارة الخبير الاستراتيجي
                          </button>
                      </div>
                  )}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {storySlides.map((slide, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl relative">
                          
{/* الهيدر (العنوان والنص - مع ميزة التحرير) */}
                          <div className="bg-slate-900 p-5 border-b border-slate-700 relative">
                              <div className="flex justify-between items-start mb-3">
                                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full inline-block">
                                    الشريحة {slide.slideNumber}
                                </span>
                                
                                {/* زر القلم لفتح وضع التحرير */}
                                {editingSlideIndex !== idx && (
                                    <button 
                                        onClick={() => handleEditClick(idx, slide)}
                                        className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                                    >
                                        <PenTool size={14} /> تعديل النصوص
                                    </button>
                                )}
                              </div>

                              {/* وضع القراءة (العادي) */}
                              {editingSlideIndex !== idx ? (
                                  <>
                                      <h4 className="text-white text-xl font-bold mb-2">{slide.title}</h4>
                                      <p className="text-slate-400 text-sm">"{slide.text}"</p>
                                  </>
                              ) : (
                                  <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                                      {/* 🌟 وضع التحرير (Edit Mode) */}
                                      {/* حقل العنوان */}
                                      <div className="relative">
                                          <label className="text-[10px] text-slate-500 absolute -top-2.5 right-3 bg-slate-900 px-1 font-bold">العنوان (لا تنسَ النجمتين * *)</label>
                                          <input 
                                              type="text" 
                                              value={editForm.title}
                                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                              className="w-full bg-slate-800 border border-indigo-500/50 text-white rounded-lg p-3 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                          />
                                      </div>
                                      
                                      {/* حقل النص */}
                                      <div className="relative">
                                          <label className="text-[10px] text-slate-500 absolute -top-2.5 right-3 bg-slate-900 px-1 font-bold">النص التوضيحي (قصير ومباشر)</label>
                                          <textarea 
                                              value={editForm.text}
                                              onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                                              className="w-full bg-slate-800 border border-indigo-500/50 text-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-20 resize-none"
                                          />
                                      </div>

                                      {/* أزرار التحكم في وضع التحرير */}
                                      <div className="flex gap-2 justify-end mt-2">
                                          <button 
                                              onClick={handleCancelEdit}
                                              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                          >
                                              إلغاء
                                          </button>
                                          
                                          {/* زر السحر الاصطناعي (AI Rewrite) */}
                                          <button 
                                              onClick={() => handleAiRewrite(idx)}
                                              disabled={isRewriting}
                                              className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.3)] disabled:opacity-50"
                                          >
                                              {isRewriting ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                              صياغة سحرية أقوى
                                          </button>

                                          {/* زر الحفظ اليدوي */}
                                          <button 
                                              onClick={() => handleSaveEdit(idx)}
                                              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                          >
                                              <CheckCircle2 size={14} /> حفظ التعديل
                                          </button>
                                      </div>
                                  </div>
                              )}
                          </div>

{/* 🌟 قسم اختيار البرومبت (الزوايا الخمس) */}
                          <div className="p-5 flex-1 flex flex-col gap-4">
{/* رأس قسم اللقطات مع زر التحديث */}
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-bold text-slate-300">اختر زاوية الإخراج السينمائي:</p>
                                    
                                    {/* 🔄 زر تحديث اللقطات لهذه الشريحة فقط */}
                                    <button 
                                        onClick={() => handleRegenerateSinglePrompts(idx)}
                                        disabled={regeneratingPromptsIndex === idx}
                                        className="text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                                        title="توليد لقطات جديدة تتناسب مع النص الحالي"
                                    >
                                        {regeneratingPromptsIndex === idx ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                        تحديث اللقطات
                                    </button>
                                </div>

                                {expertAdvice[slide.slideNumber] && (
                                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30 animate-pulse">
                                        تم تحديد الخيار الأمثل 👑
                                    </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                  {/* دالة مساعدة لتحديد ستايل اللقطة الفائزة */}
                                  {['vibePrompt', 'facePrompt', 'povPrompt', 'emotionPrompt', 'technicalPrompt'].map((promptKey, pIdx) => {
                                      const isWinner = expertAdvice[slide.slideNumber]?.bestShotKey === promptKey;
                                      const promptTitles = {
                                          vibePrompt: "🌌 لقطة أجواء (B-Roll)",
                                          facePrompt: "👤 لقطة الهوية (وجهك)",
                                          povPrompt: "📱 الإثبات (شاشة/POV)",
                                          emotionPrompt: "🎭 المشاعر (دراما/إرهاق)",
                                          technicalPrompt: "📝 الشرح التقني (شاشة كود/سبورة)"
                                      };

                                      return (
                                          <div key={pIdx} className={`group relative p-3 rounded-xl border transition-all ${
                                              isWinner 
                                              ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]' 
                                              : 'bg-slate-900/50 hover:bg-slate-900 border-slate-700'
                                          } ${promptKey === 'technicalPrompt' ? 'lg:col-span-2' : ''}`}>
                                              
                                              <div className="flex justify-between items-center mb-2">
                                                  <span className={`text-[11px] font-bold ${isWinner ? 'text-amber-400' : 'text-slate-400'}`}>
                                                      {promptTitles[promptKey]} {isWinner && '👑'}
                                                  </span>
                                                  <button onClick={() => handleCopy(slide[promptKey], `${promptKey}_${idx}`)} className={`p-1.5 rounded transition-colors disabled:opacity-50 ${isWinner ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`} disabled={!slide[promptKey]}>
                                                      {copiedIndex === `${promptKey}_${idx}` ? <CheckCircle2 size={14} className="text-white"/> : <Copy size={14} />}
                                                  </button>
                                              </div>
                                              
                                              <p className={`text-[10px] font-mono line-clamp-2 group-hover:line-clamp-none ${isWinner ? 'text-amber-100' : 'text-slate-400'}`}>
                                                  {slide[promptKey] || "اضغط لتوليد الإخراج..."}
                                              </p>

                                              {/* عرض تعليق المستشار أسفل اللقطة الفائزة */}
                                              {isWinner && (
                                                  <div className="mt-3 pt-3 border-t border-amber-500/30 text-[11px] text-amber-200 leading-relaxed font-bold bg-amber-900/40 p-2 rounded-lg">
                                                      💡 <strong>رأي المستشار:</strong> {expertAdvice[slide.slideNumber].reasoning}
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          
                          </div>
                          

                          {/* قسم رفع الصورة المختارة ومعاينتها */}
                          <div className="p-5 bg-slate-800/80 border-t border-slate-700 mt-auto">
                              {imagePreviews[`image_${slide.slideNumber}`] ? (
                                  // 🌟 حالة: تم رفع الصورة (عرض المعاينة)
                                  <div className="flex flex-col gap-3 w-full">
                                      <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-lg">
                                          <img 
                                              src={imagePreviews[`image_${slide.slideNumber}`]} 
                                              alt="Preview" 
                                              className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                          />
                                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                              تم الرفع ✅
                                          </div>
                                      </div>
                                      
                                      <div className="flex justify-between gap-3">
                                          <button 
                                              onClick={() => window.open(imagePreviews[`image_${slide.slideNumber}`], '_blank')}
                                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-2"
                                          >
                                              <Eye size={16} /> تكبير
                                          </button>
                                          
                                          <label className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-2">
                                              <RefreshCw size={16} /> تغيير
                                              <input 
                                                  type="file" 
                                                  accept="image/*" 
                                                  className="hidden"
                                                  onChange={(e) => handleImageUpload(slide.slideNumber, e.target.files[0])}
                                              />
                                          </label>
                                      </div>
                                  </div>
                              ) : (
                                  // 🌟 حالة: لم يتم رفع الصورة بعد (زر الرفع العادي)
                                  <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-slate-700/50 hover:bg-slate-600 transition-colors py-4 rounded-xl border-2 border-dashed border-slate-500 hover:border-slate-400">
                                      <span className="text-slate-300 flex items-center gap-2 text-sm font-medium">
                                          <Upload size={20}/> ارفع الصورة التي ولدتها هنا
                                      </span>
                                      <input 
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
                                          onChange={(e) => handleImageUpload(slide.slideNumber, e.target.files[0])}
                                      />
                                  </label>
                              )}
                          </div>
                      </div>
                  ))}
              </div>

              {/* زر الطباعة النهائي */}
              <div className="mt-10 flex justify-end">
                  <button 
                      onClick={handleStampImages}
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold text-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3"
                  >
                      {isLoading ? '⏳ جاري دمج الصور والنصوص...' : <><PenTool size={24}/> طباعة التصميم النهائي للقصة</>}
                  </button>
              </div>
          </div>
      )}

      {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center gap-3">
                  <ImageIcon size={32} className="text-emerald-400" /> العمل الفني جاهز
                </h3>
                <button onClick={() => {setStep(1); setStorySlides([]); setUploadedImages({}); setTopic('');}} className="text-slate-400 hover:text-white underline font-medium">بدء مشروع جديد</button>
              </div>
              
              <div className="flex gap-8 overflow-x-auto pb-8 pt-2 px-2 custom-scrollbar">
                {finalImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={`http://localhost:5000/${img}`} 
                    alt={`Final Slide ${idx+1}`} 
                    className="h-[650px] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-slate-700 flex-shrink-0 hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default StoryLab;
```

---

## `autofactory-ui\src\pages\TemplateLab.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Scale, Loader2, Image as ImageIcon, Share2, Layers, Send, CheckCircle, Target } from 'lucide-react';

export default function TemplateLab() {
  // ----------------------------------------------------
  // States المشتركة 
  // ----------------------------------------------------
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  
  // ----------------------------------------------------
  // States: المقارنة الثنائية (Classic AI vs Trad)
  // ----------------------------------------------------
  const [basicTopic, setBasicTopic] = useState('');
  const [basicSlideCount, setBasicSlideCount] = useState(6);

  // ----------------------------------------------------
  // States: المقارنة الثلاثية (The Expose)
  // ----------------------------------------------------
  const [tripleTopic, setTripleTopic] = useState('');
  const [tripleSlideCount, setTripleSlideCount] = useState(6);

  // ----------------------------------------------------
  // States: غرفة المراجعة (Review Studio)
  // ----------------------------------------------------
  const [images, setImages] = useState({ instagram: [], facebook: [] });
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // ==========================================
  // دوال الإلهام (Inspiration Fetchers)
  // ==========================================
  
  // إلهام بسيط (موضوع قصير ومباشر)
  const suggestBasicTopic = async (setTopicFunction) => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-basic-topic');
      if (res.data.success) setTopicFunction(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // إلهام فيروسي (موضوع شامل وتريند)
  const suggestViralTopic = async (setTopicFunction) => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-comparison-topic');
      if (res.data.success) setTopicFunction(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // ==========================================
  // دوال التوليد (Generation Triggers)
  // ==========================================

  // توليد الكاروسيل الثنائي
  const generateBasicComparison = async () => {
    if (!basicTopic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-comparison', { 
        topic: basicTopic, 
        slideCount: basicSlideCount, 
        platform 
      });
      if (res.data.success) {
        setImages(res.data.images);
        setIgCaption(res.data.igCaption || '');
        setFbCaption(res.data.fbCaption || '');
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  // توليد الكاروسيل الثلاثي
  const generateTripleComparison = async () => {
    if (!tripleTopic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-triple', { 
        topic: tripleTopic, 
        count: tripleSlideCount, 
        platform 
      });
      if (res.data.success) {
        setImages(res.data.images);
        setIgCaption(res.data.igCaption || '');
        setFbCaption(res.data.fbCaption || '');
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  // ==========================================
  // دالة النشر (Publishing)
  // ==========================================
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/publish-omni', {
        platform, images, igCaption, fbCaption
      });
      if (res.data.success) setPublishSuccess(true);
    } catch (error) {
      console.error(error); alert('فشل النشر. تأكد من إعدادات السيرفر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-900" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3">
        🧪 مختبر القوالب الذكية (Template Lab)
      </h1>
      
      {/* ==========================================
          محدد المنصة الرئيسي (Global Platform Selector)
          ========================================== */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-2 mb-8 mx-auto max-w-2xl text-sm shadow-lg">
        <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${platform === 'instagram' ? 'bg-pink-600 border-transparent text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-pink-500/50'}`}>إنستغرام</button>
        <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-blue-500/50'}`}>فيسبوك</button>
        <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${platform === 'both' ? 'bg-teal-600 border-transparent text-white shadow-[0_0_15px_rgba(13,148,136,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-teal-500/50'}`}>كلاهما معاً</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* ==========================================
            1. بطاقة: المقارنة الثنائية (التريند)
            ========================================== */}
        <div className="bg-slate-800 p-6 rounded-2xl border-2 border-emerald-500/50 flex flex-col hover:border-emerald-500 transition-colors shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Scale className="text-emerald-400" size={32} />
              <h2 className="text-xl font-bold text-emerald-50">المقارنة الثنائية (التريند)</h2>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">سريع ومباشر</span>
          </div>

          <div className="flex flex-col gap-4 mb-6 w-full">
            <input 
              type="text" 
              placeholder="اكتب فكرة تريند (مثال: توليد الفيديو بالذكاء الاصطناعي)" 
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              value={basicTopic}
              onChange={(e) => setBasicTopic(e.target.value)}
            />
            
            {/* 👈 أزرار الإلهام المطابقة للصورة المرجعية */}
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => suggestBasicTopic(setBasicTopic)} 
                disabled={isSuggesting} 
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-600"
              >
                {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                <span className="text-sm">إلهام بسيط</span>
              </button>
              
              <button 
                onClick={() => suggestViralTopic(setBasicTopic)} 
                disabled={isSuggesting} 
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-900/20"
              >
                {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span className="text-sm">إلهام فيروسي</span>
              </button>
            </div>

            <select value={basicSlideCount} onChange={(e) => setBasicSlideCount(Number(e.target.value))} className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 cursor-pointer font-bold transition-all text-sm">
              <option value="4">مختصر (4 شرائح)</option>
              <option value="6">متوسط (6 شرائح)</option>
              <option value="8">دسم (8 شرائح)</option>
            </select>
          </div>

          <button onClick={generateBasicComparison} disabled={loading || !basicTopic} className="w-full p-4 mt-auto rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex justify-center items-center gap-2 transition-all">
            {loading ? <><Loader2 size={20} className="animate-spin" /> جاري التصميم...</> : '⚡ صمم الكاروسيل الثنائي'}
          </button>
        </div>



      </div>

      {/* ==========================================
          👁️ غرفة المراجعة والنشر (Review Studio) المشتركة
          ========================================== */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 border-t border-slate-700 pt-8 mt-4">
          <h3 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2">
            👁️ غرفة المراجعة والاعتماد
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* قسم إنستغرام */}
            {(platform === 'instagram' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-pink-500/30 shadow-2xl">
                <h4 className="font-bold text-pink-400 mb-4 flex items-center gap-2"><ImageIcon size={20}/> نسخة إنستغرام</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.instagram?.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="IG Slide"/>
                  ))}
                </div>
                <textarea 
                  value={igCaption} onChange={(e) => setIgCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 custom-scrollbar"
                />
              </div>
            )}

            {/* قسم فيسبوك */}
            {(platform === 'facebook' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-blue-500/30 shadow-2xl">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><Share2 size={20}/> نسخة فيسبوك</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.facebook?.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="FB Slide"/>
                  ))}
                </div>
                <textarea 
                  value={fbCaption} onChange={(e) => setFbCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 custom-scrollbar"
                />
              </div>
            )}
          </div>

          {/* زر النشر النهائي */}
          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-green-600/20 text-green-400 border border-green-500 p-4 rounded-xl font-bold flex items-center gap-2 text-xl shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle size={28} /> تم النشر بنجاح على {platform === 'both' ? 'المنصتين!' : platform}
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {publishing ? <><Loader2 size={28} className="animate-spin" /> جاري الإطلاق للسيرفرات...</> : <><Send size={28} /> اعتمد المحتوى وانشر فوراً 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## `autofactory-ui\src\pages\TrendHub.jsx`

```javascript
import React, { useState } from 'react';
import { Brain, TrendingUp, Calendar, History, Sparkles, Target, Loader2, Copy, CheckCircle, FlaskConical, Eye, Zap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // للتنقل بين الصفحات
import useIdeaStore from '../store/useIdeaStore'; // المخزن الذي أنشأناه للتو
// قائمة مجالاتك الاحترافية
const niches = [
    "تطوير الويب وهندسة البرمجيات (Web Dev, Node.js, React, Python)",
    "الذكاء الاصطناعي، نماذج LLMs، وطرق استغلالها في المشاريع",
    "التعليق الصوتي المدمج بالذكاء الاصطناعي وهندسة الصوتيات",
    "أسرار وحيل سريعة في المونتاج",
    "التداول الكمي والخوارزمي (Quantitative Trading) بالبرمجة",
    "تبسيط الخوارزميات المعقدة والرياضيات البرمجية",
    "عالم الهاردوير، تجميع الحواسيب، والمقارنات التقنية",
    "ثقافة عامة تقنية، وحلول ذكية لمشاكل برمجية",
    "منهجيات فعالة لدراسة اللغات البرمجية والإنجليزية التقنية",
    "تحفيز، انضباط يومي، وقصص نجاح تقنية",
    "صحة المبرمج: الرياضة، الانضباط الجسدي والروتين",
    "التلعيب (Gamification) ومشاريع برمجية ممتعة",
    "دمج البرمجة بالعالم المادي (IoT)"
];

export default function TrendHub({ setActiveTab }) {
    // حالة التحكم بنوع الواجهة (trend vs lab)
    const [activeMode, setActiveMode] = useState('trend'); 
    
    // حالات قسم التريند
    const [selectedNiche, setSelectedNiche] = useState(niches[0]);
    
    // حالات قسم المختبر
    const [customIdea, setCustomIdea] = useState('');

    // الحالات المشتركة
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [copied, setCopied] = useState(false);

    // دالة استخراج التريند (القديمة)
    const fetchTrend = async (niche, isAuto = false) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const response = await axios.post('http://localhost:5000/api/analyze-trend', { niche, isAuto });
            if (response.data?.success) {
                setAnalysisResult({ type: 'trend', ...response.data });
            }
        } catch (error) {
            alert("❌ حدث خطأ في الخادم.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // دالة هندسة الفكرة (الجديدة)
    const engineerIdea = async () => {
        if (!customIdea.trim()) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const response = await axios.post('http://localhost:5000/api/engineer-idea', { rawIdea: customIdea });
            if (response.data?.success) {
                setAnalysisResult({ type: 'engineered', ...response.data });
            }
        } catch (error) {
            alert("❌ حدث خطأ في الخادم.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };
 const navigate = useNavigate();
const setViralData = useIdeaStore((state) => state.setViralData);

const handleTransferToStudio = () => {
    // 1. حفظ البيانات المندسة في المخزن (Zustand)
    setViralData(analysisResult); 
    // 2. تغيير التبويب النشط إلى الاستوديو
    setActiveTab('prompt'); 
};

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
            
            {/* القسم الأيمن: لوحة التحكم */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* مبدل الأوضاع (Toggle) */}
                <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-700">
                    <button 
                        onClick={() => { setActiveMode('trend'); setAnalysisResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'trend' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <TrendingUp size={20}/> استكشاف التريند
                    </button>
                    <button 
                        onClick={() => { setActiveMode('lab'); setAnalysisResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'lab' ? 'bg-pink-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <FlaskConical size={20}/> مختبر الأفكار
                    </button>
                </div>

                {/* واجهة استكشاف التريندات */}
                {activeMode === 'trend' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-2xl p-6 border border-indigo-500/30">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Brain size={24}/> الوكيل الاستراتيجي</h3>
                            <p className="text-indigo-200 text-sm mb-6">دع النظام يحلل ويقرر المجال والتريند المناسب لليوم.</p>
                            <button onClick={() => fetchTrend(niches[Math.floor(Math.random() * niches.length)], true)} disabled={isAnalyzing} className="w-full py-4 bg-white text-indigo-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100">
                                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />} استخرج الفكرة الذهبية
                            </button>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Target size={24}/> التوجيه اليدوي</h3>
                            <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-gray-900 text-white border border-gray-600 rounded-xl p-4 mb-4">
                                {niches.map((niche, idx) => <option key={idx} value={niche}>{niche}</option>)}
                            </select>
                            <button onClick={() => fetchTrend(selectedNiche, false)} disabled={isAnalyzing} className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                {isAnalyzing ? <Loader2 className="animate-spin" /> : <TrendingUp />} حلل هذا المجال
                            </button>
                        </div>
                    </div>
                )}

                {/* واجهة مختبر الأفكار */}
                {activeMode === 'lab' && (
                    <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-2xl p-6 border border-pink-500/30 shadow-xl animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg">
                                <FlaskConical size={28} className={isAnalyzing ? "animate-pulse" : ""} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">مُهندس التريند</h3>
                                <p className="text-pink-200/70 text-sm">أعطني فكرة ميتة، وسأحييها لك.</p>
                            </div>
                        </div>
                        
                        <textarea
                            value={customIdea}
                            onChange={(e) => setCustomIdea(e.target.value)}
                            placeholder="مثال: أريد عمل درس مقارنة بين لغة Python و JavaScript، كيف أقدمه ليكون تريند؟"
                            className="w-full h-32 bg-gray-900/80 border border-pink-500/30 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 resize-none mb-6 placeholder-gray-500"
                        ></textarea>

                        <button
                            onClick={engineerIdea}
                            disabled={isAnalyzing || !customIdea.trim()}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-pink-900/20"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Zap />}
                            حوّلها إلى قنبلة تفاعل 🚀
                        </button>
                    </div>
                )}
            </div>

            {/* القسم الأيسر: شاشة النتائج */}
            <div className="lg:col-span-7 bg-gray-800 rounded-2xl p-6 border border-gray-700 flex flex-col min-h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">نتائج التحليل</h3>

                {!analysisResult && !isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <Brain size={64} className="mb-4" />
                        <p className="text-lg">في انتظار تعليماتك...</p>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-blue-400">
                        <Loader2 className="animate-spin mb-4 text-blue-500" size={64} />
                        <p className="animate-pulse text-lg font-bold">جاري المعالجة والتحليل الإبداعي...</p>
                    </div>
                )}

                {/* عرض النتيجة إذا كان النمط "تريند عادي" */}
                {analysisResult?.type === 'trend' && (
                    <div className="flex-1 flex flex-col animate-fade-in-up">
                        <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-500/50 mb-4">
                            <span className="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2"><Sparkles size={14}/> الفكرة الرائجة:</span>
                            <p className="text-2xl font-bold text-white leading-relaxed">{analysisResult.trend}</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-auto">
                            <span className="text-xs font-bold text-gray-400 mb-2 block">مبررات النجاح:</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.reasoning}</p>
                        </div>
                        <button onClick={() => copyToClipboard(analysisResult.trend)} className="mt-6 w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl flex justify-center gap-2">
                            {copied ? <CheckCircle size={20}/> : <Copy size={20}/>} {copied ? 'تم النسخ!' : 'انسخ الفكرة'}
                        </button>
                    </div>
                )}

                {/* عرض النتيجة إذا كان النمط "هندسة فكرة" (المختبر) */}
                {analysisResult?.type === 'engineered' && (
                    <div className="flex-1 flex flex-col gap-4 animate-fade-in-up">
                        <div className="bg-pink-900/30 rounded-xl p-5 border border-pink-500/30 border-l-4 border-l-pink-500">
                            <span className="text-xs font-bold text-pink-400 mb-2 flex items-center gap-2"><Zap size={14}/> الخطاف الجذاب (Hook):</span>
                            <p className="text-xl font-bold text-white">{analysisResult.hook}</p>
                        </div>
                        
                        <div className="bg-blue-900/30 rounded-xl p-5 border border-blue-500/30 border-l-4 border-l-blue-500">
                            <span className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2"><Eye size={14}/> أسلوب التقديم البصري:</span>
                            <p className="text-white text-md leading-relaxed">{analysisResult.presentation}</p>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-auto">
                            <span className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2"><Brain size={14}/> الزاوية النفسية (لماذا ستنجح؟):</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.viralAngle}</p>
                        </div>

<button 
    onClick={handleTransferToStudio} 
    className="mt-2 w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl flex justify-center gap-2 hover:opacity-90"
>
    <Sparkles size={20}/> اعتماد ونقل للاستوديو
</button>
                    </div>
                )}
            </div>
        </div>
    );
}
```

---

## `autofactory-ui\src\pages\TripleTemplateLab.jsx`

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Layers, Loader2, Image as ImageIcon, Share2, Send, CheckCircle, Target } from 'lucide-react';

export default function TripleTemplateLab() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  
  const [images, setImages] = useState({ instagram: [], facebook: [] });
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // 1. جلب فكرة بسيطة ومباشرة
  const suggestBasicTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-basic-topic');
      if (res.data.success) setTopic(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // 2. جلب فكرة تريند شاملة (فيروسية)
  const suggestViralTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-comparison-topic');
      if (res.data.success) setTopic(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // توليد القالب الثلاثي
  const generateTriple = async () => {
    if (!topic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-triple', { 
        topic, 
        count: slideCount, 
        platform 
      });
      
      if (res.data.success) {
        setImages(res.data.images);
        setIgCaption(res.data.igCaption || '');
        setFbCaption(res.data.fbCaption || '');
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  // النشر
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/publish-omni', {
        platform,
        images,
        igCaption,
        fbCaption
      });
      if (res.data.success) {
        setPublishSuccess(true);
      }
    } catch (error) {
      console.error(error); alert('فشل النشر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-900" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-amber-400 flex items-center gap-3">
        🚀 قالب المقارنة الثلاثية (سيئ، جيد، احترافي)
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border-2 border-amber-500 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-amber-400" size={32} />
            <h2 className="text-xl font-bold">إعدادات الكاروسيل الثلاثي</h2>
          </div>

          <div className="flex gap-2 mb-6 w-full text-sm">
            <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border-2 ${platform === 'instagram' ? 'bg-pink-600 border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>إنستغرام</button>
            <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border-2 ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>فيسبوك</button>
            <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border-2 ${platform === 'both' ? 'bg-teal-600 border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>كلاهما معاً</button>
          </div>
          
          <div className="flex flex-col gap-4 mb-6 w-full">
            <input 
              type="text" 
              placeholder="عن ماذا ستتحدث؟ (مثال: توليد الفيديوهات)" 
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            {/* أزرار الإلهام الجديدة */}
            <div className="flex gap-2 w-full">
              <button 
                onClick={suggestBasicTopic} 
                disabled={isSuggesting} 
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-600"
              >
                {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                <span className="text-sm">إلهام بسيط</span>
              </button>
              
              <button 
                onClick={suggestViralTopic} 
                disabled={isSuggesting} 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-900/20"
              >
                {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span className="text-sm">إلهام فيروسي</span>
              </button>
            </div>

            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-bold transition-all"
            >
              <option value="4">مختصر (4 شرائح)</option>
              <option value="6">متوسط (6 شرائح)</option>
              <option value="8">دسم (8 شرائح)</option>
            </select>
          </div>

          <button onClick={generateTriple} disabled={loading || !topic} className="w-full p-4 mt-auto rounded-xl font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-50 flex justify-center items-center gap-2">
            {loading ? <><Loader2 size={20} className="animate-spin" /> جاري التصميم...</> : '✨ صمم الكاروسيل الثلاثي'}
          </button>
        </div>
      </div>

      {/* غرفة المراجعة والنشر (Review Studio) */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-2xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
            👁️ غرفة المراجعة (Review Studio)
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {(platform === 'instagram' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-pink-500/30">
                <h4 className="font-bold text-pink-400 mb-4 flex items-center gap-2"><ImageIcon size={20}/> نسخة إنستغرام</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.instagram.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="IG Slide"/>
                  ))}
                </div>
                <textarea 
                  value={igCaption} onChange={(e) => setIgCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 custom-scrollbar"
                />
              </div>
            )}

            {(platform === 'facebook' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-blue-500/30">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><Share2 size={20}/> نسخة فيسبوك</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.facebook.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="FB Slide"/>
                  ))}
                </div>
                <textarea 
                  value={fbCaption} onChange={(e) => setFbCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 custom-scrollbar"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-green-600/20 text-green-400 border border-green-500 p-4 rounded-xl font-bold flex items-center gap-2 text-xl">
                <CheckCircle size={28} /> تم النشر بنجاح على {platform === 'both' ? 'المنصتين!' : platform}
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {publishing ? <><Loader2 size={28} className="animate-spin" /> جاري الإطلاق...</> : <><Send size={28} /> اعتمد المحتوى وانشر فوراً 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## `autofactory-ui\src\store\useIdeaStore.js`

```javascript
import { create } from 'zustand';

const useIdeaStore = create((set) => ({
    // الحالة: تخزين بيانات الفكرة الفيروسية
    viralData: null, 
    
    // دالة لحفظ البيانات القادمة من TrendHub
    setViralData: (data) => set({ viralData: data }),
    
    // دالة لتفريغ البيانات بعد الانتهاء منها في PromptStudio
    clearViralData: () => set({ viralData: null })
}));

export default useIdeaStore;
```

---

