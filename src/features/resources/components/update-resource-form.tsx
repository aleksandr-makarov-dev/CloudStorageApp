import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  type UpdateResourceRequest,
  updateResourceInputSchema,
} from "../types";
import { Field } from "@/shared/ui/field";
import Input from "@/shared/ui/input";

type UpdateResourceFormProps = {
  formId: string;
  defaultValues: UpdateResourceRequest;
  onSubmit: SubmitHandler<UpdateResourceRequest>;
};

export function UpdateResourceForm({
  formId,
  defaultValues,
  onSubmit,
}: UpdateResourceFormProps) {
  const { t } = useTranslation("resources");

  const form = useForm<UpdateResourceRequest>({
    resolver: zodResolver(updateResourceInputSchema),
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
        label={t("UpdateResourceForm.Name")}
        render={({ field }) => <Input {...field} />}
      />
    </form>
  );
}
