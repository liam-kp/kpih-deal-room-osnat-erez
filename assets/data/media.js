/* ============================================================
   MEDIA DATABASE  —  Deal Room: Osnat & Erez
   ------------------------------------------------------------
   Single source of truth for all imagery/video.
   Paths are relative to index.html. Slugs are fixed; do NOT rename
   or reorder: srithanu, nai-wok, red-sunset, koma.

   Item shape:  { type, src, tag, alt }  ; video adds { poster, desc }
   tags: drone | exterior | pool | interior | sunset | floorplan | aerial
   ============================================================ */

window.MEDIA = {

  // full-screen opener — clean Koh Phangan cove (no annotations)
  hero: {
    type: "image",
    src:  "images/hero/hero.jpg",
    alt:  "מפרץ פרטי בקופנגן — מים טורקיז וחוף לבן"
  },

  projects: [
    {
      slug: "srithanu",
      cover: { type: "image", src: "images/srithanu/cover.jpg", alt: "וילת Srithanu גמורה ומרוהטת" },
      gallery: [
        { type: "image", src: "images/srithanu/01.jpg", tag: "interior", alt: "חדר שינה מרוהט עם נוף לירוק" },
        { type: "image", src: "images/srithanu/02.jpg", tag: "interior", alt: "חדר רחצה — שיש וריהוט עץ" },
        { type: "image", src: "images/srithanu/03.jpg", tag: "interior", alt: "פינת ארונות ומגורים" },
        { type: "video", src: "videos/srithanu/1.mp4", poster: "images/srithanu/1-poster.jpg", tag: "exterior", desc: "סיור בנכס ובשכונה השקטה" },
        { type: "image", src: "images/srithanu/04.jpg", tag: "floorplan", alt: "תוכנית הוילה" }
      ]
    },
    {
      slug: "nai-wok",
      cover: { type: "image", src: "images/nai-wok/cover.jpg", alt: "Nai Wok — תצלום אווירי של המתחם" },
      gallery: [
        { type: "video", src: "videos/nai-wok/1.mp4", poster: "images/nai-wok/1-poster.jpg", tag: "drone",    desc: "טיסת רחפן מעל המתחם אל קו האופק" },
        { type: "video", src: "videos/nai-wok/2.mp4", poster: "images/nai-wok/2-poster.jpg", tag: "aerial",   desc: "מעבר אווירי מעל הגגות אל הים" },
        { type: "video", src: "videos/nai-wok/3.mp4", poster: "images/nai-wok/3-poster.jpg", tag: "interior", desc: "סיור פנים — דלתות זכוכית לדק ולבריכה" },
        { type: "video", src: "videos/nai-wok/4.mp4", poster: "images/nai-wok/4-poster.jpg", tag: "exterior", desc: "חזית הוילה ודק עץ עם נוף לים" },
        { type: "video", src: "videos/nai-wok/5.mp4", poster: "images/nai-wok/5-poster.jpg", tag: "interior", desc: "פנים הוילה וחדר הרחצה" },
        { type: "video", src: "videos/nai-wok/6.mp4", poster: "images/nai-wok/6-poster.jpg", tag: "exterior", desc: "חזית הוילה ומסגור הפנים" }
      ]
    },
    {
      slug: "red-sunset",
      cover: { type: "image", src: "images/red-sunset/cover.jpg", alt: "Red Sunset — הדמיית וילת חוף עם בריכה" },
      gallery: [
        { type: "image", src: "images/red-sunset/01.jpg", tag: "drone",    alt: "תצלום רחפן אמיתי של מתחם החוף" },
        { type: "image", src: "images/red-sunset/02.jpg", tag: "aerial",   alt: "שעת הזהב — קו החוף וגבולות המגרש" },
        { type: "image", src: "images/red-sunset/03.jpg", tag: "exterior", alt: "הדמיה — הוילה במבט מהחוף" },
        { type: "image", src: "images/red-sunset/04.jpg", tag: "pool",     alt: "הדמיה — בריכה ומדשאות" },
        { type: "image", src: "images/red-sunset/05.jpg", tag: "pool",     alt: "הדמיה — אזור בריכה ומטריות" },
        { type: "image", src: "images/red-sunset/06.jpg", tag: "exterior", alt: "הדמיה — מרפסת עם נוף לים" },
        { type: "image", src: "images/red-sunset/07.jpg", tag: "interior", alt: "הדמיה — פינת אוכל עם נוף לים" },
        { type: "image", src: "images/red-sunset/08.jpg", tag: "exterior", alt: "הדמיה — הוילה בלילה" },
        { type: "video", src: "videos/red-sunset/1.mp4", poster: "images/red-sunset/1-poster.jpg", tag: "sunset", desc: "שקיעה אמיתית על חוף הפרויקט" }
      ]
    },
    {
      slug: "koma",
      cover: { type: "image", src: "images/koma/cover.jpg", alt: "Koma — מצוק, חוף ודקלים ממעוף הרחפן" },
      gallery: [
        { type: "image", src: "images/koma/01.jpg", tag: "drone",     alt: "מבט אווירי על המפרץ והחוף" },
        { type: "image", src: "images/koma/02.jpg", tag: "drone",     alt: "פנורמת המפרץ ממעוף הרחפן" },
        { type: "image", src: "images/koma/03.jpg", tag: "aerial",    alt: "המצוק והמפרץ — מבט רחב" },
        { type: "image", src: "images/koma/04.jpg", tag: "aerial",    alt: "קצה המצוק הסלעי והחוף" },
        { type: "image", src: "images/koma/05.jpg", tag: "aerial",    alt: "גבולות המגרש — מבט אווירי" },
        { type: "image", src: "images/koma/06.jpg", tag: "floorplan", alt: "מפת חלוקת מגרש 6" },
        { type: "image", src: "images/koma/07.jpg", tag: "floorplan", alt: "תוכנית וילה — טיפוס A" },
        { type: "video", src: "videos/koma/1.mp4", poster: "images/koma/1-poster.jpg", tag: "interior", desc: "הריזורט הקיים של אמיר בהאאד סאלאד — הוכחת ביצוע" },
        { type: "video", src: "videos/koma/2.mp4", poster: "images/koma/2-poster.jpg", tag: "exterior", desc: "מועדון החוף של אמיר — הוכחת ביצוע" },
        { type: "video", src: "videos/koma/3.mp4", poster: "images/koma/3-poster.jpg", tag: "exterior", desc: "קו החוף של אמיר — הוכחת ביצוע" }
      ]
    }
  ]
};
