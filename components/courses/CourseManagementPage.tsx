"use client";

import CourseForm from "./CourseForm";
import CourseGrid from "./CourseGrid";
import PageHeader from "@/components/shared/PageHeader";
import {
  ManagementScope,
  useCourseManagement,
} from "@/hooks/useCourseManagement";

type Props = {
  scope: ManagementScope;
  title: string;
  description: string;
  allowCreate?: boolean;
};

export default function CourseManagementPage({
  scope,
  title,
  description,
  allowCreate = false,
}: Props) {
  const manager = useCourseManagement(scope);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title={title}
          description={description}
          actionLabel={allowCreate ? "+ เพิ่มหลักสูตร" : undefined}
          onAction={allowCreate ? manager.startCreate : undefined}
        />

        {manager.showForm && (
          <CourseForm
            form={manager.form}
            categories={manager.categories}
            loading={manager.loading}
            uploading={manager.uploading}
            editing={Boolean(manager.editingId)}
            onChange={manager.setForm}
            onSubmit={manager.handleSubmit}
            onCancel={manager.resetForm}
            onUpload={manager.handleUpload}
          />
        )}

        <CourseGrid
          courses={manager.courses}
          role={scope}
          onEdit={manager.startEdit}
          onDelete={manager.handleDelete}
        />
      </div>
    </main>
  );
}
