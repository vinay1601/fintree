"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


export default function UserMetaCard({userName,type}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSave = () => {
    console.log("Saving changes...");
    setIsOpen(false);
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Profile + Social Links */}
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            {/* Avatar */}
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/assets/images/user.png"
                alt="user"
              />
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {/* Musharof Chowdhury */}{userName}
              </h4>
            </div>


          </div>

              <div>
               {/* Button to open document popup */}
          <div className="flex items-center mt-2 lg:col-span-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Document</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{type}</DialogTitle>
                </DialogHeader>

                {/* Skeleton placeholder */}
                <Skeleton className="w-full h-80 rounded-lg" />
                
                {/* If you want to show actual dummy image after loading: */}
                {/* <img
                  src={dummyImage}
                  alt="GST Certificate"
                  className="w-full h-auto rounded-lg"
                /> */}
              </DialogContent>
            </Dialog>
          </div>
            </div>

       
        </div>
      </div>

    </>
  );
}
