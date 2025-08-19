"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();


  const onLogout = () => {
    logout();
    router.push("/");
  };

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
        {isAuthenticated && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>{user?.id}님</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onLogout}>로그아웃</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!isAuthenticated && (
          <Button asChild variant="blue">
            <Link href="/login">로그인 / 회원가입</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
