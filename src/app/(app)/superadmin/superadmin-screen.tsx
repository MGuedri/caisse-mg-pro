
'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import type { Commerce } from '@/lib/commerces';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  LogOut,
  User,
  Shield,
  Building,
  Users,
  DollarSign,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommerceForm } from './superadmin-forms';
import { Logo } from '../logo';

export const SuperAdminScreen: React.FC = () => {
  const { 
    user, setUser, setCurrentView,
    commerces, setCommerces,
    clients, orders
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommerce, setEditingCommerce] = useState<Commerce | null>(null);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  const platformStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    return {
      commerceCount: commerces.length,
      clientCount: clients.length,
      totalRevenue: totalRevenue,
    }
  }, [commerces, clients, orders]);

  const handleOpenModal = (commerce: Commerce | null = null) => {
    setEditingCommerce(commerce);
    setIsModalOpen(true);
  };

  const handleSaveCommerce = (commerceData: Partial<Commerce>) => {
    if (editingCommerce) {
      setCommerces(commerces.map(c => c.id === editingCommerce.id ? { ...c, ...commerceData } as Commerce : c));
    } else {
      const newId = commerceData.name?.toLowerCase().replace(/\s/g, '_') || `comm_${Date.now()}`;
      const newCommerce: Commerce = {
        id: newId,
        name: commerceData.name || "Nouveau Commerce",
        ownerName: commerceData.ownerName || "N/A",
        ownerEmail: commerceData.ownerEmail || "N/A",
        subscription: commerceData.subscription || 'Trial',
        creationDate: new Date().toISOString().split('T')[0]
      };
      setCommerces([...commerces, newCommerce]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCommerce = (commerceId: string) => {
    setCommerces(commerces.filter(c => c.id !== commerceId));
  };


  const getSubscriptionBadge = (status: Commerce['subscription']) => {
    switch (status) {
      case 'Active': return <Badge className="bg-green-600/80 text-white">Actif</Badge>;
      case 'Inactive': return <Badge variant="destructive">Inactif</Badge>;
      case 'Trial': return <Badge variant="secondary" className="bg-blue-600/80 text-white">Essai</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2 text-orange-400">
            <Shield className="h-5 w-5" />
            <h1 className="text-xl font-bold">Tableau de Bord Super Admin</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-orange-400">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700 text-white" align="end">
                 <DropdownMenuLabel className="font-normal p-2">
                   <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-gray-400">{user.email}</p>
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator className="bg-gray-700" />
                 <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:!bg-red-600/80">
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Déconnexion</span>
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-300">Commerces Actifs</CardTitle>
              <Building className="h-6 w-6 text-blue-400"/>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{platformStats.commerceCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-300">Clients Totaux</CardTitle>
              <Users className="h-6 w-6 text-purple-400"/>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{platformStats.clientCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-300">Revenu Total (estimé)</CardTitle>
              <DollarSign className="h-6 w-6 text-green-400"/>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{platformStats.totalRevenue.toFixed(3)} <span className="text-xl">DT</span></p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-white">Gestion des Commerces</CardTitle>
                    <CardDescription className="text-gray-400">Ajouter, modifier ou supprimer des commerces.</CardDescription>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4"/>
                    Ajouter Commerce
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-800">
                            <TableHead className="text-white">Nom du Commerce</TableHead>
                            <TableHead className="text-white">Propriétaire</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Abonnement</TableHead>
                            <TableHead className="text-white">Date Création</TableHead>
                            <TableHead className="text-right w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commerces.map((commerce) => (
                            <TableRow key={commerce.id} className="border-gray-700 hover:bg-gray-700/50">
                                <TableCell className="font-medium text-white">{commerce.name}</TableCell>
                                <TableCell className="text-gray-300">{commerce.ownerName}</TableCell>
                                <TableCell className="text-gray-300">{commerce.ownerEmail}</TableCell>
                                <TableCell>{getSubscriptionBadge(commerce.subscription)}</TableCell>
                                <TableCell className="text-gray-300">{commerce.creationDate}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                          <DropdownMenuItem onClick={() => handleOpenModal(commerce)} className="cursor-pointer">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Modifier
                                          </DropdownMenuItem>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                               <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-400 focus:text-red-400 focus:!bg-red-900/50">
                                                  <Trash2 className="mr-2 h-4 w-4" />
                                                  Supprimer
                                               </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer {commerce.name}?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Cette action est irréversible. Toutes les données associées à ce commerce seront perdues.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border-gray-600">Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteCommerce(commerce.id)} className="bg-red-600 hover:bg-red-700">
                                                        Confirmer la Suppression
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </main>

      <CommerceForm 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveCommerce}
        commerce={editingCommerce}
      />
    </div>
  );
};
