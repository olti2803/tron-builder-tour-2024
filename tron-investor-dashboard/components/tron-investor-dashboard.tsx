"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Coins,
  Users,
  TrendingUp,
  BarChart as BarChartIcon,
  Bell,
  Search,
  Home,
  DollarSign,
  Briefcase,
  Activity,
  PlusCircle,
} from "lucide-react"
import WalletConnection from "./wallet-connection" // Adjust the import path accordingly

const projectData = [
  { name: "Jan", investments: 40000, users: 1200 },
  { name: "Feb", investments: 30000, users: 1400 },
  { name: "Mar", investments: 50000, users: 1600 },
  { name: "Apr", investments: 45000, users: 1800 },
  { name: "May", investments: 60000, users: 2000 },
  { name: "Jun", investments: 55000, users: 2200 },
]

const pieData = [
  { name: "DeFi", value: 400 },
  { name: "NFTs", value: 300 },
  { name: "Gaming", value: 300 },
  { name: "Infrastructure", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function TronInvestorDashboardComponent() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [newProjectInvestment, setNewProjectInvestment] = useState("")
  const [walletAddress, setWalletAddress] = useState(""); 

  

  const handleCreateProject = () => {
  console.log("Project Created:", {
    name: newProjectName,
    description: newProjectDescription,
    investment: newProjectInvestment,
  })
  // Reset fields after project creation
  setNewProjectName("")
  setNewProjectDescription("")
  setNewProjectInvestment("")
}

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total TRX Invested
                  </CardTitle>
                  <Coins className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,500,000 TRX</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Projects
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">
                    Across 5 sectors
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Returns
                  </CardTitle>
                  <BarChartIcon className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22.5%</div>
                  <p className="text-xs text-muted-foreground">
                    Average across all projects
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Network Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345,678</div>
                  <p className="text-xs text-muted-foreground">+5% this week</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectData}>
                      <defs>
                        <linearGradient
                          id="colorInvestments"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="investments"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorInvestments)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Investment Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "investments":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Investments</CardTitle>
              <CardDescription>
                Track and manage your TRON investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">DeFi Yield Farming</span>
                  <div className="text-right">
                    <div className="font-medium">50,000 TRX</div>
                    <div className="text-sm text-green-600">+8.5%</div>
                  </div>
                </div>
                <Progress
                  value={85}
                  className="h-2 bg-red-200"
                  indicatorClassName="bg-red-600"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium">NFT Marketplace</span>
                  <div className="text-right">
                    <div className="font-medium">30,000 TRX</div>
                    <div className="text-sm text-red-600">-2.1%</div>
                  </div>
                </div>
                <Progress
                  value={62}
                  className="h-2 bg-red-200"
                  indicatorClassName="bg-red-600"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium">TRON Gaming Platform</span>
                  <div className="text-right">
                    <div className="font-medium">75,000 TRX</div>
                    <div className="text-sm text-green-600">+12.3%</div>
                  </div>
                </div>
                <Progress
                  value={78}
                  className="h-2 bg-red-200"
                  indicatorClassName="bg-red-600"
                />
              </div>
            </CardContent>
          </Card>
        )
      case "projects":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Featured Projects</h2>
              <Dialog>
  <DialogTrigger asChild>
    <Button className="bg-red-600 hover:bg-red-700">
      <PlusCircle className="mr-2 h-4 w-4" /> Create Project
    </Button>
  </DialogTrigger>
  <DialogContent>
  <DialogHeader>
    <DialogTitle>Create New Project</DialogTitle>
  </DialogHeader>
  <div className="grid gap-4 py-4">
    {/* Project Name Input */}
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="project-name" className="text-right">Project Name</Label>
      <Input
        id="project-name"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        className="col-span-3"
      />
    </div>
    {/* Project Description Input */}
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="project-description" className="text-right">Project Description</Label>
      <textarea
        id="project-description"
        value={newProjectDescription}
        onChange={(e) => setNewProjectDescription(e.target.value)}
        className="col-span-3 p-2 border border-gray-300 rounded"
        rows={5}
        minLength={50}
        placeholder="Provide a detailed description (at least 50 characters)"
      />
    </div>
    {/* Wallet Address Input */}
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="wallet-address" className="text-right">Wallet Address</Label>
      <Input
        id="wallet-address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="col-span-3"
      />
    </div>
    {/* Funding Goal Input */}
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="funding-goal" className="text-right">Funding Goal (TRX)</Label>
      <Input
        id="funding-goal"
        type="number"  // Ensures only numbers are accepted
        value={newProjectInvestment}
        onChange={(e) => setNewProjectInvestment(e.target.value)}
        className="col-span-3"
      />
    </div>
  </div>
  <DialogFooter>
    <Button onClick={handleCreateProject}>Create</Button>
  </DialogFooter>
