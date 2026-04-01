import { Transaction, Category } from '@/types';

const categories: Category[] = [
  'Food', 'Transport', 'Housing', 'Entertainment',
  'Shopping', 'Health', 'Utilities', 'Salary', 'Freelance',
];

const descriptions: Record<Category, string[]> = {
  Food: ['Grocery Store', 'Coffee Shop', 'Restaurant Dinner', 'Food Delivery', 'Bakery', 'Lunch Takeout'],
  Transport: ['Metro Pass', 'Gas Station', 'Uber Ride', 'Parking Fee', 'Train Ticket', 'Bike Repair'],
  Housing: ['Monthly Rent', 'Home Insurance', 'Furniture Store', 'Cleaning Service', 'Plumber Visit'],
  Entertainment: ['Cinema Tickets', 'Streaming Service', 'Concert', 'Book Purchase', 'Video Game', 'Museum Entry'],
  Shopping: ['Online Order', 'Clothing Store', 'Electronics', 'Home Decor', 'Gift Purchase'],
  Health: ['Gym Membership', 'Pharmacy', 'Doctor Visit', 'Dental Checkup', 'Vitamins'],
  Utilities: ['Electricity Bill', 'Water Bill', 'Internet Service', 'Phone Plan', 'Gas Bill'],
  Salary: ['Monthly Salary', 'Bonus Payment', 'Year-End Bonus'],
  Freelance: ['Web Design Project', 'Consulting Fee', 'Logo Design', 'Content Writing', 'App Development'],
};

let idCounter = 1;
function makeId(): string {
  return `txn-${String(idCounter++).padStart(4, '0')}`;
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const now = new Date();

  // Generate 6 months of data
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const year = now.getFullYear();
    const month = now.getMonth() - monthOffset;
    const d = new Date(year, month, 1);
    const actualMonth = d.getMonth();
    const actualYear = d.getFullYear();
    const daysInMonth = new Date(actualYear, actualMonth + 1, 0).getDate();

    // 1-2 salary payments per month
    txns.push({
      id: makeId(),
      date: new Date(actualYear, actualMonth, 1).toISOString().split('T')[0],
      description: 'Monthly Salary',
      amount: randomBetween(4800, 5200),
      type: 'income',
      category: 'Salary',
    });

    // occasional freelance income
    if (Math.random() > 0.4) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Freelance),
        amount: randomBetween(300, 1500),
        type: 'income',
        category: 'Freelance',
      });
    }

    // Housing - once per month
    txns.push({
      id: makeId(),
      date: new Date(actualYear, actualMonth, 1).toISOString().split('T')[0],
      description: 'Monthly Rent',
      amount: 1200,
      type: 'expense',
      category: 'Housing',
    });

    // Utilities - 2-3 per month
    const utilCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < utilCount; i++) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Utilities),
        amount: randomBetween(30, 120),
        type: 'expense',
        category: 'Utilities',
      });
    }

    // Food - 4-6 per month
    const foodCount = Math.floor(Math.random() * 3) + 4;
    for (let i = 0; i < foodCount; i++) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Food),
        amount: randomBetween(8, 85),
        type: 'expense',
        category: 'Food',
      });
    }

    // Transport - 2-3 per month
    const transportCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < transportCount; i++) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Transport),
        amount: randomBetween(5, 60),
        type: 'expense',
        category: 'Transport',
      });
    }

    // Entertainment - 1-3 per month
    const entCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < entCount; i++) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Entertainment),
        amount: randomBetween(10, 80),
        type: 'expense',
        category: 'Entertainment',
      });
    }

    // Shopping - 1-2 per month
    const shopCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < shopCount; i++) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Shopping),
        amount: randomBetween(20, 200),
        type: 'expense',
        category: 'Shopping',
      });
    }

    // Health - 0-1 per month
    if (Math.random() > 0.4) {
      txns.push({
        id: makeId(),
        date: new Date(actualYear, actualMonth, Math.floor(Math.random() * daysInMonth) + 1).toISOString().split('T')[0],
        description: pickRandom(descriptions.Health),
        amount: randomBetween(20, 150),
        type: 'expense',
        category: 'Health',
      });
    }
  }

  // Sort by date descending
  return txns.sort((a, b) => b.date.localeCompare(a.date));
}

export const initialTransactions: Transaction[] = generateTransactions();

export const categoryColors: Record<Category, string> = {
  Food: 'hsl(32 95% 55%)',
  Transport: 'hsl(210 60% 50%)',
  Housing: 'hsl(270 50% 55%)',
  Entertainment: 'hsl(330 70% 55%)',
  Shopping: 'hsl(180 60% 40%)',
  Health: 'hsl(142 71% 45%)',
  Utilities: 'hsl(45 90% 50%)',
  Salary: 'hsl(142 71% 45%)',
  Freelance: 'hsl(200 70% 50%)',
};

export const categoryIcons: Record<Category, string> = {
  Food: '◆',
  Transport: '▶',
  Housing: '■',
  Entertainment: '★',
  Shopping: '●',
  Health: '✚',
  Utilities: '⚡',
  Salary: '▲',
  Freelance: '◎',
};
