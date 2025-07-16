import { redirect } from "next/navigation"
import RecuperarForm from "./recuperarForm"

export default async function RecuperarPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token

  if (!token) {
    redirect("/404")
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/recuperacion/validar/?token=${token}`,
    {
      headers: { accept: "application/json" },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    redirect("/404")
  }

  return <RecuperarForm token={token} />
}
