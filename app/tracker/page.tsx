import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Clock, CheckCircle2, PieChart } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function TrackerPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-accent/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Track Your Time, Boost Your Productivity
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our time tracking solution helps you stay focused, bill
                accurately, and understand how you spend your time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-1 items-center">
                <Link href="/signin">Try Web App</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-1 items-center"
              >
                <Link
                  href={siteConfig.extensionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Get Chrome Extension
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">
                Powerful Time Tracking in Your Browser
              </h2>
              <p className="text-muted-foreground">
                Our Chrome extension seamlessly integrates with your workflow,
                allowing you to track time without switching contexts.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                  <span>Track time with a single click</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                  <span>Visualize your productivity patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                  <span>Organize time entries by project</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                  <span>Sync automatically with your web account</span>
                </li>
              </ul>
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-1 items-center"
                >
                  <Link
                    href={siteConfig.extensionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Get Chrome Extension
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-accent/20">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs text-gray-300">
                    Chrome Extension - Time Tracker
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white">
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded-md mb-3 border border-accent/10">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-accent" />
                      <span className="font-medium">Project: Invoice App</span>
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      00:45:12
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      Start
                    </Button>
                    <Button size="sm" variant="outline">
                      Pause
                    </Button>
                    <Button size="sm" variant="outline">
                      Stop
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 border rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Client Meeting</span>
                      </div>
                      <span className="text-sm font-mono">01:30:00</span>
                    </div>
                    <div className="p-2 border rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Development</span>
                      </div>
                      <span className="text-sm font-mono">03:45:22</span>
                    </div>
                    <div className="p-2 border rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Design Review</span>
                      </div>
                      <span className="text-sm font-mono">00:45:12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Web App Integration Section */}
      <section className="w-full py-12 md:py-24 bg-accent/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">
              Seamless Integration with Web App
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground mt-2">
              All your time entries sync automatically with your web account for
              comprehensive reporting and invoicing.
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <div className="bg-background rounded-lg shadow-lg border border-accent/10 overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold">Time Tracking Dashboard</h3>
                  <p className="text-muted-foreground">
                    Track and manage your time across projects
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Today
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">4h 25m</div>
                        <p className="text-xs text-muted-foreground">
                          3 projects
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          This Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">28h 15m</div>
                        <p className="text-xs text-muted-foreground">
                          5 projects
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          This Month
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">112h 30m</div>
                        <p className="text-xs text-muted-foreground">
                          7 projects
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 border rounded-md flex justify-between items-center bg-accent/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium">Invoice App</span>
                      </div>
                      <span className="text-sm font-mono">2h 15m today</span>
                    </div>
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium">Client Website</span>
                      </div>
                      <span className="text-sm font-mono">1h 40m today</span>
                    </div>
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="font-medium">Marketing Campaign</span>
                      </div>
                      <span className="text-sm font-mono">0h 30m today</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <div className="bg-background rounded-lg shadow-lg border border-accent/10 overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold">Time Reports</h3>
                  <p className="text-muted-foreground">
                    Analyze your productivity and billable hours
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-center py-4">
                    <div className="relative h-64 w-full max-w-md">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PieChart className="h-40 w-40 text-accent opacity-10" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold">65%</span>
                          <span className="text-sm text-muted-foreground">
                            Billable Time
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Most Productive Day
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">Tuesday</div>
                        <p className="text-xs text-muted-foreground">
                          8.5 hours average
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Top Project
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">Invoice App</div>
                        <p className="text-xs text-muted-foreground">
                          42 hours this month
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="invoicing" className="mt-4">
              <div className="bg-background rounded-lg shadow-lg border border-accent/10 overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold">Invoicing</h3>
                  <p className="text-muted-foreground">
                    Convert tracked time into professional invoices
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Invoice #INV-2023-042</div>
                        <div className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                          Paid
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>Client: Acme Corp</div>
                        <div>$2,450.00</div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Invoice #INV-2023-041</div>
                        <div className="text-sm text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                          Pending
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>Client: Globex Inc</div>
                        <div>$1,875.50</div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Invoice #INV-2023-040</div>
                        <div className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                          Draft
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>Client: Wayne Enterprises</div>
                        <div>$3,120.75</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button className="gap-1 items-center">
                      <Link href="/signin">Create New Invoice</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">
                Ready to Boost Your Productivity?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                Start tracking your time effectively today with our web app and
                Chrome extension.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-1 items-center">
                <Link href="/signin">Sign Up Free</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-1 items-center"
              >
                <Link
                  href={siteConfig.extensionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Install Chrome Extension
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
