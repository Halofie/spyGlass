import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Calendar, Globe, Mail, Clock } from 'lucide-react';

export default function CreateApplet() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [appletName, setAppletName] = useState('');
  const [trigger, setTrigger] = useState({ type: '', config: {} });
  const [action, setAction] = useState({ type: '', config: {} });

  const triggerTypes = [
    {
      id: 'webhook',
      name: 'Webhook',
      icon: Globe,
      description: 'Trigger when a webhook URL is called',
    },
    {
      id: 'schedule',
      name: 'Schedule',
      icon: Clock,
      description: 'Trigger at specific times or intervals',
    },
    {
      id: 'manual',
      name: 'Manual',
      icon: Calendar,
      description: 'Trigger manually when you want',
    },
  ];

  const actionTypes = [
    {
      id: 'email',
      name: 'Send Email',
      icon: Mail,
      description: 'Send an email notification',
    },
    {
      id: 'webhook',
      name: 'Call Webhook',
      icon: Globe,
      description: 'Make an HTTP request to a URL',
    },
  ];

  const handleTriggerSelect = (type) => {
    setTrigger({ type, config: {} });
    setStep(2);
  };

  const handleActionSelect = (type) => {
    setAction({ type, config: {} });
    setStep(3);
  };

  const handleSave = () => {
    const newApplet = {
      id: Date.now().toString(),
      name: appletName || 'Unnamed Applet',
      trigger: {
        type: trigger.type,
        value: getTriggerDisplay(),
      },
      action: {
        type: action.type,
        value: getActionDisplay(),
      },
      enabled: true,
      lastRun: 'Never',
      createdAt: new Date().toISOString(),
    };

    const storedApplets = localStorage.getItem('applets');
    const applets = storedApplets ? JSON.parse(storedApplets) : [];
    applets.push(newApplet);
    localStorage.setItem('applets', JSON.stringify(applets));

    navigate('/dashboard');
  };

  const getTriggerDisplay = () => {
    switch (trigger.type) {
      case 'webhook':
        return 'When webhook received';
      case 'schedule':
        return trigger.config.schedule || 'Every day at 9:00 AM';
      case 'manual':
        return 'Manual trigger';
      default:
        return '';
    }
  };

  const getActionDisplay = () => {
    switch (action.type) {
      case 'email':
        return `Send email to ${action.config.to || 'recipient'}`;
      case 'webhook':
        return `Call ${action.config.url || 'webhook URL'}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Applet</h1>
          <p className="mt-2 text-gray-600">
            Build your automation in 3 simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? <Check className="h-6 w-6" /> : '1'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Choose Trigger</p>
                <p className="text-xs text-gray-500">When this happens...</p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-gray-400" />

            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 2 ? <Check className="h-6 w-6" /> : '2'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Choose Action</p>
                <p className="text-xs text-gray-500">Then do this...</p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-gray-400" />

            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Configure</p>
                <p className="text-xs text-gray-500">Set it up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Trigger */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              When this happens...
            </h2>
            {triggerTypes.map((triggerType) => {
              const Icon = triggerType.icon;
              return (
                <button
                  key={triggerType.id}
                  onClick={() => handleTriggerSelect(triggerType.id)}
                  className="w-full card hover:shadow-md transition-all text-left hover:border-primary-300"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {triggerType.name}
                      </h3>
                      <p className="text-sm text-gray-600">{triggerType.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Choose Action */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Then do this...
            </h2>
            {actionTypes.map((actionType) => {
              const Icon = actionType.icon;
              return (
                <button
                  key={actionType.id}
                  onClick={() => handleActionSelect(actionType.id)}
                  className="w-full card hover:shadow-md transition-all text-left hover:border-primary-300"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {actionType.name}
                      </h3>
                      <p className="text-sm text-gray-600">{actionType.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              Back to Triggers
            </button>
          </div>
        )}

        {/* Step 3: Configure */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Configure Your Applet
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applet Name
                  </label>
                  <input
                    type="text"
                    value={appletName}
                    onChange={(e) => setAppletName(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Daily Weather Alert"
                  />
                </div>

                {/* Trigger Configuration */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Trigger: {triggerTypes.find(t => t.id === trigger.type)?.name}
                  </h3>
                  
                  {trigger.type === 'schedule' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule
                      </label>
                      <select
                        value={trigger.config.schedule || ''}
                        onChange={(e) => setTrigger({
                          ...trigger,
                          config: { ...trigger.config, schedule: e.target.value }
                        })}
                        className="input-field"
                      >
                        <option value="">Select schedule</option>
                        <option value="Every day at 9:00 AM">Every day at 9:00 AM</option>
                        <option value="Every weekday at 8:00 AM">Every weekday at 8:00 AM</option>
                        <option value="Every Monday at 10:00 AM">Every Monday at 10:00 AM</option>
                        <option value="Every hour">Every hour</option>
                      </select>
                    </div>
                  )}

                  {trigger.type === 'webhook' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">Your webhook URL:</p>
                      <code className="block bg-white p-3 rounded border text-sm break-all">
                        https://api.spyglass.com/webhook/{Date.now()}
                      </code>
                      <p className="text-xs text-gray-500 mt-2">
                        Send POST requests to this URL to trigger your applet
                      </p>
                    </div>
                  )}

                  {trigger.type === 'manual' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        This applet will only run when you manually trigger it from the dashboard
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Configuration */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Action: {actionTypes.find(a => a.id === action.type)?.name}
                  </h3>
                  
                  {action.type === 'email' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          value={action.config.to || ''}
                          onChange={(e) => setAction({
                            ...action,
                            config: { ...action.config, to: e.target.value }
                          })}
                          className="input-field"
                          placeholder="recipient@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Subject
                        </label>
                        <input
                          type="text"
                          value={action.config.subject || ''}
                          onChange={(e) => setAction({
                            ...action,
                            config: { ...action.config, subject: e.target.value }
                          })}
                          className="input-field"
                          placeholder="Your automation alert"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Body
                        </label>
                        <textarea
                          value={action.config.body || ''}
                          onChange={(e) => setAction({
                            ...action,
                            config: { ...action.config, body: e.target.value }
                          })}
                          className="input-field"
                          rows="4"
                          placeholder="Your message here..."
                        />
                      </div>
                    </div>
                  )}

                  {action.type === 'webhook' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={action.config.url || ''}
                          onChange={(e) => setAction({
                            ...action,
                            config: { ...action.config, url: e.target.value }
                          })}
                          className="input-field"
                          placeholder="https://api.example.com/webhook"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Method
                        </label>
                        <select
                          value={action.config.method || 'POST'}
                          onChange={(e) => setAction({
                            ...action,
                            config: { ...action.config, method: e.target.value }
                          })}
                          className="input-field"
                        >
                          <option value="POST">POST</option>
                          <option value="GET">GET</option>
                          <option value="PUT">PUT</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex-1"
              >
                Create Applet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
