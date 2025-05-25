"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./login-form"
import { SignUpForm } from "./signup-form"
import { Button } from "@/components/ui/button" // Assuming you're using shadcn/ui
import { Card, CardContent } from "@/components/ui/card"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login")
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="w-full max-m-wd">
          <CardContent>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">RecruitMe</h1>
              <p className="text-muted-foreground">Sign in to continue to your account</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-sm">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" asChild>
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm onSuccess={() => {}} />
                </motion.div>
              </TabsContent>

              <TabsContent value="signup" asChild>
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignUpForm onSuccess={() => {}} />
                </motion.div>
              </TabsContent>
            </Tabs>
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => router.push("/")}>
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
