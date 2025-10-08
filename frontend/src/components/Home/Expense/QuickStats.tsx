import React from "react";

interface QuickStatsProps{
  largestExpense: string
  mostFrequentCategory: string
  dailyAverage: string
}

const QuickStats = ({ largestExpense, mostFrequentCategory, dailyAverage }: QuickStatsProps) => {
  
  return (
    <div className="flex flex-row justify-center border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-60">
      <div className="w-full">
        <h1 className="text-2xl text-[#09090B] font-semibold">
          Quick Stats
          <div className="flex flex-col items-start justify-center mt-10 gap-4">
            <p className="text-base font-medium">Largest Expense: <span className="font-bold text-red-500 ml-1">{largestExpense}</span></p>
            <p className="text-base font-medium">Most Frequent Category: <span className="font-bold text-red-500 ml-1">{mostFrequentCategory}</span></p>
            <p className="text-base font-medium">Daily Average: <span className="font-bold text-red-500 ml-1">{dailyAverage}</span></p>
          </div>
        </h1>
      </div>
    </div>
  );
};

export default QuickStats;
