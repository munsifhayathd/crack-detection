"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare, PanelLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Contact us</CardTitle>
            <CardDescription>
              Questions about uploads, processing, or results? Send us a message
              and our team will get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <Alert>
                <MessageSquare />
                <AlertTitle>Message received</AlertTitle>
                <AlertDescription>
                  Thanks for reaching out. We&apos;ll respond to your inquiry
                  soon.
                </AlertDescription>
              </Alert>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="How can we help?"
                    className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </div>
                <Button type="submit">Send message</Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Support
              </CardTitle>
              <CardDescription>
                Reach the CrackDetect team directly for product and technical
                support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                <a
                  href="mailto:support@crackdetect.example"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  support@crackdetect.example
                </a>
              </p>
              <p className="text-muted-foreground">
                Typical response time: 1–2 business days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PanelLeft className="size-4 text-primary" />
                Sidebar navigation
              </CardTitle>
              <CardDescription>
                The Contact tab in the sidebar links directly to this page from
                anywhere in the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  Back to Dashboard
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
