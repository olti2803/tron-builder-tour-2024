"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function WalletConnection() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const handleConnect = async () => {
    if (!window.tronWeb) {
      alert("TronLink is not installed. Please install the TronLink extension.")
      return
    }

    setIsConnecting(true)

    try {
      // Request accounts from TronLink
      const res = await window.tronWeb.request({
        method: "tron_requestAccounts",
        params: {
          websiteIcon: "https://example.com/icon.png", // optional
          websiteName: "TRON Investor", // optional
        },
      })

      if (res.code === 200) {
        console.log("Connected to TronLink")
        setConnected(true)
        setAddress(window.tronWeb.defaultAddress.base58)
      } else {
        console.error("User rejected the connection: ", res.message)
        alert("Connection failed: " + res.message)
      }
    } catch (error) {
      console.error("Connection failed: ", error)
      alert("Wallet connection failed. Ensure you have TronLink installed and try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setConnected(false)
    setAddress(null)
    console.log("Disconnected from TronLink")
  }

  useEffect(() => {
    // Check if TronLink is already connected
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setConnected(true)
      setAddress(window.tronWeb.defaultAddress.base58)
    }
  }, [])

  return (
    <div className="flex items-center space-x-4">
      {connected ? (
        <>
          <span className="font-semibold">{address}</span>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Disconnect Wallet
          </Button>
        </>
      ) : (
        <Button
          onClick={handleConnect}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  )
}
