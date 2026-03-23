"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Phone, Users } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ManualEntryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function ManualEntryModal({ isOpen, onClose, onSuccess }: ManualEntryModalProps) {
	const [formData, setFormData] = useState({
		customerName: "",
		phoneNumber: "",
		customerSize: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.customerName.trim()) {
			newErrors.customerName = "Customer name is required";
		}

		if (!formData.phoneNumber.trim()) {
			newErrors.phoneNumber = "Phone number is required";
		} else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
			newErrors.phoneNumber = "Please enter a valid phone number";
		}

		const size = parseInt(formData.customerSize);
		if (!formData.customerSize.trim()) {
			newErrors.customerSize = "Party size is required";
		} else if (isNaN(size) || size < 1) {
			newErrors.customerSize = "Party size must be at least 1";
		} else if (size > 20) {
			newErrors.customerSize = "Party size cannot exceed 20";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		try {
			const res = await fetch("/api/queue/manual", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					customerName: formData.customerName.trim(),
					phoneNumber: formData.phoneNumber.trim(),
					customerSize: parseInt(formData.customerSize),
				}),
			});

			const data = await res.json();

			if (res.ok) {
				// Reset form
				setFormData({
					customerName: "",
					phoneNumber: "",
					customerSize: "",
				});
				onSuccess();
				onClose();
			} else {
				// Handle server validation errors
				if (data.errors && Array.isArray(data.errors)) {
					const serverErrors: Record<string, string> = {};
					data.errors.forEach((error: any) => {
						serverErrors[error.path[0]] = error.message;
					});
					setErrors(serverErrors);
				} else {
					setErrors({ submit: data.message || "Failed to add customer to queue" });
				}
			}
		} catch (error) {
			console.error("Error adding customer:", error);
			setErrors({ submit: "Network error. Please try again." });
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (!loading) {
			setFormData({
				customerName: "",
				phoneNumber: "",
				customerSize: "",
			});
			setErrors({});
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<UserPlus className="w-5 h-5" />
						Add Customer to Queue
					</DialogTitle>
					<DialogDescription>
						Add a customer manually to the queue. They will receive a WhatsApp
						message when their table is ready.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="customerName">Customer Name *</Label>
						<Input
							id="customerName"
							value={formData.customerName}
							onChange={(e) => handleInputChange("customerName", e.target.value)}
							placeholder="Enter customer name"
							disabled={loading}
							className={errors.customerName ? "border-red-500" : ""}
						/>
						{errors.customerName && (
							<p className="text-sm text-red-500">{errors.customerName}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phoneNumber">WhatsApp Number *</Label>
						<div className="relative">
							<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								id="phoneNumber"
								value={formData.phoneNumber}
								onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
								placeholder="+1234567890"
								disabled={loading}
								className={`pl-10 ${errors.phoneNumber ? "border-red-500" : ""}`}
							/>
						</div>
						{errors.phoneNumber && (
							<p className="text-sm text-red-500">{errors.phoneNumber}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="customerSize">Party Size *</Label>
						<div className="relative">
							<Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								id="customerSize"
								type="number"
								value={formData.customerSize}
								onChange={(e) => handleInputChange("customerSize", e.target.value)}
								placeholder="2"
								min="1"
								max="20"
								disabled={loading}
								className={`pl-10 ${errors.customerSize ? "border-red-500" : ""}`}
							/>
						</div>
						{errors.customerSize && (
							<p className="text-sm text-red-500">{errors.customerSize}</p>
						)}
					</div>

					{errors.submit && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{errors.submit}</p>
						</div>
					)}

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Spinner className="w-4 h-4 mr-2" />
									Adding...
								</>
							) : (
								<>
									<UserPlus className="w-4 h-4 mr-2" />
									Add to Queue
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
