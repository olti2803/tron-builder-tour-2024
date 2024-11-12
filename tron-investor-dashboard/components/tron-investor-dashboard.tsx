"use client"

// tron-investor-dashboard.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTronPriceData } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Coins,
  TrendingUp,
  Bell,
  Search,
  Home,
  DollarSign,
  Briefcase,
  Activity,
  PlusCircle,
} from "lucide-react";
import WalletConnection from "./wallet-connection"; // Adjust the import path accordingly
import Image from 'next/image';


const contractAddress = 'TUg33aK94qt2j6UyG1gTFdmRN2dgXjxWgm'; //test

const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_fundingGoal", "type": "uint256" }
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }],
    "name": "donateWithTRX",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }],
    "name": "freezeCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "campaigns",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "totalDonationsTRX", "type": "uint256" },
      { "internalType": "uint256", "name": "totalDonationsUSD", "type": "uint256" },
      { "internalType": "bool", "name": "funded", "type": "bool" },
      { "internalType": "bool", "name": "frozen", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "campaignCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];
type TronData = {
  market_data: {
    current_price: {
      usd: number;
    };
    circulating_supply: number;
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
  market_cap_rank: number;
};
// Define a type for your project structure
type Project = {
  id: number;
  title: string;
  description: string;
  fundingGoal: number;
  totalDonationsTRX: number;
  totalDonationsUSD: number;
  creator: string;
  funded: boolean;
  frozen: boolean;
};

// Use the defined Project[] type in useState


export function TronInvestorDashboardComponent() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectInvestment, setNewProjectInvestment] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); 
  const [tronData, setTronData] = useState<TronData | null>(null); // <-- Update here
  const [projects, setProjects] = useState<Project[]>([]); // <-- Update here
  const [fundingProjectId, setFundingProjectId] = useState(null);
  const [fundingAmount, setFundingAmount] = useState("");

  useEffect(() => {
    if (selectedTab === "overview") {
      const fetchData = async () => {
        const data: TronData = await getTronPriceData();
        setTronData(data);
      };
      fetchData();
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (typeof window !== 'undefined' && window.tronWeb && window.tronWeb.defaultAddress.base58) {
      const tronWeb = window.tronWeb;
      const contract = await tronWeb.contract(contractABI, contractAddress);
  
      const projectsArray = [];
      const campaignCount = await contract.campaignCount().call(); // This should work with the updated global.d.ts
  
      for (let i = 0; i < campaignCount; i++) {
        try {
          const campaign = await contract.campaigns(i).call(); // This should also work
          projectsArray.push({
            id: i,
            title: campaign.title,
            description: campaign.description,
            fundingGoal: tronWeb.fromSun(campaign.fundingGoal),
            totalDonationsTRX: tronWeb.fromSun(campaign.totalDonationsTRX),
            totalDonationsUSD: campaign.totalDonationsUSD / 1e6,
            creator: campaign.creator,
            funded: campaign.funded,
            frozen: campaign.frozen,
          });
        } catch (error) {
          console.error(`Error fetching campaign ${i}:`, error);
        }
      }
      setProjects(projectsArray);
    }
  };
  
  

  const handleCreateProject = async () => {
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      const contract = await window.tronWeb.contract(contractABI, contractAddress);
      const tx = await contract.createCampaign(
        newProjectName,
        newProjectDescription,
        window.tronWeb.toSun(newProjectInvestment)
      ).send({
        from: window.tronWeb.defaultAddress.base58,
      });
      console.log('Campaign Created:', tx);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectInvestment('');
      fetchProjects();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign: ' + error.message);
    }
    
  };

  const handleFundProject = (projectId) => {
    setFundingProjectId(projectId);
  };

  const donateToProject = async () => {
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      const contract = await window.tronWeb.contract(contractABI, contractAddress);
      const tx = await contract.donateWithTRX(fundingProjectId).send({
        from: window.tronWeb.defaultAddress.base58,
        callValue: window.tronWeb.toSun(fundingAmount),
      });
      console.log('Donation successful:', tx);
      setFundingAmount("");
      setFundingProjectId(null);
      fetchProjects();
    } catch (error: any) {
      console.error('Error donating to project:', error);
      alert('Error donating to project: ' + error.message);
    }
    
  };

  const freezeCampaign = async (campaignId) => {
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      const contract = await window.tronWeb.contract(contractABI, contractAddress);
      const tx = await contract.freezeCampaign(campaignId).send({
        from: window.tronWeb.defaultAddress.base58,
      });
      console.log('Campaign frozen:', tx);
      fetchProjects();
    } catch (error: any) {
      console.error('Error donating to project:', error);
      alert('Error donating to project: ' + error.message);
    }
    
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Overview Header Section */}
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h1 className="text-3xl font-bold text-red-600">TRON - FundYou Overview</h1>
              <p>Welcome to the TRON Investor Dashboard! Here you can find real-time data on TRON&apos;s cryptocurrency, including current price, market trends, and volume.</p>

            </div>

            {/* Card Sections with 2 Cards per Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Current Price */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current TRON Price (USD)
                  </CardTitle>
                  <Coins className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tronData ? `$${tronData.market_data.current_price.usd}` : "Loading..."}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated in real-time
                  </p>
                </CardContent>
              </Card>

              {/* Market Cap Rank */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Market Cap Rank
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tronData ? `#${tronData.market_cap_rank}` : "Loading..."}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current Market Cap Ranking
                  </p>
                </CardContent>
              </Card>

              {/* Circulating Supply */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Circulating Supply
                  </CardTitle>
                  <Coins className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tronData ? `${tronData.market_data.circulating_supply.toLocaleString()} TRX` : "Loading..."}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total circulating supply
                  </p>
                </CardContent>
              </Card>

              {/* Trading Volume (24h) */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trading Volume (24h)
                  </CardTitle>
                  <Coins className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tronData ? `$${tronData.market_data.total_volume.usd.toLocaleString()}` : "Loading..."}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trading volume in the last 24 hours
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Row for Detailed Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Price Change (24h) */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Price Change (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tronData
                      ? `${tronData.market_data.price_change_percentage_24h.toFixed(2)}%`
                      : "Loading..."}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Price change in the last 24 hours
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

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
                        placeholder="Provide a detailed description"
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
                        type="number"
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
            {/* Display Projects */}
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Goal: ${project.fundingGoal} USD</p>
                    <p>Raised: {project.totalDonationsTRX} TRX (${project.totalDonationsUSD.toFixed(2)} USD)</p>
                    <p>Status: {project.funded ? 'Funded' : (project.frozen ? 'Frozen' : 'Active')}</p>
                    {!project.frozen && (
                      <Button onClick={() => handleFundProject(project.id)}>Fund</Button>
                    )}
                    {window.tronWeb && window.tronWeb.defaultAddress.base58 === project.creator && !project.frozen && (
                      <Button onClick={() => freezeCampaign(project.id)}>Freeze Campaign</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

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
        );

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
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 md:w-48 lg:w-56 xl:w-64 bg-red-600 text-white p-4 h-screen flex flex-col justify-between">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center mb-2">
          <Image src="/Minimalist_TRON_FundYou_logo.png" alt="TRON-FundYou Logo" width={80} height={80} className="mr-2" />
          <span className="text-xl font-normal">TRON - FundYou</span>
          </div>
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
              className={`w-full justify-start py-6 px-8 text-xl ${selectedTab === "projects" ? "bg-red-700" : ""}`}
              onClick={() => setSelectedTab("projects")}
            >
              <Briefcase className="mr-4 h-6 w-6" /> Projects
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start py-6 px-8 text-xl ${selectedTab === "investments" ? "bg-red-700" : ""}`}
              onClick={() => setSelectedTab("investments")}
            >
              <DollarSign className="mr-4 h-6 w-6" /> Funds
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
              <WalletConnection />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <ScrollArea className="h-full">{renderContent()}</ScrollArea>

          {/* Funding Dialog */}
          {fundingProjectId && (
            <Dialog open={fundingProjectId !== null} onOpenChange={() => setFundingProjectId(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fund Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="funding-amount" className="text-right">Amount (TRX)</Label>
                    <Input
                      id="funding-amount"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={donateToProject} className="bg-red-600 hover:bg-red-700">Fund</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}