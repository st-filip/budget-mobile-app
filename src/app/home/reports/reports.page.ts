import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../transactions/transactions.service';
import { ViewWillEnter } from '@ionic/angular';
import { Transaction } from '../transactions/transaction.model';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit, ViewWillEnter {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  selectedMonth: string = '';
  maxdate: string;
  totalExpense: number = 0;
  totalIncome: number = 0;
  balance: number = 0;

  title = 'ng2-charts-demo';

  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Month'],
    datasets: [
      { data: [], label: 'Total income' },
      { data: [], label: 'Total expense' },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  constructor(private transactionsService: TransactionsService) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    this.maxdate = `${year}-${month}`;
    this.selectedMonth = this.maxdate;
  }

  ngOnInit() {
    this.transactionsService.transactions.subscribe((transactions) => {
      this.transactions = transactions;
      this.filterTransactions();
    });
  }

  ionViewWillEnter() {
    this.transactionsService.getTransactions().subscribe();
  }

  isModalOpen = false;

  onModalOpen() {
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }

  searchTransactions() {
    // Handle the search functionality here using the selectedMonth value
    console.log('Selected Month:', this.selectedMonth);
    // Add your logic to fetch and display transactions for the selected month
    this.filterTransactions();
  }

  filterTransactions() {
    const [year, month] = this.selectedMonth.split('-');
    this.filteredTransactions = this.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getFullYear() === parseInt(year, 10) &&
        transactionDate.getMonth() + 1 === parseInt(month, 10)
      );
    });

    this.calculateTotals();
  }

  calculateTotals() {
    this.totalExpense = this.filteredTransactions
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + transaction.amount!, 0);

    this.totalIncome = this.filteredTransactions
      .filter((transaction) => transaction.type === 'Income')
      .reduce((sum, transaction) => sum + transaction.amount!, 0);

    this.balance = this.totalIncome - this.totalExpense;

    this.barChartData = {
      labels: [this.formatdate(this.selectedMonth)],
      datasets: [
        { data: [this.totalIncome], label: 'Total income' },
        { data: [this.totalExpense], label: 'Total expense' },
      ],
    };
  }

  formatdate(date: string) {
    const [year, month] = date.split('-');
    const formattedMonth = new Date(`${date}-01`).toLocaleString('en-US', {
      month: 'long',
    });
    const formattedDate = `${formattedMonth} ${year}`;
    return formattedDate;
  }
}
