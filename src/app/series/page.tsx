import SeriesListClient from "./SeriesListClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Series — JoTechBlog",
  description:
    "Comprehensive guides and tutorials organized by topic on JoTechBlog.",
  alternates: {
    canonical: "/series",
  },
};

export default function SeriesPage() {
  return <SeriesListClient />;
}
