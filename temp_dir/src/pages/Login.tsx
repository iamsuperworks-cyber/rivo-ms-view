import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <span className="font-heading text-xl font-bold tracking-tight text-foreground">
          Rivo
        </span>
      </div>
      <Card className="w-full max-w-md shadow-md border border-border">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Welcome
            </h1>
          </div>
          <div className="space-y-2">
            <label className="font-body text-sm font-medium text-foreground">
              Enter your email
            </label>
            <Input
              type="text"
              placeholder="name@example.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => navigate("/verify")}
          >
            Send Verification Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
