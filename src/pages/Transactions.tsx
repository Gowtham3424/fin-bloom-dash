import { useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { FilterBar } from '@/components/transactions/FilterBar';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Plus, Download } from 'lucide-react';

export default function Transactions() {
  const { state, filteredTransactions } = useApp();
  const isAdmin = state.role === 'admin';
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleEdit = useCallback((id: string) => {
    setEditId(id);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditId(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map(t =>
      [t.date, `"${t.description}"`, t.category, t.type, t.amount.toFixed(2)]
    );
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredTransactions]);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-[0.2em] uppercase">TRANSACTIONS</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-tactile flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-foreground/10 transition-colors"
          >
            <Download className="h-3 w-3" /> CSV
          </button>
          {isAdmin && (
            <button
              onClick={() => { setEditId(null); setFormOpen(true); }}
              className="btn-tactile flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              <Plus className="h-3 w-3" /> ADD
            </button>
          )}
        </div>
      </div>

      <FilterBar />

      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {filteredTransactions.length} TRANSACTION{filteredTransactions.length !== 1 ? 'S' : ''} FOUND
      </div>

      <TransactionTable onEdit={handleEdit} />

      {isAdmin && (
        <TransactionForm open={formOpen} onClose={handleClose} editId={editId} />
      )}
    </div>
  );
}
