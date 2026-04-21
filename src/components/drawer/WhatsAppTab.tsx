import { MessageCircle } from "lucide-react";

export function WhatsAppTab() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground">
      <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
      <p className="text-sm">Messages will appear here</p>
    </div>
  );
}
