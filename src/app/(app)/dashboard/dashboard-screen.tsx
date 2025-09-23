
'use client';

import React, { useState } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Download, Upload,
  CreditCard,
  TrendingUp,
  ChevronDown,
  DollarSign,
  ShoppingCart,
  ArrowDown,
  User,
  Send,
  Loader2,
} from 'lucide-react';
import { SyncStatus } from '@/components/sync-status';
import { generateReport } from '@/ai/flows/generate-report-flow';


const ChiffreAffaireCard: React.FC = () => {
    const { orders } = useApp();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <Card className="bg-green-600/90 border-green-500 text-white relative overflow-hidden">
             <CardContent className="p-6">
                <DollarSign className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
                <p className="text-sm text-green-100">Chiffre d'Affaire</p>
                <p className="text-3xl font-bold">{totalRevenue.toFixed(3)} DT</p>
                <div className="flex items-center text-xs text-green-100 mt-1">
                    <ArrowDown className="h-3 w-3 mr-1"/>
                    <span>-100.0% par rapport à hier</span>
                </div>
             </CardContent>
        </Card>
    )
}

const NombreVentesCard: React.FC = () => {
    const { orders } = useApp();
    const totalSales = orders.length;

    return (
        <Card className="bg-blue-600/90 border-blue-500 text-white relative overflow-hidden">
             <CardContent className="p-6">
                <ShoppingCart className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
                <p className="text-sm text-blue-100">Nombre de Ventes</p>
                <p className="text-3xl font-bold">{totalSales}</p>
                <div className="flex items-center text-xs text-blue-100 mt-1">
                    <ArrowDown className="h-3 w-3 mr-1"/>
                    <span>-100.0% par rapport à hier</span>
                </div>
             </CardContent>
        </Card>
    )
}

const TotalCreditCard: React.FC = () => {
    const { clients } = useApp();
    const totalCredit = clients.reduce((sum, client) => sum + client.credit, 0);

    return (
        <Card className="bg-orange-600/90 border-orange-500 text-white relative overflow-hidden">
             <CardContent className="p-6">
                <CreditCard className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
                <p className="text-sm text-orange-100">Total Crédit</p>
                <p className="text-3xl font-bold">{totalCredit.toFixed(3)} DT</p>
                <div className="flex items-center text-xs text-orange-100 mt-1">
                    <ArrowDown className="h-3 w-3 mr-1"/>
                    <span>-100.0% par rapport à hier</span>
                </div>
             </CardContent>
        </Card>
    )
}

const TopProductsCard: React.FC = () => {
    const topProducts = [
        { name: 'Café express', sold: 2, color: 'bg-yellow-400' },
        { name: 'Capucin', sold: 2, color: 'bg-gray-400' },
        { name: 'Thé au menthe', sold: 2, color: 'bg-green-400' }
    ];

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white text-lg">Top Produits du Jour</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-white">{index + 1}. {product.name}</span>
                                <span className="text-gray-400">{product.sold} vendus</span>
                            </div>
                            <Progress value={50 + Math.random() * 50} className={`h-2 [&>div]:${product.color}`} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const PeakHourCard: React.FC = () => (
    <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-lg">Heure de Pointe</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-400"/>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold text-orange-400">Soir (18-05h)</p>
            <p className="text-sm text-gray-400">Période avec le plus de ventes aujourd'hui.</p>
        </CardContent>
    </Card>
);

const SalesHistoryCard: React.FC = () => {
    const { orders, user } = useApp();
    const todayOrders = orders; // Using all orders for now

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white text-lg">Historique Détaillé des Ventes</CardTitle>
                <CardDescription className="text-gray-400">
                    Liste de toutes les transactions enregistrées aujourd'hui ({todayOrders.length}).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {todayOrders.map(order => (
                        <AccordionItem value={order.id} key={order.id} className="border-b-gray-700">
                            <AccordionTrigger className="hover:no-underline [&[data-state=open]>svg]:text-orange-400">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div>
                                        <p className="text-white font-medium text-left">{order.clientName}</p>
                                        <p className="text-gray-400 text-sm text-left">#{order.id.slice(-6)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-sm">{new Date(order.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-orange-400 font-bold">{order.total.toFixed(3)} DT</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-gray-900/50 p-4 rounded-md">
                               <div className="space-y-2 mb-4">
                                 {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <p className="text-gray-300">{item.quantity} x {item.name} @ {item.price.toFixed(3)} DT</p>
                                        <p className="text-white">{(item.quantity * item.price).toFixed(3)} DT</p>
                                    </div>
                                 ))}
                               </div>
                               <div className="border-t border-gray-700 pt-2 space-y-1 text-sm">
                                   <div className="flex justify-between">
                                       <p className="text-gray-400">Sous-total</p>
                                       <p className="text-white">{order.total.toFixed(3)} DT</p>
                                   </div>
                                    <div className="flex justify-between">
                                       <p className="text-gray-400">TVA</p>
                                       <p className="text-white">0.000 DT</p>
                                   </div>
                                    <div className="flex justify-between font-bold">
                                       <p className="text-white">Total</p>
                                       <p className="text-orange-400">{order.total.toFixed(3)} DT</p>
                                   </div>
                               </div>
                               <div className="border-t border-gray-700 mt-3 pt-2 flex items-center gap-2 text-sm text-gray-400">
                                   <User className="h-4 w-4"/>
                                   <span>Vendu par : <span className="font-medium text-white">{user?.name}</span></span>
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}


