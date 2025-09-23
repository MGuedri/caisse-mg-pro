
'use client';

import React, { useState, useEffect } from 'react';
import { Client, Employee, Expense } from '@/app/(app)/app-provider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';


// ======================
// CLIENT FORM
// ======================
interface ClientFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (clientData: Partial<Client>) => void;
  client: Client | null;
  isPending: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onOpenChange, onSave, client, isPending }) => {
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({ name: '', email: '', phone: '', isVip: false, credit: 0 });
    }
  }, [client, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{client ? 'Modifier le client' : 'Ajouter un client'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Nom" value={formData.name || ''} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input placeholder="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input placeholder="Téléphone" value={formData.phone || ''} onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input type="number" placeholder="Crédit" value={formData.credit || 0} onChange={(e) => setFormData(p => ({...p, credit: parseFloat(e.target.value) || 0}))} className="bg-gray-700 border-gray-600"/>
          <div className="flex items-center space-x-2">
            <Checkbox id="isVip" checked={formData.isVip} onCheckedChange={(checked) => setFormData(p => ({ ...p, isVip: !!checked }))} />
            <Label htmlFor="isVip">Client VIP</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600">Annuler</Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// ======================
// EMPLOYEE FORM
// ======================
interface EmployeeFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (employeeData: Partial<Employee>) => void;
    employee: Employee | null;
    isPending: boolean;
}
  
export const EmployeeForm: React.FC<EmployeeFormProps> = ({ isOpen, onOpenChange, onSave, employee, isPending }) => {
    const [formData, setFormData] = useState<Partial<Employee>>({});

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        } else {
            setFormData({
                name: '',
                role: 'Caissier',
                salary: 0,
                evaluation: 0,
                schedule: '',
                workingDays: [],
                joinDate: new Date().toLocaleDateString('fr-CA'),
                advance: 0,
                balance: 0,
                isTopEmployee: false
            });
        }
    }, [employee, isOpen]);

    const handleSave = () => {
        onSave(formData);
    };

    const handleWorkingDaysChange = (day: 'L'|'M'|'J'|'V'|'S'|'D') => {
        const currentDays = formData.workingDays || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        setFormData(p => ({ ...p, workingDays: newDays }));
    }

    const allDays: ('L'|'M'|'J'|'V'|'S'|'D')[] = ['L', 'M', 'J', 'V', 'S', 'D'];


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>{employee ? 'Modifier l\'employé' : 'Ajouter un employé'}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <Input placeholder="Nom" value={formData.name || ''} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-gray-700 border-gray-600" />
                    <Select value={formData.role} onValueChange={(value) => setFormData(p => ({...p, role: value as 'Caissier' | 'Manager'}))}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="Caissier">Caissier</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Salaire" value={formData.salary || 0} onChange={(e) => setFormData(p => ({ ...p, salary: parseFloat(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600" />
                    <Input type="number" placeholder="Acompte" value={formData.advance || 0} onChange={(e) => setFormData(p => ({ ...p, advance: parseFloat(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600" />
                    <Input placeholder="Date d'entrée (JJ/MM/AAAA)" value={formData.joinDate || ''} onChange={(e) => setFormData(p => ({ ...p, joinDate: e.target.value }))} className="bg-gray-700 border-gray-600" />
                    <Input placeholder="Horaire (ex: 10:00 - 18:00)" value={formData.schedule || ''} onChange={(e) => setFormData(p => ({ ...p, schedule: e.target.value }))} className="bg-gray-700 border-gray-600" />
                    
                    <div className="col-span-2">
                        <Label>Jours de travail</Label>
                        <div className="flex gap-2 mt-2">
                            {allDays.map(day => (
                                <Button 
                                    key={day}
                                    variant={formData.workingDays?.includes(day) ? 'default' : 'outline'}
                                    onClick={() => handleWorkingDaysChange(day)}
                                    className={formData.workingDays?.includes(day) ? 'bg-orange-500' : 'border-gray-600'}
                                >
                                    {day}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600">Annuler</Button>
                    <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// ======================
// EXPENSE FORM
// ======================
interface ExpenseFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (expenseData: Partial<Expense>) => void;
    expense: Expense | null;
    isPending: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onOpenChange, onSave, expense, isPending }) => {
    const [formData, setFormData] = useState<Partial<Expense>>({});

    useEffect(() => {
        if (expense) {
            setFormData(expense);
        } else {
            setFormData({ description: '', amount: 0, category: 'Divers' });
        }
    }, [expense, isOpen]);

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>{expense ? 'Modifier la dépense' : 'Ajouter une dépense'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="bg-gray-700 border-gray-600" />
                    <Input type="number" placeholder="Montant" value={formData.amount || 0} onChange={(e) => setFormData(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600" />
                    <Input placeholder="Catégorie" value={formData.category || ''} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="bg-gray-700 border-gray-600" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600">Annuler</Button>
                    <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
