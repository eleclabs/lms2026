export async function getCategories() {
  const res = await fetch("/api/admin/categories", {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return [];
  }

  return Array.isArray(data) ? data : [];
}