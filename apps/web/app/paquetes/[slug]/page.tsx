import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackage, allPackageSlugs } from "@/lib/packages";
import { PackageDetail } from "@/components/packages/package-detail";

export function generateStaticParams() {
  return allPackageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Paquete no encontrado" };
  return {
    title: `${pkg.name} — Paquete de viaje`,
    description: pkg.tagline,
  };
}

export default async function PaquetePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();
  return <PackageDetail pkg={pkg} />;
}
