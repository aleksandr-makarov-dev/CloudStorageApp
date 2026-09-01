import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { createFolderInputSchema, type CreateFolderRequest } from "../types";

type CreateFolderFormProps = {
  formId: string;
  defaultValues: CreateFolderRequest;
  onSubmit: SubmitHandler<CreateFolderRequest>;
};

export function CreateFolderForm({
  formId,
  defaultValues,
  onSubmit,
}: CreateFolderFormProps) {
  const { t } = useTranslation("resources");

  const form = useForm<CreateFolderRequest>({
    resolver: zodResolver(createFolderInputSchema),
    defaultValues,
  });

  return (
    <form
      id={formId}
      className="space-y-3"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Field
        control={form.control}
        name="name"
        label={t("CreateFolderForm.Name")}
        render={({ field }) => <Input {...field} />}
      />
    </form>
  );
}
