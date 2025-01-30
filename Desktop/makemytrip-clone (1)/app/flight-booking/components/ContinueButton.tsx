import { Button } from "@/components/ui/button";

export const ContinueButton = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-end">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-12">
          CONTINUE
        </Button>
      </div>
    </div>
  );
};