import PublicPAPView from "./_components/public-pap-view"

interface PublicPAPPageProps {
  params: Promise<{
    publicId: string
  }>
}

export default async function PublicPAPPage({ params }: PublicPAPPageProps) {
  const { publicId } = await params;
  return <PublicPAPView publicId={publicId} />
}