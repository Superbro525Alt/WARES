"use client";

import { useState } from "react";
import { submitContact } from "@/app/contact/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/db/schema.zod";
import { z } from "zod";

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Email us anytime: sales@warobotics.education
      </p>
      <form
        className="mt-8 grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("message", values.message);
          const result = await submitContact(formData);
          if (!result.ok) {
            setStatus(result.error ?? "Unable to send.");
          } else {
            setStatus("Message sent! We will reply soon.");
            form.reset();
          }
        })}
      >
        <Input {...form.register("name")} placeholder="Name" />
        <Input {...form.register("email")} type="email" placeholder="Email" />
        <Textarea
          {...form.register("message")}
          placeholder="How can we help?"
          className="min-h-[160px]"
        />
        <Button type="submit">Send message</Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </form>
    </div>
  );
}
