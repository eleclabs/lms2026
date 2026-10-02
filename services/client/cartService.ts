import { CartItem } from "@/types/cart";
import { Course } from "@/types/course";

const CART_KEY = "lms2026-cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function isCourseInCart(courseId: string) {
  return getCartItems().some((item) => item.courseId === courseId);
}

export function addCourseToCart(course: Course) {
  const items = getCartItems();
  if (items.some((item) => item.courseId === course._id)) return items;

  const teacher =
    typeof course.teacher === "object" ? course.teacher?.name : undefined;
  const nextItems = [
    ...items,
    {
      courseId: course._id,
      title: course.title,
      price: course.price || 0,
      thumbnail: course.thumbnail,
      teacher,
    },
  ];
  saveCart(nextItems);
  return nextItems;
}

export function removeCourseFromCart(courseId: string) {
  const nextItems = getCartItems().filter((item) => item.courseId !== courseId);
  saveCart(nextItems);
  return nextItems;
}

export function removeCoursesFromCart(courseIds: string[]) {
  const purchased = new Set(courseIds);
  const nextItems = getCartItems().filter(
    (item) => !purchased.has(item.courseId)
  );
  saveCart(nextItems);
  return nextItems;
}
