"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// Define types for collaboration
export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  active: boolean;
  lastActive: Date;
}

export interface CollaborationMessage {
  type:
    | "cursor_move"
    | "node_move"
    | "zoom"
    | "user_join"
    | "user_leave"
    | "ping";
  userId: string;
  data?: any;
  timestamp: Date;
}

interface CollaborationContextType {
  users: User[];
  currentUser: User | null;
  sendMessage: (
    message: Omit<CollaborationMessage, "userId" | "timestamp">
  ) => void;
  isConnected: boolean;
}

// Create a context for collaboration
const CollaborationContext = createContext<CollaborationContextType>({
  users: [],
  currentUser: null,
  sendMessage: () => {},
  isConnected: false,
});

// Mock WebSocket for demonstration purposes
class MockWebSocket {
  private callbacks: { [event: string]: ((data?: any) => void)[] } = {
    open: [],
    message: [],
    close: [],
    error: [],
  };
  private mockUsers: User[] = [];
  private isOpen = false;
  private mockServerMessages: CollaborationMessage[] = [];
  private interval: NodeJS.Timeout | null = null;

  constructor(url: string) {
    // Generate 3-5 mock users for demonstration
    const userCount = Math.floor(Math.random() * 3) + 3;
    const userNames = [
      "Sarah",
      "Michael",
      "Lisa",
      "David",
      "Alex",
      "Olivia",
      "Thomas",
      "Samantha",
    ];
    const userColors = [
      "#3060D1",
      "#50C878",
      "#F9A826",
      "#FF6B6B",
      "#9C27B0",
      "#FF5722",
      "#607D8B",
      "#795548",
    ];

    for (let i = 0; i < userCount; i++) {
      this.mockUsers.push({
        id: `user-${i + 1}`,
        name: userNames[i % userNames.length],
        color: userColors[i % userColors.length],
        cursor: { x: Math.random() * 500, y: Math.random() * 500 },
        active: true,
        lastActive: new Date(),
      });
    }

    // Simulate connection delay
    setTimeout(() => {
      this.isOpen = true;
      this.callbacks.open.forEach((cb) => cb());

      // Send initial users list
      this.sendServerMessage({
        type: "user_join",
        userId: "server",
        data: { users: this.mockUsers },
        timestamp: new Date(),
      });

      // Start simulating real-time updates
      this.startSimulation();
    }, 1000);
  }

  addEventListener(event: string, callback: (data?: any) => void) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  removeEventListener(event: string, callback: (data?: any) => void) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  send(data: string) {
    if (!this.isOpen) return;

    try {
      const message = JSON.parse(data) as CollaborationMessage;

      // Echo message back to simulate server response
      setTimeout(() => {
        this.sendServerMessage(message);

        // Simulate other users reacting to the message
        if (message.type === "node_move" || message.type === "zoom") {
          this.simulateUserResponses(message);
        }
      }, 50);
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  }

  close() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.isOpen = false;
    this.callbacks.close.forEach((cb) => cb());
  }

  // Helper method to send a message from the mock server
  private sendServerMessage(message: CollaborationMessage) {
    const event = {
      data: JSON.stringify(message),
    };

    this.callbacks.message.forEach((cb) => cb(event));
  }

  // Simulate other users moving their cursors and interacting
  private startSimulation() {
    this.interval = setInterval(() => {
      // Randomly move a user's cursor
      const randomUserIndex = Math.floor(Math.random() * this.mockUsers.length);
      const user = this.mockUsers[randomUserIndex];

      if (Math.random() > 0.7) {
        // Move cursor
        user.cursor = {
          x: Math.max(
            0,
            Math.min(500, user.cursor!.x + (Math.random() * 100 - 50))
          ),
          y: Math.max(
            0,
            Math.min(500, user.cursor!.y + (Math.random() * 100 - 50))
          ),
        };

        this.sendServerMessage({
          type: "cursor_move",
          userId: user.id,
          data: { cursor: user.cursor },
          timestamp: new Date(),
        });
      }

      if (Math.random() > 0.9) {
        // Simulate a node move
        this.sendServerMessage({
          type: "node_move",
          userId: user.id,
          data: {
            nodeId: `node-${Math.floor(Math.random() * 10) + 1}`,
            position: {
              x: Math.random() * 500,
              y: Math.random() * 500,
            },
          },
          timestamp: new Date(),
        });
      }

      // Randomly toggle user active state
      if (Math.random() > 0.95) {
        user.active = !user.active;
        user.lastActive = new Date();

        this.sendServerMessage({
          type: user.active ? "user_join" : "user_leave",
          userId: user.id,
          data: { user },
          timestamp: new Date(),
        });
      }
    }, 2000);
  }

