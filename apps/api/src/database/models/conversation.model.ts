import mongoose, { Schema, Document } from "mongoose";

export interface IConversationDoc extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversationDoc>("Conversation", conversationSchema);

export interface IMessageDoc extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: any[];
  timestamp: Date;
}

const messageSchema = new Schema<IMessageDoc>({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  toolCalls: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessageDoc>("Message", messageSchema);
