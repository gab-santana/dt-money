import { ReactNode, createContext, useEffect, useState } from "react";

interface ITransaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  created_at: string;
}

interface ITransactionContextType {
  transactions: ITransaction[]
}

interface ITransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as ITransactionContextType)

export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  async function loadTransactions() {
    const response = await fetch('http://localhost:3000/transactions')

    const data = await response.json()

    setTransactions(data)
  }
  useEffect(() => {

    loadTransactions()
  }, [])
  return (
    <TransactionsContext.Provider value={{ transactions }
    }>
      {children}
    </TransactionsContext.Provider >
  )
}