</DialogContent>


</Dialog>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {["DeFi", "NFT", "Gaming", "Infrastructure"].map(
                    (category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 font-bold">
                            {category[0]}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{category} Project</h3>
                          <p className="text-sm text-muted-foreground">
                            Innovative {category.toLowerCase()} solution on TRON
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Invest
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "network":
        return (
          <Card>
            <CardHeader>
              <CardTitle>TRON Network Stats</CardTitle>
              <CardDescription>Real-time network performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Block Height</span>
                  <span className="font-medium">38,245,129</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transactions per Second</span>
                  <span className="font-medium">2,845</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Accounts</span>
                  <span className="font-medium">1,234,567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Transactions</span>
                  <span className="font-medium">3,456,789,012</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-white">
{/* Sidebar */}
<div className="w-64 md:w-48 lg:w-56 xl:w-64 bg-red-600 text-white p-4 h-screen flex flex-col justify-between">
  <div className="flex flex-col space-y-8">
    {/* Add logo to the sidebar */}
    <div className="flex items-center mb-2">
  <img src="/Minimalist_TRON_FundYou_logo.png" alt="TRON-FundYou Logo" className="w-20 h-20 mr-2" />
  <span className="text-xl font-normal">TRON - FundYou</span>
</div>
    {/* Horizontal line below the logo */}
    <hr className="border-gray-400 mb-4 w-full" />

    <nav className="space-y-2">
      <Button
        variant="ghost"
        className={`w-full justify-start py-6 px-8 text-xl ${selectedTab === "overview" ? "bg-red-700" : ""}`}
        onClick={() => setSelectedTab("overview")}
      >
        <Home className="mr-4 h-6 w-6" /> Overview
      </Button>
      <Button
        variant="ghost"
        className={`w-full justify-start py-6 px-8 text-xl ${selectedTab === "investments" ? "bg-red-700" : ""}`}
        onClick={() => setSelectedTab("investments")}
      >
        <DollarSign className="mr-4 h-6 w-6" /> Investments
      </Button>
      <Button
        variant="ghost"
        className={`w-full justify-start py-6 px-8 text-xl ${selectedTab === "projects" ? "bg-red-700" : ""}`}
        onClick={() => setSelectedTab("projects")}
      >
        <Briefcase className="mr-4 h-6 w-6" /> Projects
      </Button>
      <Button
        variant="ghost"
        className={`w-full justify-start py-6 px-8 text-xl ${selectedTab === "network" ? "bg-red-700" : ""}`}
        onClick={() => setSelectedTab("network")}
      >
        <Activity className="mr-4 h-6 w-6" /> Network
      </Button>
    </nav>
  </div>
  <div className="hidden md:block mt-auto text-sm text-gray-300">
    <p>TRON-FundYou</p>
    <p>© 2024 All Rights Reserved</p>
  </div>
</div>




      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 pr-2 py-1 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
              {/* Wallet Connection Component */}
              <WalletConnection />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <ScrollArea className="h-full">{renderContent()}</ScrollArea>
        </main>
      </div>
    </div>
  )
}
