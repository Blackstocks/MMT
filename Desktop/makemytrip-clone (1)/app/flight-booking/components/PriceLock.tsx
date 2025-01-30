import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const PriceLock = () => {
  return (
    <Card className="mb-4">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <span className="text-gray-900">Still unsure about this trip? </span>
            <span className="text-teal-600">Lock this price!</span>
          </div>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          LOCK NOW
        </Button>
      </div>
    </Card>
  );
};