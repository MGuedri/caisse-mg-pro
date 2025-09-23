
'use client';

import React, { useState, useEffect } from 'react';
import { Commerce } from '@/app/(app)/app-provider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommerceFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (commerceData: Partial<Commerce>) => void;
  commerce: Commerce | null;
}

export const CommerceForm: React.FC<CommerceFormProps> = ({ isOpen, onOpenChange, onSave, commerce }) => {
  const [formData, setFormData] = useState<Partial<Commerce>>({});

  useEffect(() => {
    if (commerce) {
      setFormData(commerce);
    } else {
      setFormData({ 
        name: '', 
        ownerName: '', 
        ownerEmail: '',
        password: '',
        subscription: 'Trial', 
        creationDate: new Date().toISOString().split('T')[0],
        address: '',
      });
    }
  }, [commerce, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{commerce ? 'Modifier le Commerce' : 'Ajouter un Commerce'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Nom du Commerce" value={formData.name || ''} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input placeholder="Nom du Propriétaire" value={formData.ownerName || ''} onChange={(e) => setFormData(p => ({...p, ownerName: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input placeholder="Adresse" value={formData.address || ''} onChange={(e) => setFormData(p => ({...p, address: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input placeholder="Email du Propriétaire" type="email" value={formData.ownerEmail || ''} onChange={(e) => setFormData(p => ({...p, ownerEmail: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Input placeholder="Mot de passe" type="password" value={formData.password || ''} onChange={(e) => setFormData(p => ({...p, password: e.target.value}))} className="bg-gray-700 border-gray-600"/>
          <Select value={formData.subscription} onValueChange={(value: Commerce['subscription']) => setFormData(p => ({...p, subscription: value}))}>
            <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Abonnement" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="Active">Actif</SelectItem>
                <SelectItem value="Inactive">Inactif</SelectItem>
                <SelectItem value="Trial">Essai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600">Annuler</Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

    