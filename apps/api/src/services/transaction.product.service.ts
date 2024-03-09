import { prisma } from "./prisma.service";
import { TransactionsProducts } from "@prisma/client";

export default class TransactionProductService {
    async create(transactionProduct: TransactionsProducts): Promise<TransactionsProducts> {
        return await prisma.transactionsProducts.create({
            data: transactionProduct
        });
    }

    async getByTransactionId(transactionId: number): Promise<TransactionsProducts[]> {
        return await prisma.transactionsProducts.findMany({
            where: {
                transactionId: transactionId
            }
        });
    }

    async getById(id: number): Promise<TransactionsProducts | null> {
        return await prisma.transactionsProducts.findUnique({
            where: {
                id: id
            }
        });
    }

    async update(id: number, transactionProduct: TransactionsProducts): Promise<TransactionsProducts> {
        return await prisma.transactionsProducts.update({
            where: {
                id: id
            },
            data: transactionProduct
        });
    }
}