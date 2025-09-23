
'use client';

import React, { useMemo, useState, useEffect, useTransition } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import type { Commerce, Invoice } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  LogOut,
  Shield,
  LayoutGrid,
  Users,
  DollarSign,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  Building,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommerceForm } from './superadmin-forms';
import { Logo } from '../logo';
import { DashboardScreen } from '../dashboard/dashboard-screen';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { serverSignOut } from '@/app/actions/debug-auth';
import { createCommerce, deleteCommerce, updateCommerce, createInvoice, markInvoiceAsPaid } from '@/app/actions/mutations';

export const SuperAdminScreen: React.FC = () => {
  const { 
    user, setUser, setCurrentView,
    commerces,
    clients, orders,
    invoices,
    viewedCommerceId, setViewedCommerceId,
    refreshData,
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommerce, setEditingCommerce] = useState<Commerce | null>(null);
  const [commerceToInvoiceId, setCommerceToInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user?.isSuperAdmin) {
      refreshData();
    }
  }, [user, refreshData]);

  const platformStats = useMemo(() => {
    return {
      commerceCount: commerces.length,
      clientCount: clients.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    }
  }, [commerces, clients, orders]);

  const handleOpenModal = (commerce: Commerce | null = null) => {
    setEditingCommerce(commerce);
    setIsModalOpen(true);
  };

  const handleSaveCommerce = async (commerceData: Partial<Commerce>, ownerPassword?: string) => {
    startTransition(async () => {
      let result;
      if (editingCommerce) {
        result = await updateCommerce(editingCommerce.id, commerceData);
        if (!result.error) {
          toast({variant: 'success', title: 'Succès', description: 'Commerce mis à jour.'});
        }
      } else {
        if (!commerceData.owneremail || !commerceData.ownername || !commerceData.name || !ownerPassword) {
          toast({ variant: 'destructive', title: 'Erreur', description: 'Tous les champs sont requis, y compris le mot de passe.' });
          return;
        }
        result = await createCommerce(commerceData as Commerce, ownerPassword);
        if (!result.error) {
          toast({ variant: 'success', title: 'Succès', description: 'Commerce ajouté.' });
        }
      }

      if (result.error) {
          toast({ variant: 'destructive', title: 'Erreur', description: result.error });
      } else {
        setIsModalOpen(false);
      }
    });
  };

  const handleDeleteCommerce = async (commerce: Commerce) => {
    startTransition(async () => {
      const result = await deleteCommerce(commerce.id);
      if(result.error) {
          toast({variant: 'destructive', title: 'Erreur', description: result.error});
      } else {
          toast({variant: 'success', title: 'Commerce Supprimé'});
          if (viewedCommerceId === commerce.id) {
            setViewedCommerceId(commerces.length > 1 ? commerces.find(c => c.id !== commerce.id)!.id : null);
          }
      }
    });
  };

  const handleGenerateInvoice = async (commerceId: string) => {
    startTransition(async () => {
      const commerce = commerces.find(c => c.id === commerceId);
      if(!commerce || !commerce.subscription_price) {
          toast({variant: 'destructive', title: 'Erreur', description: 'Commerce non trouvé ou prix non défini.'});
          return;
      }
      const result = await createInvoice(commerceId, commerce.subscription_price, commerce.name);
      if (result.error) {
          toast({variant: 'destructive', title: 'Erreur', description: result.error});
      } else {
          toast({variant: 'success', title: 'Facture Générée'});
      }
    });
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    startTransition(async () => {
      const result = await markInvoiceAsPaid(invoiceId);
      if (result.error) {
          toast({variant: 'destructive', title: 'Erreur', description: result.error});
      } else {
          toast({variant: 'success', title: 'Facture Payée'});
      }
    });
  };


  const getSubscriptionBadge = (status: Commerce['subscription']) => {
    switch (status) {
      case 'Active': return <Badge className="bg-green-600/80 text-white">Actif</Badge>;
      case 'Inactive': return <Badge variant="destructive">Inactif</Badge>;
      case 'Trial': return <Badge variant="secondary" className="bg-blue-600/80 text-white">Essai</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  if (!user || !user.isSuperAdmin) return null;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Logo size="sm" />
          <div className="hidden sm:flex items-center gap-2 text-orange-400">
            <Shield className="h-5 w-5" />
            <h1 className="text-xl font-bold hidden md:block">Super Admin</h1>
          </div>
          
          <div className="w-px h-6 bg-gray-600 mx-2 sm:mx-4"></div>

          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-400" />
            <Select value={viewedCommerceId || ''} onValueChange={(id) => setViewedCommerceId(id)}>
              <SelectTrigger className="w-[150px] sm:w-[200px] bg-gray-700 border-gray-600">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {commerces.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
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
                 <DropdownMenuItem onClick={async () => await serverSignOut()} className="cursor-pointer hover:!bg-red-600/80">
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Déconnexion</span>
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-800 p-1 mb-6">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4"/> Tableau de Bord
                </TabsTrigger>
                <TabsTrigger value="management" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex items-center gap-2">
                    <Settings className="h-4 w-4"/> Gestion Commerces
                </TabsTrigger>
                <TabsTrigger value="invoicing" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex items-center gap-2">
                    <FileText className="h-4 w-4"/> Facturation
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              {viewedCommerceId ? (
                <DashboardScreen />
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p>Veuillez sélectionner un commerce pour afficher son tableau de bord.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="management">
              <div className="space-y-6">
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
                      <p className="text-4xl font-bold text-white">{clients.length}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg text-gray-300">Revenu Total (estimé)</CardTitle>
                      <DollarSign className="h-6 w-6 text-green-400"/>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-white">{orders.reduce((acc, o) => acc + o.total, 0).toFixed(3)} <span className="text-xl">DT</span></p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-white">Gestion des Commerces</CardTitle>
                            <CardDescription className="text-gray-400">Ajouter, modifier ou supprimer des commerces.</CardDescription>
                        </div>
                        <div className='flex gap-2 flex-col sm:flex-row w-full sm:w-auto'>
                            <Button onClick={() => handleOpenModal()} className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Plus className="mr-2 h-4 w-4"/>}
                                Ajouter Commerce
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-gray-800">
                                    <TableHead className="text-white">Nom du Commerce</TableHead>
                                    <TableHead className="text-white hidden lg:table-cell">Propriétaire</TableHead>
                                    <TableHead className="text-white hidden md:table-cell">Abonnement</TableHead>
                                    <TableHead className="text-white">Prix</TableHead>
                                    <TableHead className="text-white hidden lg:table-cell">Date Création</TableHead>
                                    <TableHead className="text-right w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {commerces.map((commerce) => (
                                    <TableRow key={commerce.id} className="border-gray-700 hover:bg-gray-700/50">
                                        <TableCell className="font-medium text-white">{commerce.name}</TableCell>
                                        <TableCell className="text-gray-300 hidden lg:table-cell">{commerce.ownername}</TableCell>
                                        <TableCell className="hidden md:table-cell">{getSubscriptionBadge(commerce.subscription)}</TableCell>
                                        <TableCell className="text-white">
                                            {commerce.subscription_price ? `${commerce.subscription_price.toFixed(3)} DT` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-gray-300 hidden lg:table-cell">{new Date(commerce.creationdate).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
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
                                                        <Trash2 className="mr-2h-4 w-4" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Supprimer {commerce.name}?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-gray-400">
                                                                Cette action est irréversible.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="border-gray-600">Annuler</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteCommerce(commerce)} className="bg-red-600 hover:bg-red-700">
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
                        </div>
                    </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invoicing">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Facturation des Abonnements</CardTitle>
                        <CardDescription className="text-gray-400">Générez et suivez les factures pour chaque commerce.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 hover:bg-gray-800">
                                        <TableHead className="text-white">Commerce</TableHead>
                                        <TableHead className="text-white">Montant</TableHead>
                                        <TableHead className="text-white">Date d'échéance</TableHead>
                                        <TableHead className="text-white">Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="border-gray-700">
                                            <TableCell className="font-medium text-white">{invoice.commerceName || invoice.commerce_id}</TableCell>
                                            <TableCell className="text-gray-300">{invoice.amount.toFixed(3)} DT</TableCell>
                                            <TableCell className="text-gray-300">{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell>
                                                {invoice.status === 'paid' && <Badge className="bg-green-600/80 text-white">Payée</Badge>}
                                                {invoice.status === 'pending' && <Badge variant="secondary" className="bg-yellow-600/80 text-white">En attente</Badge>}
                                                {invoice.status === 'overdue' && <Badge variant="destructive">En retard</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {invoice.status === 'pending' && (
                                                <Button size="sm" onClick={() => handleMarkAsPaid(invoice.id)} className="bg-green-600 hover:bg-green-700" disabled={isPending}>
                                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                                                     Marquer Payée
                                                </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 border-t border-gray-700 pt-6">
                            <h4 className="text-lg font-semibold text-white mb-4">Générer une Nouvelle Facture</h4>
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="w-full sm:w-auto flex-grow">
                                    <Label htmlFor='invoice-commerce-select' className="text-gray-300">Sélectionner un commerce</Label>
                                    <Select onValueChange={setCommerceToInvoiceId}>
                                        <SelectTrigger id='invoice-commerce-select' className="bg-gray-700 border-gray-600 mt-1">
                                            <SelectValue placeholder="Choisir un commerce..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                            {commerces.filter(c => c.subscription_price && c.subscription_price > 0).map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    onClick={() => {
                                        if (commerceToInvoiceId) {
                                            handleGenerateInvoice(commerceToInvoiceId);
                                        } else {
                                            toast({variant: 'destructive', title: 'Erreur', description: 'Veuillez sélectionner un commerce.'})
                                        }
                                    }}
                                    className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                                    disabled={isPending || !commerceToInvoiceId}
                                >
                                    {isPending ? <Loader2 className="mr-2h-4 w-4 animate-spin"/> : <Plus className="mr-2 h-4 w-4" />}
                                     Générer
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
      </main>

      <CommerceForm 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveCommerce}
        commerce={editingCommerce}
        isPending={isPending}
      />
    </div>
  );
