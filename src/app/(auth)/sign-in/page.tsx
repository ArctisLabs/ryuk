"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/chat",
      });

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Google signin error:", error);
      toast.error("Unable to sigin with google")
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setLoading(true);
    try {
      const result = await signIn("github", {
        redirect: false,
        callbackUrl: "/chat",
      });

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("GitHub signin error:", error);
      toast.error("Unable to singin with github")
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Invalid creds")
      } else {
        router.push("/chat");
      }
    } catch (error) {
      toast.error("An error occurred during sign in")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[55%] flex items-center justify-center ml-52">
      <Card className="bg-black/60 text-white border border-gray-800/50 shadow-2xl backdrop-blur-xl rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/kuiper.png"
              width={100}
              height={100}
              alt="Kuiper logo"
              className="mb-4"
            />
            <h2 className="text-3xl font-semibold">Welcome</h2>
            <span className="text-sm text-gray-400 mt-1">
              Enter your email and password to sign in!
            </span>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full bg-black border border-gray-700/50 text-white hover:bg-gray-700/80"
              onClick={handleGoogle}
              type="button"
              disabled={loading}
            >
              <Image
                src="/google.svg"
                width={20}
                height={20}
                alt="google logo"
                className="mr-2"
              />
              Continue with Google
            </Button>

            <Button
              className="w-full bg-black border border-gray-700/50 text-white hover:bg-gray-700/80"
              onClick={handleGithub}
              type="button"
              disabled={loading}
            >
              <Github className="mr-2" />
              Continue with Github
            </Button>
          </div>

          <div className="my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-800"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-800"></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="email"
                        disabled={loading}
                        className="bg-black border-gray-700/50 text-white backdrop-blur-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        disabled={loading}
                        className="bg-black border-gray-700/50 text-white backdrop-blur-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                disabled={loading}
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-sm text-gray-400 mt-6 text-center">
            Not registered yet?{" "}
            <Link
              className="font-semibold text-blue-400 hover:text-blue-300"
              href="/sign-up"
            >
              Create an Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;