interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeading({ eyebrow, title, description, action }: PageHeadingProps) {
  return (
    <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title mt-2 max-w-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

