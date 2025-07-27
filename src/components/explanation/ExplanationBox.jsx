
import { Lightbulb } from "lucide-react";

export default function ExplanationBox({ explanation }) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md h-full">
      <div className="flex items-center mb-2">
        <Lightbulb className="text-yellow-400 mr-2" />
        <h2 className="text-lg font-bold">Move Explanation</h2>
      </div>
      <p className="text-sm">{explanation || "Select a move to get explanation."}</p>
    </div>
  );
}
