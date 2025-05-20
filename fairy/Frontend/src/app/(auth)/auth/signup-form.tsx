"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SignUpFormValues {
  first_name: string
  last_name: string
  email: string
  password: string
  terms: boolean
  student_id: string
  degree: string
  gender: "male" | "female" | "other"
  study_year: number
  is_pg: boolean
  is_intl: boolean
}

interface SignUpFormProps {
  onSuccess: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      terms: false,
      student_id: "",
      degree: "",
      gender: "other",
      study_year: 1,
      is_pg: false,
      is_intl: false,
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            student_id: data.student_id,
            degree: data.degree,
            gender: data.gender,
            study_year: data.study_year,
            is_pg: data.is_pg,
            is_intl: data.is_intl,
          },
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Signup failed")

      setSuccessMessage("Check your email for the confirmation link.")
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default" className="mb-4 bg-green-100 border border-green-400 text-green-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          type="text"
          placeholder="John"
          {...register("first_name", {
            required: "First name is required",
          })}
        />
        {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          type="text"
          placeholder="Doe"
          {...register("last_name", {
            required: "Last name is required",
          })}
        />
        {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="student_id">Student ID</Label>
        <Input
          id="student_id"
          type="text"
          placeholder="e.g. z1234567"
          {...register("student_id", { required: "Student ID is required" })}
        />
        {errors.student_id && <p className="text-xs text-red-500">{errors.student_id.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          type="text"
          placeholder="Computer Science"
          {...register("degree", { required: "Degree is required" })}
        />
        {errors.degree && <p className="text-xs text-red-500">{errors.degree.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <select
          id="gender"
          className="w-full h-10 border rounded px-2"
          {...register("gender", { required: "Gender is required" })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="study_year">Year of Study</Label>
        <Input
          id="study_year"
          type="number"
          {...register("study_year", {
            required: "Study year is required",
            min: { value: 1, message: "Minimum is 1" },
          })}
        />
        {errors.study_year && <p className="text-xs text-red-500">{errors.study_year.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" id="is_pg" {...register("is_pg")} />
        <Label htmlFor="is_pg">Postgraduate student</Label>
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" id="is_intl" {...register("is_intl")} />
        <Label htmlFor="is_intl">International student</Label>
      </div>

      <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-slate-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="h-10">
          Google
        </Button>
        <Button variant="outline" type="button" className="h-10">
          GitHub
        </Button>
      </div>
    </form>
  )
}
