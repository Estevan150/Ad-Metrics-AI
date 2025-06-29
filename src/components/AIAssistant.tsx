
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Olá! Sou sua IA especialista em Meta Ads e Google Ads. Como posso ajudá-lo a otimizar suas campanhas hoje?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickQuestions = [
    "Como melhorar o CTR das minhas campanhas?",
    "Por que meu CPC está alto?",
    "Quais palavras-chave devo usar?",
    "Como otimizar o orçamento?",
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage("");
  };

  const getAIResponse = (userInput: string): string => {
    const responses = [
      "Com base na análise dos seus dados, recomendo focar em campanhas com CTR acima de 2% e reduzir orçamento das com CTR abaixo de 1%. Também sugiro testar novos públicos similares aos seus melhores conversores.",
      "Analisando suas métricas, vejo que o horário das 18h-20h tem melhor performance. Considere aumentar os lances neste período e pausar campanhas de baixo desempenho.",
      "Para otimizar suas campanhas, sugiro implementar palavras-chave negativas, testar novos formatos de anúncio e ajustar a segmentação demográfica com base nos dados de conversão.",
      "Baseado no seu histórico, recomendo redistribuir 30% do orçamento das campanhas de awareness para campanhas de conversão, que estão apresentando ROI 2.3x maior."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-2xl z-50 flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">IA Marketing Assistant</h3>
              <p className="text-xs opacity-90">Especialista em Meta & Google Ads</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === "ai" && (
                    <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                  )}
                  {message.type === "user" && (
                    <User className="w-4 h-4 mt-0.5 text-white" />
                  )}
                  <div>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>Perguntas rápidas:</span>
            </div>
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start text-sm h-auto p-3 hover:bg-blue-50"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Digite sua pergunta..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
