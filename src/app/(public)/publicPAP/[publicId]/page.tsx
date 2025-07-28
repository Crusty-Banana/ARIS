import PublicPAPView from "./_components/public-pap-view"

interface PublicPAPPageProps {
  params: {
    publicId: string
  }
}

export default function PublicPAPPage({ params }: PublicPAPPageProps) {
  return <PublicPAPView publicId={params.publicId} />
}