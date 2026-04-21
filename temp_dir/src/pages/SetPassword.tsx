import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const requirements = [
  { label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one number", test: (v: string) => /\d/.test(v) },
  { label: "At least one special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[460px] shadow-md border-border/60">
        <CardContent className="pt-10 pb-10 px-8 md:px-10">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-2">
              Set Your Password
            </h1>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Create a password to access your secure mortgage portal.
            </p>
          </div>

          <div className="space-y-5">
            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Email
              </label>
              <Input
                type="email"
                value="martin.kask@email.com"
                readOnly
                className="bg-muted text-muted-foreground cursor-default"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-1.5 pt-1">
              {requirements.map((req) => {
                const met = req.test(password);
                return (
                  <div key={req.label} className="flex items-center gap-2">
                    {met ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                    <span
                      className={`font-body text-xs ${
                        met ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Button
              variant="premium"
              className="w-full mt-2"
              onClick={() => navigate("/eligibility")}
            >
              Continue
            </Button>
          </div>

          {/* Footer */}
          <p className="font-body text-muted-foreground/70 text-xs text-center mt-8 leading-relaxed">
            If you need help, contact your mortgage specialist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;
