import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md border border-border">
        <CardContent className="p-8 space-y-6">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Enter verification code
            </h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              We've sent a 6-digit code to your email
            </p>
          </div>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (value.length === 6) {
                  sessionStorage.setItem("authenticated", "true");
                  navigate("/");
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="text-center">
            <button className="font-body text-sm font-medium text-primary hover:underline">
              Resend code
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
