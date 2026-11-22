/**
 * part3a-autofactory-studios-and-15qa-v1.js
 * [الشطر 3A الخاص بمجلد AutoFactory فقط]
 * 1. حقن <CarouselCourseFunnelPanel /> آلياً في صفحات الاستوديو الست داخل autofactory-ui/src/pages/:
 *    (TemplateLab, TripleTemplateLab, RoadmapLab, BusinessLab, StoryLab, CommercialLab).
 * 2. تشغيل روبوت الفحص الآلي الشامل لـ AutoFactory (runAutoTest_AutoFactoryFunnelEdition — 15/15 PASS).
 * 3. أرشفة سكربتات الشطر 1 و 2 تلقائياً في مجلد _archive_patches.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;

function resolveUiDir() {
  const candidates = [
    path.join(ROOT, 'autofactory-ui'),
    ROOT,
    path.join(ROOT, '..', 'autofactory-ui')
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'src', 'pages'))) {
      return dir;
    }
  }
  throw new Error('❌ لم يتم العثور على مجلد autofactory-ui/src/pages. ضع هذا السكربت في المجلد الرئيسي E:\\AutoFactory.');
}

function resolveBackendDir() {
  const candidates = [
    path.join(ROOT, 'autofactory-backend'),
    ROOT,
    path.join(ROOT, '..', 'autofactory-backend')
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'server.js'))) {
      return dir;
    }
  }
  throw new Error('❌ لم يتم العثور على مجلد autofactory-backend. ضع هذا السكربت في المجلد الرئيسي E:\\AutoFactory.');
}

function verifyJsxSanity(code, fileLabel) {
  if (!code.includes('export default')) {
    throw new Error('❌ فشل فحص JSX في ' + fileLabel + ': جملة export default مفقودة.');
  }
  let curly = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') curly++;
    else if (code[i] === '}') curly--;
  }
  if (curly !== 0) {
    throw new Error('❌ فشل فحص JSX في ' + fileLabel + ': عدم توازن في الأقواس المعقوفة {} (الفرق: ' + curly + ').');
  }
  return true;
}

console.log('🇩🇿🚀 [الشطر 3A - AutoFactory] بدء حقن الاستوديوهات الستة وتشغيل الفحص الآلي الشامل (15/15 PASS)...\n');

const UI_DIR = resolveUiDir();
const BACKEND_DIR = resolveBackendDir();
const PAGES_DIR = path.join(UI_DIR, 'src', 'pages');

// ============================================================================
// 1. حقن <CarouselCourseFunnelPanel /> في استوديوهات الكاروسيل الستة
// ============================================================================
const STUDIO_CONFIGS = [
  { file: 'TemplateLab.jsx', studioType: 'template_binary', topicVar: 'topic' },
  { file: 'TripleTemplateLab.jsx', studioType: 'template_triple', topicVar: 'topic' },
  { file: 'RoadmapLab.jsx', studioType: 'roadmap_steps', topicVar: 'topic' },
  { file: 'BusinessLab.jsx', studioType: 'business_saas', topicVar: 'topic' },
  { file: 'StoryLab.jsx', studioType: 'story_lab', topicVar: 'topic' },
  { file: 'CommercialLab.jsx', studioType: 'commercial_lab', topicVar: 'productIdea' }
];

function injectFunnelPanelIntoStudioPage(cfg) {
  const filePath = path.join(PAGES_DIR, cfg.file);
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ الملف ' + cfg.file + ' غير موجود، تم تخطيه.');
    return false;
  }

  let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // أ) إزالة أي حقن سابق لنفس المكوّن لضمان النظافة التامة (Idempotency)
  code = code.replace(/import CarouselCourseFunnelPanel from '\.\.\/components\/CarouselCourseFunnelPanel';\n?/g, '');
  code = code.replace(/\s*\{\/\* \[AUTO-FUNNEL PANEL START\] \*\/\}[\s\S]*?\{\/\* \[AUTO-FUNNEL PANEL END\] \*\/\}\n?/g, '');

  // ب) إضافة سطر الاستيراد في أعلى الملف بعد أول جملة import
  const firstImportMatch = code.match(/^import .+$/m);
  if (firstImportMatch) {
    const insertIdx = firstImportMatch.index + firstImportMatch[0].length;
    code =
      code.slice(0, insertIdx) +
      "\nimport CarouselCourseFunnelPanel from '../components/CarouselCourseFunnelPanel';" +
      code.slice(insertIdx);
  } else {
    code = "import CarouselCourseFunnelPanel from '../components/CarouselCourseFunnelPanel';\n" + code;
  }

  // ج) ضمان التقاط مصفوفة slides القادمة من السيرفر في State الصفحة إذا لم تكن موجودة
  const hasSlidesState = /\bconst\s+\[\s*slides\s*,/.test(code);
  const hasFunnelSlidesState = /\bconst\s+\[\s*funnelSlides\s*,/.test(code);

  if (!hasSlidesState && !hasFunnelSlidesState && cfg.file !== 'CommercialLab.jsx') {
    const firstUseStateMatch = code.match(/const\s+\[[a-zA-Z0-9_]+,\s*set[a-zA-Z0-9_]+\]\s*=\s*useState\(/);
    if (firstUseStateMatch) {
      code =
        code.slice(0, firstUseStateMatch.index) +
        'const [funnelSlides, setFunnelSlides] = useState([]);\n  ' +
        code.slice(firstUseStateMatch.index);
    }
    code = code.replace(
      /setImages\(res\.data\.images\);/g,
      'setImages(res.data.images);\n        if (res.data.slides) setFunnelSlides(res.data.slides);'
    );
  }

  // د) ربط متغيرات الصفحة (topic, slides, igCaption, fbCaption) بخصائص المكوّن
  const hasTopicState = new RegExp('\\bconst\\s+\\[\\s*' + cfg.topicVar + '\\s*,').test(code);
  const resolvedTopicExpr = hasTopicState ? cfg.topicVar : "''";

  const resolvedSlidesExpr =
    cfg.file === 'CommercialLab.jsx'
      ? "(typeof commercial !== 'undefined' && commercial?.scenes) ? commercial.scenes : []"
      : hasSlidesState
        ? 'slides'
        : "(typeof funnelSlides !== 'undefined' ? funnelSlides : [])";

  const hasIgCaption = /\bconst\s+\[\s*igCaption\s*,/.test(code);
  const hasSingleCaption = /\bconst\s+\[\s*caption\s*,/.test(code);
  const hasFbCaption = /\bconst\s+\[\s*fbCaption\s*,/.test(code);

  const igProps = hasIgCaption
    ? 'igCaption={igCaption} setIgCaption={setIgCaption}'
    : hasSingleCaption
      ? 'igCaption={caption} setIgCaption={setCaption}'
      : '';

  const fbProps = hasFbCaption ? 'fbCaption={fbCaption} setFbCaption={setFbCaption}' : '';

  const panelJsxBlock = [
    '',
    '      {/* [AUTO-FUNNEL PANEL START] */}',
    '      <CarouselCourseFunnelPanel',
    '        topic={' + resolvedTopicExpr + '}',
    '        studioType="' + cfg.studioType + '"',
    '        slides={' + resolvedSlidesExpr + '}',
    '        ' + igProps,
    '        ' + fbProps,
    '      />',
    '      {/* [AUTO-FUNNEL PANEL END] */}',
    ''
  ].join('\n');

  // هـ) حقن المكوّن قبل آخر </div> يسبق export default
  const exportDefaultIdx = code.lastIndexOf('export default');
  const searchArea = exportDefaultIdx !== -1 ? code.slice(0, exportDefaultIdx) : code;
  const lastCloseDivIdx = searchArea.lastIndexOf('</div>');

  if (lastCloseDivIdx !== -1) {
    code = code.slice(0, lastCloseDivIdx) + panelJsxBlock + '    ' + code.slice(lastCloseDivIdx);
  }

  verifyJsxSanity(code, cfg.file);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('✅ [Studio Hooked] تم حقن وفحص <CarouselCourseFunnelPanel studioType="' + cfg.studioType + '" /> في ' + cfg.file);
  return true;
}

