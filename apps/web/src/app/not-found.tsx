import Link from "next/link";

import { EmptyState } from "@/components/data-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <EmptyState title="Page not found" description="The CatalogFlow page you requested does not exist." action={<Button asChild><Link href="/dashboard">Return to dashboard</Link></Button>} />
    </div>
  );
}

