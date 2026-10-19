import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/os/CaseStudy";
import { WORKS, workBySlug } from "@/components/os/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const work = workBySlug((await params).slug);
  return {
    title: work ? `${work.title} — Bits AI Lab` : "Work — Bits AI Lab",
    description: work?.result,
    robots: { index: false, follow: false },
  };
}

export default async function CaseStudyRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!workBySlug(slug)) notFound();
  return <CaseStudy slug={slug} />;
}
