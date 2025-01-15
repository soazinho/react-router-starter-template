
import type { Route } from "./+types/home";
import { z } from "zod";
import { data, useFetcher } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "react-router-starter-template" },
    { name: "description", content: "react-router-starter-template to quickly build production-ready applications." },
  ];
}
 
const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must have at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
  email: z
    .string()
    .email("Invalid email.")
    .min(2, {
      message: "Email must have at least 2 characters.",
    }),
  content: z
    .string()
    .min(10, {
      message: "Message must have at least 2 characters.",
    })
    .max(250, {
      message: "Message must not exceed 50 characters.",
    }),
})
 
export default function Home() {
  let fetcher = useFetcher();
  let busy = fetcher.state !== "idle";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Using fetch to do a POST request without navigating
    // See react-router docs
    fetcher.submit(
      { name: data.name, email: data.email, content: data.content },
      { method: "post", encType: "application/x-www-form-urlencoded" },
    );

    toast({
      title: "Email has been sent",
      description: "Thank you.",
    })
  }
 
  return (
    <div className="flex flex-col h-screen">
      <span className="font-semibold text-5xl m-16">hezino.</span>
      <div className="flex flex-col justify-evenly grow items-center md:flex-row">
        <div className="w-3/4 md:w-1/4">
          <span className="font-bold text-4xl md:text-6xl tracking-normal leading-tight">
            Let's create a <span className="underline underline-offset-8 decoration-indigo-500">production-ready application.</span>
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 md:w-1/3 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Sylvie Brown" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="sylvie@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How can I help you?"
                      className="h-64 max-h-128 md:h-48"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {busy ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export async function action({
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const content = String(formData.get("content"));

  const errors: any = {};

  if (name.length < 2) {
    errors.name =
      "Name must have at least 2 characters.";
  }

  if (!email.includes("@")) {
    errors.email = "Invalid email.";
  }

  if (content.length < 12) {
    errors.content =
      "Content must have at least 12 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  // You could redirect to another page when form submission is successful
  // return redirect("/dashboard");
}
