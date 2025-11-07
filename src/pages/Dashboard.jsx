import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Zap, Clock, Activity, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Dashboard() {
  const [applets, setApplets] = useState([]);

  useEffect(() => {
    // Load applets from localStorage (mock data for now)
    const storedApplets = localStorage.getItem('applets');
    if (storedApplets) {
      setApplets(JSON.parse(storedApplets));
    } else {
      // Add some sample applets
      const sampleApplets = [
        {
          id: '1',
          name: 'Daily Weather Email',
          trigger: { type: 'schedule', value: 'Every day at 8:00 AM' },
          action: { type: 'email', value: 'Send weather update' },
          enabled: true,
          lastRun: '2 hours ago',
        },
        {
          id: '2',
          name: 'Webhook to Email',
          trigger: { type: 'webhook', value: 'When webhook received' },
          action: { type: 'email', value: 'Forward to email' },
          enabled: true,
          lastRun: 'Never',
        },
      ];
      localStorage.setItem('applets', JSON.stringify(sampleApplets));
      setApplets(sampleApplets);
    }
  }, []);

  const toggleApplet = (id) => {
    const updated = applets.map(app => 
      app.id === id ? { ...app, enabled: !app.enabled } : app
    );
    setApplets(updated);
    localStorage.setItem('applets', JSON.stringify(updated));
  };

  const deleteApplet = (id) => {
    const updated = applets.filter(app => app.id !== id);
    setApplets(updated);
    localStorage.setItem('applets', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applets</h1>
          <p className="mt-2 text-gray-600">
            Manage your automation workflows
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applets</p>
                <p className="text-2xl font-semibold text-gray-900">{applets.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applets.filter(a => a.enabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Executions Today</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Applet Button */}
        <div className="mb-6">
          <Link
            to="/applets/new"
            className="inline-flex items-center px-6 py-3 btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Applet
          </Link>
        </div>

        {/* Applets List */}
        {applets.length === 0 ? (
          <div className="card text-center py-12">
            <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applets yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first automation to get started
            </p>
            <Link to="/applets/new" className="btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Applet
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applets.map((applet) => (
              <div key={applet.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {applet.name}
                      </h3>
                      <span
                        className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${
                          applet.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {applet.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">If:</span>
                        <span className="ml-2">{applet.trigger.value}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">Then:</span>
                        <span className="ml-2">{applet.action.value}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      Last run: {applet.lastRun}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    <button
                      onClick={() => toggleApplet(applet.id)}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      title={applet.enabled ? 'Disable' : 'Enable'}
                    >
                      {applet.enabled ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteApplet(applet.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
