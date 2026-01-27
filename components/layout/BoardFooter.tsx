"use client";

import { forwardRef } from "react";

const BoardFooter = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t">
      <div
        ref={ref}
        className="w-full overflow-x-auto overflow-y-hidden"
        style={{ height: 16 }}
      />
    </div>
  );
});

BoardFooter.displayName = "BoardFooter";

export default BoardFooter;
