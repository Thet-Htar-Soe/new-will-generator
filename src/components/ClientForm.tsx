import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

const familyMemberSchema = z.object({
  id: z.number(),
  name: z.string().nonempty("Name is required"),
  relationship: z.string().nonempty("Relationship is required"),
  assets: z.number().optional(),
});

const formSchema = z.object({
  asset_one: z.number().nonnegative("Must be non-negative"),
  asset_two: z.number().nonnegative("Must be non-negative"),
  asset_three: z.number().nonnegative("Must be non-negative"),
  family_mem: z.array(familyMemberSchema),
});

export type FormData = z.infer<typeof formSchema>;

export default function ClientForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const idCounter = useRef(1);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_one: 0,
      asset_two: 0,
      asset_three: 0,
      family_mem: [{ id: 1, name: "", relationship: "", assets: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "family_mem",
  });

  const handleAdd = () => {
    idCounter.current += 1;
    append({ id: idCounter.current, name: "", relationship: "", assets: undefined });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white space-y-6 p-6 border rounded-md shadow-md max-w-xl mx-auto"
    >
      <div>
        <h3 className="font-semibold text-lg mb-2">Assets</h3>
        <label className="block text-sm mb-1 text-neutral-500">Asset One</label>
        <input type="number" {...register("asset_one", { valueAsNumber: true })} className="border p-2 w-full mb-2" />
        <p className="text-red-500 text-sm">{errors.asset_one?.message}</p>

        <label className="block text-sm mb-1 text-neutral-500">Asset Two</label>
        <input type="number" {...register("asset_two", { valueAsNumber: true })} className="border p-2 w-full mb-2" />
        <p className="text-red-500 text-sm">{errors.asset_two?.message}</p>

        <label className="block text-sm mb-1 text-neutral-500">Asset Three</label>
        <input type="number" {...register("asset_three", { valueAsNumber: true })} className="border p-2 w-full" />
        <p className="text-red-500 text-sm">{errors.asset_three?.message}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Family Members</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 mb-4 rounded-md relative bg-blue-200 text-black">
            <p className="font-medium mb-2">Person {index + 1}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input {...register(`family_mem.${index}.name`)} className="border p-2 w-full" />
                <p className="text-red-500 text-sm">{errors.family_mem?.[index]?.name?.message}</p>
              </div>
              <div>
                <label className="block text-sm mb-1">Relationship</label>
                <input {...register(`family_mem.${index}.relationship`)} className="border p-2 w-full" />
                <p className="text-red-500 text-sm">{errors.family_mem?.[index]?.relationship?.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-white cursor-pointer"
            >
              ✖
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAdd} className="bg-black text-white px-3 py-1 rounded cursor-pointer">
          + Add Family Member
        </button>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </div>
    </form>
  );
}
