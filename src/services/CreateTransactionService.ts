import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';


interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({ title, type, value, category = 'Other' }:Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    var balance = await transactionsRepository.getBalance();
    if(type == 'outcome' && (balance.total - value < 0)){
      throw new AppError("Saldo insuficiente.");
    }

    var existedCategory = await categoriesRepository.findOne({ where: { title: category } });

    if(!existedCategory){
      existedCategory = await categoriesRepository.create({ title: category });
      await categoriesRepository.save(existedCategory);
    }

    const transaction = transactionsRepository.create({ title, value, type, category: existedCategory });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
