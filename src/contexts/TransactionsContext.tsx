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

interface ICreateTransactionInput {
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;

}

interface ITransactionContextType {
  transactions: ITransaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: ICreateTransactionInput) => Promise<void>
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
        _sort: 'created_at',
        _order: 'desc',
        q: query
      }
    })
    setTransactions(response.data)
  }

  async function createTransaction(data: ICreateTransactionInput) {
    const { category, description, price, type } = data

    const response = await api.post('transactions', {
      description,
      category,
      price,
      type,
      created_at: new Date(),


    })

    setTransactions(state => [response.data, ...state])
  }

  useEffect(() => {

    fetchTransactions()
  }, [])
  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions, createTransaction }
    }>
      {children}
    </TransactionsContext.Provider >
  )
}