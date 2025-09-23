import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  amount: string;
}

const MetricCard = ({ title, icon: Icon, amount }: MetricCardProps) => {
  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full h-full">
      <div className="flex flex-row items-center gap-4">
        <div className="bg-[#FAFAFA] p-4 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-medium text-base text-[#18181B]">{title}</h1>
          <p className="text-3xl font-bold text-[#18181B]">{amount}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
