"use client";

import { Download, RefreshCw, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CollaborationProvider,
  type User as CollaborationUser,
  useCollaboration,
} from "./CollaborationProvider";
import { OntologyVisualizer } from "./OntologyVisualizer";

// User cursor component
function UserCursor({ user }: { user: CollaborationUser }) {
  if (!user.cursor) return null;

  return (
    <div
      className="pointer-events-none absolute z-50 flex flex-col items-center"
      style={{
        left: user.cursor.x,
        top: user.cursor.y,
        transform: "translate(-10px, -10px)",
        opacity: user.active ? 1 : 0.3,
      }}
    >
      {/* Cursor */}
      <svg
        fill="none"
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 2.5L16 10L5 17.5V2.5Z"
          fill={user.color}
          stroke={user.color}
          strokeWidth="1.5"
        />
      </svg>

      {/* User label */}
      <div
        className="whitespace-nowrap rounded px-2 py-0.5 text-white text-xs leading-none"
        style={{ backgroundColor: user.color, marginTop: "2px" }}
      >
        {user.name}
      </div>
    </div>
  );
}

// Users list component
function UsersList() {
  const { users, currentUser } = useCollaboration();
  const [expanded, setExpanded] = useState(false);

  // Filter out current user and get active users first
  const sortedUsers = [...users]
    .filter((user) => user.id !== currentUser?.id)
    .sort((a, b) => {
      // Active users first
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;

      // Then sort by last active time
      return (
        new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      );
    });

  const activeCount = sortedUsers.filter((user) => user.active).length;

  return (
    <div className="absolute top-4 right-4 z-40">
      <Button
        className="mb-2 bg-background/80 backdrop-blur-sm"
        onClick={() => setExpanded(!expanded)}
        size="sm"
        variant="outline"
      >
        <Users className="mr-1 h-4 w-4" />
        {activeCount} {activeCount === 1 ? "user" : "users"}
      </Button>

      {expanded && (
        <div className="w-48 rounded-md border border-border bg-background/80 p-2 backdrop-blur-sm">
          <div className="mb-2 font-medium text-xs">Collaborators</div>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {sortedUsers.map((user) => (
              <div className="flex items-center justify-between" key={user.id}>
                <div className="flex items-center">
                  <div
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="max-w-[100px] truncate text-xs">
                    {user.name}
                  </span>
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${user.active ? "bg-green-500" : "bg-gray-400"}`}
                  title={user.active ? "Online" : "Offline"}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Collaboration wrapper for OntologyVisualizer
function CollaborativeVisualizerInner({
  data,
  height,
  width,
}: {
  data: any;
  height?: number;
  width?: number;
}) {
  const { users, currentUser, sendMessage, isConnected } = useCollaboration();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      // Send cursor position update
      if (isConnected && !isDragging) {
        sendMessage({
          type: "cursor_move",
          data: { cursor: { x, y } },
        });
      }
    };

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
      containerRef.current.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isConnected, sendMessage, isDragging]);

  // Handle zoom change
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);

    // Send zoom update
    sendMessage({
      type: "zoom",
      data: { level: newZoom },
    });
  };

  // Handle node movement
  const handleNodeMove = (
    nodeId: string,
    position: { x: number; y: number }
  ) => {
    // Send node move update
    sendMessage({
      type: "node_move",
      data: { nodeId, position },
    });
  };

  return (
    <div
      className="relative"
      ref={containerRef}
      style={{
        height: `${height || 600}px`,
        width: width ? `${width}px` : "100%",
      }}
    >
      {/* Visualizer component */}
      <OntologyVisualizer data={data} height={height} width={width} />

      {/* User cursors */}
      {users
        .filter(
          (user) => user.id !== currentUser?.id && user.cursor && user.active
        )
        .map((user) => (
          <UserCursor key={user.id} user={user} />
        ))}

      {/* User list */}
      <UsersList />

      {/* Connection status */}
      {!isConnected && (
        <div className="absolute bottom-4 left-4 flex items-center rounded-full bg-yellow-500/80 px-3 py-1 text-black text-xs">
          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
          Reconnecting...
        </div>
      )}
    </div>
  );
}

// Main component with CollaborationProvider
export function CollaborativeOntologyVisualizer({
  projectId = "demo-project",
  data,
  height,
  width,
}: {
  projectId?: string;
  data: any;
  height?: number;
  width?: number;
}) {
  return (
    <Card className="w-full overflow-hidden border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-normal text-base">
          Ontology Visualization
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            Semantic
          </Button>
          <Button size="sm" variant="outline">
            Kinetic
          </Button>
          <Button size="sm" variant="outline">
            Dynamic
          </Button>
          <Button className="h-8 w-8" size="icon" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative p-0">
        <CollaborationProvider projectId={projectId}>
          <CollaborativeVisualizerInner
            data={data}
            height={height}
            width={width}
          />
        </CollaborationProvider>
      </CardContent>
    </Card>
  );
}
