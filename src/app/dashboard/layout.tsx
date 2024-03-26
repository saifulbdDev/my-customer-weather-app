"use client"; // FIXME: testing purpose only, remove this line

import { PropsWithChildren, useEffect } from "react";
import Header from "../../components/Header";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header />

       {children}
        
    </main>
  );
}
