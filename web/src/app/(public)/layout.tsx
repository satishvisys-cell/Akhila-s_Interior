import { PublicShell } from "@/components/layout/public-shell";
import { getSiteSettings } from "@/lib/cms/public";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const social = settings?.socialContact;

  return (
    <PublicShell
      floatingSocial={{
        enabled: social?.floatingEnabled ?? true,
        whatsappE164: social?.whatsappE164,
        whatsappMessage: social?.whatsappMessage,
        instagramUrl:
          social?.instagramUrl ||
          settings?.socialLinks?.instagram ||
          "https://instagram.com/akhilainteriors",
      }}
    >
      {children}
    </PublicShell>
  );
}
