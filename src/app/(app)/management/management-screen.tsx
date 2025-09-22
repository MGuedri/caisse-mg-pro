'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp, Employee } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader, CardDescription, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import {
  Users, Trash2, Edit, Plus, Wallet, DollarSign, FileText, Star, UserPlus, Clock, Calendar, Landmark, RefreshCw, AlertTriangle
} from 'lucide-react';

// --- Salaries Tab ---
const SalariesTabContent: React.FC = () => {
    const { employees, setEmployees } = useApp();
  
    const totalBrut = employees.reduce((acc, emp) => acc + emp.salary, 0);
    const totalAdvance = employees.reduce((acc, emp) => acc + emp.advance, 0);
    const totalToPay = totalBrut - totalAdvance;
  
    const handlePay = (employeeId: string) => {
        // Logic to handle payment, for now we can just log it
        console.log(`Paying employee ${employeeId}`);
    };

    const handleNewMonth = () => {
        // Logic to reset for a new month
        console.log("Starting a new month for salaries");
    }

    type SalaryStatus = 'paid' | 'pending' | 'partial';

    const getEmployeeSalaryStatus = (employee: Employee): SalaryStatus => {
        if (employee.balance === 0) return 'paid';
        if (employee.advance > 0 && employee.balance > 0) return 'partial';
        return 'pending';
    }

    return (
      <div>
        <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
                <CardTitle className="text-white">Gestion des Salaires</CardTitle>
                <CardDescription className="text-gray-400">
                    Suivi et paiement des salaires des employés pour le mois en cours.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Card className="bg-teal-900/50 border-teal-800">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Landmark className="h-8 w-8 text-teal-400"/>
                                <div>
                                    <p className="text-sm text-gray-400">Masse Salariale (Brut)</p>
                                    <p className="text-2xl font-bold text-white">{totalBrut.toFixed(3)} DT</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-red-900/50 border-red-800">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Wallet className="h-8 w-8 text-red-400"/>
                                <div>
                                    <p className="text-sm text-gray-400">Total Acomptes Versés</p>
                                    <p className="text-2xl font-bold text-red-400">{totalAdvance.toFixed(3)} DT</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-green-900/50 border-green-800">
                         <CardHeader>
                            <div className="flex items-center gap-4">
                                <DollarSign className="h-8 w-8 text-green-400"/>
                                <div>
                                    <p className="text-sm text-gray-400">Solde Total à Payer</p>
                                    <p className="text-2xl font-bold text-green-400">{totalToPay.toFixed(3)} DT</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                 <Button variant="outline" onClick={handleNewMonth} className="border-gray-600 text-gray-300">
                    <RefreshCw className="mr-2 h-4 w-4" /> Nouveau Mois
                </Button>
            </CardContent>
        </Card>
        
        <div className="space-y-4">
            {employees.map(employee => {
                const status = getEmployeeSalaryStatus(employee);
                return (
                    <Card key={employee.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Image src={employee.avatar} alt={employee.name} width={48} height={48} className="rounded-full" />
                                    <div>
                                        <p className="font-bold text-white">{employee.name}</p>
                                        <p className="text-sm text-gray-400">{employee.role}</p>
                                    </div>
                                </div>
                                <div>
                                    {status === 'pending' && <Badge variant="destructive" className="bg-yellow-600/20 text-yellow-400 border-yellow-500 gap-1"><AlertTriangle className="h-3 w-3"/>En attente</Badge>}
                                    {status === 'paid' && <Badge variant="default" className="bg-green-600/20 text-green-400 border-green-500">Payé</Badge>}
                                    {status === 'partial' && <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500">Partiel</Badge>}
                                </div>
                            </div>
                             <div className="grid grid-cols-3 gap-4 text-center mt-4 pt-4 border-t border-gray-700">
                                <div>
                                    <p className="text-sm text-gray-400">Salaire Brut</p>
                                    <p className="font-bold text-white">{employee.salary.toFixed(3)} DT</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Acompte</p>
                                    <p className="font-bold text-orange-400">{employee.advance.toFixed(3)} DT</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Solde à Payer</p>
                                    <p className="font-bold text-green-400">{employee.balance.toFixed(3)} DT</p>
                                </div>
                            </div>
                             <div className="mt-4 flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="border-gray-600">Détails</Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handlePay(employee.id)} disabled={employee.balance === 0}>
                                    <DollarSign className="mr-1 h-4 w-4"/> Payer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>
    );
}


export const ManagementScreen: React.FC = () => {
  const { clients, employees, expenses } = useApp();
  const [activeTab, setActiveTab] = useState('employees');

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
    { value: 'report', label: 'Rapport', icon: FileText },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Gestion</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800 p-1 mb-6 h-auto">
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
                 <Button className="w-full h-full bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un client
                  </Button>
              </CardHeader>
            </Card>
          </div>
          <div className="space-y-4">
            {clients.map(client => (
              <Card key={client.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex items-center gap-4">
                  <Image src={client.avatar || `https://i.pravatar.cc/150?u=${client.id}`} alt={client.name} width={64} height={64} className="rounded-full" />
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
                        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></Button>
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
                              <AlertDialogAction className="bg-red-600">Supprimer</AlertDialogAction>
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
                 <Button className="w-full h-full bg-orange-500 hover:bg-orange-600">
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
                        <Image src={employee.avatar} alt={employee.name} width={80} height={80} className="rounded-full mb-2" />
                     </div>
                     <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                            <p className="text-gray-400">{employee.role}</p>
                          </div>
                           <div className="flex items-center gap-2">
                            {employee.isTopEmployee && <Badge className="bg-green-600 text-white">Top Employé</Badge>}
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                           <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400"/>
                              <div>
                                 <p className="text-gray-400">Membre depuis</p>
                                 <p className="text-white font-medium">{employee.joinDate}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400"/>
                              <div>
                                 <p className="text-gray-400">Horaire</p>
                                 <p className="text-white font-medium">{employee.schedule}</p>
                              </div>
                           </div>
                        </div>
                        
                        <div>
                           <p className="text-gray-400 mb-2">Planning</p>
                           <div className="flex gap-1">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
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
                     <p className="text-gray-400 flex items-center justify-center gap-1"><Landmark className="h-4 w-4"/> Salaire Brut</p>
                     <p className="font-bold text-white text-base">{employee.salary.toFixed(3)} DT</p>
                   </div>
                   <div className="p-3 text-center border-x border-gray-700">
                     <p className="text-gray-400 flex items-center justify-center gap-1"><Wallet className="h-4 w-4"/> Acompte versé</p>
                     <p className="font-bold text-orange-400 text-base">{employee.advance.toFixed(3)} DT</p>
                   </div>
                   <div className="p-3 text-center">
                     <p className="text-gray-400 flex items-center justify-center gap-1"><DollarSign className="h-4 w-4"/> Solde à payer</p>
                     <p className="font-bold text-green-400 text-base">{employee.balance.toFixed(3)} DT</p>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="salaries">
          <SalariesTabContent/>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="space-y-4">
            <Button className="bg-orange-500 hover:bg-orange-600">
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
                        <Button size="sm" variant="outline" className="border-gray-600"><Edit className="h-3 w-3" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                              <AlertDialogDescription>Irreversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600">Supprimer</AlertDialogAction>
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
         <TabsContent value="report">
           <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Rapports</h3>
                <p>Cette section est en cours de développement.</p>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
