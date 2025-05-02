"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SignUpFormValues {
  name: string
  email: string
  password: string
  terms: boolean
}

interface SignUpFormProps {
  onSuccess: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      // Here you would implement your actual signup logic
      console.log("Signup data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess()
    } catch (err) {
      setError("An error occurred during sign up. Please try again.")
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

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          className="h-10"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-10"
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
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="h-10"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>
      {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

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
