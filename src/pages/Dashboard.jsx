import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Zap, Clock, Activity, Trash2, ToggleLeft, ToggleRight, Copy, CheckCircle, ExternalLink, Play, AlertCircle } from 'lucide-react';
import config from '../config';
import { appletService } from '../services';

export default function Dashboard() {
  const [applets, setApplets] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [testingId, setTestingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplets();
  }, []);

  const loadApplets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appletService.getAll();
      // Normalize appletId to id for frontend compatibility
      const normalized = (response.data || []).map(applet => ({
        ...applet,
        id: applet.appletId || applet.id,
      }));
      setApplets(normalized);
    } catch (err) {
      console.error('Error loading applets:', err);
      setError('Failed to load applets');
      setApplets([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleApplet = async (id) => {
    try {
      await appletService.toggle(id);
      await loadApplets(); // Reload to get updated data
    } catch (err) {
      console.error('Error toggling applet:', err);
      alert('Failed to toggle applet');
    }
  };

  const deleteApplet = async (id) => {
    if (!confirm('Are you sure you want to delete this applet?')) return;
    
    try {
      await appletService.delete(id);
      await loadApplets(); // Reload to get updated data
    } catch (err) {
      console.error('Error deleting applet:', err);
      alert('Failed to delete applet');
    }
  };

  const copyWebhookUrl = (appletId) => {
    const webhookUrl = `${config.api.baseUrl}/webhooks/${appletId}`;
    navigator.clipboard.writeText(webhookUrl);
    setCopiedId(appletId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const testWebhook = async (appletId) => {
    setTestingId(appletId);
    try {
      const response = await fetch(`${config.api.baseUrl}/webhooks/${appletId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          message: 'Test webhook trigger from dashboard',
          timestamp: new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Webhook triggered successfully!\n\n' + JSON.stringify(data, null, 2));
      } else {
        alert('❌ Webhook failed:\n\n' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      alert('❌ Error triggering webhook:\n\n' + error.message);
    } finally {
      setTestingId(null);
    }
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

        {/* Error State */}
        {error && (
          <div className="mb-6 card border-red-200 bg-red-50">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
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

                    {/* Webhook URL for webhook triggers */}
                    {applet.trigger.type === 'webhook' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-blue-900 mb-1">Webhook URL:</p>
                            <code className="text-xs text-blue-700 break-all">
                              {config.api.baseUrl}/webhooks/{applet.id}
                            </code>
                          </div>
                          <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                            <button
                              onClick={() => testWebhook(applet.id)}
                              disabled={testingId === applet.id}
                              className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                              title="Test webhook"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => copyWebhookUrl(applet.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Copy webhook URL"
                            >
                              {copiedId === applet.id ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 " />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2 flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          POST to this URL to trigger the applet (don't open in browser!)
                        </p>
                      </div>
                    )}
                    
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
          </>
        )}
      </div>
    </div>
  );
}
