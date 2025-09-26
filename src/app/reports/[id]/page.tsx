import CrsPage from "@/app/reports/[id]/CrsPage";
import { getSessionUser } from "@/util/auth";
import SsrPage from "@/app/reports/[id]/SsrPage";

type props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: props) {
  const { id } = await params;
  const isAuthenticated = !!(await getSessionUser());

  return isAuthenticated ? <SsrPage token={id}  /> : <CrsPage id={id} />;
}
