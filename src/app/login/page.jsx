"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import tenants from "@/config/tenants.json";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/atoms/LoginForm"), {
  ssr: false,
});

export default function TenantLogin() {
const params = useParams();
  const tenant = params?.login;

   useEffect(() => {
    if (tenant) {
      localStorage.setItem("themecode", tenant);
    }
  }, [tenant]);

  const brand = tenants.find((b) => b.id === tenant) || tenants[0];

  return (
    <div className={`flex w-full min-h-screen1 text-neutral-dark ${brand.font}`}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 h-screen">
        <div
          className={`relative hidden md:flex items-center justify-center bg-gradient-to-br ${brand.gradient}`}
        >
          <Image
            src="/assets/images/fintree/loan2.png"
            alt="Login illustration"
            width={500}
            height={400}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <div className="flex flex-col p-3 justify-center mt-12 md:mt-0 md:justify-center items-center w-full h-full bg-white">
          <div className="w-full max-w-md px-6 md:px-10 py-6 rounded-2xl shadow-xl border border-neutral-gray/20">
            <Image
              src="/assets/images/fintree/logo.png"
              alt={`${brand.name} Logo`}
              width={240}
              height={100}
              priority
              className="mx-auto mb-4"
            />
            <h1
              className="text-2xl font-bold text-center mb-2"
              style={{ color: brand.primaryColor }}
            >
              Sign in to {brand.name}
            </h1>
            <p className="text-center text-neutral-gray mb-2 text-sm">
              Enter your credentials to access your dashboard
            </p>
            <LoginForm tenant={tenant} />
            <p className="text-xs text-center text-neutral-gray mt-1">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
