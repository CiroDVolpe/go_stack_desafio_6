import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    var transactions = await this.find();
    var income = 0;
    var outcome = 0;

    transactions.map(transaction =>
      transaction.type == "income" ?
      income += Number(transaction.value):
      outcome = Number(transaction.value)
    );

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
