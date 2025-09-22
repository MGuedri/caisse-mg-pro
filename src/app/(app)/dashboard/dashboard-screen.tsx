'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useApp } from '@/app/(app)/app-provider';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download, Upload,
  DollarSign,
  Users,
  Package,
  User,
} from 'lucide-react';
import { SyncStatus } from '@/components/sync-status';


const SalesChart: React.FC = () => {
  const mockData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Fév', revenue: 3800 },
    { month: 'Mar', revenue: 5100 },
    { month: 'Avr', revenue: 4900 },
    { month: 'Mai', revenue: 6200 },
    { month: 'Jun', revenue: 5800 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Ventes Mensuelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="revenue" fill="#FF9800" name="Revenus (DT)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const TopProductsChart: React.FC = () => {
  const COLORS = ['#FF9800', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const mockData = [
    { name: 'Express', value: 120 },
    { name: 'Cappuccino', value: 95 },
    { name: 'Croissant', value: 80 },
    { name: 'Chocolat Chaud', value: 65 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Produits Populaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardScreen: React.FC = () => {
  const { orders, employees, products, clients, expenses } = useApp();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.slice(0, 5);
  const topEmployees = employees.filter(emp => emp.isTopEmployee);

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Tableau de Bord</h1>
        <SyncStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Revenus Total</p>
                <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} DT</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Produits</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Employés</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProductsChart />
      </div>

      <Card className="bg-orange-600 border-orange-500">
        <CardHeader>
          <CardTitle className="text-white">Maintenance et Données</CardTitle>
          <CardDescription className="text-orange-100">
            Sauvegardez ou restaurez les données de votre commerce.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap pt-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ventes Récentes</CardTitle>
            <CardDescription className="text-gray-400">Les 5 dernières ventes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{order.clientName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{order.clientName}</p>
                        <p className="text-gray-400 text-sm">{order.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-bold">+{order.total.toFixed(2)} DT</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune vente récente</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Employés</CardTitle>
            <CardDescription className="text-gray-400">Meilleures évaluations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {topEmployees.length > 0 ? (
              <div className="space-y-3">
                {topEmployees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{employee.name}</p>
                        <p className="text-gray-400 text-sm">{employee.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold">★ {employee.evaluation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun top employé</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
