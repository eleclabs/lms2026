
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/services/core/httpService";

import {
  Category,
  CategoryForm,
} from "@/types/category";

export function getCategories() {
  return apiGet<Category[]>("/api/categories");
}

export function createCategory(form: CategoryForm) {
  return apiPost<Category>("/api/admin/categories", form);
}

export function updateCategory(
  categoryId: string,
  form: CategoryForm
) {
  return apiPatch<Category>(
    `/api/admin/categories/${categoryId}`,
    form
  );
}

export function deleteCategory(categoryId: string) {
  return apiDelete<{ message: string }>(
    `/api/admin/categories/${categoryId}`
  );
}