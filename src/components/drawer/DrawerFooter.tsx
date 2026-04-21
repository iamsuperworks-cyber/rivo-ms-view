interface DrawerFooterProps {
  onQualify: () => void;
  onDecline: () => void;
  onNurture: () => void;
}

export function DrawerFooter({ onQualify, onDecline, onNurture }: DrawerFooterProps) {
  return (
    <div className="border-t border-border p-4 bg-card space-y-2">
      <div className="flex gap-2">
        <button
          onClick={onQualify}
          className="flex-1 py-2 text-sm font-medium rounded-md bg-rivo-purple text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Qualify & Convert
        </button>
        <button
          onClick={onDecline}
          className="flex-1 py-2 text-sm font-medium rounded-md border border-rivo-danger text-rivo-danger hover:bg-rivo-danger-bg transition-colors"
        >
          Decline
        </button>
        <button
          onClick={onNurture}
          className="flex-1 py-2 text-sm font-medium rounded-md border border-rivo-info text-rivo-info hover:bg-rivo-info-bg transition-colors"
        >
          Nurture
        </button>
      </div>
      <button className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
        Save Draft
      </button>
    </div>
  );
}
