"use client";

import { Download, Maximize, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Node = {
  id: string;
  label: string;
  type: string;
  layer: string;
  radius: number;
};

type Link = {
  source: string;
  target: string;
  type: string;
  strength: number;
};

type OntologyGraph = {
  nodes: Node[];
  links: Link[];
};

interface OntologyVisualizerProps {
  data?: OntologyGraph;
  height?: number;
  width?: number;
}

// Mock data for the visualization
const mockOntologyData: OntologyGraph = {
  nodes: [
    {
      id: "customer",
      label: "Customer",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "order",
      label: "Order",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "product",
      label: "Product",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "payment",
      label: "Payment",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "invoice",
      label: "Invoice",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "customerRecord",
      label: "CustomerRecord",
      type: "entity",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "orderProcess",
      label: "OrderProcess",
      type: "process",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "productCatalog",
      label: "ProductCatalog",
      type: "entity",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "paymentProcessor",
      label: "PaymentProcessor",
      type: "service",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "invoiceGenerator",
      label: "InvoiceGenerator",
      type: "service",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "customerAPI",
      label: "CustomerAPI",
      type: "interface",
      layer: "dynamic",
      radius: 6,
    },
    {
      id: "orderAPI",
      label: "OrderAPI",
      type: "interface",
      layer: "dynamic",
      radius: 6,
    },
    {
      id: "productAPI",
      label: "ProductAPI",
      type: "interface",
      layer: "dynamic",
      radius: 6,
    },
    {
      id: "paymentGateway",
      label: "PaymentGateway",
      type: "external",
      layer: "dynamic",
      radius: 6,
    },
  ],
  links: [
    {
      source: "customer",
      target: "customerRecord",
      type: "implements",
      strength: 1,
    },
    {
      source: "customerRecord",
      target: "customerAPI",
      type: "exposes",
      strength: 1,
    },
    { source: "customer", target: "order", type: "places", strength: 0.7 },
    { source: "order", target: "orderProcess", type: "processes", strength: 1 },
    {
      source: "orderProcess",
      target: "orderAPI",
      type: "exposes",
      strength: 1,
    },
    { source: "order", target: "invoice", type: "generates", strength: 0.7 },
    {
      source: "invoice",
      target: "invoiceGenerator",
      type: "implements",
      strength: 1,
    },
    { source: "order", target: "product", type: "contains", strength: 0.5 },
    {
      source: "product",
      target: "productCatalog",
      type: "catalogs",
      strength: 1,
    },
    {
      source: "productCatalog",
      target: "productAPI",
      type: "exposes",
      strength: 1,
    },
    { source: "order", target: "payment", type: "requires", strength: 0.7 },
    {
      source: "payment",
      target: "paymentProcessor",
      type: "processes",
      strength: 1,
    },
    {
      source: "paymentProcessor",
      target: "paymentGateway",
      type: "connects",
      strength: 1,
    },
  ],
};

export function OntologyVisualizer({
  data = mockOntologyData,
  height = 600,
  width = 800,
}: OntologyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    semantic: true,
    kinetic: true,
    dynamic: true,
  });

  // Initialize visualization when component mounts or data changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Filter nodes based on active filters
    const filteredNodes = data.nodes.filter((node) => {
      if (node.layer === "semantic" && !activeFilters.semantic) return false;
      if (node.layer === "kinetic" && !activeFilters.kinetic) return false;
      if (node.layer === "dynamic" && !activeFilters.dynamic) return false;
      return true;
    });

    // Filter links to only include connections between filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));
    const filteredLinks = data.links.filter(
      (link) =>
        filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );

    // Create a simple force-directed graph
    const simulation = createSimulation(
      filteredNodes,
      filteredLinks,
      width,
      height
    );

    // Start animation
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply zoom
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Draw connections
      drawLinks(ctx, filteredLinks, filteredNodes);

      // Draw nodes
      drawNodes(ctx, filteredNodes);

      ctx.restore();

      // Continue animation
      animationFrameId = requestAnimationFrame(animate);
    };

    setTimeout(() => {
      setLoading(false);
      animate();
    }, 500);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [data, width, height, zoom, activeFilters]);

  // Toggle a layer filter
  const toggleFilter = (layer: "semantic" | "kinetic" | "dynamic") => {
    setActiveFilters((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Zoom controls
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <Card className="w-full overflow-hidden border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-normal text-base">
          Ontology Visualization
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            className={activeFilters.semantic ? "bg-primary/10" : ""}
            onClick={() => toggleFilter("semantic")}
            size="sm"
            variant="outline"
          >
            Semantic
          </Button>
          <Button
            className={activeFilters.kinetic ? "bg-primary/10" : ""}
            onClick={() => toggleFilter("kinetic")}
            size="sm"
            variant="outline"
          >
            Kinetic
          </Button>
          <Button
            className={activeFilters.dynamic ? "bg-primary/10" : ""}
            onClick={() => toggleFilter("dynamic")}
            size="sm"
            variant="outline"
          >
            Dynamic
          </Button>
          <Button className="h-8 w-8" size="icon" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative p-0">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="relative" style={{ height: `${height}px` }}>
          <canvas
            className="bg-card"
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
          />

          <div className="absolute right-4 bottom-4 flex flex-col rounded-md border border-border bg-background/80 p-1 backdrop-blur-sm">
            <Button
              className="h-8 w-8"
              onClick={zoomIn}
              size="icon"
              variant="ghost"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8"
              onClick={zoomOut}
              size="icon"
              variant="ghost"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8"
              onClick={resetZoom}
              size="icon"
              variant="ghost"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 rounded-md border border-border bg-background/80 p-2 text-xs backdrop-blur-sm">
            <div className="mb-1 flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-primary" />
              <span>Semantic Layer</span>
            </div>
            <div className="mb-1 flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-chart-2" />
              <span>Kinetic Layer</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-chart-3" />
              <span>Dynamic Layer</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to create a simple force-directed graph simulation
function createSimulation(
  nodes: Node[],
  links: Link[],
  width: number,
  height: number
) {
  // Initialize node positions randomly
  nodes.forEach((node) => {
    (node as any).x = Math.random() * width;
    (node as any).y = Math.random() * height;
    (node as any).vx = 0;
    (node as any).vy = 0;
  });

  // Create a lookup map for nodes
  const nodeMap = new Map<string, any>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  // Initialize links with source and target nodes
  const processedLinks = links.map((link) => ({
    ...link,
    sourceNode: nodeMap.get(link.source),
    targetNode: nodeMap.get(link.target),
  }));

  // Run some iterations of the force simulation
  for (let i = 0; i < 300; i++) {
    applyForces(nodes, processedLinks, width, height);
  }

  return { nodes, links: processedLinks };
}

// Apply forces to nodes
function applyForces(
  nodes: any[],
  links: any[],
  width: number,
  height: number
) {
  // Repulsive force between all nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      const dx = nodeA.x - nodeB.x;
      const dy = nodeA.y - nodeB.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      // Stronger repulsion for nodes of the same layer
      const repulsionFactor = nodeA.layer === nodeB.layer ? 2000 : 1000;

      const force = repulsionFactor / (distance * distance);
      const forceX = (dx * force) / distance;
      const forceY = (dy * force) / distance;

      nodeA.vx += forceX;
      nodeA.vy += forceY;
      nodeB.vx -= forceX;
      nodeB.vy -= forceY;
    }
  }

  // Attractive force along links
  for (const link of links) {
    const sourceNode = link.sourceNode;
    const targetNode = link.targetNode;

    if (!(sourceNode && targetNode)) continue;

    const dx = sourceNode.x - targetNode.x;
    const dy = sourceNode.y - targetNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    // Adjust link strength based on the link's strength property
    const force = 0.1 * link.strength;
    const forceX = dx * force;
    const forceY = dy * force;

    sourceNode.vx -= forceX;
    sourceNode.vy -= forceY;
    targetNode.vx += forceX;
    targetNode.vy += forceY;
  }

  // Update positions with velocity and apply damping
  for (const node of nodes) {
    node.vx *= 0.9; // Damping factor
    node.vy *= 0.9;

    node.x += node.vx;
    node.y += node.vy;

    // Keep nodes within bounds
    node.x = Math.max(50, Math.min(width - 50, node.x));
    node.y = Math.max(50, Math.min(height - 50, node.y));
  }
}

// Draw nodes on canvas
function drawNodes(ctx: CanvasRenderingContext2D, nodes: any[]) {
  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);

    // Set color based on node layer
    if (node.layer === "semantic") {
      ctx.fillStyle = "rgb(48, 96, 209)"; // Primary blue
    } else if (node.layer === "kinetic") {
      ctx.fillStyle = "rgb(138, 92, 246)"; // Purple
    } else if (node.layer === "dynamic") {
      ctx.fillStyle = "rgb(45, 157, 145)"; // Teal
    } else {
      ctx.fillStyle = "rgb(150, 150, 150)"; // Gray
    }

    ctx.fill();

    // Draw node border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw node label
    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  }
}

// Draw links on canvas
function drawLinks(ctx: CanvasRenderingContext2D, links: any[], nodes: any[]) {
  // Create a map for quick node lookup
  const nodeMap = new Map<string, any>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  for (const link of links) {
    const sourceNode = nodeMap.get(link.source);
    const targetNode = nodeMap.get(link.target);

    if (!(sourceNode && targetNode)) continue;

    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    ctx.lineTo(targetNode.x, targetNode.y);

    // Set link color and width based on link type
    ctx.strokeStyle = "rgba(150, 150, 150, 0.4)";
    ctx.lineWidth = link.strength * 2;

    ctx.stroke();

    // Draw direction arrow
    const arrowSize = 5;
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const angle = Math.atan2(dy, dx);

    // Calculate position for arrow (80% of the way from source to target)
    const arrowX = sourceNode.x + dx * 0.8;
    const arrowY = sourceNode.y + dy * 0.8;

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
      arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
      arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();

    ctx.fillStyle = "rgba(150, 150, 150, 0.8)";
    ctx.fill();
  }
}
