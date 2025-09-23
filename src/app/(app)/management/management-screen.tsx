'use client';

import React, { useState } from 'react';
import { useApp, Client, Employee, Expense } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import {
  Users, Trash2, Edit, Plus, Wallet, DollarSign, Star, UserPlus,
} from 'lucide-react';
import { SalariesTabContent } from './salaries-tab';
import { ClientForm, EmployeeForm, ExpenseForm } from './management-forms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};


export const ManagementScreen: React.FC = () => {
  const { clients, setClients, employees, setEmployees, expenses, setExpenses } = useApp();
  const [activeTab, setActiveTab] = useState('clients');

  // State for modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const totalCredit = clients.reduce((acc, client) => acc + client.credit, 0);
  const averageEvaluation = employees.length > 0 ? employees.reduce((acc, emp) => acc + emp.evaluation, 0) / employees.length : 0;

  const getEvaluationText = (avg: number) => {
    if (avg >= 4.5) return "Excellent";
    if (avg >= 4) return "Bon";
    if (avg >= 3) return "Moyen";
    return "Bas";
  }

  const managementTabs = [
    { value: 'clients', label: 'Clients', icon: Users },
    { value: 'employees', label: 'Employés', icon: UserPlus },
    { value: 'salaries', label: 'Salaires', icon: Wallet },
    { value: 'expenses', label: 'Dépenses', icon: DollarSign },
  ]
  
  // --- Client Actions ---
  const handleOpenClientModal = (client: Client | null = null) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };
  const handleSaveClient = (clientData: Partial<Client>) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } as Client : c));
    } else {
      setClients([...clients, { ...clientData, id: Date.now().toString(), credit: clientData.credit || 0 } as Client]);
    }
    setIsClientModalOpen(false);
  };
  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
  };

  // --- Employee Actions ---
  const handleOpenEmployeeModal = (employee: Employee | null = null) => {
    setEditingEmployee(employee);
    setIsEmployeeModalOpen(true);
  }
  const handleSaveEmployee = (employeeData: Partial<Employee>) => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...employeeData, balance: (employeeData.salary || e.salary) - (employeeData.advance || e.advance) } as Employee : e));
    } else {
      const newEmployee = { ...employeeData, id: Date.now().toString() } as Employee;
      newEmployee.balance = (newEmployee.salary || 0) - (newEmployee.advance || 0);
      setEmployees([...employees, newEmployee]);
    }
    setIsEmployeeModalOpen(false);
  }
  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(e => e.id !== employeeId));
  }

  const handlePaySalary = (employeeId: string) => {
    setEmployees(employees.map(e => e.id === employeeId ? { ...e, advance: 0, balance: 0 } : e));
    // In a real app you'd probably want to mark it as paid for the month, not just zero out balance.
  }

  // --- Expense Actions ---
  const handleOpenExpenseModal = (expense: Expense | null = null) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  }
  const handleSaveExpense = (expenseData: Partial<Expense>) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...e, ...expenseData } as Expense : e));
    } else {
      setExpenses([...expenses, { ...expenseData, id: Date.now().toString(), date: new Date().toLocaleDateString('fr-CA') } as Expense]);
    }
    setIsExpenseModalOpen(false);
  }
  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Gestion</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 p-1 mb-6 h-auto">
          {managementTabs.map(tab => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded flex-col h-16"
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="clients">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Clients</p>
                    <p className="text-2xl font-bold text-white">{clients.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Crédit Total</p>
                    <p className="text-2xl font-bold text-red-400">{totalCredit.toFixed(2)} DT</p>
                  </div>
                  <Wallet className="h-8 w-8 text-red-500" />
                </div>
              </CardHeader>
            </Card>
             <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                 <Button onClick={() => handleOpenClientModal()} className="w-full h-full bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un client
                  </Button>
              </CardHeader>
            </Card>
          </div>
          <div className="space-y-4">
            {clients.map(client => (
              <Card key={client.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{client.name}</h3>
                          {client.isVip && <Badge className="bg-yellow-600 text-white text-xs">VIP</Badge>}
                        </div>
                        <p className="text-gray-400 text-sm">{client.email}</p>
                        <p className="text-gray-400 text-sm">{client.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => handleOpenClientModal(client)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer {client.name} ?</AlertDialogTitle>
                              <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteClient(client.id)} className="bg-red-600">Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                   {client.credit > 0 && 
                    <div className="text-right pl-4 border-l border-gray-700 ml-4">
                      <p className="text-sm text-gray-400">Crédit</p>
                      <p className="text-lg font-bold text-red-400">{client.credit.toFixed(2)} DT</p>
                    </div>
                   }
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employees">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Employés</p>
                    <p className="text-2xl font-bold text-white">{employees.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Évaluation Moyenne</p>
                    <p className="text-2xl font-bold text-white">{getEvaluationText(averageEvaluation)}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardHeader>
            </Card>
             <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                 <Button onClick={() => handleOpenEmployeeModal()} className="w-full h-full bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un employé
                  </Button>
              </CardHeader>
            </Card>
          </div>
          <div className="space-y-4">
            {employees.map(employee => (
              <Card key={employee.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-shrink-0 flex flex-col items-center">
                        <Avatar className="h-20 w-20">
                           <AvatarImage src={employee.avatar} alt={employee.name} />
                           <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                     </div>
                     <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                            <p className="text-gray-400">{employee.role}</p>
                          </div>
                           <div className="flex items-center gap-2">
                            {employee.isTopEmployee && <Badge className="bg-green-600 text-white">Top Employé</Badge>}
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => handleOpenEmployeeModal(employee)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer {employee.name} ?</AlertDialogTitle>
                                  <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)} className="bg-red-600">Supprimer</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                           <div className="flex items-center gap-2">
                              <p className="text-gray-400">Membre depuis: <span className="text-white font-medium">{employee.joinDate}</span></p>
                           </div>
                           <div className="flex items-center gap-2">
                              <p className="text-gray-400">Horaire: <span className="text-white font-medium">{employee.schedule}</span></p>
                           </div>
                        </div>
                        
                        <div>
                           <p className="text-gray-400 mb-2">Planning</p>
                           <div className="flex gap-1">
                            {['L', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                              <span key={i} className={`w-8 h-8 flex items-center justify-center text-xs rounded-full ${employee.workingDays.includes(day as any) ? 'bg-orange-500 text-white font-bold' : 'bg-gray-700 text-gray-400'}`}>
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>

                     </div>
                  </div>
                </CardContent>
                <div className="grid grid-cols-3 bg-gray-900/50 text-sm">
                   <div className="p-3 text-center">
                     <p className="text-gray-400 flex items-center justify-center gap-1">Salaire Brut</p>
                     <p className="font-bold text-white text-base">{employee.salary.toFixed(3)} DT</p>
                   </div>
                   <div className="p-3 text-center border-x border-gray-700">
                     <p className="text-gray-400 flex items-center justify-center gap-1">Acompte versé</p>
                     <p className="font-bold text-orange-400 text-base">{employee.advance.toFixed(3)} DT</p>
                   </div>
                   <div className="p-3 text-center">
                     <p className="text-gray-400 flex items-center justify-center gap-1">Solde à payer</p>
                     <p className="font-bold text-green-400 text-base">{employee.balance.toFixed(3)} DT</p>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="salaries">
          <SalariesTabContent 
            onPay={handlePaySalary}
            onDetails={handleOpenEmployeeModal}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <div className="space-y-4">
            <Button onClick={() => handleOpenExpenseModal()} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" /> Ajouter une dépense
            </Button>
            {expenses.map(expense => (
              <Card key={expense.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{expense.description}</h3>
                      <p className="text-gray-400">{expense.category}</p>
                      <p className="text-gray-400">{expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">- {expense.amount.toFixed(2)} DT</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="border-gray-600" onClick={() => handleOpenExpenseModal(expense)}><Edit className="h-3 w-3" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette dépense ?</AlertDialogTitle>
                              <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)} className="bg-red-600">Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <ClientForm 
        isOpen={isClientModalOpen}
        onOpenChange={setIsClientModalOpen}
        onSave={handleSaveClient}
        client={editingClient}
      />
      <EmployeeForm
        isOpen={isEmployeeModalOpen}
        onOpenChange={setIsEmployeeModalOpen}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
      <ExpenseForm
        isOpen={isExpenseModalOpen}
        onOpenChange={setIsExpenseModalOpen}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </div>
  );
};
