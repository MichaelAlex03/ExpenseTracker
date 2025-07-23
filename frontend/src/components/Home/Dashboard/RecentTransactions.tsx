interface Transaction {
  nameOfPayment: string;
  paymentType: string;
  paymentAmount: string;
  paymentDate: Date;
}

interface RecentTransactionProps {
  transaction: Transaction[];
}

const RecentTransactions = () => {
  return (
    <div className="border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-102">
      <div className="w-full">
        <h1 className="text-2xl text-[#09090B] font-semibold">
          Recent Transactions
        </h1>
      </div>
    </div>
  );
};

export default RecentTransactions;
