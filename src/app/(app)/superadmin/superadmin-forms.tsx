
'use client';

import React, { useState, useEffect } from 'react';
import { Commerce } from '@/app/(app)/app-provider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CommerceFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (commerceData: Partial<Commerce>, ownerPassword?: string) => void;
  commerce: Commerce | null;
  isPending: boolean;
}

export const CommerceForm: React.FC<CommerceFormProps> = ({ isOpen, onOpenChange, onSave, commerce, isPending }) => {
  const [formData, setFormData] = useState<Partial<Commerce>>({});
  const [ownerPassword, setOwnerPassword] = useState('');

  useEffect(() => {
    if (commerce) {
      setFormData(commerce);
      setOwnerPassword(''); // Clear password on edit
    } else {
      setFormData({ 
        name: '', 
        ownername: '', 
        owneremail: '',
        subscription: 'Trial', 
        creationdate: new Date().toLocaleDateString('fr-CA'), // YYYY-MM-DD
        address: '',
        subscription_price: 0,
        subscription_period: 'monthly'
      });
      setOwnerPassword('');
    }
  }, [commerce, isOpen]);

  const handleSave = () => {
    onSave(formData, ownerPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>{commerce ? 'Modifier le Commerce' : 'Ajouter un Commerce'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4">
          <div className="col-span-2">
            <Label>Nom du Commerce</Label>
            <Input placeholder="Nom du Commerce" value={formData.name || ''} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="bg-gray-700 border-gray-600 mt-1"/>
          </div>
          <div>
            <Label>Nom du Propriétaire</Label>
            <Input placeholder="Nom du Propriétaire" value={formData.ownername || ''} onChange={(e) => setFormData(p => ({...p, ownername: e.target.value}))} className="bg-gray-700 border-gray-600 mt-1"/>
          </div>
          <div>
            <Label>Email du Propriétaire</Label>
            <Input placeholder="Email du Propriétaire" type="email" value={formData.owneremail || ''} onChange={(e) => setFormData(p => ({...p, owneremail: e.target.value}))} className="bg-gray-700 border-gray-600 mt-1"/>
          </div>
          <div className="col-span-2">
            <Label>Adresse</Label>
            <Input placeholder="Adresse" value={formData.address || ''} onChange={(e) => setFormData(p => ({...p, address: e.target.value}))} className="bg-gray-700 border-gray-600 mt-1"/>
          </div>
          <div className="col-span-2">
             <Label>Mot de passe</Label>
            <Input 
                placeholder={commerce ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe du propriétaire"}
                type="password" 
                value={ownerPassword} 
                onChange={(e) => setOwnerPassword(e.target.value)} 
                className="bg-gray-700 border-gray-600 mt-1"
            />
          </div>
          <div>
            <Label>Abonnement</Label>
            <Select value={formData.subscription} onValueChange={(value: Commerce['subscription']) => setFormData(p => ({...p, subscription: value}))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 mt-1">
                    <SelectValue placeholder="Abonnement" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="Active">Actif</SelectItem>
                    <SelectItem value="Inactive">Inactif</SelectItem>
                    <SelectItem value="Trial">Essai</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prix de l'abonnement (DT)</Label>
            <Input type="number" placeholder="Prix" value={formData.subscription_price || 0} onChange={(e) => setFormData(p => ({ ...p, subscription_price: parseFloat(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600 mt-1" />
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
