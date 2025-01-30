import { Card } from "@/components/ui/card";

export const SpecialFare = () => {
  const fareCategories = [
    {
      type: "Armed forces",
      discount: "Up to ₹ 500 off"
    },
    {
      type: "Senior Citizen",
      discount: "Up to ₹ 500 off"
    },
    {
      type: "Student",
      discount: "Extra Discount/Baggage"
    }
  ];

  return (
    <Card className="mb-4">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Get More Benefits with</h2>
          <span className="text-teal-600">Special Fare</span>
          <span className="px-2 py-0.5 text-xs bg-pink-600 text-white rounded">new</span>
        </div>

        <p className="text-gray-600 mb-6">
          Check the availability of the special fare if the travellers selected above belong to one of these categories.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {fareCategories.map((category, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-500"
            >
              <input 
                type="radio" 
                name="special-fare" 
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium">{category.type}</div>
                <div className="text-sm text-gray-500">{category.discount}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
};