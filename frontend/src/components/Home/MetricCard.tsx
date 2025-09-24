import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  amount: string;
}

const MetricCard = ({ title, icon: Icon, amount }: MetricCardProps) => {
  return (
    <div className="flex flex-col border-1 border-gray-300 shadow-lg p-6 rounded-xl">
      <div className="flex flex-row justify-between">
        <p className="text-sm text-[#71717A]">{title}</p>
        <Icon />
      </div>
      <p className="text-2xl font-bold">{amount}</p>
    </div>
  );
};

export default MetricCard;
