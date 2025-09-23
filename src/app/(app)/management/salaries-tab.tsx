
'use client';

import React from 'react';
import { useApp, Employee } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Wallet, DollarSign, Landmark, RefreshCw, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

interface SalariesTabContentProps {
    onPay: (employeeId: string) => void;
    onDetails: (employee: Employee) => void;
    isPending: boolean;
}

export const SalariesTabContent: React.FC<SalariesTabContentProps> = ({ onPay, onDetails, isPending }) => {
    const { employees, setEmployees } = useApp();
  
    const totalBrut = employees.reduce((acc, emp) => acc + emp.salary, 0);
    const totalAdvance = employees.reduce((acc, emp) => acc + emp.advance, 0);
    const totalToPay = totalBrut - totalAdvance;
  
    const handleNewMonth = () => {
        // This is a simulation. A real implementation would be more robust.
        // It should probably reset advances and log payments for the previous month.
        setEmployees(employees.map(e => ({...e, balance: e.salary - e.advance})));
        console.log("Starting a new month for salaries");
    }

    type SalaryStatus = 'paid' | 'pending' | 'partial';

    const getEmployeeSalaryStatus = (employee: Employee): SalaryStatus => {
        if (employee.balance <= 0) return 'paid';
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
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={employee.avatar} alt={employee.name} />
                                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                    </Avatar>
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
                                <Button size="sm" variant="outline" className="border-gray-600" onClick={() => onDetails(employee)} disabled={isPending}>Détails</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={isPending || employee.balance <= 0}>
                                            <DollarSign className="mr-1 h-4 w-4"/> Payer
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2">
                                                <Wallet className="h-6 w-6 text-orange-400"/>
                                                Confirmer le Paiement du Salaire
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-300 pt-2">
                                                Vous êtes sur le point de payer le salaire de <span className="font-bold text-white">{employee.name}</span>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        
                                        <div className="bg-gray-700/50 rounded-lg p-4 my-4 space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Salaire Brut</span>
                                                <span className="font-medium text-white">{employee.salary.toFixed(3)} DT</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Acompte déjà versé</span>
                                                <span className="font-medium text-red-400">{employee.advance.toFixed(3)} DT</span>
                                            </div>
                                            <div className="border-t border-gray-600 my-2"></div>
                                            <div className="flex justify-between font-bold text-base">
                                                <span className="text-green-400">Solde à Payer</span>
                                                <span className="text-green-400">{employee.balance.toFixed(3)} DT</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            Cette action marquera le salaire comme "Payé" et enregistrera une nouvelle dépense dans la catégorie "Charges Salaires".
                                        </p>

                                        <AlertDialogFooter className="mt-4">
                                            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                                Annuler
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onPay(employee.id)} className="bg-green-600 hover:bg-green-700" disabled={isPending}>
                                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                                                Confirmer le Paiement
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>
    );
}
