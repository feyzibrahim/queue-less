"use client";
import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Clock, CheckCircle, XCircle, Phone } from "lucide-react";

type QueueEntry = {
	id: string;
	customerName: string;
	phoneNumber: string;
	customerSize: number;
	status: string;
	position: number;
	createdAt: string;
};

export default function DashboardPage() {
	const [queue, setQueue] = useState<QueueEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadQueue = async () => {
		setLoading(true);
		const res = await fetch("/api/queue/list");
		const data = await res.json();
		if (!res.ok) {
			setError(data.message || "Could not load queue");
			setLoading(false);
			return;
		}
		setQueue(data.entries ?? []);
		setLoading(false);
	};

	const action = async (id: string, act: "notified" | "seated" | "cancelled") => {
		try {
			const res = await fetch(`/api/queue/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: act }),
			});
			if (res.ok) {
				// Reload queue after action
				await loadQueue();
			} else {
				setError("Failed to update queue entry");
			}
		} catch (err) {
			setError("Network error occurred");
		}
	};

	useEffect(() => {
		let canceled = false;

		const init = async () => {
			if (canceled) return;
			await loadQueue();
		};

		void init();

		return () => {
			canceled = true;
		};
	}, []);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "waiting":
				return <Badge variant="secondary">Waiting</Badge>;
			case "notified":
				return (
					<Badge variant="outline" className="text-blue-600 border-blue-600">
						Notified
					</Badge>
				);
			case "seated":
				return (
					<Badge variant="default" className="bg-green-600">
						Seated
					</Badge>
				);
			case "cancelled":
				return <Badge variant="destructive">Cancelled</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const stats = {
		total: queue.length,
		waiting: queue.filter((q) => q.status === "waiting").length,
		notified: queue.filter((q) => q.status === "notified").length,
		seated: queue.filter((q) => q.status === "seated").length,
	};

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total in Queue
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.total}</div>
						<p className="text-xs text-muted-foreground">
							Active queue entries
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Waiting</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.waiting}</div>
						<p className="text-xs text-muted-foreground">Customers waiting</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Notified</CardTitle>
						<Phone className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.notified}</div>
						<p className="text-xs text-muted-foreground">Tables called</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Seated</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.seated}</div>
						<p className="text-xs text-muted-foreground">
							Today&apos;s total
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Queue Table */}
			<Card>
				<CardHeader>
					<CardTitle>Current Queue</CardTitle>
					<CardDescription>
						Manage your restaurant queue in real-time
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading && (
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex space-x-4">
									<Skeleton className="h-4 w-8" />
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-24" />
									<div className="flex space-x-2">
										<Skeleton className="h-8 w-16" />
										<Skeleton className="h-8 w-16" />
										<Skeleton className="h-8 w-16" />
									</div>
								</div>
							))}
						</div>
					)}

					{error && (
						<Alert variant="destructive">
							<XCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{!loading && !queue.length && (
						<div className="text-center py-12">
							<Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium text-muted-foreground mb-2">
								No customers in queue
							</h3>
							<p className="text-sm text-muted-foreground">
								Customers will appear here when they join via WhatsApp
							</p>
						</div>
					)}

					{queue.length > 0 && (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-16">Pos</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead className="w-20">Customers</TableHead>
										<TableHead className="w-24">Status</TableHead>
										<TableHead>Joined</TableHead>
										<TableHead className="w-48">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{queue.map((entry) => (
										<TableRow key={entry.id}>
											<TableCell className="font-medium">
												{entry.position}
											</TableCell>
											<TableCell>{entry.customerName}</TableCell>
											<TableCell className="font-mono text-sm">
												{entry.phoneNumber}
											</TableCell>
											<TableCell>{entry.customerSize}</TableCell>
											<TableCell>
												{getStatusBadge(entry.status)}
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{new Date(
													entry.createdAt,
												).toLocaleTimeString()}
											</TableCell>
											<TableCell>
												<div className="flex space-x-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															void action(
																entry.id,
																"notified",
															)
														}
														disabled={
															entry.status !== "waiting"
														}
													>
														Notify
													</Button>
													<Button
														size="sm"
														onClick={() =>
															void action(
																entry.id,
																"seated",
															)
														}
														disabled={
															entry.status === "seated" ||
															entry.status === "cancelled"
														}
													>
														Seat
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() =>
															void action(
																entry.id,
																"cancelled",
															)
														}
														disabled={
															entry.status === "seated" ||
															entry.status === "cancelled"
														}
													>
														Cancel
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
