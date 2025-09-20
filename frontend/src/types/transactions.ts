//Income object returned from POST api call
export interface IncomeResponseObject {
    id: number
    incomeAmount: string
    incomeDescription: string
    incomeCategory: string
    incomeFrequency: string
    dateOfIncome: Date
    additionalNotes: string
    userId: number
  }
  
  //Expense object returned from POST api call
  export interface ExpenseResponseObject {
    id: number
    userId: number
    expenseAmount: string
    expenseDescription: string
    expenseCategory: string
    expensePaymentMethod: string
    dateOfExpense: Date
    additionalNotes: string
  }