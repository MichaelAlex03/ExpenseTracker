import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { type IncomeResponseObject, type ExpenseResponseObject } from '../../../types/types';

interface MonthlyOverviewProps {
  incomeData: IncomeResponseObject[];
  expenseData: ExpenseResponseObject[];
  selectedMonth: Date;
}

const MonthlyOverview = ({ incomeData, expenseData, selectedMonth }: MonthlyOverviewProps) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const getDailyData = () => {
    const daysInMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    ).getDate();

    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      income: 0,
      expenses: 0
    }));

    incomeData
      .filter(income => {
        const date = new Date(income.dateOfIncome);
        return (
          date.getMonth() === selectedMonth.getMonth() &&
          date.getFullYear() === selectedMonth.getFullYear()
        );
      })
      .forEach(income => {
        const day = new Date(income.dateOfIncome).getDate();
        dailyData[day - 1].income += parseFloat(income.incomeAmount);
      });

    expenseData
      .filter(expense => {
        const date = new Date(expense.dateOfExpense);
        return (
          date.getMonth() === selectedMonth.getMonth() &&
          date.getFullYear() === selectedMonth.getFullYear()
        );
      })
      .forEach(expense => {
        const day = new Date(expense.dateOfExpense).getDate();
        dailyData[day - 1].expenses += parseFloat(expense.expenseAmount);
      });


    return dailyData;
  };

  const chartData = getDailyData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-md">
          <p className="text-sm">{months[selectedMonth.getMonth()]} {label}{getOrdinalSuffix(label)}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color }}>
              {pld.name}: ${pld.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-102">
      <div className="w-full mb-4">
        <h1 className="text-2xl text-[#09090B] font-semibold">Monthly Overview</h1>
        <p className="text-sm text-gray-500">Daily income and expenses for {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="w-full h-[400px]">
        <LineChart width={550} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day"
            interval={1}
            tickMargin={5}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4ADE80" strokeWidth={2} name="Income" dot={false} />
          <Line type="monotone" dataKey="expenses" stroke="#F87171" strokeWidth={2} name="Expenses" dot={false} />
        </LineChart>
      </div>
    </div>
  );
};

export default MonthlyOverview;
