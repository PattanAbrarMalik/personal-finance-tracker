/**
 * File upload and export service
 */
export declare class FileService {
    /**
     * Export transactions to CSV
     */
    exportTransactionsToCSV(userId: string): Promise<string>;
    /**
     * Export transactions to JSON
     */
    exportTransactionsToJSON(userId: string): Promise<string>;
    /**
     * Import transactions from CSV
     */
    importTransactionsFromCSV(userId: string, csvContent: string): Promise<number>;
    /**
     * Generate report PDF (placeholder)
     */
    generateMonthlyReport(userId: string, year: number, month: number): Promise<Buffer>;
}
export declare const fileService: FileService;
//# sourceMappingURL=file.service.d.ts.map