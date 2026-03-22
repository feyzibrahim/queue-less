"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart3, Clock, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Queue",
		url: "/dashboard/queue",
		icon: Users,
	},
	{
		title: "Analytics",
		url: "/dashboard/analytics",
		icon: BarChart3,
	},
	{
		title: "Settings",
		url: "/dashboard/settings",
		icon: Settings,
	},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = () => {
		// Clear auth data
		document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		localStorage.removeItem("auth_token");

		// Redirect to login
		router.push("/login");
	};

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full">
				<Sidebar>
					<SidebarHeader className="border-b p-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<Clock className="w-5 h-5 text-white" />
							</div>
							<span className="text-lg font-bold">Queue Less</span>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton isActive={pathname === item.url}>
										<Link
											href={item.url}
											className="flex items-center gap-2 w-full"
										>
											<item.icon className="w-4 h-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarContent>

					<SidebarFooter className="border-t p-4">
						<div className="flex items-center justify-between gap-3 w-full">
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<Avatar className="w-9 h-9 shrink-0">
									<AvatarImage src="" />
									<AvatarFallback>ST</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">Staff</p>
									<p className="text-xs text-muted-foreground truncate">
										staff@restaurant.com
									</p>
								</div>
							</div>
							<Tooltip>
								<TooltipTrigger
									className="h-9 w-9 shrink-0"
									onClick={handleLogout}
								>
									<LogOut className="h-4 w-4" />
									<span className="sr-only">Logout</span>
								</TooltipTrigger>
								<TooltipContent side="top">Logout</TooltipContent>
							</Tooltip>
						</div>
					</SidebarFooter>
				</Sidebar>

				<main className="flex-1 flex flex-col">
					<header className="border-b bg-white px-6 py-4 flex items-center">
						<SidebarTrigger className="mr-4" />
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-slate-900">
								{menuItems.find((item) => item.url === pathname)?.title ||
									"Dashboard"}
							</h1>
						</div>
					</header>

					<div className="flex-1 p-6 bg-slate-50">{children}</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
