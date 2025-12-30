"use strict";
/**
 * File upload and export service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = exports.FileService = void 0;
const prisma_1 = require("../utils/prisma");
class FileService {
    /**
     * Export transactions to CSV
     */
    async exportTransactionsToCSV(userId) {
        const transactions = await prisma_1.prisma.transaction.findMany({
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
    async exportTransactionsToJSON(userId) {
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
        });
        return JSON.stringify(transactions, null, 2);
    }
    /**
     * Import transactions from CSV
     */
    async importTransactionsFromCSV(userId, csvContent) {
        const lines = csvContent.split('\n').slice(1); // Skip header
        let importedCount = 0;
        for (const line of lines) {
            if (!line.trim())
                continue;
            const [date, description, categoryName, amount, type] = line.split(',');
            try {
                const category = await prisma_1.prisma.category.findFirst({
                    where: { userId, name: categoryName.trim() },
                });
                if (category) {
                    await prisma_1.prisma.transaction.create({
                        data: {
                            userId,
                            description: description.trim(),
                            amount: parseFloat(amount),
                            type: type.trim(),
                            categoryId: category.id,
                            createdAt: new Date(date),
                        },
                    });
                    importedCount++;
                }
            }
            catch (error) {
                console.error('Transaction import error:', error);
            }
        }
        return importedCount;
    }
    /**
     * Generate report PDF (placeholder)
     */
    async generateMonthlyReport(userId, year, month) {
        // This would use a library like pdfkit or html2pdf
        // For now, returning a placeholder
        return Buffer.from('PDF report would be generated here');
    }
}
exports.FileService = FileService;
exports.fileService = new FileService();
//# sourceMappingURL=file.service.js.map