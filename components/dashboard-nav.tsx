"use client";

import { Link, usePathname } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Pill, LayoutDashboard, Map, Package, User, LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import type { User as DbUser } from "@/drizzle/schema";

export function DashboardNav({ user }: { user: DbUser }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isPatient = user.role === "patient";
  const isDelivery = user.role === "delivery";

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Pill className="h-7 w-7 text-primary" aria-hidden />
          <span className="font-bold">MediFast</span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} size="sm">
              <LayoutDashboard className="ml-1 h-4 w-4" />
              {t("dashboard")}
            </Button>
          </Link>
          {isPatient && (
            <>
              <Link href="/dashboard/requests">
                <Button variant={pathname === "/dashboard/requests" ? "secondary" : "ghost"} size="sm">
                  <Package className="ml-1 h-4 w-4" />
                  {t("requests")}
                </Button>
              </Link>
              <Link href="/dashboard/request">
                <Button variant={pathname === "/dashboard/request" ? "secondary" : "ghost"} size="sm">
                  <Package className="ml-1 h-4 w-4" />
                  {t("requestMedicine")}
                </Button>
              </Link>
              <Link href="/dashboard/map">
                <Button variant={pathname === "/dashboard/map" ? "secondary" : "ghost"} size="sm">
                  <Map className="ml-1 h-4 w-4" />
                  {t("map")}
                </Button>
              </Link>
            </>
          )}
          {isDelivery && (
            <Link href="/dashboard/jobs">
              <Button variant={pathname === "/dashboard/jobs" ? "secondary" : "ghost"} size="sm">
                <Package className="ml-1 h-4 w-4" />
                {t("jobs")}
              </Button>
            </Link>
          )}
          <Link href="/dashboard/profile">
            <Button variant={pathname === "/dashboard/profile" ? "secondary" : "ghost"} size="sm">
              <User className="ml-1 h-4 w-4" />
              {t("profile")}
            </Button>
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" aria-label={t("logout")}>
              <LogOut className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
