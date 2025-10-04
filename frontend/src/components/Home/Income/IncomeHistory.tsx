import React, { useState } from "react";
import { X } from 'lucide-react';
import type { IncomeResponseObject } from '../../../types/types';

interface IncomeHistoryProps {
  incomes: IncomeResponseObject[];
  selectedMonth: Date;
}

const IncomeHistory = ({ incomes, selectedMonth }: IncomeHistoryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter incomes for the selected month
  const filterIncomesByMonth = (incomes: IncomeResponseObject[]) => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.dateOfIncome);
      return incomeDate.getMonth() === selectedMonth.getMonth() &&
             incomeDate.getFullYear() === selectedMonth.getFullYear();
    });
  };

  const filteredIncomes = filterIncomesByMonth(incomes);

  const IncomeTable = ({ data, showAll = false }: { data: IncomeResponseObject[], showAll?: boolean }) => (
    <table className="w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Frequency
          </th>
          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {(showAll ? data : data?.slice(0, 5))?.map((income: IncomeResponseObject) => (
          <tr 
            key={income.id} 
            className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-gray-600`}>
              {formatDate(income.dateOfIncome)}
            </td>
            <td className={`px-6 py-4 ${showAll ? 'text-base' : 'text-sm'} text-gray-900`}>
              {income.incomeDescription}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'}`}>
              <span className={`px-3 py-1 rounded-full ${showAll ? 'text-sm' : 'text-xs'} font-medium bg-gray-100 text-gray-800 capitalize`}>
                {income.incomeCategory}
              </span>
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-gray-600`}>
              {income.incomeFrequency}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-right font-medium text-green-600`}>
              +${income.incomeAmount}
            </td>
          </tr>
        ))}
        {!data?.length && (
          <tr>
            <td 
              colSpan={5} 
              className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50"
            >
              No income found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Recent Income</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <IncomeTable data={filteredIncomes || []} />
        </div>
      </div>

      {/* Modal for all income */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Income</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <IncomeTable data={filteredIncomes || []} showAll />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncomeHistory;
