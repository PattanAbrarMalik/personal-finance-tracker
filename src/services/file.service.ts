/**
 * File upload and export service
 */

import { prisma } from '../utils/prisma';

export class FileService {
  /**
   * Export transactions to CSV
   */
  async exportTransactionsToCSV(userId: string): Promise<string> {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const rows = transactions.map(t => [
      new Date(t.createdAt).toISOString().split('T')[0],
      t.description,
      t.category.name,
      t.amount,
      t.type,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Export transactions to JSON
   */
  async exportTransactionsToJSON(userId: string): Promise<string> {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    });

    return JSON.stringify(transactions, null, 2);
  }

  /**
   * Import transactions from CSV
   */
  async importTransactionsFromCSV(userId: string, csvContent: string): Promise<number> {
    const lines = csvContent.split('\n').slice(1); // Skip header
    let importedCount = 0;

    for (const line of lines) {
      if (!line.trim()) continue;

      const [date, description, categoryName, amount, type] = line.split(',');

      try {
        const category = await prisma.category.findFirst({
          where: { userId, name: categoryName.trim() },
        });

        if (category) {
          await prisma.transaction.create({
            data: {
              userId,
              description: description.trim(),
              amount: parseFloat(amount),
              type: type.trim() as 'income' | 'expense',
              categoryId: category.id,
              createdAt: new Date(date),
            },
          });
          importedCount++;
        }
      } catch (error) {
        console.error('Transaction import error:', error);
      }
    }

    return importedCount;
  }

  /**
   * Generate report PDF (placeholder)
   */
  async generateMonthlyReport(userId: string, year: number, month: number): Promise<Buffer> {
    // This would use a library like pdfkit or html2pdf
    // For now, returning a placeholder
    return Buffer.from('PDF report would be generated here');
  }
}

export const fileService = new FileService();
