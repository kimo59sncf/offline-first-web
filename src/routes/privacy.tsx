import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Règles de confidentialité — CoranProFree" },
      { name: "description", content: "Règles de confidentialité de CoranProFree : aucune donnée personnelle collectée, tout reste sur votre appareil." },
      { property: "og:title", content: "Règles de confidentialité — CoranProFree" },
      { property: "og:description", content: "CoranProFree ne collecte aucune donnée personnelle." },
    ],
  }),
  component: PrivacyPage,
});

const content = {
  fr: {
    title: "Règles de confidentialité",
    updated: "Dernière mise à jour : 11 octobre 2026",
    sections: [
      {
        h: "Résumé",
        p: "CoranProFree est une application de lecture et d'écoute du Coran. Elle ne collecte, n'utilise et ne partage aucune donnée personnelle. Aucun compte n'est requis, aucune information n'est envoyée à nos serveurs à des fins d'identification ou de suivi.",
      },
      {
        h: "Données stockées sur votre appareil",
        p: "Vos préférences (langue, récitateur, taille du texte), vos favoris, votre progression de lecture et vos téléchargements audio sont enregistrés uniquement dans le stockage local de votre appareil. Ces données ne quittent jamais votre appareil et ne sont accessibles à personne d'autre. Vous pouvez les effacer à tout moment depuis Réglages → « Effacer mes données locales », ou en désinstallant l'application.",
      },
      {
        h: "Connexion Internet",
        p: "L'application contacte uniquement des serveurs de contenu pour afficher le texte du Coran, ses traductions et diffuser l'audio des récitations : l'API Islamic Network (api.alquran.cloud) et les serveurs audio officiels associés, ainsi que le relais audio de l'application hébergé sur coran-pro-setup.lovable.app. Ces requêtes transmettent uniquement les informations techniques nécessaires (adresse IP, comme toute connexion Internet) et ne contiennent aucune donnée personnelle vous concernant.",
      },
      {
        h: "Données sensibles et partage avec des tiers",
        p: "L'application n'accède à aucune donnée sensible (contacts, localisation, photos, microphone, identifiants publicitaires). Elle ne contient ni publicité, ni outil d'analyse ou de suivi. Aucune donnée n'est vendue, louée ou partagée avec des tiers, quels qu'ils soient.",
      },
      {
        h: "Enfants",
        p: "L'application convient à tous les âges. Ne collectant aucune donnée, elle ne collecte pas sciemment d'informations auprès d'enfants.",
      },
      {
        h: "Permissions",
        p: "Android : uniquement l'accès à Internet, nécessaire au téléchargement et à l'écoute de l'audio. iOS : aucune permission particulière.",
      },
      {
        h: "Modifications",
        p: "Toute évolution de ces règles sera publiée sur cette page, avec une date de mise à jour.",
      },
      {
        h: "Contact",
        p: "Pour toute question sur ces règles de confidentialité, contactez-nous via la page du développeur sur le Google Play Store ou l'App Store.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: October 11, 2026",
    sections: [
      {
        h: "Summary",
        p: "CoranProFree is a Quran reading and listening app. It does not collect, use or share any personal data. No account is required and no information is sent to our servers for identification or tracking purposes.",
      },
      {
        h: "Data stored on your device",
        p: "Your preferences (language, reciter, text size), favorites, reading progress and audio downloads are stored only in your device's local storage. This data never leaves your device and is not accessible to anyone else. You can erase it at any time from Settings → “Clear my local data”, or by uninstalling the app.",
      },
      {
        h: "Internet connection",
        p: "The app only contacts content servers to display the Quran text, its translations and stream recitation audio: the Islamic Network API (api.alquran.cloud) and the associated official audio servers, plus the app's audio relay hosted at coran-pro-setup.lovable.app. These requests carry only the technical information required for any Internet connection (such as your IP address) and contain no personal data about you.",
      },
      {
        h: "Sensitive data and third-party sharing",
        p: "The app accesses no sensitive data (contacts, location, photos, microphone, advertising identifiers). It contains no advertising and no analytics or tracking tools. No data is sold, rented or shared with any third party.",
      },
      {
        h: "Children",
        p: "The app is suitable for all ages. Since it collects no data, it does not knowingly collect information from children.",
      },
      {
        h: "Permissions",
        p: "Android: Internet access only, required to download and play audio. iOS: no special permissions.",
      },
      {
        h: "Changes",
        p: "Any changes to this policy will be published on this page with an updated date.",
      },
      {
        h: "Contact",
        p: "For any question about this privacy policy, contact us through the developer page on the Google Play Store or the App Store.",
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: ١١ أكتوبر ٢٠٢٦",
    sections: [
      {
        h: "ملخص",
        p: "تطبيق CoranProFree لتلاوة القرآن الكريم واستماعه. لا يجمع التطبيق أي بيانات شخصية ولا يستخدمها ولا يشاركها. لا حاجة لأي حساب، ولا تُرسل أي معلومات إلى خوادمنا لأغراض التعريف أو التتبع.",
      },
      {
        h: "البيانات المخزنة على جهازك",
        p: "تُحفظ تفضيلاتك (اللغة، القارئ، حجم الخط) ومفضلاتك وتقدمك في القراءة وتنزيلاتك الصوتية في التخزين المحلي لجهازك فقط. لا تغادر هذه البيانات جهازك أبدًا ولا يصل إليها أي شخص آخر. يمكنك مسحها في أي وقت من الإعدادات ← «مسح بياناتي المحلية» أو بإلغاء تثبيت التطبيق.",
      },
      {
        h: "الاتصال بالإنترنت",
        p: "يتصل التطبيق فقط بخوادم المحتوى لعرض نص القرآن وترجماته وبث التلاوات الصوتية: واجهة Islamic Network (api.alquran.cloud) وخوادم الصوت الرسمية المرتبطة بها، إضافة إلى خادم ترحيل الصوت الخاص بالتطبيق على coran-pro-setup.lovable.app. لا تنقل هذه الطلبات سوى المعلومات التقنية اللازمة لأي اتصال بالإنترنت (مثل عنوان IP) ولا تتضمن أي بيانات شخصية عنك.",
      },
      {
        h: "البيانات الحساسة والمشاركة مع الغير",
        p: "لا يصل التطبيق إلى أي بيانات حساسة (جهات الاتصال، الموقع، الصور، الميكروفون، معرّفات الإعلانات). لا يحتوي على إعلانات ولا على أدوات تحليل أو تتبع. لا تُباع أي بيانات ولا تُؤجَّر ولا تُشارك مع أي طرف ثالث.",
      },
      {
        h: "الأطفال",
        p: "التطبيق مناسب لجميع الأعمار. وبما أنه لا يجمع أي بيانات، فهو لا يجمع عن قصد أي معلومات من الأطفال.",
      },
      {
        h: "الأذونات",
        p: "أندرويد: الوصول إلى الإنترنت فقط، اللازم لتنزيل الصوت وتشغيله. iOS: لا أذونات خاصة.",
      },
      {
        h: "التعديلات",
        p: "سيُنشر أي تعديل على هذه السياسة في هذه الصفحة مع تاريخ محدَّث.",
      },
      {
        h: "الاتصال",
        p: "لأي سؤال حول سياسة الخصوصية هذه، تواصل معنا عبر صفحة المطوّر على Google Play أو App Store.",
      },
    ],
  },
} as const;

function PrivacyPage() {
  const { lang } = useT();
  const c = content[lang];
  return (
    <div>
      <PageHeader title={c.title} />
      <div className="space-y-4 px-5">
        <p className="text-sm text-muted-foreground">{c.updated}</p>
        {c.sections.map((s) => (
          <section key={s.h} className="rounded-2xl border bg-card p-4">
            <h2 className="mb-2 text-lg font-semibold">{s.h}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
