import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gallery",
  robots: { index: false },
};

/** Legacy admin route — Designs replaces Gallery. */
export default async function AdminGalleryRedirectPage() {
  redirect("/admin/designs");
}
