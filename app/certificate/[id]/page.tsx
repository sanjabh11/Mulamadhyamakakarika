import CertificateContent from "./CertificateContent";

export function generateStaticParams() {
  return Array.from({ length: 27 }, (_, i) => ({
    id: String(i + 1),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificatePage({ params }: PageProps) {
  const { id } = await params;
  return <CertificateContent id={id} />;
}
