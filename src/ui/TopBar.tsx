"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <div className="flex h-[64px] items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-[24px] font-bold tracking-tight">gStats</span>
          </Link>
        </div>

        <NavigationMenu className="ml-[120px]">
          <NavigationMenuList className="flex gap-2 text-[15px] font-medium">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/reports">리포트</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/reports">리포트</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-6">
        <Button variant="blue">로그인 / 회원가입</Button>
      </div>
    </div>
  );
}
