'use client';

import React from 'react';
import { useApp } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Download, Upload,
  CreditCard,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { SyncStatus } from '@/components/sync-status';


const TotalCreditCard: React.FC = () => {
    const { clients } = useApp();
    const totalCredit = clients.reduce((sum, client) => sum + client.credit, 0);

    return (
        <Card className="bg-orange-600/90 border-orange-500 text-white relative overflow-hidden">
             <CardContent className="p-6">
                <CreditCard className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
                <p className="text-sm text-orange-100">Total Crédit</p>
                <p className="text-3xl font-bold">{totalCredit.toFixed(3)} DT</p>
             </CardContent>
        </Card>
    )
}

const TopProductsCard: React.FC = () => {
    const topProducts = [
        { name: 'Express', sold: 2, color: 'bg-yellow-400' },
        { name: 'Cappuccin', sold: 2, color: 'bg-gray-400' },
        { name: 'Cappuccin Noisette', sold: 2, color: 'bg-orange-400' }
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
    const { orders } = useApp();
    const todayOrders = orders.slice(0, 2); // Mocking today's orders

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white text-lg">Historique Détaillé des Ventes</CardTitle>
                <CardDescription className="text-gray-400">
                    Liste de toutes les transactions enregistrées aujourd'hui ({todayOrders.length}).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {todayOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{order.clientName}</p>
                                <p className="text-gray-400 text-sm">#{order.id.slice(-6)}</p>
                            </div>
                            <div className="text-right flex items-center gap-2">
                                <div>
                                    <p className="text-gray-400 text-sm">{new Date(order.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="text-orange-400 font-bold">{order.total.toFixed(3)} DT</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400"/>
                            </div>
                        </div>
                    ))}
                </div>
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
        a.download = `caisse-mg-backup-${new Date().toISOString().split('T')[0]}.json`;
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
              localStorage.setItem('caisse_mg_data', JSON.stringify(data));
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

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-900 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <SyncStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalCreditCard />
        <PeakHourCard/>
        <div className="md:col-span-2">
            <TopProductsCard />
        </div>
        <div className="md:col-span-2">
            <SalesHistoryCard />
        </div>
        <div className="md:col-span-2">
            <DataManagementCard />
        </div>
      </div>

    </div>
  );
};
