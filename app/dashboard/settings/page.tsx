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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Phone, QrCode, ExternalLink, Copy, Check } from "lucide-react";

export default function SettingsPage() {
	const [restaurant, setRestaurant] = useState<{
		name: string;
		phone: string;
		slug: string;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		void (async () => {
			try {
				const res = await fetch("/api/settings/info");
				const data = await res.json();
				if (res.ok) setRestaurant(data.restaurant);
			} catch (error) {
				console.error("Failed to load settings:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const whatsappUrl = restaurant
		? `https://wa.me/${restaurant.phone.replace(/\D/g, "")}?text=Hi`
		: "";

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold mb-2">Settings</h1>
					<p className="text-muted-foreground">
						Manage your restaurant information and WhatsApp integration
					</p>
				</div>

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-6 w-32" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-6 w-36" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-2">Settings</h1>
				<p className="text-muted-foreground">
					Manage your restaurant information and WhatsApp integration
				</p>
			</div>

			{restaurant && (
				<div className="grid gap-6">
					{/* Restaurant Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building2 className="w-5 h-5" />
								Restaurant Information
							</CardTitle>
							<CardDescription>
								Basic details about your restaurant
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-medium text-muted-foreground">
										Restaurant Name
									</label>
									<p className="text-lg font-semibold">
										{restaurant.name}
									</p>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-muted-foreground">
										Phone Number
									</label>
									<div className="flex items-center gap-2">
										<Phone className="w-4 h-4 text-muted-foreground" />
										<p className="text-lg font-mono">
											{restaurant.phone}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* WhatsApp Integration */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Phone className="w-5 h-5" />
								WhatsApp Integration
							</CardTitle>
							<CardDescription>
								Customer-facing WhatsApp link and QR code for queue
								joining
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-muted-foreground mb-1">
											WhatsApp Link
										</p>
										<p className="text-sm font-mono break-all">
											{whatsappUrl}
										</p>
									</div>
									<div className="flex items-center gap-2 ml-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(whatsappUrl)}
										>
											{copied ? (
												<Check className="w-4 h-4" />
											) : (
												<Copy className="w-4 h-4" />
											)}
										</Button>
										<Button variant="outline" size="sm">
											<a
												href={whatsappUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<ExternalLink className="w-4 h-4" />
											</a>
										</Button>
									</div>
								</div>

								<Separator />

								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<QrCode className="w-5 h-5" />
										<h3 className="text-lg font-semibold">QR Code</h3>
									</div>
									<p className="text-sm text-muted-foreground">
										Print this QR code and display it in your
										restaurant for customers to scan and join the
										queue.
									</p>
									<div className="flex justify-center">
										<div className="p-4 bg-white border rounded-lg">
											<img
												src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappUrl)}`}
												alt="WhatsApp QR Code"
												className="w-48 h-48"
											/>
										</div>
									</div>
									<div className="flex justify-center">
										<Button variant="outline">
											Download QR Code
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Integration Status */}
					<Card>
						<CardHeader>
							<CardTitle>Integration Status</CardTitle>
							<CardDescription>
								Current status of your WhatsApp integration
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-3">
								<Badge variant="default" className="bg-green-600">
									Active
								</Badge>
								<span className="text-sm text-muted-foreground">
									WhatsApp integration is working correctly
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