  // Simulate other users reacting to a user's actions
  private simulateUserResponses(originalMessage: CollaborationMessage) {
    // Some users will echo or react to the original message
    this.mockUsers.forEach((user) => {
      if (user.id !== originalMessage.userId && Math.random() > 0.7) {
        setTimeout(
          () => {
            if (originalMessage.type === "node_move") {
              // Echo with slight variation
              this.sendServerMessage({
                type: "node_move",
                userId: user.id,
                data: {
                  nodeId: originalMessage.data.nodeId,
                  position: {
                    x:
                      originalMessage.data.position.x +
                      (Math.random() * 10 - 5),
                    y:
                      originalMessage.data.position.y +
                      (Math.random() * 10 - 5),
                  },
                },
                timestamp: new Date(),
              });
            } else if (originalMessage.type === "zoom") {
              // Echo zoom
              this.sendServerMessage({
                type: "zoom",
                userId: user.id,
                data: {
                  level: originalMessage.data.level,
                },
                timestamp: new Date(),
              });
            }
          },
          Math.random() * 1000 + 500
        );
      }
    });
  }
}

// Utility function to generate random color
function generateRandomColor(): string {
  const colors = [
    "#3060D1", // Blue
    "#50C878", // Green
    "#F9A826", // Orange
    "#FF6B6B", // Red
    "#9C27B0", // Purple
    "#FF5722", // Deep Orange
    "#607D8B", // Blue Grey
    "#795548", // Brown
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

// CollaborationProvider component
export function CollaborationProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<MockWebSocket | null>(null);

  // Set up WebSocket connection on component mount
  useEffect(() => {
    // Create a mock user for the current user
    const user: User = {
      id: `local-user-${Math.random().toString(36).substring(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      color: generateRandomColor(),
      active: true,
      lastActive: new Date(),
    };

    setCurrentUser(user);

    // Create a new WebSocket connection
    const socket = new MockWebSocket(
      `wss://mock-socket-server.alias-mosaic.com/ontology/${projectId}`
    );
    socketRef.current = socket;

    // Set up event listeners
    socket.addEventListener("open", () => {
      setIsConnected(true);

      // Send join message
      const joinMessage: CollaborationMessage = {
        type: "user_join",
        userId: user.id,
        data: { user },
        timestamp: new Date(),
      };

      socket.send(JSON.stringify(joinMessage));

      // Set up ping interval
      const pingInterval = setInterval(() => {
        if (socket && isConnected) {
          const pingMessage: CollaborationMessage = {
            type: "ping",
            userId: user.id,
            timestamp: new Date(),
          };

          socket.send(JSON.stringify(pingMessage));
        }
      }, 30_000);

      return () => clearInterval(pingInterval);
    });

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data) as CollaborationMessage;

        handleIncomingMessage(message);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    socket.addEventListener("close", () => {
      setIsConnected(false);
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    });

    // Clean up WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [projectId]);

  // Handle incoming messages
  const handleIncomingMessage = (message: CollaborationMessage) => {
    switch (message.type) {
      case "user_join":
        if (message.data.users) {
          // Initial users list
          setUsers(message.data.users);
        } else if (message.data.user) {
          // Single user joined
          setUsers((prev) => {
            // Remove user if already exists
            const filtered = prev.filter((u) => u.id !== message.data.user.id);
            return [...filtered, message.data.user];
          });
        }
        break;

      case "user_leave":
        if (message.data.user) {
          setUsers((prev) => {
            // Update user active status
            return prev.map((u) =>
              u.id === message.data.user.id
                ? {
                    ...u,
                    active: false,
                    lastActive: new Date(message.timestamp),
                  }
                : u
            );
          });
        }
        break;

      case "cursor_move":
        if (message.data.cursor) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === message.userId
                ? {
                    ...u,
                    cursor: message.data.cursor,
                    lastActive: new Date(message.timestamp),
                  }
                : u
            )
          );
        }
        break;

      // Handle other message types as needed

      default:
        break;
    }
  };

  // Send a message to the WebSocket server
  const sendMessage = (
    message: Omit<CollaborationMessage, "userId" | "timestamp">
  ) => {
    if (socketRef.current && isConnected && currentUser) {
      const fullMessage: CollaborationMessage = {
        ...message,
        userId: currentUser.id,
        timestamp: new Date(),
      };

      socketRef.current.send(JSON.stringify(fullMessage));
    }
  };

  return (
    <CollaborationContext.Provider
      value={{ users, currentUser, sendMessage, isConnected }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}

// Custom hook to use the collaboration context
export function useCollaboration() {
  const context = useContext(CollaborationContext);

  if (!context) {
    throw new Error(
      "useCollaboration must be used within a CollaborationProvider"
    );
  }

  return context;
}
