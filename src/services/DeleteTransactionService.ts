import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transaction = await transactionsRepository.findOne({ where: { id } });

    if(!transaction){
      throw new AppError('Transaction does not exist', 404);
    }

    await transactionsRepository.delete(id);
    return;
  }
}

export default DeleteTransactionService;
