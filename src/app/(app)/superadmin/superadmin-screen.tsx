

'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  RefreshCw,
  Loader2,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommerceForm } from './superadmin-forms';
import { Logo } from '../logo';
import { DashboardScreen } from '../dashboard/dashboard-screen';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { add } from 'date-fns';
import { Label } from '@/components/ui/label';
import { defaultProducts } from '@/lib/initial-data';


export const SuperAdminScreen: React.FC = () => {
  const { 
    user, setUser, setCurrentView,
    commerces, setCommerces,
    clients, orders, products, setProducts, employees, expenses,
    invoices, setInvoices,
    viewedCommerceId, setViewedCommerceId,
    fetchAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommerce, setEditingCommerce] = useState<Commerce | null>(null);
  const [commerceToInvoiceId, setCommerceToInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.isSuperAdmin) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

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

  const handleSaveCommerce = async (commerceData: Partial<Commerce>, ownerPassword?: string) => {
    if (editingCommerce) {
      // --- UPDATE ---
      const { data: updatedCommerce, error: commerceError } = await supabase
        .from('commerces')
        .update({
          name: commerceData.name,
          ownername: commerceData.ownername,
          owneremail: commerceData.owneremail,
          subscription: commerceData.subscription,
          address: commerceData.address,
          subscription_price: commerceData.subscription_price,
          subscription_period: commerceData.subscription_period,
        })
        .eq('id', editingCommerce.id)
        .select()
        .single();
      
      if(commerceError || !updatedCommerce) { 
        toast({variant: 'destructive', title: 'Erreur', description: `Impossible de mettre à jour le commerce: ${commerceError?.message}`}); 
        return; 
      }

      // Update user table if email or password changed
      const userUpdate: {email?: string, password?: string, name?: string} = {};
      if (commerceData.owneremail && commerceData.owneremail !== editingCommerce.owneremail) {
        userUpdate.email = commerceData.owneremail;
      }
      if (ownerPassword) {
        userUpdate.password = ownerPassword;
      }
      if (commerceData.ownername && commerceData.ownername !== editingCommerce.ownername) {
        userUpdate.name = commerceData.ownername;
      }
      
      if (Object.keys(userUpdate).length > 0 && editingCommerce.owner_id) {
         const { error: userError } = await supabase
          .from('users')
          .update(userUpdate)
          .eq('id', editingCommerce.owner_id);
        
         if (userError) {
           toast({variant: 'destructive', title: 'Erreur Utilisateur', description: `Impossible de mettre à jour l'utilisateur associé: ${userError.message}`});
           return;
         }
      }

      setCommerces(commerces.map(c => c.id === updatedCommerce.id ? updatedCommerce : c));
      toast({variant: 'success', title: 'Succès', description: 'Commerce mis à jour.'});

    } else {
        // --- CREATE ---
        if (!commerceData.owneremail || !commerceData.ownername || !commerceData.name || !ownerPassword) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Tous les champs sont requis, y compris le mot de passe.' });
            return;
        }

        // Step 1: Find or Create the user.
        let ownerUser;
        const { data: existingUser } = await supabase.from('users').select('*').eq('email', commerceData.owneremail).single();

        if (existingUser) {
            if (existingUser.commerce_id) {
                toast({ variant: 'destructive', title: 'Erreur', description: 'Cet utilisateur est déjà propriétaire d\'un autre commerce.' });
                return;
            }
            ownerUser = existingUser;
        } else {
            const { data: newUserData, error: newUserError } = await supabase.from('users').insert({
                name: commerceData.ownername,
                email: commerceData.owneremail,
                password: ownerPassword,
                role: 'Owner',
            }).select().single();

            if (newUserError || !newUserData) {
                toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de créer l'utilisateur propriétaire: ${newUserError?.message}` });
                return;
            }
            ownerUser = newUserData;
        }

        // Step 2: Create the commerce and link the owner.
        const { data: newCommerceData, error: newCommerceError } = await supabase.from('commerces').insert({
            name: commerceData.name,
            ownername: commerceData.ownername,
            owneremail: commerceData.owneremail,
            subscription: commerceData.subscription || 'Trial',
            creationdate: new Date().toLocaleDateString('fr-CA'),
            address: commerceData.address,
            subscription_price: commerceData.subscription_price,
            subscription_period: commerceData.subscription_period,
            owner_id: ownerUser.id,
        }).select().single();
        
        if (newCommerceError || !newCommerceData) {
            toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de créer le commerce: ${newCommerceError?.message}` });
            // If we created a new user, roll it back.
            if (!existingUser) {
              await supabase.from('users').delete().eq('id', ownerUser.id);
            }
            return;
        }

        // Step 3: Update the user with the new commerce_id. THIS IS THE CRUCIAL STEP.
        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ commerce_id: newCommerceData.id })
            .eq('id', ownerUser.id);

        if (userUpdateError) {
            toast({ variant: 'destructive', title: 'Erreur Association', description: `Commerce créé, mais impossible de l'associer à l'utilisateur: ${userUpdateError.message}` });
            // Rollback commerce and user creation
            await supabase.from('commerces').delete().eq('id', newCommerceData.id);
            if (!existingUser) {
              await supabase.from('users').delete().eq('id', ownerUser.id);
            }
            return;
        }
        
        // Step 4. Populate default products for the new commerce
        const productsToInsert = defaultProducts.map(product => ({
            ...product,
            commerce_id: newCommerceData.id,
        }));
        
        const { error: productsError } = await supabase.from('products').insert(productsToInsert);

        if (productsError) {
            toast({variant: 'destructive', title: 'Attention', description: `Le commerce a été créé, mais l'inventaire par défaut n'a pas pu être ajouté: ${productsError.message}`});
        }
        
        await fetchAllData();
        setViewedCommerceId(newCommerceData.id);
        toast({ variant: 'success', title: 'Succès', description: 'Commerce et inventaire par défaut ajoutés.' });
    }
    setIsModalOpen(false);
  };

  const handleDeleteCommerce = async (commerce: Commerce) => {
    const { error: commerceError } = await supabase.from('commerces').delete().eq('id', commerce.id);
    if(commerceError) { 
        toast({variant: 'destructive', title: 'Erreur', description: `Impossible de supprimer le commerce: ${commerceError.message}`});
        return; 
    }
    
    if (commerce.owner_id) {
        const { error: userError } = await supabase.from('users').delete().eq('id', commerce.owner_id);
        if (userError) {
            console.error("Could not delete owner, but commerce was deleted.", userError)
            toast({variant: 'destructive', title: 'Attention', description: 'Le commerce a été supprimé, mais son propriétaire n\'a pas pu être supprimé.'});
        }
    }
    
    setCommerces(commerces.filter(c => c.id !== commerce.id));
    if (viewedCommerceId === commerce.id) {
      setViewedCommerceId(commerces.length > 1 ? commerces.find(c => c.id !== commerce.id)!.id : null);
    }
    toast({variant: 'success', title: 'Commerce Supprimé'});
  };

  const handleGenerateInvoice = async (commerceId: string) => {
    const commerce = commerces.find(c => c.id === commerceId);
    if(!commerce || !commerce.subscription_price) {
        toast({variant: 'destructive', title: 'Erreur', description: 'Commerce non trouvé ou prix non défini.'});
        return;
    }

    const dueDate = add(new Date(), { months: 1 });

    const newInvoice = {
        commerce_id: commerce.id,
        amount: commerce.subscription_price,
        due_date: dueDate.toLocaleDateString('fr-CA'),
        status: 'pending' as 'pending',
    };

    const {data, error} = await supabase.from('invoices').insert(newInvoice).select().single();
    if (error || !data) {
        toast({variant: 'destructive', title: 'Erreur', description: `Impossible de générer la facture: ${error?.message}`});
        return;
    }

    const newInvoiceWithCommerceName = {...data, commerceName: commerce.name};
    setInvoices([newInvoiceWithCommerceName, ...invoices]);
    toast({variant: 'success', title: 'Facture Générée'});
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    const {data, error} = await supabase
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', invoiceId)
        .select()
        .single();
    
    if(error || !data) {
        toast({variant: 'destructive', title: 'Erreur', description: `Impossible de mettre à jour la facture: ${error?.message}`});
        return;
    }

    setInvoices(invoices.map(inv => inv.id === invoiceId ? {...inv, ...data} : inv));
    toast({variant: 'success', title: 'Facture Payée'});
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

  const currentCommerceData = useMemo(() => {
    if (!viewedCommerceId) return null;
    const commerce = commerces.find(c => c.id === viewedCommerceId);
    if (!commerce) return null;

    return {
        commerce,
        products: products.filter(p => p.commerce_id === viewedCommerceId),
        clients: clients.filter(c => c.commerce_id === viewedCommerceId),
        employees: employees.filter(e => e.commerce_id === viewedCommerceId),
        orders: orders.filter(o => o.commerce_id === viewedCommerceId),
        expenses: expenses.filter(ex => ex.commerce_id === viewedCommerceId),
    }
  }, [viewedCommerceId, commerces, products, clients, employees, orders, expenses]);
  
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
                 <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:!bg-red-600/80">
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
              {viewedCommerceId && currentCommerceData ? (
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
                            <Button onClick={() => handleOpenModal()} className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4"/>
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
                                                                Cette action est irréversible. Toutes les données associées à ce commerce (et son utilisateur) seront perdues.
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
                                                <Button size="sm" onClick={() => handleMarkAsPaid(invoice.id)} className="bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="mr-2 h-4 w-4"/> Marquer Payée
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
                                    disabled={!commerceToInvoiceId}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Générer
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
      />
    </div>
  );

    



    

    

    



