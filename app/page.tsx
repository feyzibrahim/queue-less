import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { BarChart3, CheckCircle, Clock, Shield, Smartphone, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<Clock className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold text-slate-900">
							Queue Less
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<Link href="/login">
							<Button variant="ghost">Sign In</Button>
						</Link>
						<Link href="/dashboard">
							<Button>Dashboard</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto text-center">
					<Badge variant="secondary" className="mb-4">
						🚀 Now in Beta
					</Badge>
					<h1 className="text-5xl font-bold text-slate-900 mb-6 max-w-4xl mx-auto">
						Revolutionize Your Restaurant Queue Management
					</h1>
					<p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
						Eliminate long waits and unhappy customers. Manage your restaurant
						queue seamlessly via WhatsApp with our modern dashboard.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/login">
							<Button size="lg" className="text-lg px-8 py-3">
								Get Started Free
							</Button>
						</Link>
						<Button variant="outline" size="lg" className="text-lg px-8 py-3">
							Watch Demo
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 bg-white">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Why Choose Queue Less?
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Built for modern restaurants that value customer experience
							and operational efficiency.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="border-0 shadow-lg">
							<CardHeader>
								<Smartphone className="w-12 h-12 text-blue-600 mb-4" />
								<CardTitle>WhatsApp Integration</CardTitle>
								<CardDescription>
									Customers join your queue directly through WhatsApp.
									No apps to download, no forms to fill.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardHeader>
								<Clock className="w-12 h-12 text-green-600 mb-4" />
								<CardTitle>Real-time Updates</CardTitle>
								<CardDescription>
									Notify customers instantly when their table is ready.
									Reduce wait times and improve satisfaction.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardHeader>
								<Users className="w-12 h-12 text-purple-600 mb-4" />
								<CardTitle>Customer Size Management</CardTitle>
								<CardDescription>
									Handle different customer sizes efficiently. Prioritize
									tables based on availability and customer needs.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardHeader>
								<BarChart3 className="w-12 h-12 text-orange-600 mb-4" />
								<CardTitle>Analytics Dashboard</CardTitle>
								<CardDescription>
									Track wait times, customer flow, and peak hours. Make
									data-driven decisions to optimize operations.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardHeader>
								<Shield className="w-12 h-12 text-red-600 mb-4" />
								<CardTitle>Secure & Reliable</CardTitle>
								<CardDescription>
									Bank-level security with OTP verification. Your
									customer data is protected and never shared.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardHeader>
								<CheckCircle className="w-12 h-12 text-teal-600 mb-4" />
								<CardTitle>Easy Setup</CardTitle>
								<CardDescription>
									Get started in minutes. No complex installations or
									expensive hardware required.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* How it Works */}
			<section className="py-20 px-4 bg-slate-50">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							How It Works
						</h2>
						<p className="text-lg text-slate-600">
							Three simple steps to transform your restaurant operations
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-2xl font-bold text-white">1</span>
							</div>
							<h3 className="text-xl font-semibold mb-4">
								Customer Joins Queue
							</h3>
							<p className="text-slate-600">
								Customers send a WhatsApp message to join your queue with
								their name and customer size.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-2xl font-bold text-white">2</span>
							</div>
							<h3 className="text-xl font-semibold mb-4">
								Staff Manages Queue
							</h3>
							<p className="text-slate-600">
								Your staff monitors the queue in real-time and notifies
								customers when tables are ready.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-2xl font-bold text-white">3</span>
							</div>
							<h3 className="text-xl font-semibold mb-4">
								Happy Customers
							</h3>
							<p className="text-slate-600">
								Customers receive instant notifications and enjoy a
								seamless dining experience.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-blue-600 text-white">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to Transform Your Restaurant?
					</h2>
					<p className="text-xl mb-8 opacity-90">
						Join hundreds of restaurants already using Queue Less
					</p>
					<Link href="/login">
						<Button
							size="lg"
							variant="secondary"
							className="text-lg px-8 py-3"
						>
							Start Free Trial
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-4 bg-slate-900 text-white">
				<div className="container mx-auto">
					<div className="flex items-center justify-center space-x-2 mb-8">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<Clock className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold">Queue Less</span>
					</div>
					<div className="text-center text-slate-400">
						<p>&copy; 2024 Queue Less. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
