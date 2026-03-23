"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

interface QueueEntryLog {
	id: string;
	oldStatus: string | null;
	newStatus: string;
	changedBy: string | null;
	changeReason: string | null;
	createdAt: string;
}

interface LogsModalProps {
	isOpen: boolean;
	onClose: () => void;
	queueEntryId: string;
	customerName: string;
}

export function LogsModal({ isOpen, onClose, queueEntryId, customerName }: LogsModalProps) {
	const [logs, setLogs] = useState<QueueEntryLog[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen && queueEntryId) {
			fetchLogs();
		}
	}, [isOpen, queueEntryId]);

	const fetchLogs = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/queue/${queueEntryId}/logs`, {
				credentials: "include",
			});
			if (res.ok) {
				const data = await res.json();
				setLogs(data.logs || []);
			} else {
				console.error("Failed to fetch logs");
			}
		} catch (error) {
			console.error("Error fetching logs:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "waiting":
				return "default";
			case "notified":
				return "secondary";
			case "seated":
				return "default";
			case "cancelled":
				return "destructive";
			default:
				return "default";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="min-w-7xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Clock className="w-5 h-5" />
						Status Logs - {customerName}
					</DialogTitle>
					<DialogDescription>
						View the history of status changes for this customer
					</DialogDescription>
				</DialogHeader>

				{loading ? (
					<div className="flex justify-center py-8">
						<Spinner />
					</div>
				) : logs.length === 0 ? (
					<div className="text-center py-12">
						<Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">No logs available</h3>
						<p className="text-muted-foreground">
							No status changes have been recorded for this customer yet.
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date & Time</TableHead>
								<TableHead>From</TableHead>
								<TableHead>To</TableHead>
								<TableHead>Changed By</TableHead>
								<TableHead>Reason</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{logs.map((log) => (
								<TableRow key={log.id}>
									<TableCell className="text-sm">
										{formatDate(log.createdAt)}
									</TableCell>
									<TableCell>
										{log.oldStatus ? (
											<Badge variant={getStatusVariant(log.oldStatus)}>
												{log.oldStatus}
											</Badge>
										) : (
											<span className="text-muted-foreground">Initial</span>
										)}
									</TableCell>
									<TableCell>
										<Badge variant={getStatusVariant(log.newStatus)}>
											{log.newStatus}
										</Badge>
									</TableCell>
									<TableCell className="text-sm">
										{log.changedBy || "System"}
									</TableCell>
									<TableCell className="text-sm">
										{log.changeReason || "-"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				<div className="flex justify-end pt-4">
					<Button onClick={onClose}>
						<X className="w-4 h-4 mr-2" />
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
