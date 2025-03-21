
import { z } from "zod";

export const MAX_FILE_SIZE = 5000000; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const donationSchema = z.object({
  batchName: z.string().min(2, {
    message: "Batch name must be at least 2 characters.",
  }),
  itemCategory: z.string({
    required_error: "Please select a category.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  estimatedValue: z.coerce.number().min(0, {
    message: "Value must be a positive number.",
  }),
  storageLocation: z.string().min(2, {
    message: "Storage location is required.",
  }),
  storageArea: z.coerce.number().min(0, {
    message: "Storage area must be a positive number.",
  }),
  storageType: z.string().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  taxEntityName: z.string().min(2, {
    message: "Tax entity name is required for tax benefits.",
  }).optional(),
  taxId: z.string().optional(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;
