"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourses, CourseScope } from "@/services/client/courseService";
import { Course } from "@/types/course";

export function useCourses(scope: CourseScope = "public") {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCourses(scope);
      setCourses(data);
      return data;
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "โหลดหลักสูตรไม่สำเร็จ";
      setError(message);
      throw reason;
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    let active = true;
    getCourses(scope)
      .then((data) => {
        if (active) setCourses(data);
      })
      .catch((reason) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : "โหลดหลักสูตรไม่สำเร็จ"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [scope]);

  return { courses, loading, error, reload };
}
