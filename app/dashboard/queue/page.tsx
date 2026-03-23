"use client";
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
import { Users, Clock, CheckCircle, XCircle, History, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { LogsModal } from "@/components/logs-modal";
import { ManualEntryModal } from "@/components/manual-entry-modal";

interface QueueEntry {
	id: string;
	customerName: string;
	phoneNumber: string;
	customerSize: number;
	position: number;
	status: "waiting" | "notified" | "seated" | "cancelled";
	createdAt: string;
}

export default function QueuePage() {
	const [queue, setQueue] = useState<QueueEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState<string | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<{ id: string; name: string } | null>(null);
	const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
	const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

	useEffect(() => {
		fetchQueue();
		const interval = setInterval(fetchQueue, 3000); // Refresh every 3 seconds
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		console.log("Queue state updated:", queue);
	}, [queue]);

	const fetchQueue = async () => {
		try {
			const res = await fetch("/api/queue/list", {
				credentials: "include",
			});
			if (res.ok) {
				const data = await res.json();
				console.log("Queue data received:", data);
				setQueue(data.entries || []);
			} else {
				console.error("API returned status:", res.status);
			}
		} catch (error) {
			console.error("Failed to fetch queue:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateStatus = async (id: string, newStatus: string) => {
		setUpdating(id);
		try {
			const res = await fetch(`/api/queue/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ action: newStatus }),
			});
			if (res.ok) {
				await fetchQueue();
			} else {
				console.error("Update failed with status:", res.status);
			}
		} catch (error) {
			console.error("Failed to update status:", error);
		} finally {
			setUpdating(null);
		}
	};

	const openLogsModal = (id: string, name: string) => {
		setSelectedEntry({ id, name });
		setIsLogsModalOpen(true);
	};

	const waitingCount = queue.filter((q) => q.status === "waiting").length;
	const avgWait = waitingCount > 0 ? waitingCount * 6 : 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-2">Queue Management</h1>
					<p className="text-muted-foreground">
						Manage customer reservations and queue positions
					</p>
				</div>
				<Button onClick={() => setIsManualEntryOpen(true)}>
					<UserPlus className="w-4 h-4 mr-2" />
					Add Customer
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">In Queue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{waitingCount}</div>
						<p className="text-xs text-muted-foreground">Customers waiting</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Avg Wait Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{avgWait} min</div>
						<p className="text-xs text-muted-foreground">
							{waitingCount} × 6 mins per customer
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Served Today
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{queue.filter((q) => q.status === "seated").length}
						</div>
						<p className="text-xs text-muted-foreground">Customers seated</p>
					</CardContent>
				</Card>
			</div>

			{/* Queue Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="w-5 h-5" />
						Active Queue
					</CardTitle>
					<CardDescription>
						Click &quot;Ready&quot; when customer&apos;s table is available
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex justify-center py-8">
							<Spinner />
						</div>
					) : queue.length === 0 ? (
						<div className="text-center py-12">
							<Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								No customers in queue
							</h3>
							<p className="text-muted-foreground">
								Customers will appear here when they join via WhatsApp
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Position</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead>Customer Size</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
										<TableHead>Logs</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{queue.map((entry) => (
										<TableRow
											key={entry.id}
											className={
												entry.status === "seated"
													? "opacity-50"
													: ""
											}
										>
											<TableCell className="font-bold">
												#{entry.position}
											</TableCell>
											<TableCell>{entry.customerName}</TableCell>
											<TableCell className="text-sm">
												{entry.phoneNumber}
											</TableCell>
											<TableCell>{entry.customerSize}</TableCell>
											<TableCell>
												<Badge
													variant={
														entry.status === "waiting"
															? "default"
															: entry.status === "notified"
																? "secondary"
																: entry.status ===
																	"seated"
																	? "default"
																	: "destructive"
													}
												>
													{entry.status}
												</Badge>
											</TableCell>
											<TableCell className="space-x-2">
												{entry.status === "waiting" && (
													<>
														<Button
															size="sm"
															variant="outline"
															disabled={
																updating === entry.id
															}
															onClick={() =>
																updateStatus(
																	entry.id,
																	"notified",
																)
															}
														>
															{updating === entry.id ? (
																<Spinner className="w-3 h-3" />
															) : (
																<>
																	<Clock className="w-3 h-3 mr-1" />
																	Ready
																</>
															)}
														</Button>
														<Button
															size="sm"
															variant="destructive"
															disabled={
																updating === entry.id
															}
															onClick={() =>
																updateStatus(
																	entry.id,
																	"cancelled",
																)
															}
														>
															<XCircle className="w-3 h-3 mr-1" />
															Cancel
														</Button>
													</>
												)}
												{entry.status === "notified" && (
													<Button
														size="sm"
														variant="outline"
														disabled={updating === entry.id}
														onClick={() =>
															updateStatus(
																entry.id,
																"seated",
															)
														}
													>
														{updating === entry.id ? (
															<Spinner className="w-3 h-3" />
														) : (
															<>
																<CheckCircle className="w-3 h-3 mr-1" />
																Seat
															</>
														)}
													</Button>
												)}
											</TableCell>
											<TableCell>
												<Button
													size="icon"
													variant="outline"
													onClick={() => openLogsModal(entry.id, entry.customerName)}
												>
													<History className="w-3 h-3" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Logs Modal */}
			{selectedEntry && (
				<LogsModal
					isOpen={isLogsModalOpen}
					onClose={() => setIsLogsModalOpen(false)}
					queueEntryId={selectedEntry.id}
					customerName={selectedEntry.name}
				/>
			)}

			{/* Manual Entry Modal */}
			<ManualEntryModal
				isOpen={isManualEntryOpen}
				onClose={() => setIsManualEntryOpen(false)}
				onSuccess={fetchQueue}
			/>
		</div>
	);
}
