import React, { useState, useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useRoute } from '../context/RouteContext';
import { Settings, Save, ArrowLeft, Copy, RefreshCw, RotateCcw } from 'lucide-react';
import RedirectFooter from '../components/RedirectFooter';
import { Config } from '../config/config';

const ConfigPage: React.FC = () => {
  const { config, updateConfig, resetConfig } = useConfig();
  const { navigateTo, isConfigLocked } = useRoute();
  const [formData, setFormData] = useState<Config>({ ...config });
  const [copied, setCopied] = useState(false);
  const [testLinkParams, setTestLinkParams] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    if (isConfigLocked) {
      navigateTo('redirect');
    }
  }, [isConfigLocked, navigateTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev };
      if (name.startsWith('theme.')) {
        const themeProp = name.split('.')[1];
        newData.theme = { ...newData.theme, [themeProp]: value };
      } else if (name.startsWith('turnstile.')) {
        const turnstileProp = name.split('.')[1];
        newData.turnstile = { ...newData.turnstile, [turnstileProp]: turnstileProp === 'maxAttempts' ? parseInt(value) : value };
      } else {
        (newData as any)[name] = value;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig(formData);
      navigateTo('redirect');
    } catch (err) {
      // Error is handled by the useConfig hook
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      try {
        await resetConfig();
        setFormData({ ...config });
      } catch (err) {
        // Error is handled by the useConfig hook
      }
    }
  };

  const generateTestLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    if (testLinkParams) {
      params.set('to', testLinkParams);
    } else if (formData.defaultTargetUrl) {
      params.set('to', formData.defaultTargetUrl);
    }
    
    const link = `${baseUrl}?${params.toString()}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConfigLocked) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigateTo('redirect')}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuration
              </h1>
              <p className="text-sm text-gray-500">
                Customize your redirect experience
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset to Defaults
          </button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-500">
                    Configure the default behavior of your redirect page
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="defaultTargetUrl" className="block text-sm font-medium text-gray-700">
                      Default Redirect URL
                    </label>
                    <input
                      type="url"
                      id="defaultTargetUrl"
                      name="defaultTargetUrl"
                      value={formData.defaultTargetUrl}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Used when no URL is specified in parameters
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500">
                    Customize how your redirect page looks
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="headerTitle" className="block text-sm font-medium text-gray-700">
                      Header Title
                    </label>
                    <input
                      type="text"
                      id="headerTitle"
                      name="headerTitle"
                      value={formData.headerTitle}
                      onChange={handleChange}
                      placeholder="Secure Redirect"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="headerSubtitle" className="block text-sm font-medium text-gray-700">
                      Header Subtitle
                    </label>
                    <input
                      type="text"
                      id="headerSubtitle"
                      name="headerSubtitle"
                      value={formData.headerSubtitle}
                      onChange={handleChange}
                      placeholder="Please verify to continue"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="leftLogoUrl" className="block text-sm font-medium text-gray-700">
                      Left Logo URL (optional)
                    </label>
                    <input
                      type="url"
                      id="leftLogoUrl"
                      name="leftLogoUrl"
                      value={formData.leftLogoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/left-logo.png"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Logo displayed on the left side of the header
                    </p>
                  </div>

                  <div>
                    <label htmlFor="rightLogoUrl" className="block text-sm font-medium text-gray-700">
                      Right Logo URL (optional)
                    </label>
                    <input
                      type="url"
                      id="rightLogoUrl"
                      name="rightLogoUrl"
                      value={formData.rightLogoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/right-logo.png"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Logo displayed on the right side of the header
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Show Destination URL
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="showDestinationUrl"
                          checked={formData.showDestinationUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, showDestinationUrl: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Display the target URL on the redirect page
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="text-lg font-medium text-gray-900">Theme Settings</h2>
                  <p className="text-sm text-gray-500">
                    Customize the colors of your redirect page
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="theme.primaryColor" className="block text-sm font-medium text-gray-700">
                      Primary Color
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="color"
                        id="theme.primaryColor"
                        name="theme.primaryColor"
                        value={formData.theme.primaryColor}
                        onChange={handleChange}
                        className="h-9 w-9 rounded-l-md border border-r-0 border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.theme.primaryColor}
                        onChange={handleChange}
                        name="theme.primaryColor"
                        className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="theme.backgroundColor" className="block text-sm font-medium text-gray-700">
                      Background Color
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="color"
                        id="theme.backgroundColor"
                        name="theme.backgroundColor"
                        value={formData.theme.backgroundColor}
                        onChange={handleChange}
                        className="h-9 w-9 rounded-l-md border border-r-0 border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.theme.backgroundColor}
                        onChange={handleChange}
                        name="theme.backgroundColor"
                        className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="theme.textColor" className="block text-sm font-medium text-gray-700">
                      Text Color
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="color"
                        id="theme.textColor"
                        name="theme.textColor"
                        value={formData.theme.textColor}
                        onChange={handleChange}
                        className="h-9 w-9 rounded-l-md border border-r-0 border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.theme.textColor}
                        onChange={handleChange}
                        name="theme.textColor"
                        className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="text-lg font-medium text-gray-900">Cloudflare Turnstile Settings</h2>
                  <p className="text-sm text-gray-500">
                    Configure Cloudflare Turnstile verification settings
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="turnstile.siteKey" className="block text-sm font-medium text-gray-700">
                      Site Key
                    </label>
                    <input
                      type="text"
                      id="turnstile.siteKey"
                      name="turnstile.siteKey"
                      value={formData.turnstile.siteKey}
                      onChange={handleChange}
                      placeholder="0x4AAAAAABaeDHdwHVmJobfE"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label htmlFor="turnstile.maxAttempts" className="block text-sm font-medium text-gray-700">
                      Max Attempts
                    </label>
                    <input
                      type="number"
                      id="turnstile.maxAttempts"
                      name="turnstile.maxAttempts"
                      value={formData.turnstile.maxAttempts}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <h2 className="text-lg font-medium text-gray-900">Generate Test Link</h2>
                  <p className="text-sm text-gray-500">
                    Create a test link for your email campaigns
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="testLinkParams" className="block text-sm font-medium text-gray-700">
                      Target URL (optional)
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="url"
                        id="testLinkParams"
                        value={testLinkParams}
                        onChange={(e) => setTestLinkParams(e.target.value)}
                        placeholder="https://example.com/destination"
                        className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={generateTestLink}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="ml-1">Generate</span>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to use the default redirect URL
                    </p>
                  </div>
                  
                  {generatedLink && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Generated Link
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          readOnly
                          value={generatedLink}
                          className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 bg-gray-50 sm:text-sm p-2 border"
                        />
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                        >
                          {copied ? (
                            <span className="text-green-500">Copied!</span>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="ml-1">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end pt-5">
                  <button
                    type="button"
                    onClick={() => navigateTo('redirect')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Configuration
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <RedirectFooter />
    </div>
  );
};

export default ConfigPage;