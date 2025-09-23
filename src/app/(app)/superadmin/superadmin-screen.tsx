
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import type { Commerce } from '@/app/(app)/app-provider';
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
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommerceForm } from './superadmin-forms';
import { Logo } from '../logo';
import { DashboardScreen } from '../dashboard/dashboard-screen';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';


export const SuperAdminScreen: React.FC = () => {
  const { 
    user, setUser, setCurrentView,
    commerces, setCommerces,
    clients, orders, products, employees, expenses,
    viewedCommerceId, setViewedCommerceId,
    fetchAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommerce, setEditingCommerce] = useState<Commerce | null>(null);
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
          ownerName: commerceData.ownerName,
          ownerEmail: commerceData.ownerEmail,
          subscription: commerceData.subscription,
          address: commerceData.address
        })
        .eq('id', editingCommerce.id)
        .select()
        .single();
      
      if(commerceError || !updatedCommerce) { toast({variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour le commerce.'}); return; }

      // Update user table if email or password changed
      const userUpdate: {email?: string, password?: string, name?: string} = {};
      if (commerceData.ownerEmail && commerceData.ownerEmail !== editingCommerce.ownerEmail) {
        userUpdate.email = commerceData.ownerEmail;
      }
      if (ownerPassword) {
        userUpdate.password = ownerPassword;
      }
      if (commerceData.ownerName && commerceData.ownerName !== editingCommerce.ownerName) {
        userUpdate.name = commerceData.ownerName;
      }
      
      if (Object.keys(userUpdate).length > 0 && editingCommerce.owner_id) {
         const { error: userError } = await supabase
          .from('users')
          .update(userUpdate)
          .eq('id', editingCommerce.owner_id);
        
         if (userError) {
           toast({variant: 'destructive', title: 'Erreur Utilisateur', description: 'Impossible de mettre à jour l\'utilisateur associé.'});
           return;
         }
      }

      setCommerces(commerces.map(c => c.id === updatedCommerce.id ? updatedCommerce : c));
      toast({variant: 'success', title: 'Succès', description: 'Commerce mis à jour.'});

    } else {
        // --- CREATE ---
        if (!commerceData.ownerEmail || !commerceData.ownerName || !commerceData.name) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Nom du commerce, nom du propriétaire et email sont requis.' });
            return;
        }

        let ownerId: string;
        let ownerUser;

        // 1. Check if user already exists
        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('*')
            .eq('email', commerceData.ownerEmail)
            .single();

        if (existingUser) {
            // User exists, check if they already own a commerce
            if(existingUser.commerce_id) {
                toast({ variant: 'destructive', title: 'Erreur', description: 'Cet utilisateur est déjà propriétaire d\'un autre commerce.' });
                return;
            }
            ownerUser = existingUser;
            ownerId = existingUser.id;
        } else {
            // User does not exist, create them
            if (!ownerPassword) {
                toast({ variant: 'destructive', title: 'Erreur', description: 'Le mot de passe est requis pour un nouveau propriétaire.' });
                return;
            }
            const { data: newUserData, error: newUserError } = await supabase
                .from('users')
                .insert({
                    name: commerceData.ownerName,
                    email: commerceData.ownerEmail,
                    password: ownerPassword,
                    role: 'Owner',
                })
                .select()
                .single();

            if (newUserError || !newUserData) {
                toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de créer l'utilisateur propriétaire. L'email existe peut-être déjà." });
                return;
            }
            ownerUser = newUserData;
            ownerId = newUserData.id;
        }

        // 2. Create the commerce and link it
        const { data: newCommerceData, error: newCommerceError } = await supabase
            .from('commerces')
            .insert({
                name: commerceData.name,
                ownerName: commerceData.ownerName,
                ownerEmail: commerceData.ownerEmail,
                subscription: commerceData.subscription || 'Trial',
                creationdate: new Date().toISOString().split('T')[0],
                address: commerceData.address,
                owner_id: ownerId,
            })
            .select()
            .single();

        if (newCommerceError || !newCommerceData) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de créer le commerce.' });
            // If user was newly created, roll back user creation
            if (!existingUser) {
                await supabase.from('users').delete().eq('id', ownerId);
            }
            return;
        }

        // 3. Link commerce_id back to user
        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ commerce_id: newCommerceData.id })
            .eq('id', ownerId);

        if(userUpdateError) {
             toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de lier le commerce à l'utilisateur." });
             // Rollback: delete commerce and potentially the user
             await supabase.from('commerces').delete().eq('id', newCommerceData.id);
             if (!existingUser) {
                await supabase.from('users').delete().eq('id', ownerId);
             }
             return;
        }

        setCommerces([...commerces, newCommerceData]);
        toast({ variant: 'success', title: 'Succès', description: 'Commerce et propriétaire ajoutés.' });
    }
    setIsModalOpen(false);
  };


  const handleDeleteCommerce = async (commerce: Commerce) => {
    if (!commerce.owner_id) {
        toast({variant: 'destructive', title: 'Erreur', description: 'Impossible de trouver le propriétaire associé.'});
        return;
    }

    // 1. Unlink user from commerce first
    const { error: unlinkError } = await supabase.from('users').update({ commerce_id: null }).eq('id', commerce.owner_id);
    if(unlinkError) {
        toast({variant: 'destructive', title: 'Erreur', description: 'Impossible de délier l\'utilisateur.'});
        return;
    }
    
    // 2. Delete the commerce
    const { error: commerceError } = await supabase.from('commerces').delete().eq('id', commerce.id);
    if(commerceError) { 
        toast({variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le commerce.'});
        // Relink user if commerce deletion fails
        await supabase.from('users').update({ commerce_id: commerce.id }).eq('id', commerce.owner_id);
        return; 
    }
    
    // Optionally delete the user if they are no longer needed
    // For now, we will leave the user in the system so they can be reassigned.
    // To delete:
    // const { error: userError } = await supabase.from('users').delete().eq('id', commerce.owner_id);
    
    setCommerces(commerces.filter(c => c.id !== commerce.id));
    if (viewedCommerceId === commerce.id) {
      setViewedCommerceId(commerces.length > 1 ? commerces.find(c => c.id !== commerce.id)!.id : null);
    }
    toast({variant: 'success', title: 'Commerce Supprimé'});
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
                                    <TableHead className="text-white hidden md:table-cell">Adresse</TableHead>
                                    <TableHead className="text-white">Abonnement</TableHead>
                                    <TableHead className="text-white hidden lg:table-cell">Date Création</TableHead>
                                    <TableHead className="text-right w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {commerces.map((commerce) => (
                                    <TableRow key={commerce.id} className="border-gray-700 hover:bg-gray-700/50">
                                        <TableCell className="font-medium text-white">{commerce.name}</TableCell>
                                        <TableCell className="text-gray-300 hidden lg:table-cell">{commerce.ownerName}</TableCell>
                                        <TableCell className="text-gray-300 hidden md:table-cell">{commerce.address}</TableCell>
                                        <TableCell>{getSubscriptionBadge(commerce.subscription)}</TableCell>
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

    

    


    

    

    