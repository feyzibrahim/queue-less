"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";

export default function AnalyticsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-2">Analytics</h1>
				<p className="text-muted-foreground">
					Track your restaurant performance and customer insights
				</p>
			</div>

			{/* Coming Soon Notice */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="w-5 h-5" />
						Analytics Dashboard
					</CardTitle>
					<CardDescription>
						Comprehensive insights into your restaurant operations
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-12">
						<BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							Analytics Coming Soon
						</h3>
						<p className="text-muted-foreground mb-4">
							We&apos;re working on comprehensive analytics to help you
							understand your queue performance, customer patterns, and
							operational efficiency.
						</p>
						<Badge variant="secondary">In Development</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Preview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Avg Wait Time
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">-</div>
						<p className="text-xs text-muted-foreground">Coming soon</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">-</div>
						<p className="text-xs text-muted-foreground">Coming soon</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Customer Satisfaction
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">-</div>
						<p className="text-xs text-muted-foreground">Coming soon</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Queue Efficiency
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">-</div>
						<p className="text-xs text-muted-foreground">Coming soon</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
