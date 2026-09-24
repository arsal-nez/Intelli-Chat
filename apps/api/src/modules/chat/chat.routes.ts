import { Router, Response } from "express";
import { Conversation, Message } from "../../database/models/conversation.model";
import { Event } from "../../database/models/event.model";
import { RSVP } from "../../database/models/rsvp.model";
import { authenticate, AuthRequest } from "../../middleware/auth";

const router = Router();

async function handleToolCall(toolName: string, args: any, userId: string) {
  switch (toolName) {
    case "search_events": {
      const filter: any = { status: "active" };
      if (args.keyword) filter.title = { $regex: args.keyword, $options: "i" };
      if (args.category) filter.category = { $regex: args.category, $options: "i" };
      if (args.city) filter["venue.city"] = { $regex: args.city, $options: "i" };
      const events = await Event.find(filter).sort({ startTime: 1 }).limit(10);
      return { events };
    }
    case "get_event": {
      const event = await Event.findById(args.eventId);
      return event ? { event } : { error: "Event not found" };
    }
    case "get_my_rsvps": {
      const rsvps = await RSVP.find({ userId, status: "confirmed" }).populate("eventId");
      return { rsvps };
    }
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

function classifyIntent(message: string): { tool: string; args: any } | null {
  const lower = message.toLowerCase();
  if (lower.includes("find") || lower.includes("search") || lower.includes("show") || lower.includes("what")) {
    const categoryMatch = lower.match(/\b(music|concert|sports|comedy|theater|theatre|festival)\b/);
    const cityMatch = lower.match(/\bin\s+(\w+)/);
    return {
      tool: "search_events",
      args: {
        keyword: categoryMatch ? categoryMatch[1] : undefined,
        category: categoryMatch ? categoryMatch[1] : undefined,
        city: cityMatch ? cityMatch[1] : undefined,
      },
    };
  }
  if (lower.includes("my events") || lower.includes("my rsvp") || lower.includes("upcoming")) {
    return { tool: "get_my_rsvps", args: {} };
  }
  return null;
}

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { message, conversationId } = req.body;
    if (!message) {
      res.status(400).json({ success: false, error: { code: "VALIDATION", message: "message required" } });
      return;
    }

    let convo;
    if (conversationId) {
      convo = await Conversation.findById(conversationId);
    }
    if (!convo) {
      convo = await Conversation.create({ userId, title: message.substring(0, 50) });
    }

    await Message.create({ conversationId: convo._id, role: "user", content: message });

    const intent = classifyIntent(message);
    let responseContent: string;
    let toolResults: any = null;

    if (intent) {
      const result = await handleToolCall(intent.tool, intent.args, userId);
      toolResults = { tool: intent.tool, result };

      if (intent.tool === "search_events" && (result as any).events) {
        const events = (result as any).events;
        if (events.length === 0) {
          responseContent = "I couldn't find any events matching your search. Try a different keyword or city!";
        } else {
          responseContent = `I found ${events.length} event${events.length > 1 ? "s" : ""} for you! Here they are:`;
        }
      } else if (intent.tool === "get_my_rsvps" && (result as any).rsvps) {
        const rsvps = (result as any).rsvps;
        if (rsvps.length === 0) {
          responseContent = "You don't have any upcoming RSVPs yet. Would you like me to find some events for you?";
        } else {
          responseContent = `You have ${rsvps.length} upcoming event${rsvps.length > 1 ? "s" : ""}:`;
        }
      } else {
        responseContent = "Here's what I found:";
      }
    } else {
      responseContent =
        "I can help you find events, check your RSVPs, and more! Try asking me something like:\n" +
        '- "Find music events"\n' +
        '- "Show my upcoming events"\n' +
        '- "Find concerts in New York"';
    }

    await Message.create({
      conversationId: convo._id,
      role: "assistant",
      content: responseContent,
      toolCalls: toolResults ? [toolResults] : undefined,
    });

    res.json({
      success: true,
      data: {
        conversationId: convo._id,
        response: responseContent,
        toolResults,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

export default router;
