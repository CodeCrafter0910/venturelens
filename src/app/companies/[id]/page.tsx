import { mockCompanies } from "@/lib/mockCompanies"
import { notFound } from "next/navigation"
import CompanyProfileClient from "../../../components/CompanyProfileClient"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function CompanyPage({ params }: Props) {
  const { id } = await params

  const company = mockCompanies.find(
    (c) => c.id === id
  )

  if (!company) {
    return notFound()
  }

  return <CompanyProfileClient company={company} />
}