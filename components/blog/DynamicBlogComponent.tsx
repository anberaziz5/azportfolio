"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export function DynamicBlogComponent({ componentName }: { componentName: string }) {
  // We use useMemo to ensure the dynamic import is only created once per componentName,
  // preventing React from unmounting and remounting it on every render.
  const Component = useMemo(
    () =>
      dynamic(
        () =>
          import(`@/components/blog/${componentName}`).catch((err) => {
            console.error(`Dynamic component "${componentName}" failed to load.`, err);
            return () => (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 p-4 text-center rounded-xl">
                <span className="font-bold">Component Error</span>
                <span className="text-sm">Could not find components/blog/{componentName}.tsx</span>
              </div>
            );
          }),
        { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-muted/20" /> }
      ),
    [componentName]
  );

  return <Component />;
}
