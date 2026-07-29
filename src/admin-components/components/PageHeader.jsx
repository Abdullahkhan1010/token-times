import React from "react";

export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-stack-lg flex flex-col gap-4 justify-between border-b border-outline-variant pb-stack-md md:flex-row md:items-end">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary">{title}</h2>
        {subtitle && <p className="font-body-md text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-4 items-center md:justify-end">{children}</div>}
    </header>
  );
}
