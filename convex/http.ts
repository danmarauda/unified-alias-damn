import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * HTTP Router Configuration
 *
 * Handles:
 * - ALIAS Hivemind V3 observability ingestion
 * - Future WorkOS authentication hooks
 * - Custom API routes and webhooks
 */
const http = httpRouter();

/**
 * POST /api/observability/ingest
 *
 * Accepts observability events from Claude Code hooks and Hivemind V3.
 * Supports both single events and batches for high-throughput scenarios.
 */
http.route({
  path: "/api/observability/ingest",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      if (!body) {
        return new Response(JSON.stringify({ error: "Request body required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Batch ingestion
      if (body.batch === true && Array.isArray(body.events)) {
        for (const event of body.events) {
          if (!event.sessionId || !event.sourceApp || !event.eventType || !event.action) {
            return new Response(
              JSON.stringify({
                error: "Each event must have sessionId, sourceApp, eventType, and action",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        }

        await ctx.runMutation(api.observability.ingestEventsBatch, {
          events: body.events,
        });

        return new Response(
          JSON.stringify({
            success: true,
            eventsIngested: body.events.length,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Single event ingestion
      if (!body.sessionId || !body.sourceApp || !body.eventType || !body.action) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields: sessionId, sourceApp, eventType, action",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      await ctx.runMutation(api.observability.ingestEvent, {
        sessionId: body.sessionId,
        sourceApp: body.sourceApp,
        eventType: body.eventType,
        action: body.action,
        payload: body.payload,
        agentName: body.agentName,
        squadron: body.squadron,
        llmProvider: body.llmProvider,
        llmModel: body.llmModel,
        tokensUsed: body.tokensUsed,
        costEstimate: body.costEstimate,
        status: body.status,
        duration: body.duration,
        metadata: body.metadata,
      });

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Observability ingest error:", error);

      return new Response(
        JSON.stringify({
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

/**
 * POST /api/observability/neural
 *
 * Record UCE neural network activations (35 neurons)
 */
http.route({
  path: "/api/observability/neural",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      if (!body) {
        return new Response(JSON.stringify({ error: "Request body required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Batch activation recording
      if (body.batch === true && Array.isArray(body.activations)) {
        for (const activation of body.activations) {
          if (
            !activation.sessionId ||
            !activation.neuronId ||
            !activation.neuronName ||
            typeof activation.activationLevel !== "number" ||
            typeof activation.weight !== "number" ||
            !activation.context
          ) {
            return new Response(
              JSON.stringify({
                error:
                  "Each activation must have sessionId, neuronId, neuronName, activationLevel, weight, and context",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        }

        await ctx.runMutation(api.observability.recordNeuralActivationsBatch, {
          activations: body.activations,
        });

        return new Response(
          JSON.stringify({
            success: true,
            activationsRecorded: body.activations.length,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Single activation recording
      if (
        !body.sessionId ||
        !body.neuronId ||
        !body.neuronName ||
        typeof body.activationLevel !== "number" ||
        typeof body.weight !== "number" ||
        !body.context
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required fields: sessionId, neuronId, neuronName, activationLevel, weight, context",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      await ctx.runMutation(api.observability.recordNeuralActivation, {
        sessionId: body.sessionId,
        neuronId: body.neuronId,
        neuronName: body.neuronName,
        activationLevel: body.activationLevel,
        weight: body.weight,
        context: body.context,
      });

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Neural activation recording error:", error);

      return new Response(
        JSON.stringify({
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

/**
 * POST /api/observability/squadron
 *
 * Update squadron status (3 squadrons × 9 agents = 27 total)
 */
http.route({
  path: "/api/observability/squadron",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      if (
        !body ||
        !body.squadronName ||
        typeof body.activeAgents !== "number" ||
        typeof body.totalAgents !== "number" ||
        !Array.isArray(body.currentTasks) ||
        typeof body.performanceScore !== "number"
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required fields: squadronName, activeAgents, totalAgents, currentTasks, performanceScore",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      await ctx.runMutation(api.observability.updateSquadronStatus, {
        squadronName: body.squadronName,
        activeAgents: body.activeAgents,
        totalAgents: body.totalAgents,
        currentTasks: body.currentTasks,
        performanceScore: body.performanceScore,
      });

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Squadron status update error:", error);

      return new Response(
        JSON.stringify({
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

/**
 * GET /api/observability/health
 *
 * Health check endpoint
 */
http.route({
  path: "/api/observability/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: Date.now(),
        service: "alias-hivemind-v3-observability",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

/**
 * GET /test
 *
 * Simple test endpoint
 */
http.route({
  path: "/test",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ message: "Test endpoint works!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http;
