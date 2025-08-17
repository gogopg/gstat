
type requestBody = {
  id: string;
  password: string
}

export async function POST(request: Request) {
  const body: requestBody = await request.json().catch(() => ({}));
  console.log(body)
}