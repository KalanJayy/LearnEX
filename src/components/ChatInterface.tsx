
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Loader2, Brain, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  model?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm LearnEX AI, your learning and career development assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("openai");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending message to AI:", userMessage.content, "using model:", selectedModel);

      // Prepare conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          message: userMessage.content,
          conversationHistory,
          model: selectedModel,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to get AI response");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: data.timestamp || new Date().toISOString(),
        model: data.model,
      };

      setMessages((prev) => [...prev, aiMessage]);
      console.log("AI response received and displayed");
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble responding right now. Please try again.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getModelIcon = (model?: string) => {
    return model === "gemini" ? <Sparkles className="w-4 h-4 text-blue-400" /> : <Brain className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="bg-gradient-to-br from-black to-purple-900/80">
      <Card className="w-full max-w-4xl mx-auto h-[600px] glass-effect">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-neon-purple" />
              LearnEX AI Assistant
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-32 bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-green-400" />
                    OpenAI
                  </div>
                </SelectItem>
                <SelectItem value="gemini">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Gemini
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {message.role === "user" ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#deabf7] to-[#9332c4] flex items-center justify-center">
                          <User className="w-4 h-4 text-black" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-[#9332c4] flex items-center justify-center">
                          <Bot className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl ${
                        message.role === "user"
                          ? "glass-effect-3"
                          : "glass-effect"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                        {message.role === "assistant" && message.model && (
                          <div className="flex items-center gap-1">
                            {getModelIcon(message.model)}
                            <span className="text-xs opacity-70 capitalize">
                              {message.model}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="glass-effect p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                      <span className="text-sm">
                        {selectedModel === "gemini" ? "Gemini" : "OpenAI"} is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask ${selectedModel === "gemini" ? "Gemini" : "OpenAI"} about learning, careers, or skills...`}
                disabled={isLoading}
                className="flex-1 bg-background/50 border-border/50 focus:border-neon-cyan"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-neon-purple text-black hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
