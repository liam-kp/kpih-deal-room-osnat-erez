/* ============================================================
   MEDIA DATABASE  —  Deal Room: Osnat & Erez   (v2 — KPR-213)
   ------------------------------------------------------------
   Per-project media is split into THREE groups, rendered as
   labeled sub-sections inside each chapter body:
       photos[]    → "תמונות"   (GALLERY)
       videos[]    → "וידאו"    (VIDEO)      [shown only if any]
       floorplan[] → "תוכנית"   (FLOOR PLAN) [shown only if any]
   The lightbox scopes to the group that was opened.

   Item shapes:
     photo  : { type:"image", src, tag, alt, feature?:true }
     video  : { type:"video", src, poster, tag, desc }
     plan   : { type:"image", src, alt }
   Per-project actions (rendered as buttons):
     location : { url, label }
     brochure : { url, label }   (red-sunset only)
     ref      : { url, label }   (koma only)
   Paths are relative to index.html. Slugs are fixed.
   ============================================================ */

window.MEDIA = {

  hero: { type: "image", src: "images/hero/hero.jpg", alt: "מפרץ פרטי בקופנגן — מים טורקיז וחוף לבן" },

  projects: [
    {
      slug: "srithanu",
      cover: { type: "image", src: "images/srithanu/cover.jpg", alt: "וילת Srithanu — חזית גמורה" },
      galleryNote: 'כולל תמונות מווילה מקבילה זהה במתחם, שכבר מאוכלסת ומרוהטת.*',
      galleryNoteFootnote: '* חבילת הריהוט בווילה השכנה שונה ונבחרה טיילור-מייד.',
      photos: [
        { type: "image", src: "images/srithanu/01.jpg", tag: "exterior", alt: "וילות גמורות בשכונה השקטה" },
        { type: "image", src: "images/srithanu/02.jpg", tag: "exterior", alt: "שביל גישה ונוף לדקלים" },
        { type: "image", src: "images/srithanu/03.jpg", tag: "exterior", alt: "חזית הוילה ודקל" },
        { type: "image", src: "images/srithanu/04.jpg", tag: "exterior", alt: "מרפסת ומדרגות הכניסה" },
        { type: "image", src: "images/srithanu/05.jpg", tag: "exterior", alt: "הוילה והחצר" },
        { type: "image", src: "images/srithanu/06.jpg", tag: "pool",     alt: "בריכה פרטית בשעת ערב — וילה מקבילה זהה במתחם" },
        { type: "image", src: "images/srithanu/07.jpg", tag: "pool",     alt: "מבט מהסלון אל הבריכה — וילה מקבילה במתחם" },
        { type: "image", src: "images/srithanu/08.jpg", tag: "interior", alt: "סלון מרוהט ומואר — וילה מקבילה במתחם" },
        { type: "image", src: "images/srithanu/09.jpg", tag: "interior", alt: "פינת מגורים מעוצבת — וילה מקבילה במתחם" },
        { type: "image", src: "images/srithanu/10.jpg", tag: "interior", alt: "חדר שינה עם יציאה לגינה — וילה מקבילה במתחם" },
        { type: "image", src: "images/srithanu/11.jpg", tag: "interior", alt: "חדר שינה — וילה מקבילה במתחם" },
        { type: "image", src: "images/srithanu/12.jpg", tag: "interior", alt: "חדר רחצה עם כיורים כפולים — וילה מקבילה במתחם" }
      ],
      videos: [
        { type: "video", src: "videos/srithanu/1.mp4", poster: "images/srithanu/1-poster.jpg", tag: "exterior", desc: "סיור בנכס ובשכונה השקטה" }
      ],
      floorplan: [
        { type: "image", src: "images/srithanu/fp1.jpg", alt: "תוכנית הוילה" },
        { type: "image", src: "images/srithanu/fp2.jpg", alt: "תוכנית המגרש — Plot 2 (יחידות 2.1 / 2.2)" }
      ],
      location: { url: "https://maps.app.goo.gl/5wLhUyRYD1WfWPK87", label: "מיקום במפה" },
      instagram: { url: "https://www.instagram.com/zenbeachkohphangan/", place: "Zen Beach" }
    },
    {
      slug: "nai-wok",
      cover: { type: "image", src: "images/nai-wok/cover.jpg", alt: "Nai Wok — תצלום אווירי של המתחם" },
      photos: [
        { type: "image", src: "images/nai-wok/01.jpg", tag: "interior", alt: "סלון מרוהט" },
        { type: "image", src: "images/nai-wok/02.jpg", tag: "aerial",   alt: "נוף אווירי לים ולאי" },
        { type: "image", src: "images/nai-wok/03.jpg", tag: "interior", alt: "חדר רחצה עם אמבטיה" },
        { type: "image", src: "images/nai-wok/04.jpg", tag: "interior", alt: "מטבח ופינת אוכל" },
        { type: "image", src: "images/nai-wok/05.jpg", tag: "interior", alt: "חדר שינה" },
        { type: "image", src: "images/nai-wok/06.jpg", tag: "interior", alt: "חדר רחצה" },
        { type: "image", src: "images/nai-wok/07.jpg", tag: "pool",     alt: "בריכה ודק עץ" },
        { type: "image", src: "images/nai-wok/08.jpg", tag: "pool",     alt: "דק הבריכה" },
        { type: "image", src: "images/nai-wok/09.jpg", tag: "pool",     alt: "אזור הבריכה" },
        { type: "image", src: "images/nai-wok/10.jpg", tag: "pool",     alt: "בריכה ודק" }
      ],
      videos: [
        { type: "video", src: "videos/nai-wok/1.mp4", poster: "images/nai-wok/1-poster.jpg", tag: "drone",    desc: "טיסת רחפן מעל המתחם אל קו האופק" },
        { type: "video", src: "videos/nai-wok/2.mp4", poster: "images/nai-wok/2-poster.jpg", tag: "aerial",   desc: "מעבר אווירי מעל הגגות אל הים" },
        { type: "video", src: "videos/nai-wok/3.mp4", poster: "images/nai-wok/3-poster.jpg", tag: "interior", desc: "סיור פנים — דלתות זכוכית לדק ולבריכה" },
        { type: "video", src: "videos/nai-wok/4.mp4", poster: "images/nai-wok/4-poster.jpg", tag: "exterior", desc: "חזית הוילה ודק עץ עם נוף לים" },
        { type: "video", src: "videos/nai-wok/5.mp4", poster: "images/nai-wok/5-poster.jpg", tag: "interior", desc: "פנים הוילה וחדר הרחצה" },
        { type: "video", src: "videos/nai-wok/6.mp4", poster: "images/nai-wok/6-poster.jpg", tag: "exterior", desc: "חזית הוילה ומסגור הפנים" }
      ],
      floorplan: [ { type: "image", src: "images/nai-wok/fp-layout.jpg", alt: "תוכנית המתחם — 7 וילות" } ],
      villaPlans: {
        "2": [ { type: "image", src: "images/nai-wok/fp-v2.jpg", alt: "תוכנית וילה 2" } ],
        "3": [ { type: "image", src: "images/nai-wok/fp-v3.jpg", alt: "תוכנית וילה 3" } ]
      },
      location: { url: "https://maps.google.com/?q=9.722080,99.981956", label: "מיקום במפה" },
      instagram: { url: "https://www.instagram.com/bluerama_official/", place: "Blue Rama" }
    },
    {
      slug: "villa-anne",
      cover: { type: "image", src: "images/villa-anne/cover.jpg", alt: "Villa Anne — וילה מודרנית עם בריכה פרטית ונוף ים ישיר" },
      photos: [
        { type: "image", src: "images/villa-anne/01.jpg", tag: "pool",     alt: "בריכת אינפיניטי מול אופק הים — טרסה עם תקרת במבוק" },
        { type: "image", src: "images/villa-anne/02.jpg", tag: "interior", alt: "סלון בוהו־שיק עם דלתות זכוכית לבריכה ולנוף הים" },
        { type: "image", src: "images/villa-anne/03.jpg", tag: "interior", alt: "חדר שינה מאסטר עם יציאה ישירה לבריכה ונוף ים" },
        { type: "image", src: "images/villa-anne/04.jpg", tag: "interior", alt: "פינת אוכל עגולה עם נוף ים פתוח ומנורת רוטנג" },
        { type: "image", src: "images/villa-anne/05.jpg", tag: "interior", alt: "סלון פתוח עם מטבח מעץ טיק ברקע" },
        { type: "image", src: "images/villa-anne/06.jpg", tag: "interior", alt: "מטבח פתוח — ארונות עץ טיק ואי מרכזי" },
        { type: "image", src: "images/villa-anne/07.jpg", tag: "interior", alt: "פינת ישיבה בסלון עם ספה מינימליסטית ואמנות קיר" },
        { type: "image", src: "images/villa-anne/08.jpg", tag: "interior", alt: "חדר רחצה עם מראה עגולה מוארת וצמחייה טרופית" },
        { type: "image", src: "images/villa-anne/09.jpg", tag: "pool",     alt: "נוף בריכה נוסף — פרספקטיבה רחבה של הבריכה והים" },
        { type: "image", src: "images/villa-anne/10.jpg", tag: "interior", alt: "חדר שינה שלישי — עיצוב מקרמה, אווירה רכה ומוארת" }
      ],
      videos: [],
      floorplan: [],
      location: { url: "https://maps.app.goo.gl/tDj7XxZpes5qUxdXA", label: "מיקום במפה" },
      instagram: { url: "https://www.instagram.com/tomorrowxhighlifevillas/", place: "Tomorrow X" },
      ref: { url: "https://www.airbnb.com/l/7zo6XMkh", label: "Airbnb · Superhost 5⭐" }
    },
    {
      slug: "red-sunset",
      cover: { type: "image", src: "images/red-sunset/cover.jpg", alt: "Red Sunset — הדמיית חזית הוילה" },
      photos: [
        { type: "image", src: "images/red-sunset/feature1.jpg", tag: "aerial",   alt: "תצלום אווירי — מיקום שלוש הווילות על החוף", feature: true },
        { type: "image", src: "images/red-sunset/09.jpg", tag: "exterior", alt: "הדמיה — הוילה והבריכה" },
        { type: "image", src: "images/red-sunset/10.jpg", tag: "exterior", alt: "הדמיה — הכניסה והחניה" },
        { type: "image", src: "images/red-sunset/03.jpg", tag: "exterior", alt: "הדמיה — מבט מהחוף" },
        { type: "image", src: "images/red-sunset/04.jpg", tag: "pool",     alt: "הדמיה — בריכה" },
        { type: "image", src: "images/red-sunset/05.jpg", tag: "pool",     alt: "הדמיה — אזור בריכה ומטריות" },
        { type: "image", src: "images/red-sunset/06.jpg", tag: "exterior", alt: "הדמיה — מרפסת עם נוף לים" },
        { type: "image", src: "images/red-sunset/07.jpg", tag: "interior", alt: "הדמיה — פינת אוכל עם נוף לים" },
        { type: "image", src: "images/red-sunset/08.jpg", tag: "exterior", alt: "הדמיה — הוילה בלילה" },
        { type: "image", src: "images/red-sunset/01.jpg", tag: "drone",    alt: "תצלום רחפן אמיתי של המתחם" },
        { type: "image", src: "images/red-sunset/02.jpg", tag: "aerial",   alt: "שעת הזהב — קו החוף" }
      ],
      videos: [
        { type: "video", src: "videos/red-sunset/1.mp4", poster: "images/red-sunset/1-poster.jpg", tag: "exterior", desc: "שמי ערב בגוונים חמים על חוף הפרויקט" },
        { type: "video", src: "videos/red-sunset/2.mp4", poster: "images/red-sunset/2-poster.jpg", tag: "exterior", desc: "מבט מהמגרש — צמחייה טרופית, אדמה ונוף פתוח לים ולאי" },
        { type: "video", src: "videos/red-sunset/3.mp4", poster: "images/red-sunset/3-poster.jpg", tag: "exterior", desc: "החוף מול הפרויקט — חוף חולי, סלעים ומים רגועים" }
      ],
      floorplan: [],
      villaPlans: {
        "1": [ { type: "image", src: "images/red-sunset/fp1.jpg", alt: "תוכנית Villa 1 — Beachfront Signature" } ],
        "2": [ { type: "image", src: "images/red-sunset/fp2.jpg", alt: "תוכנית Villa 2 — Elevated Sea View" } ],
        "3": [ { type: "image", src: "images/red-sunset/fp3.jpg", alt: "תוכנית Villa 3 — Grand Family Duplex (קומת קרקע)" },
               { type: "image", src: "images/red-sunset/fp4.jpg", alt: "תוכנית Villa 3 — קומה עליונה" } ]
      },
      location: { url: "https://maps.app.goo.gl/wukt9KP7e4JA348t8", label: "מיקום במפה" },
      instagram: { url: "https://www.instagram.com/concierge_kohphangan/", place: "Concierge Koh Phangan" },
      brochure: { url: "images/red-sunset/brochure.pdf", label: "ברושור (PDF)" }
    },
    {
      slug: "koma",
      cover: { type: "image", src: "images/koma/cover.jpg", alt: "Koh Ma — מצוק, חוף ודקלים ממעוף הרחפן" },
      photos: [
        { type: "image", src: "images/koma/02.jpg", tag: "drone",  alt: "פנורמת המפרץ ממעוף הרחפן" },
        { type: "image", src: "images/koma/03.jpg", tag: "aerial", alt: "המצוק והמפרץ — מבט רחב" },
        { type: "image", src: "images/koma/04.jpg", tag: "aerial", alt: "קצה המצוק הסלעי והחוף" },
        { type: "image", src: "images/koma/05.jpg", tag: "aerial", alt: "גבולות המגרש — מבט אווירי" }
      ],
      videos: [
        { type: "video", src: "videos/koma/1.mp4", poster: "images/koma/1-poster.jpg", tag: "interior", desc: "הריזורט הקיים של היזם בהאאד סאלאד — הוכחת ביצוע" },
        { type: "video", src: "videos/koma/2.mp4", poster: "images/koma/2-poster.jpg", tag: "exterior", desc: "מועדון החוף של היזם — הוכחת ביצוע" },
        { type: "video", src: "videos/koma/3.mp4", poster: "images/koma/3-poster.jpg", tag: "exterior", desc: "קו החוף של היזם — הוכחת ביצוע" }
      ],
      floorplan: [
        { type: "image", src: "images/koma/06.jpg", alt: "מפת חלוקת מגרש 6" },
        { type: "image", src: "images/koma/07.jpg", alt: "תוכנית וילה — טיפוס A" }
      ],
      location: { url: "https://maps.app.goo.gl/qCApzgbSm42qAMQm7?g_st=iw", label: "מיקום במפה" },
      instagram: { url: "https://www.instagram.com/praya_venera/", place: "Praya Venera" },
      ref: { url: "https://www.airbnb.com/rooms/1475878179553704138", label: "הריזורט שהיזם בנה באי — Haad Salad" }
    }
  ]
};
