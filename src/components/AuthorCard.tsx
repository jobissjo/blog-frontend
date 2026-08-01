import React from "react";
import { UserDetails } from "@/types/blog";
import { ExternalLink, User } from "lucide-react";

interface AuthorCardProps {
  userDetails?: UserDetails;
  authorName?: string;
}

export function AuthorCard({ userDetails, authorName }: AuthorCardProps) {
  const name = userDetails?.firstName
    ? `${userDetails.firstName}${userDetails.lastName ? ` ${userDetails.lastName}` : ""}`
    : authorName || "Jobi";
  
  const role = userDetails?.role || "Software Engineer & Writer";
  const portfolioLink = userDetails?.profile?.portfolio_link;
  const avatarImage = userDetails?.profile?.image;

  return (
    <div className="my-12 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:border-primary/40">
      <div className="relative shrink-0">
        {avatarImage ? (
          <img
            src={avatarImage}
            alt={name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xl shadow-inner">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Written by
            </span>
            <h4 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
              {name}
            </h4>
          </div>

          {portfolioLink && (
            <a
              href={portfolioLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors self-center sm:self-auto"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <p className="mt-1 text-xs text-muted-foreground font-medium">
          {role}
        </p>

        <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
          Sharing technical insights, engineering concepts, and practical modern software development guides.
        </p>
      </div>
    </div>
  );
}
