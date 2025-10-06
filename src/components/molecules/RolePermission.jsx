export async function generateStaticParams() {
  const res = await fetch("https://your-api.com/roles");
  const roles = await res.json();
  return roles.map((r) => ({ id: r.id.toString() }));
}
