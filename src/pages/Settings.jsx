import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="card">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  className="input-field"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="input-field"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AWS Configuration */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">AWS Configuration</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                AWS integration will be configured after backend deployment. 
                You'll be able to manage your AWS Cognito settings, SES configuration, 
                and Lambda functions from here.
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary-600 mr-3" defaultChecked />
                <span className="text-sm text-gray-700">Email notifications for applet executions</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary-600 mr-3" defaultChecked />
                <span className="text-sm text-gray-700">Email notifications for errors</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-primary-600 mr-3" />
                <span className="text-sm text-gray-700">Weekly summary emails</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
