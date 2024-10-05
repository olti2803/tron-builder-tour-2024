"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Coins, Users, TrendingUp, BarChart as BarChartIcon, Link, Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"

const projectData = [
  { name: 'Jan', investments: 40000, users: 1200 },
  { name: 'Feb', investments: 30000, users: 1400 },
  { name: 'Mar', investments: 50000, users: 1600 },
  { name: 'Apr', investments: 45000, users: 1800 },
  { name: 'May', investments: 60000, users: 2000 },
  { name: 'Jun', investments: 55000, users: 2200 },
]

const pieData = [
  { name: 'DeFi', value: 400 },
  { name: 'NFTs', value: 300 },
  { name: 'Gaming', value: 300 },
  { name: 'Infrastructure', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const notifications = [
  { id: 1, message: "New investment opportunity in DeFi sector" },
  { id: 2, message: "Your investment in Project X has yielded 5% returns" },
  { id: 3, message: "TRON network upgrade scheduled for next week" },
  { id: 4, message: "New governance proposal open for voting" },
]

export function TronInvestorDashboardComponent() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-red-600 text-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Menu className="h-6 w-6 mr-4 cursor-pointer" />
            <h1 className="text-2xl font-bold">TRON Investor Hub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8 pr-2 py-1 rounded-full bg-red-700 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-200" />
            </div>
            <Bell className="h-6 w-6 cursor-pointer" />
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="CryptoVisionary" />
              <AvatarFallback>CV</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-red-100 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Investments</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Projects</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total TRX Invested</CardTitle>
                  <Coins className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,500,000 TRX</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">Across 5 sectors</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                  <BarChartIcon className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22.5%</div>
                  <p className="text-xs text-muted-foreground">Average across all projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Network Users</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345,678</div>
                  <p className="text-xs text-muted-foreground">+5% this week</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Investment Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectData}>
                      <defs>
                        <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="investments" stroke="#ef4444" fillOpacity={1} fill="url(#colorInvestments)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Investments</CardTitle>
                <CardDescription>Track and manage your TRON investments</CardDescription>
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
                  <Progress value={85} className="h-2 bg-red-200" indicatorClassName="bg-red-600" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">NFT Marketplace</span>
                    <div className="text-right">
                      <div className="font-medium">30,000 TRX</div>
                      <div className="text-sm text-red-600">-2.1%</div>
                    </div>
                  </div>
                  <Progress value={62} className="h-2 bg-red-200" indicatorClassName="bg-red-600" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">TRON Gaming Platform</span>
                    <div className="text-right">
                      <div className="font-medium">75,000 TRX</div>
                      <div className="text-sm text-green-600">+12.3%</div>
                    </div>
                  </div>
                  <Progress value={78} className="h-2 bg-red-200" indicatorClassName="bg-red-600" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured Projects</CardTitle>
                <CardDescription>Explore new investment opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['DeFi', 'NFT', 'Gaming', 'Infrastructure'].map((category) => (
                    <div key={category} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">{category[0]}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{category} Project</h3>
                        <p className="text-sm text-muted-foreground">Innovative {category.toLowerCase()} solution on TRON</p>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="network" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-red-600 text-white mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <Button variant="link" className="text-white hover:text-red-200">About</Button>
            <Button variant="link" className="text-white hover:text-red-200">Terms</Button>
            <Button variant="link" className="text-white hover:text-red-200">Privacy</Button>
          </div>
          <div className="flex items-center space-x-2">
            <span>Powere d by</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.07 28.06" className="h-6 w-auto">
              <path d="M43.94,25.39c-3.47,0-6.08-2.8-6.08-6.5s2.61-6.5,6.08-6.5,6.08,2.8,6.08,6.5-2.61,6.5-6.08,6.5Zm0-10.71c-2.21,0-3.75,1.82-3.75,4.21s1.54,4.21,3.75,4.21,3.75-1.82,3.75-4.21-1.54-4.21-3.75-4.21Z" fill="#fff"/>
              <path d="M60.88,25.39c-3.47,0-6.08-2.8-6.08-6.5s2.61-6.5,6.08-6.5,6.08,2.8,6.08,6.5-2.61,6.5-6.08,6.5Zm0-10.71c-2.21,0-3.75,1.82-3.75,4.21s1.54,4.21,3.75,4.21,3.75-1.82,3.75-4.21-1.54-4.21-3.75-4.21Z" fill="#fff"/>
              <path d="M73.61,25.11h-2.19V6.28h2.19V25.11Z" fill="#fff"/>
              <path d="M86.55,25.39c-3.75,0-6.5-2.8-6.5-6.5s2.75-6.5,6.5-6.5,6.5,2.8,6.5,6.5-2.75,6.5-6.5,6.5Zm0-10.71c-2.33,0-4.17,1.82-4.17,4.21s1.82,4.21,4.17,4.21,4.17-1.82,4.17-4.21-1.82-4.21-4.17-4.21Z" fill="#fff"/>
              <path d="M103.42,25.39c-3.75,0-6.5-2.8-6.5-6.5s2.75-6.5,6.5-6.5,6.5,2.8,6.5,6.5-2.75,6.5-6.5,6.5Zm0-10.71c-2.33,0-4.17,1.82-4.17,4.21s1.82,4.21,4.17,4.21,4.17-1.82,4.17-4.21-1.82-4.21-4.17-4.21Z" fill="#fff"/>
              <path d="M122.07,12.67v12.44h-2.19v-1.4c-.98,1.12-2.33,1.68-3.89,1.68-3.47,0-6.08-2.8-6.08-6.5s2.61-6.5,6.08-6.5c1.54,0,2.89,.56,3.89,1.68v-1.4h2.19Zm-5.94,10.43c2.21,0,3.75-1.82,3.75-4.21s-1.54-4.21-3.75-4.21-3.75,1.82-3.75,4.21,1.54,4.21,3.75,4.21Z" fill="#fff"/>
              <path d="M14.03,0C6.28,0,0,6.28,0,14.03s6.28,14.03,14.03,14.03,14.03-6.28,14.03-14.03S21.78,0,14.03,0Zm6.39,15.5c-.07,.07-.14,.1-.23,.1s-.17-.03-.23-.1l-3.85-3.85-3.85,3.85c-.07,.07-.14,.1-.23,.1s-.17-.03-.23-.1c-.13-.13-.13-.34,0-.47l3.85-3.85-3.85-3.85c-.13-.13-.13-.34,0-.47s.34-.13,.47,0l3.85,3.85,3.85-3.85c.13-.13,.34-.13,.47,0s.13,.34,0,.47l-3.85,3.85,3.85,3.85c.13,.13,.13,.34,0,.47Z" fill="#fff"/>
            </svg>
          </div>
        </div>
      </footer>
    </div>
  )
}