"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Clock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState<"phone" | "verify">("phone");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function requestOtp() {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/request-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phoneNumber: phone }),
			});
			const data = await res.json();
			setMessage(data.message || "OTP requested");
			if (res.ok) setStep("verify");
		} catch (error) {
			setMessage("Failed to request OTP");
		} finally {
			setLoading(false);
		}
	}

	async function verifyOtp() {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phoneNumber: phone, code }),
			});
			const data = await res.json();
			setMessage(data.message || "");
			if (res.ok) router.push("/dashboard");
		} catch (error) {
			setMessage("Failed to verify OTP");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to home
					</Link>
					<div className="flex items-center justify-center space-x-2 mb-4">
						<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<Clock className="w-6 h-6 text-white" />
						</div>
						<span className="text-2xl font-bold text-slate-900">
							Queue Less
						</span>
					</div>
				</div>

				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Staff Login</CardTitle>
						<CardDescription>
							Access your restaurant dashboard
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="+1234567890"
								disabled={step === "verify"}
							/>
						</div>

						{step === "phone" ? (
							<Button
								className="w-full"
								onClick={requestOtp}
								disabled={!phone || loading}
							>
								{loading ? "Sending..." : "Send OTP"}
							</Button>
						) : (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Enter OTP Code</Label>
									<InputOTP
										value={code}
										onChange={setCode}
										maxLength={6}
									>
										<InputOTPGroup className="justify-center">
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>
								</div>

								<div className="flex space-x-2">
									<Button
										variant="outline"
										onClick={() => setStep("phone")}
										disabled={loading}
									>
										Back
									</Button>
									<Button
										className="flex-1"
										onClick={verifyOtp}
										disabled={code.length !== 6 || loading}
									>
										{loading ? "Verifying..." : "Verify & Login"}
									</Button>
								</div>
							</div>
						)}

						{message && (
							<Alert>
								<AlertDescription>{message}</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
