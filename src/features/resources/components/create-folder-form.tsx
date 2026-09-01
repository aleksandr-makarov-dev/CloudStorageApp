import { useForm, type SubmitHandler } from "react-hook-form";
import { createFolderInputSchema, type CreateFolderRequest } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";

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
  const form = useForm<CreateFolderRequest>({
    resolver: zodResolver(createFolderInputSchema),
    defaultValues: defaultValues,
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
        label="Name"
        render={({ field }) => <Input {...field} />}
      />
    </form>
  );
}
