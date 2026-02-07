"use client";

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Server,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Accordion = ({ title, children, icon }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 overflow-hidden rounded-md border border-border">
      <button
        className="flex w-full items-center justify-between bg-background px-4 py-3 transition-colors hover:bg-background/80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 font-medium text-sm">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="border-border border-t bg-background/50 px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
};

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-md bg-black/80 p-4 text-muted-foreground text-xs">
        <code>{code}</code>
      </pre>
      <button
        aria-label="Copy code"
        className="absolute top-2 right-2 rounded-md bg-background/10 p-1.5 transition-colors hover:bg-background/20"
        onClick={copyToClipboard}
      >
        {copied ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default function RunNodePage() {
  return (
    <MainLayout>
      <div className="mx-auto flex max-w-4xl flex-col items-center p-4 md:p-6">
        <Card className="w-full border-border bg-card">
          <CardHeader className="border-border border-b">
            <CardTitle className="font-normal text-xl">
              How to Run a Dria Node
            </CardTitle>
            <CardDescription>
              Complete guide to setting up and running a node on the Dria
              decentralized AI inference network
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8 space-y-6">
              <section className="mb-6">
                <h2 className="mb-2 font-medium text-lg">Overview</h2>
                <p className="mb-4 text-muted-foreground">
                  Running a Dria node allows you to participate in the
                  decentralized AI inference network, earn rewards, and
                  contribute to a more resilient and distributed AI ecosystem.
                  This guide will walk you through the complete setup process.
                </p>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-start rounded-md border border-border bg-background/50 p-4">
                    <Server className="mt-0.5 mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="mb-1 font-medium text-sm">Node Hosting</h3>
                      <p className="text-muted-foreground text-xs">
                        Host AI models and contribute computational resources to
                        the network.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start rounded-md border border-border bg-background/50 p-4">
                    <Database className="mt-0.5 mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="mb-1 font-medium text-sm">Earn Rewards</h3>
                      <p className="text-muted-foreground text-xs">
                        Get compensated in $DRIA tokens for successfully
                        completing inference tasks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start rounded-md border border-border bg-background/50 p-4">
                    <Globe className="mt-0.5 mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="mb-1 font-medium text-sm">
                        Network Participation
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Join a global network of node operators supporting
                        decentralized AI.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-2 font-medium text-lg">Prerequisites</h2>
                <Accordion
                  icon={<HardDrive className="h-5 w-5 text-primary" />}
                  title="Hardware Requirements"
                >
                  <div className="space-y-4">
                    <p className="text-sm">
                      The hardware requirements depend on which AI models you
                      plan to run. Here are the minimum specifications:
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-md border border-border p-3">
                        <h4 className="mb-1 font-medium text-sm">
                          Basic Node (Smaller Models)
                        </h4>
                        <ul className="space-y-1 text-muted-foreground text-xs">
                          <li>• CPU: 4+ cores</li>
                          <li>• RAM: 16GB+</li>
                          <li>• Storage: 100GB SSD</li>
                          <li>• GPU: NVIDIA/AMD with 8GB+ VRAM</li>
                        </ul>
                      </div>

                      <div className="rounded-md border border-border p-3">
                        <h4 className="mb-1 font-medium text-sm">
                          Advanced Node (Larger Models)
                        </h4>
                        <ul className="space-y-1 text-muted-foreground text-xs">
                          <li>• CPU: 8+ cores</li>
                          <li>• RAM: 32GB+</li>
                          <li>• Storage: 500GB SSD</li>
                          <li>• GPU: NVIDIA RTX 3080/4080 or better</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Accordion>

                <Accordion
                  icon={<Cpu className="h-5 w-5 text-primary" />}
                  title="Software Requirements"
                >
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>
                        <strong>Operating System:</strong> Linux (Ubuntu 20.04
                        or later recommended), macOS, or Windows
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>
                        <strong>Docker:</strong> Latest stable version
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>
                        <strong>NVIDIA CUDA:</strong> 11.7+ (for GPU support)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>
                        <strong>Node.js:</strong> v18.0 or higher
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>
                        <strong>Git:</strong> Latest version
                      </span>
                    </li>
                  </ul>

                  <div className="mt-4">
                    <p className="mb-2 font-medium text-sm">
                      Install prerequisites on Ubuntu:
                    </p>
                    <CodeBlock
                      code={`# Update package lists
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
sudo apt-get install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install CUDA (if using NVIDIA GPU)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin
sudo mv cuda-ubuntu2004.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/11.7.1/local_installers/cuda-repo-ubuntu2004-11-7-local_11.7.1-515.65.01-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2004-11-7-local_11.7.1-515.65.01-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2004-11-7-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda`}
                    />
                  </div>
                </Accordion>

                <Accordion
                  icon={<Shield className="h-5 w-5 text-primary" />}
                  title="Wallet Setup"
                >
                  <p className="mb-3 text-sm">
                    You need a cryptocurrency wallet that supports the Dria
                    network to receive rewards. Follow these steps to set up a
                    wallet:
                  </p>

                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="mt-0.5 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        1
                      </span>
                      <div>
                        <p className="font-medium">Create a wallet</p>
                        <p className="text-muted-foreground text-xs">
                          Install MetaMask or another compatible wallet and
                          create a new wallet.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <span className="mt-0.5 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Add Dria Network</p>
                        <p className="text-muted-foreground text-xs">
                          Add the Dria network to your wallet with the following
                          details:
                        </p>
                        <div className="mt-2 rounded-md bg-background p-2 text-xs">
                          <p>
                            <strong>Network Name:</strong> Dria Network
                          </p>
                          <p>
                            <strong>RPC URL:</strong> https://rpc.dria.co
                          </p>
                          <p>
                            <strong>Chain ID:</strong> 62522
                          </p>
                          <p>
                            <strong>Symbol:</strong> DRIA
                          </p>
                          <p>
                            <strong>Block Explorer:</strong>{" "}
                            https://explorer.dria.co
                          </p>
                        </div>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <span className="mt-0.5 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Secure your wallet</p>
                        <p className="text-muted-foreground text-xs">
                          Store your seed phrase offline in a secure location
                          and never share it with anyone.
                        </p>
                      </div>
                    </li>
                  </ol>
                </Accordion>
              </section>

              <section>
                <h2 className="mb-2 font-medium text-lg">Installation Steps</h2>

                <div className="space-y-4">
                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="mb-2 font-medium text-primary text-sm">
                      Step 1: Clone the Repository
                    </p>
                    <CodeBlock
                      code={`# Clone the repository
git clone https://github.com/firstbatchxyz/dria
cd dria`}
                    />
                  </div>

                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="mb-2 font-medium text-primary text-sm">
                      Step 2: Install Dependencies
                    </p>
                    <CodeBlock
                      code={`# Install dependencies
npm install`}
                    />
                  </div>

                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="mb-2 font-medium text-primary text-sm">
                      Step 3: Configure Your Node
                    </p>
                    <p className="mb-3 text-muted-foreground text-xs">
                      Create a configuration file by copying the example and
                      edit it with your wallet address and preferences.
                    </p>
                    <CodeBlock
                      code={`# Create a configuration file
cp config.example.json config.json

# Edit your configuration - replace with your favorite editor
nano config.json`}
                    />

                    <div className="mt-4">
                      <p className="mb-1 text-muted-foreground text-xs">
                        Here's an example configuration:
                      </p>
                      <CodeBlock
                        code={`{
  "wallet": "0xYourWalletAddressHere",
  "node": {
    "name": "My Dria Node",
    "models": ["llama3.1-8b", "gemini-2.0-flash"],
    "max_gpu_memory": "80%",
    "max_concurrent_tasks": 4,
    "log_level": "info"
  },
  "network": {
    "endpoint": "https://mainnet.dria.co",
    "telemetry": true,
    "heartbeat_interval": 60
  }
}`}
                      />
                    </div>
                  </div>

                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="mb-2 font-medium text-primary text-sm">
                      Step 4: Start Your Node
                    </p>
                    <CodeBlock
                      code={`# Start the node
npm run start

# Or run as a background service
npm run start:daemon`}
                    />

                    <p className="mt-3 text-muted-foreground text-xs">
                      Your node will download the required models and connect to
                      the network. This may take some time depending on your
                      internet connection and the models you've configured.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-2 font-medium text-lg">
                  Advanced Configuration
                </h2>

                <Accordion
                  icon={<Server className="h-5 w-5 text-primary" />}
                  title="Monitoring & Maintenance"
                >
                  <p className="mb-3 text-sm">
                    Monitor your node's performance and status using the
                    following commands:
                  </p>

                  <CodeBlock
                    code={`# Check node status
npm run status

# View logs
npm run logs

# Update to the latest version
git pull
npm install
npm run restart`}
                  />

                  <p className="mt-3 text-sm">
                    For production deployments, consider using a process manager
                    like PM2:
                  </p>

                  <CodeBlock
                    code={`# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "dria-node" -- run start

# Set to auto-start on system boot
pm2 startup
pm2 save`}
                  />
                </Accordion>

                <Accordion
                  icon={<HardDrive className="h-5 w-5 text-primary" />}
                  title="Troubleshooting"
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1 font-medium text-sm">
                        Connection Issues
                      </h4>
                      <p className="mb-2 text-muted-foreground text-xs">
                        If your node can't connect to the network:
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-xs">
                        <li>Check your internet connection</li>
                        <li>Verify the network endpoint in your config</li>
                        <li>
                          Ensure your firewall allows outgoing connections
                        </li>
                        <li>Try restarting the node with `npm run restart`</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-1 font-medium text-sm">
                        Model Loading Failures
                      </h4>
                      <p className="mb-2 text-muted-foreground text-xs">
                        If models fail to load:
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-xs">
                        <li>
                          Verify you have enough disk space and GPU memory
                        </li>
                        <li>Check the logs for specific error messages</li>
                        <li>Try with a smaller model first</li>
                        <li>
                          Update to the latest version of the node software
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-1 font-medium text-sm">
                        Common Error Messages
                      </h4>
                      <div className="space-y-2">
                        <div className="rounded-md bg-background p-2">
                          <p className="mb-1 font-mono text-red-500 text-xs">
                            Error: CUDA out of memory
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Your GPU doesn't have enough memory. Try reducing
                            `max_gpu_memory` in config or use a smaller model.
                          </p>
                        </div>

                        <div className="rounded-md bg-background p-2">
                          <p className="mb-1 font-mono text-red-500 text-xs">
                            Error: Network connection refused
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Check your network settings and ensure the Dria
                            network is operational.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Accordion>
              </section>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <Link href="/">
                <Button
                  className="w-full border-muted sm:w-auto"
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
              </Link>

              <div className="flex gap-4">
                <Link
                  href="https://docs.dria.co"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    className="w-full border-primary text-primary sm:w-auto"
                    variant="outline"
                  >
                    Documentation
                  </Button>
                </Link>

                <Link
                  href="https://github.com/firstbatchxyz/dria"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button className="w-full bg-primary text-black hover:bg-primary/90 sm:w-auto">
                    GitHub Repository
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
