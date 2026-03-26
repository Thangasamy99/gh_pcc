import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { securityService } from '@/services/securityService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  AlertCircle, 
  UserCheck, 
  Activity,
  Clock,
  UserPlus,
  FileText,
  Search
} from 'lucide-react';

interface DashboardStats {
  totalEntriesToday: number;
  emergencyCasesToday: number;
  visitorsInside: number;
  normalEntriesToday: number;
  visitorEntriesToday: number;
  emergencyEntriesToday: number;
}

interface ActiveVisitor {
  id: number;
  visitorId: string;
  visitorName: string;
  patientName: string;
  roomNumber: string;
  entryTime: string;
  visitorPassNumber: string;
}

interface RecentEntry {
  id: number;
  entryId: string;
  entryType: string;
  fullName: string;
  entryTime: string;
  status: string;
}

const SecurityDashboard: React.FC = () => {
  const { user, currentBranch } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!currentBranch?.id) return;

    setLoading(true);
    setError(null);

    try {
      const [statsData, visitorsData, entriesData] = await Promise.all([
        securityService.getDashboardStats(currentBranch.id),
        securityService.getActiveVisitors(currentBranch.id),
        securityService.getTodayEntries(currentBranch.id)
      ]);

      setStats(statsData);
      setActiveVisitors(visitorsData.slice(0, 5)); // Show only first 5
      setRecentEntries(entriesData.slice(0, 5)); // Show only first 5
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, [currentBranch]);

  const handleCheckoutVisitor = async (visitorId: number) => {
    if (!user?.id) return;

    try {
      await securityService.checkoutVisitor(visitorId, user.id);
      fetchDashboardData(); // Refresh data
    } catch (err: any) {
      console.error('Error checking out visitor:', err);
      alert('Failed to checkout visitor');
    }
  };

  const getEntryTypeColor = (entryType: string) => {
    switch (entryType) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800';
      case 'VISITOR':
        return 'bg-blue-100 text-blue-800';
      case 'NORMAL':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <p>{error}</p>
          <Button onClick={fetchDashboardData} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {currentBranch?.name} - {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchDashboardData} variant="outline">
            Refresh
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEntriesToday || 0}</div>
            <p className="text-xs text-muted-foreground">All entry types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.emergencyCasesToday || 0}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors Inside</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.visitorsInside || 0}</div>
            <p className="text-xs text-muted-foreground">Currently in facility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normal Entries</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.normalEntriesToday || 0}</div>
            <p className="text-xs text-muted-foreground">Regular patient entries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Visitors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeVisitors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active visitors</p>
            ) : (
              <div className="space-y-3">
                {activeVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{visitor.visitorName}</p>
                      <p className="text-sm text-gray-600">
                        Visiting: {visitor.patientName} | Room: {visitor.roomNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Entry: {formatTime(visitor.entryTime)} | Pass: {visitor.visitorPassNumber}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCheckoutVisitor(visitor.id)}
                    >
                      Checkout
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No entries today</p>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{entry.fullName}</p>
                      <p className="text-sm text-gray-600">
                        ID: {entry.entryId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Entry: {formatTime(entry.entryTime)}
                      </p>
                    </div>
                    <Badge className={getEntryTypeColor(entry.entryType)}>
                      {entry.entryType}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <UserPlus className="h-6 w-6 mb-2" />
              <span>New Entry</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Search className="h-6 w-6 mb-2" />
              <span>Find Patient</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>Daily Logs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              <span>Emergency</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
