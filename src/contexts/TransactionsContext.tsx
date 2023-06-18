import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

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
  fetchTransactions: (query?: string) => Promise<void>
}

interface ITransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as ITransactionContextType)

export function TransactionsProvider({ children }: ITransactionsProviderProps) {

  const [transactions, setTransactions] = useState<ITransaction[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api.get('/transactions', {
      params: {
        q: query
      }
    })

    setTransactions(response.data)
  }
  useEffect(() => {

    fetchTransactions()
  }, [])
  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions }
    }>
      {children}
    </TransactionsContext.Provider >
  )
}