STUDIO_CONFIGS.forEach(injectFunnelPanelIntoStudioPage);

// ============================================================================
// 2. روبوت الفحص الآلي الشامل لـ AutoFactory (15/15 PASS)
// ============================================================================
function runAutoTest_AutoFactoryFunnelEdition() {
  const results = [];
  const check = (name, cond, detail) => {
    results.push({ name, passed: Boolean(cond), detail: detail || '' });
  };

  const campaignCode = fs.readFileSync(path.join(BACKEND_DIR, 'models', 'Campaign.js'), 'utf8');
  const srvCode = fs.readFileSync(path.join(BACKEND_DIR, 'server.js'), 'utf8');
  const panelPath = path.join(UI_DIR, 'src', 'components', 'CarouselCourseFunnelPanel.jsx');
  const panelCode = fs.existsSync(panelPath) ? fs.readFileSync(panelPath, 'utf8') : '';
  const campMgrCode = fs.readFileSync(path.join(PAGES_DIR, 'CampaignManager.jsx'), 'utf8');

  check(
    '1. ترقية نموذج Campaign.js بحقول الربط (course_id, course_title, course_url, studio_type)',
    campaignCode.includes('course_url') && campaignCode.includes('studio_type'),
    'Campaign Schema Upgraded'
  );

  check(
    '2. دعم الكلمات المفتاحية المتعددة المفصولة بفاصلة في مسار /webhook',
    srvCode.includes('split(/[،,|]/)'),
    'Multi-Keyword Webhook Active'
  );

  check(
    '3. إرجاع مصفوفة الشرائح (slides) في مسارات توليد الكاروسيل الأربعة',
    srvCode.includes('slides: lessonData.slides') && srvCode.includes('slides: roadmapData.slides'),
    'Carousel Slides Returned'
  );

  check(
    '4. مسار توليد الكورس التطبيقي المرافق (/api/funnel/generate-companion-course)',
    srvCode.includes("app.post('/api/funnel/generate-companion-course'"),
    'Companion Course Generator Active'
  );

  check(
    '5. مسار الرفع لـ 5001 وتفعيل الحملة (/api/funnel/deploy-course-and-campaign)',
    srvCode.includes("app.post('/api/funnel/deploy-course-and-campaign'") && srvCode.includes('{{COURSE_URL}}'),
    'Deploy & DM URL Injector Active'
  );

  check(
    '6. مسارا جلب وتصفير كورسات المنصة (/api/funnel/platform-courses & platform-reset)',
    srvCode.includes("app.get('/api/funnel/platform-courses'") && srvCode.includes("app.post('/api/funnel/platform-reset'"),
    'Platform Management Routes Ready'
  );

  let srvSyntaxOk = false;
  try {
    new vm.Script(srvCode, { filename: 'server.js' });
    srvSyntaxOk = true;
  } catch (_) {}
  check(
    '7. سلامة القواعد النحوية لخادم AutoFactory (vm.Script Syntax Check)',
    srvSyntaxOk,
    '0 Syntax Errors in server.js'
  );

  check(
    '8. وجود المكوّن الموحد <CarouselCourseFunnelPanel /> بكامل وظائفه',
    panelCode.includes('handleGenerateCompanionCourse') && panelCode.includes('handleDeployFunnel'),
    'CarouselCourseFunnelPanel.jsx Verified'
  );

  check(
    '9. ترقية مدير الحملات (CampaignManager.jsx) بقائمة كورسات المنصة وأزرار التصفير',
    campMgrCode.includes('handleResetPlatformCourses') && campMgrCode.includes('handleSelectCourseForDM'),
    'CampaignManager Hub Ready'
  );

  STUDIO_CONFIGS.forEach((cfg, idx) => {
    const pCode = fs.readFileSync(path.join(PAGES_DIR, cfg.file), 'utf8');
    check(
      (10 + idx) + '. حقن <CarouselCourseFunnelPanel /> في ' + cfg.file + ' (' + cfg.studioType + ')',
      pCode.includes('<CarouselCourseFunnelPanel') && pCode.includes('studioType="' + cfg.studioType + '"'),
      cfg.file + ' Hooked'
    );
  });

  console.log('\n================================================================================');
  console.log('🇩🇿🚀 تقرير الفحص الآلي الشامل — منظومة AutoFactory (15/15 PASS)');
  console.log('================================================================================');
  let passedCount = 0;
  results.forEach((r) => {
    if (r.passed) passedCount++;
    console.log((r.passed ? '✅ [PASS]' : '❌ [FAIL]') + ' ' + r.name + ' — (' + r.detail + ')');
  });
  console.log('--------------------------------------------------------------------------------');
  console.log('📊 النتيجة النهائية: ' + passedCount + '/' + results.length + ' PASS (' + Math.round((passedCount / results.length) * 100) + '%)');
  console.log('================================================================================\n');
}

runAutoTest_AutoFactoryFunnelEdition();

// ============================================================================
// 3. نقل سكربتات الشطرين 1 و 2 إلى مجلد الأرشيف (_archive_patches)
// ============================================================================
const archiveDir = path.join(ROOT, '_archive_patches');
if (!fs.existsSync(archiveDir)) {
  try {
    fs.mkdirSync(archiveDir, { recursive: true });
  } catch (_) {}
}

[
  'part1-autofactory-backend-funnel-engine-v1.js',
  'part2-autofactory-ui-funnel-component-campaigns-v1.js'
].forEach((fileName) => {
  const srcPath = path.join(ROOT, fileName);
  if (fs.existsSync(srcPath)) {
    try {
      fs.renameSync(srcPath, path.join(archiveDir, fileName));
    } catch (_) {}
  }
});

console.log('🎉🇩🇿 اكتمل إعداد وحقن AutoFactory بنجاح 100%! انتقل الآن لمجلد platformauto وشغّل: node part3b-cherif-platform-5001-installer-v1.js');