import { useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import posthog from "posthog-js";
import { supabase } from "@/lib/supabase";

const POSTHOG_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

/**
 * Email capture for new posts. `location` labels where the form was submitted
 * from, for PostHog breakdowns.
 */
export default function EmailSubscribe({ location }: { location: string }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setError("");
    setSubmitting(true);

    if (POSTHOG_CONFIGURED) {
      posthog.capture("subscribe_attempted", { location });
    }

    if (!supabase) {
      setSubmitting(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    const { error: dbError } = await supabase
      .from("personal_emails")
      .insert({ email });

    setSubmitting(false);

    if (dbError) {
      // 23505 = unique violation: already subscribed, treat as success.
      if (dbError.code === "23505") {
        if (POSTHOG_CONFIGURED) {
          posthog.capture("subscribe_duplicate", { location });
        }
        setSubscribed(true);
      } else {
        if (POSTHOG_CONFIGURED) {
          posthog.capture("subscribe_failed", {
            location,
            error_code: dbError.code,
          });
        }
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    if (POSTHOG_CONFIGURED) {
      posthog.capture("subscribed", { location });
    }
    setSubscribed(true);
  };

  return (
    <section className="mt-16 border-t pt-8">
      <h2 className="text-base font-medium text-foreground">
        Get new posts by email
      </h2>

      {subscribed ? (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="size-4 shrink-0 text-foreground" />
          You&rsquo;re on the list.
        </p>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className="mt-5 flex items-center gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            aria-label="Email address"
            className="w-56 border-0 border-b border-foreground/25 bg-transparent px-0 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 pb-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground disabled:opacity-50"
          >
            {submitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </section>
  );
}