const DataManagementCard: React.FC = () => {
    const { products, clients, employees, orders, expenses } = useApp();

    const handleBackup = () => {
        const data = {
          products,
          clients,
          employees,
          orders,
          expenses,
          timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `caisse-mp-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target?.result as string);
              localStorage.setItem('caisse_mp_data', JSON.stringify(data));
              window.location.reload();
            } catch (error) {
              alert('Erreur lors de la restauration');
            }
          };
          reader.readAsText(file);
        }
      };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Maintenance et Données</CardTitle>
                <CardDescription className="text-gray-400">
                    Sauvegardez ou restaurez les données de votre commerce.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
                <Button onClick={handleBackup} className="bg-orange-500 hover:bg-orange-400 text-white">
                    <Download className="mr-2 h-4 w-4" /> Sauvegarder
                </Button>
                <div>
                    <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} id="restore-input" />
                    <Button onClick={() => document.getElementById('restore-input')?.click()} variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                        <Upload className="mr-2 h-4 w-4" /> Restaurer
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export const DashboardScreen: React.FC = () => {
  const { user, orders, clients } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendReport = async () => {
    setIsGenerating(true);
    try {
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalSales = orders.length;
      const totalCredit = clients.reduce((sum, client) => sum + client.credit, 0);
      const peakHour = "Soir (18-05h)"; // Placeholder
      const topProducts = [ // Placeholder
          { name: 'Café express', sold: 2 },
          { name: 'Capucin', sold: 2 },
          { name: 'Thé au menthe', sold: 2 }
      ];

      const reportHtml = await generateReport({
        totalRevenue: totalRevenue.toFixed(3) + ' DT',
        totalSales: totalSales.toString(),
        totalCredit: totalCredit.toFixed(3) + ' DT',
        peakHour: peakHour,
        topProducts: topProducts.map(p => `${p.name} (x${p.sold})`),
        salesHistory: orders.map(order => ({
            id: order.id.slice(-6),
            client: order.clientName,
            time: new Date(order.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            total: order.total.toFixed(3) + ' DT',
            items: order.items.map(item => `${item.quantity} x ${item.name} @ ${item.price.toFixed(3)} DT`),
        })),
      });

      const subject = `Bilan de la Journée - ${new Date().toLocaleDateString('fr-FR')}`;
      const mailtoLink = `mailto:${user?.ownerEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportHtml)}`;
      window.location.href = mailtoLink;

    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Erreur lors de la génération du rapport.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-900 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleSendReport} className="bg-orange-500 hover:bg-orange-600" disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Envoyer le Bilan
          </Button>
          <SyncStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ChiffreAffaireCard />
        <NombreVentesCard />
        <TotalCreditCard />
        <PeakHourCard/>
        <div className="lg:col-span-2">
            <TopProductsCard />
        </div>
        <div className="lg:col-span-2">
            <SalesHistoryCard />
        </div>
        <div className="md:col-span-2 lg:col-span-4">
            <DataManagementCard />
        </div>
      </div>

    </div>
  );
};
