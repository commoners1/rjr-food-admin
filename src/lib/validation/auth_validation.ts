import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const createNewUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(1, 'Password is required')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{5,})/,
      'The password must be a minimum of 6 characters and must consist of uppercase letters, lowercase letters and numbers.',
    ),
  roleId: z.string().min(1, "Role is required"),
  divisionId: z.string().min(1, "Division is required"),
  jobPosition: z.string().min(1, "Job position is required"),
  avatar: z.string().optional(),
  birthday: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateNewUserSchema = z.infer<typeof createNewUserSchema>;
