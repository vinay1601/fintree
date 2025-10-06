"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// -------------------- Schemas --------------------
const passwordLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

const otpLoginSchema = z.object({
  mobile: z.string()
    .min(10, { message: "Mobile number must be 10 digits" })
    .max(10, { message: "Mobile number must be 10 digits" })
    .regex(/^[0-9]+$/, { message: "Mobile number must contain only digits" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

// -------------------- Demo Credentials --------------------
// const DEMO_USERS = {
//   password: {
//     admin: { email: "admin@example.com", password: "password", role: "admin", redirect: "/dashboard" },
//     FI: { email: "fi@example.com", password: "password", role: "FI", redirect: "/dashboard/field_investigation" },
//     Credit: { email: "credit@example.com", password: "password", role: "credit", redirect: "/dashboard/credit" },
//     Risk: { email: "risk@example.com", password: "password", role: "risk assessment", redirect: "/dashboard/riskassessment " },
//   },
//   otp: {
//     admin: { mobile: "9999999999", otp: "123456", role: "admin", redirect: "/dashboard" },
//     FI: { mobile: "8888888888", otp: "654321", role: "FI", redirect: "/dashboard/field_investigation" },
//     Credit: { mobile: "7777777777", otp: "654321", role: "credit", redirect: "/dashboard/credit" },
//     Risk: { mobile: "6666666666", otp: "654321", role: "risk assessment", redirect: "/dashboard/riskassessment" },
//   },
// };

// -------------------- Component --------------------
const LoginForm = ({tenant}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [tab, setTab] = useState("password");
  const [showOtpField, setShowOtpField] = useState(false);
  const [submittedMobile, setSubmittedMobile] = useState("");
    useEffect(() => {
      const user = sessionStorage.getItem("userId");
      if (user) router.replace("/dashboard");
    }, [router]);

  // -------------------- Forms --------------------
  const passwordForm = useForm({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpLoginSchema),
    defaultValues: { mobile: "", otp: "" },
  });

  // -------------------- Helpers --------------------
  // const loginSuccess = (role, redirect) => {
  //   Cookies.set("token", "demo_token", { expires: 1 });
  //   Cookies.set("role", role, { expires: 1 });
  //   toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
  //   router.push(redirect);
  // };

  // -------------------- Handlers --------------------
  const handlePasswordLogin = async ({ email, password }) => {
  // try {
  //   const res = await fetch("/api/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //     credentials: "include", // keeps cookies if you want them
  //   });

  //   if (!res.ok) {
  //     const { error } = await res.json();
  //     toast.error(error || "Invalid credentials");
  //     return;
  //   }

  //   const data = await res.json();

  //   // ✅ Store in localStorage
  //   localStorage.setItem("userId", data.userId);
  //   localStorage.setItem("role", data.role);
  //   localStorage.setItem("accessToken", data.accessToken);
  //   localStorage.setItem("refreshToken", data.refreshToken);

  //   toast.success("Login successful!");
  //   router.push(`/${tenant}/dashboard`);
  // } catch (err) {
  //   toast.error("Something went wrong");
  // }

 const  username = email;
   try {
    const res = await fetch(`http://72.60.103.194:8000/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // if FastAPI sets cookies
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Invalid credentials");
      return;
    }

    const data = await res.json();
    // console.log("sadsd",data)
    // console.log("sadsd",data.user.company_id)

    // ✅ Save tokens in localStorage
    sessionStorage.setItem("userId", data.user.id);
    sessionStorage.setItem("role", data.user.user_type);
    sessionStorage.setItem("accessToken", data.access_token);
    sessionStorage.setItem("refreshToken", data.refresh_token);
    sessionStorage.setItem("companyId", data.user.company_id);

    toast.success("Login successful!");
    router.push(`/dashboard`);
  } catch (err) {
    toast.error("Something went wrong");
  }

};


const handleOtpLogin = async ({ mobile, otp }) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Invalid OTP");
      return;
    }

    const data = await res.json();
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("role", data.role);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // CookieStore.set("accessToken", data.accessToken)
    // CookieStore.set("refreshToken", data.refreshToken)

    toast.success("Login successful!");
    router.push(`/${tenant}/dashboard`);
  } catch (err) {
    toast.error("Something went wrong2");
  }
};


const sendOtp = async () => {
  const mobile = otpForm.getValues("mobile");

  // Validate mobile
  if (!/^\d{10}$/.test(mobile)) {
    toast.error("Enter a valid 10-digit mobile number");
    return;
  }

  try {
    // Call API to "send OTP" (in your dummy backend this is just for demo)
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, requestOtp: true }), // optional, for demo
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "This mobile number is not registered");
      return;
    }

    const data = await res.json();

    // Show OTP demo message (you can remove in production)
    toast.success(`OTP sent to ${mobile} (demo: check backend dummy users)`);

    setShowOtpField(false);
    setSubmittedMobile("");
    setTimeout(() => {
      setSubmittedMobile(mobile);
      setShowOtpField(true);
    }, 2000);
  } catch (err) {
    toast.error("Something went wrong while sending OTP");
  }
};

  return (
    <div className="flex justify-center w-full p-2">
      <Card className="w-full max-w-md shadow-md border">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>
            </div>

            {/* Password Login */}
            <TabsContent value="password">
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordLogin)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* OTP Login */}
            <TabsContent value="otp">
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(handleOtpLogin)}
                  className="space-y-4"
                >
                  {!submittedMobile && (
                    <FormField
                      control={otpForm.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter 10-digit mobile number" maxLength={10} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {submittedMobile && (
                    <p className="text-sm text-center text-gray-600">
                      OTP sent to <span className="font-semibold">{submittedMobile}</span>
                    </p>
                  )}

                  {!submittedMobile && (
                    <Button type="button" className="w-full" onClick={sendOtp}>
                      Send OTP
                    </Button>
                  )}

                  {showOtpField && (
                    <>
                      <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OTP</FormLabel>
                            <FormControl>
                              <Input placeholder="123456" maxLength={6} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
                        {otpForm.formState.isSubmitting ? "Verifying..." : "Login with OTP"}
                      </Button>
                    </>
                  )}
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
