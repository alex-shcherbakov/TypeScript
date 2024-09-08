class Transaction {
    public amount: number;
    public date: Date;
    public description: string;
    public category: string;

    constructor(amount: number, description: string, category: string = "General") {
        this.amount = amount;
        this.date = new Date();
        this.description = description;
        this.category = category;
    }
}

class Account {
    private balance: number;
    private transactions: Transaction[];

    constructor(initialBalance: number = 0) {
        this.balance = initialBalance;
        this.transactions = [];
    }

    public addTransaction(transaction: Transaction): void {
        this.balance += transaction.amount;
        this.transactions.push(transaction);
        console.log(`Transaction added: ${transaction.description}, Amount: ${transaction.amount}, Category: ${transaction.category}`);
    }

    public getBalance(): number {
        return this.balance;
    }

    public getTransactions(): Transaction[] {
        return this.transactions;
    }

    public getTotalExpenses(): number {
        return this.transactions
            .filter(t => t.amount < 0)
            .reduce((total, t) => total + Math.abs(t.amount), 0);
    }

    public getTotalIncome(): number {
        return this.transactions
            .filter(t => t.amount > 0)
            .reduce((total, t) => total + t.amount, 0);
    }

    public printStatement(): void {
        console.log("Transaction History:");
        this.transactions.forEach((transaction, index) => {
            console.log(
                `${index + 1}. Date: ${transaction.date}, Description: ${transaction.description}, Amount: ${transaction.amount}, Category: ${transaction.category}`
            );
        });
        console.log(`Total Income: ${this.getTotalIncome()}`);
        console.log(`Total Expenses: ${this.getTotalExpenses()}`);
        console.log(`Current Balance: ${this.getBalance()}`);
    }
}

class SavingsAccount extends Account {
    private interestRate: number;

    constructor(initialBalance: number, interestRate: number) {
        super(initialBalance);
        this.interestRate = interestRate;
    }

    public addInterest(): void {
        const interest = this.getBalance() * (this.interestRate / 100);
        this.addTransaction(new Transaction(interest, "Interest Added"));
        console.log(`Interest added: ${interest}, New Balance: ${this.getBalance()}`);
    }
}

class Budget {
    public name: string;
    public limit: number;
    public expenses: number;

    constructor(name: string, limit: number) {
        this.name = name;
        this.limit = limit;
        this.expenses = 0;
    }

    public addExpense(amount: number): void {
        this.expenses += amount;
        if (this.expenses > this.limit) {
            console.log(`Warning: Budget exceeded for ${this.name}`);
        } else {
            console.log(`Expense added: ${amount} to ${this.name}`);
        }
    }

    public remainingBudget(): number {
        return this.limit - this.expenses;
    }

    public printBudget(): void {
        console.log(
            `Budget: ${this.name}, Limit: ${this.limit}, Expenses: ${this.expenses}, Remaining: ${this.remainingBudget()}`
        );
    }
}

class FinancialManager {
    private account: Account;
    private savingsAccount: SavingsAccount;
    private budgets: Budget[];

    constructor(accountBalance: number, savingsBalance: number, interestRate: number) {
        this.account = new Account(accountBalance);
        this.savingsAccount = new SavingsAccount(savingsBalance, interestRate);
        this.budgets = [];
    }

    public addBudget(name: string, limit: number): void {
        const newBudget = new Budget(name, limit);
        this.budgets.push(newBudget);
        console.log(`Budget added: ${name} with limit ${limit}`);
    }

    public addTransactionToAccount(amount: number, description: string, category: string = "General"): void {
        const transaction = new Transaction(amount, description, category);
        this.account.addTransaction(transaction);
    }

    public addTransactionToSavings(amount: number, description: string, category: string = "General"): void {
        const transaction = new Transaction(amount, description, category);
        this.savingsAccount.addTransaction(transaction);
    }

    public addInterestToSavings(): void {
        this.savingsAccount.addInterest();
    }

    public addExpenseToBudget(budgetName: string, amount: number): void {
        const budget = this.budgets.find((b) => b.name === budgetName);
        if (budget) {
            budget.addExpense(amount);
        } else {
            console.log(`Budget ${budgetName} not found!`);
        }
    }

    public printAccountStatement(): void {
        console.log("Account Statement:");
        this.account.printStatement();
    }

    public printSavingsStatement(): void {
        console.log("Savings Account Statement:");
        this.savingsAccount.printStatement();
    }

    public printBudgets(): void {
        console.log("Budgets Overview:");
        this.budgets.forEach((budget) => budget.printBudget());
    }

    public transferToSavings(amount: number): void {
        if (this.account.getBalance() >= amount) {
            this.addTransactionToAccount(-amount, "Transfer to Savings");
            this.addTransactionToSavings(amount, "Transfer from Account");
            console.log(`Transferred ${amount} from account to savings.`);
        } else {
            console.log("Insufficient balance in account to transfer!");
        }
    }

    public calculateTotalSavings(): number {
        return this.savingsAccount.getBalance();
    }

    public calculateTotalExpenses(): number {
        return this.account.getTotalExpenses();
    }

    public calculateTotalIncome(): number {
        return this.account.getTotalIncome();
    }

    public printFinancialOverview(): void {
        console.log("Financial Overview:");
        console.log(`Total Income: ${this.calculateTotalIncome()}`);
        console.log(`Total Expenses: ${this.calculateTotalExpenses()}`);
        console.log(`Total Savings: ${this.calculateTotalSavings()}`);
        console.log(`Account Balance: ${this.account.getBalance()}`);
    }
}


const manager = new FinancialManager(1000, 500, 2);

manager.addBudget("Groceries", 300);
manager.addBudget("Entertainment", 150);

manager.addTransactionToAccount(500, "Salary", "Income");
manager.addTransactionToAccount(-50, "Grocery shopping", "Groceries");
manager.addExpenseToBudget("Groceries", 50);

manager.addTransactionToSavings(200, "Deposit into savings", "Savings");
manager.addInterestToSavings();

manager.printAccountStatement();
manager.printSavingsStatement();
manager.printBudgets();

manager.transferToSavings(100);
manager.printAccountStatement();
manager.printSavingsStatement();

manager.printFinancialOverview();
