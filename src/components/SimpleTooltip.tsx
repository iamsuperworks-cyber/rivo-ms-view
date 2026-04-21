import { useState, useRef, useCallback, type ReactNode } from "react";

interface SimpleTooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
}

export const SimpleTooltip = ({ text, children, className = "" }: SimpleTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 200);
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <span
          className="absolute z-50 pointer-events-none whitespace-normal"
          style={{
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1A1A2E",
            color: "#FFFFFF",
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 7,
            maxWidth: 220,
            lineHeight: 1.4,
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: "normal",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};
