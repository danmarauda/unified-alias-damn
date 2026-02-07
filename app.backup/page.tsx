import { redirect } from "next/navigation";

/**
 * Root page redirects to observability dashboard
 */
export default function HomePage() {
  redirect("/observability");
}
