import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Transaction, Category, TransactionType } from '@/types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';

const allCategories: Category[] = [
  'Food', 'Transport', 'Housing', 'Entertainment',
  'Shopping', 'Health', 'Utilities', 'Salary', 'Freelance',
];

interface Props {
  open: boolean;
  onClose: () => void;
  editId?: string | null;
}

export function TransactionForm({ open, onClose, editId }: Props) {
  const { state, dispatch } = useApp();
  const editing = editId ? state.transactions.find(t => t.id === editId) : null;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editing) {
      setDescription(editing.description);
      setAmount(String(editing.amount));
      setType(editing.type);
      setCategory(editing.category);
      setDate(editing.date);
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!description || isNaN(parsed) || parsed <= 0) return;

    const txn: Transaction = {
      id: editing?.id || `txn-${Date.now()}`,
      date,
      description,
      amount: parsed,
      type,
      category,
    };

    if (editing) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: txn });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: txn });
    }
    onClose();
  };

  const inputClass = "w-full h-9 px-3 text-xs bg-background border-2 border-foreground/20 rounded-sm focus:outline-none focus:border-accent font-mono";
  const labelClass = "label-uppercase block mb-1.5";

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="card-tactile border-2 border-foreground/20 bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold tracking-[0.2em] uppercase">
            {editing ? '✎ EDIT' : '+ NEW'} TRANSACTION
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {editing ? 'Update the transaction details below.' : 'Fill in the details for your new transaction.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={inputClass}
              placeholder="e.g. Grocery Store"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className={inputClass}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <div className="flex border-2 border-foreground/20 rounded-sm overflow-hidden">
              {(['expense', 'income'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    type === t ? 'bg-foreground text-background' : 'bg-transparent text-foreground/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className={inputClass}
            >
              {allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <DialogFooter className="gap-2">
            <button type="button" onClick={onClose} className="btn-tactile px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-foreground/10 transition-colors">
              CANCEL
            </button>
            <button type="submit" className="btn-tactile px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
              {editing ? 'UPDATE' : 'ADD'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
