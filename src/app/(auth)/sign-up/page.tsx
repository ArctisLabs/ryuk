"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SignupUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  typeOfUser: z.enum(["brand-admin", "customer"]),
  upiId: z.string().optional(),
  companyId: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof SignupUserSchema>;

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupUserSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      typeOfUser: "customer",
      upiId: "",
      companyId: "",
      email: "",
      password: "",
    },
  });

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/chat",
      });
    } catch (error) {
      console.error("Google signin error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setLoading(true);
    try {
      await signIn("github", {
        callbackUrl: "/generate-test",
      });
    } catch (error) {
      console.error("GitHub signin error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to sign in with GitHub. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Signup successful, but auto-login failed",
        });
        router.push("/sign-in");
      } else {
        router.push("/chat");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[55%] flex items-center justify-center  ml-52 mt-28">
      <Card className=" bg-black/60 text-white border border-gray-800/50 shadow-2xl backdrop-blur-xl rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/kuiper.png"
              width={100}
              height={100}
              alt="Kuiper logo"
              className="mb-4"
            />
            <h2 className="text-3xl font-semibold">Sign Up</h2>
            <span className="text-sm text-gray-400 mt-1">
              Enter your information to create an account
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
              type="button"
              onClick={handleGithub}
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
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Snow"
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
                    <FormLabel className="text-white text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
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
              > SignUp </Button>
            </form>
          </Form>

          <div className="text-sm text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <Link
              className="font-semibold text-blue-400 hover:text-blue-300"
              href="/sign-in"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
