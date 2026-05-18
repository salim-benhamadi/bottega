import React, { useState } from 'react';
import BrandIcon from '../../components/BrandIcon';

// ── Connector Catalog ──────────────────────────────────────────────────────

const CONNECTORS = [
  // Storage
  { id: 'google_drive',    name: 'Google Drive',       category: 'Storage',     emoji: '📁', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-600',   description: 'Read, write and organise files and folders',               fields: [{ key: 'client_id', label: 'OAuth Client ID' }, { key: 'client_secret', label: 'OAuth Client Secret', type: 'password' }] },
  { id: 'dropbox',         name: 'Dropbox',             category: 'Storage',     emoji: '💎', bg: 'bg-sky-50',     border: 'border-sky-100',     accent: 'text-sky-600',    description: 'Sync, share and access files from any device',             fields: [{ key: 'access_token', label: 'Access Token', type: 'password' }] },
  { id: 'onedrive',        name: 'OneDrive',            category: 'Storage',     emoji: '☁️', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-700',   description: 'Microsoft cloud storage for files and documents',          fields: [{ key: 'client_id', label: 'App Client ID' }, { key: 'client_secret', label: 'App Client Secret', type: 'password' }] },
  { id: 'box',             name: 'Box',                 category: 'Storage',     emoji: '📦', bg: 'bg-cyan-50',    border: 'border-cyan-100',    accent: 'text-cyan-600',   description: 'Enterprise cloud content management',                      fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },

  // Productivity
  { id: 'google_docs',     name: 'Google Docs',         category: 'Productivity',emoji: '📄', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-600',   description: 'Create, edit and comment on documents',                    fields: [{ key: 'client_id', label: 'OAuth Client ID' }, { key: 'client_secret', label: 'OAuth Client Secret', type: 'password' }] },
  { id: 'google_sheets',   name: 'Google Sheets',       category: 'Productivity',emoji: '📊', bg: 'bg-green-50',   border: 'border-green-100',   accent: 'text-green-600',  description: 'Read, write and analyse spreadsheets',                     fields: [{ key: 'client_id', label: 'OAuth Client ID' }, { key: 'client_secret', label: 'OAuth Client Secret', type: 'password' }] },
  { id: 'notion',          name: 'Notion',              category: 'Productivity',emoji: '📝', bg: 'bg-slate-50',   border: 'border-slate-200',   accent: 'text-slate-700',  description: 'Read and write Notion pages, databases and blocks',         fields: [{ key: 'api_key', label: 'Integration Token', type: 'password' }] },
  { id: 'airtable',        name: 'Airtable',            category: 'Productivity',emoji: '🗃️', bg: 'bg-yellow-50',  border: 'border-yellow-100',  accent: 'text-yellow-700', description: 'Query and update Airtable bases and views',                fields: [{ key: 'api_key', label: 'API Key', type: 'password' }, { key: 'base_id', label: 'Base ID' }] },
  { id: 'confluence',      name: 'Confluence',          category: 'Productivity',emoji: '📚', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-700',   description: 'Access and update team wikis and documentation',           fields: [{ key: 'base_url', label: 'Confluence URL' }, { key: 'email', label: 'Email' }, { key: 'api_token', label: 'API Token', type: 'password' }] },
  { id: 'sharepoint',      name: 'SharePoint',          category: 'Productivity',emoji: '🏢', bg: 'bg-teal-50',    border: 'border-teal-100',    accent: 'text-teal-700',   description: 'Intranet, team sites and document libraries',              fields: [{ key: 'client_id', label: 'App ID' }, { key: 'client_secret', label: 'App Secret', type: 'password' }, { key: 'tenant_id', label: 'Tenant ID' }] },

  // Email
  { id: 'gmail',           name: 'Gmail',               category: 'Email',       emoji: '📧', bg: 'bg-red-50',     border: 'border-red-100',     accent: 'text-red-600',    description: 'Read, compose, send and manage emails',                    fields: [{ key: 'client_id', label: 'OAuth Client ID' }, { key: 'client_secret', label: 'OAuth Client Secret', type: 'password' }] },
  { id: 'outlook',         name: 'Outlook / 365',       category: 'Email',       emoji: '📨', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-700',   description: 'Microsoft email, calendar and contacts',                   fields: [{ key: 'client_id', label: 'App Client ID' }, { key: 'client_secret', label: 'App Client Secret', type: 'password' }, { key: 'tenant_id', label: 'Tenant ID' }] },
  { id: 'sendgrid',        name: 'SendGrid',            category: 'Email',       emoji: '✉️', bg: 'bg-sky-50',     border: 'border-sky-100',     accent: 'text-sky-600',    description: 'Send transactional and marketing emails at scale',         fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'mailchimp',       name: 'Mailchimp',           category: 'Email',       emoji: '🐵', bg: 'bg-yellow-50',  border: 'border-yellow-100',  accent: 'text-yellow-700', description: 'Manage email campaigns, lists and automations',            fields: [{ key: 'api_key', label: 'API Key', type: 'password' }, { key: 'server_prefix', label: 'Server Prefix (e.g. us1)' }] },

  // Messaging
  { id: 'slack',           name: 'Slack',               category: 'Messaging',   emoji: '💬', bg: 'bg-purple-50',  border: 'border-purple-100',  accent: 'text-purple-700', description: 'Send messages, post to channels and manage threads',       fields: [{ key: 'bot_token', label: 'Bot OAuth Token', type: 'password' }, { key: 'webhook_url', label: 'Incoming Webhook URL' }] },
  { id: 'teams',           name: 'Microsoft Teams',     category: 'Messaging',   emoji: '👥', bg: 'bg-indigo-50',  border: 'border-indigo-100',  accent: 'text-indigo-700', description: 'Post messages and cards to Teams channels',               fields: [{ key: 'webhook_url', label: 'Incoming Webhook URL' }] },
  { id: 'discord',         name: 'Discord',             category: 'Messaging',   emoji: '🎮', bg: 'bg-violet-50',  border: 'border-violet-100',  accent: 'text-violet-700', description: 'Send messages to Discord servers and channels',            fields: [{ key: 'bot_token', label: 'Bot Token', type: 'password' }, { key: 'webhook_url', label: 'Webhook URL' }] },
  { id: 'whatsapp',        name: 'WhatsApp Business',   category: 'Messaging',   emoji: '📱', bg: 'bg-green-50',   border: 'border-green-100',   accent: 'text-green-700',  description: 'Send WhatsApp messages via Cloud API',                     fields: [{ key: 'phone_id', label: 'Phone Number ID' }, { key: 'access_token', label: 'Access Token', type: 'password' }] },
  { id: 'telegram',        name: 'Telegram',            category: 'Messaging',   emoji: '✈️', bg: 'bg-sky-50',     border: 'border-sky-100',     accent: 'text-sky-600',    description: 'Send messages through Telegram Bot API',                   fields: [{ key: 'bot_token', label: 'Bot Token', type: 'password' }, { key: 'chat_id', label: 'Default Chat ID' }] },

  // CRM
  { id: 'salesforce',      name: 'Salesforce',          category: 'CRM',         emoji: '☁️', bg: 'bg-sky-50',     border: 'border-sky-100',     accent: 'text-sky-700',    description: 'Manage leads, contacts, opportunities and cases',          fields: [{ key: 'instance_url', label: 'Instance URL' }, { key: 'client_id', label: 'Consumer Key' }, { key: 'client_secret', label: 'Consumer Secret', type: 'password' }] },
  { id: 'hubspot',         name: 'HubSpot',             category: 'CRM',         emoji: '🔶', bg: 'bg-orange-50',  border: 'border-orange-100',  accent: 'text-orange-700', description: 'CRM, contacts, deals, tickets and marketing hub',          fields: [{ key: 'api_key', label: 'Private App Token', type: 'password' }] },
  { id: 'pipedrive',       name: 'Pipedrive',           category: 'CRM',         emoji: '🔵', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-600',   description: 'Pipeline management, deals and activities',               fields: [{ key: 'api_token', label: 'API Token', type: 'password' }] },
  { id: 'zoho_crm',        name: 'Zoho CRM',            category: 'CRM',         emoji: '🟢', bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'text-emerald-700',description: 'Manage contacts, leads and sales pipelines',              fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },

  // Project Management
  { id: 'jira',            name: 'Jira',                category: 'Project',     emoji: '🔷', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-700',   description: 'Create and manage issues, sprints and epics',             fields: [{ key: 'base_url', label: 'Jira URL (yourco.atlassian.net)' }, { key: 'email', label: 'Email' }, { key: 'api_token', label: 'API Token', type: 'password' }] },
  { id: 'asana',           name: 'Asana',               category: 'Project',     emoji: '🎯', bg: 'bg-rose-50',    border: 'border-rose-100',    accent: 'text-rose-600',   description: 'Tasks, projects, milestones and team goals',               fields: [{ key: 'access_token', label: 'Personal Access Token', type: 'password' }] },
  { id: 'linear',          name: 'Linear',              category: 'Project',     emoji: '📐', bg: 'bg-violet-50',  border: 'border-violet-100',  accent: 'text-violet-700', description: 'Issue tracking and project cycles for engineering',        fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'trello',          name: 'Trello',              category: 'Project',     emoji: '📋', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-600',   description: 'Boards, lists and cards for visual project management',    fields: [{ key: 'api_key', label: 'API Key' }, { key: 'token', label: 'Token', type: 'password' }] },
  { id: 'clickup',         name: 'ClickUp',             category: 'Project',     emoji: '✅', bg: 'bg-purple-50',  border: 'border-purple-100',  accent: 'text-purple-700', description: 'Tasks, docs and goals on one platform',                    fields: [{ key: 'api_key', label: 'API Token', type: 'password' }] },
  { id: 'monday',          name: 'Monday.com',          category: 'Project',     emoji: '🗓️', bg: 'bg-rose-50',    border: 'border-rose-100',    accent: 'text-rose-600',   description: 'Work OS for planning, tracking and automating',            fields: [{ key: 'api_key', label: 'API Token', type: 'password' }] },

  // Development
  { id: 'github',          name: 'GitHub',              category: 'Dev',         emoji: '🐙', bg: 'bg-slate-50',   border: 'border-slate-200',   accent: 'text-slate-700',  description: 'Repos, PRs, issues, actions and releases',                fields: [{ key: 'access_token', label: 'Personal Access Token', type: 'password' }] },
  { id: 'gitlab',          name: 'GitLab',              category: 'Dev',         emoji: '🦊', bg: 'bg-orange-50',  border: 'border-orange-100',  accent: 'text-orange-700', description: 'CI/CD pipelines, merge requests and code review',          fields: [{ key: 'access_token', label: 'Personal Access Token', type: 'password' }, { key: 'base_url', label: 'GitLab URL (leave blank for gitlab.com)' }] },
  { id: 'vercel',          name: 'Vercel',              category: 'Dev',         emoji: '▲',  bg: 'bg-slate-50',   border: 'border-slate-200',   accent: 'text-slate-700',  description: 'Deploy and manage frontend projects',                      fields: [{ key: 'access_token', label: 'Access Token', type: 'password' }] },

  // Finance
  { id: 'stripe',          name: 'Stripe',              category: 'Finance',     emoji: '💳', bg: 'bg-violet-50',  border: 'border-violet-100',  accent: 'text-violet-700', description: 'Payments, subscriptions, invoices and refunds',            fields: [{ key: 'secret_key', label: 'Secret Key', type: 'password' }] },
  { id: 'quickbooks',      name: 'QuickBooks',          category: 'Finance',     emoji: '📒', bg: 'bg-green-50',   border: 'border-green-100',   accent: 'text-green-700',  description: 'Accounting, invoices and financial reports',               fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },
  { id: 'xero',            name: 'Xero',                category: 'Finance',     emoji: '🔢', bg: 'bg-sky-50',     border: 'border-sky-100',     accent: 'text-sky-600',    description: 'Invoices, bank reconciliation and payroll',                fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },

  // Analytics
  { id: 'google_analytics',name: 'Google Analytics',   category: 'Analytics',   emoji: '📈', bg: 'bg-orange-50',  border: 'border-orange-100',  accent: 'text-orange-600', description: 'Website traffic, conversions and user behaviour',          fields: [{ key: 'property_id', label: 'GA4 Property ID' }, { key: 'service_account', label: 'Service Account JSON', type: 'password' }] },
  { id: 'mixpanel',        name: 'Mixpanel',            category: 'Analytics',   emoji: '🔍', bg: 'bg-indigo-50',  border: 'border-indigo-100',  accent: 'text-indigo-700', description: 'Product analytics, funnels and cohort analysis',           fields: [{ key: 'project_token', label: 'Project Token' }, { key: 'api_secret', label: 'API Secret', type: 'password' }] },
  { id: 'amplitude',       name: 'Amplitude',           category: 'Analytics',   emoji: '📉', bg: 'bg-blue-50',    border: 'border-blue-100',    accent: 'text-blue-700',   description: 'Digital analytics and behavioural insights',               fields: [{ key: 'api_key', label: 'API Key' }, { key: 'secret_key', label: 'Secret Key', type: 'password' }] },

  // Database
  { id: 'postgres',        name: 'PostgreSQL',          category: 'Database',    emoji: '🐘', bg: 'bg-indigo-50',  border: 'border-indigo-100',  accent: 'text-indigo-700', description: 'Query, insert and update SQL database records',            fields: [{ key: 'connection_string', label: 'Connection String', type: 'password', placeholder: 'postgresql://user:pass@host/db' }] },
  { id: 'mysql',           name: 'MySQL',               category: 'Database',    emoji: '🐬', bg: 'bg-orange-50',  border: 'border-orange-100',  accent: 'text-orange-600', description: 'Read and write MySQL and MariaDB databases',               fields: [{ key: 'host', label: 'Host' }, { key: 'user', label: 'User' }, { key: 'password', label: 'Password', type: 'password' }, { key: 'database', label: 'Database' }] },
  { id: 'mongodb',         name: 'MongoDB',             category: 'Database',    emoji: '🌿', bg: 'bg-green-50',   border: 'border-green-100',   accent: 'text-green-700',  description: 'Read, write and aggregate MongoDB collections',             fields: [{ key: 'connection_string', label: 'Connection URI', type: 'password', placeholder: 'mongodb+srv://...' }] },
  { id: 'supabase',        name: 'Supabase',            category: 'Database',    emoji: '⚡', bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'text-emerald-700',description: 'Postgres + realtime + auth as a service',                  fields: [{ key: 'url', label: 'Project URL' }, { key: 'service_key', label: 'Service Role Key', type: 'password' }] },

  // Integration
  { id: 'zapier',          name: 'Zapier',              category: 'Integration', emoji: '⚡', bg: 'bg-orange-50',  border: 'border-orange-100',  accent: 'text-orange-600', description: 'Trigger Zaps and connect 6000+ apps automatically',        fields: [{ key: 'webhook_url', label: 'Catch Hook Webhook URL' }] },
  { id: 'make',            name: 'Make',                category: 'Integration', emoji: '⚙️', bg: 'bg-violet-50',  border: 'border-violet-100',  accent: 'text-violet-700', description: 'Visual workflow builder for complex automations',           fields: [{ key: 'webhook_url', label: 'Webhook URL' }] },
  { id: 'webhook',         name: 'Custom Webhook',      category: 'Integration', emoji: '🔗', bg: 'bg-slate-50',   border: 'border-slate-200',   accent: 'text-slate-700',  description: 'POST data to any HTTP endpoint on agent actions',          fields: [{ key: 'url', label: 'Endpoint URL' }, { key: 'secret', label: 'Signing Secret (optional)' }] },
  { id: 'rest_api',        name: 'REST API',            category: 'Integration', emoji: '🌐', bg: 'bg-teal-50',    border: 'border-teal-100',    accent: 'text-teal-700',   description: 'Call any REST API with configurable auth headers',         fields: [{ key: 'base_url', label: 'Base URL' }, { key: 'api_key', label: 'API Key / Bearer Token', type: 'password' }] },
  { id: 'graphql',         name: 'GraphQL',             category: 'Integration', emoji: '◈',  bg: 'bg-pink-50',    border: 'border-pink-100',    accent: 'text-pink-700',   description: 'Execute queries and mutations on any GraphQL API',         fields: [{ key: 'endpoint', label: 'Endpoint URL' }, { key: 'auth_token', label: 'Auth Token', type: 'password' }] },
];

const CATEGORIES = ['All', 'Storage', 'Productivity', 'Email', 'Messaging', 'CRM', 'Project', 'Dev', 'Finance', 'Analytics', 'Database', 'Integration'];

const CAT_COLORS = {
  Storage:     'bg-blue-100 text-blue-700',
  Productivity:'bg-purple-100 text-purple-700',
  Email:       'bg-red-100 text-red-700',
  Messaging:   'bg-indigo-100 text-indigo-700',
  CRM:         'bg-orange-100 text-orange-700',
  Project:     'bg-rose-100 text-rose-700',
  Dev:         'bg-slate-200 text-slate-700',
  Finance:     'bg-violet-100 text-violet-700',
  Analytics:   'bg-amber-100 text-amber-700',
  Database:    'bg-green-100 text-green-700',
  Integration: 'bg-teal-100 text-teal-700',
};

// ── ConnectorCard ─────────────────────────────────────────────────────────

function ConnectorCard({ connector, isConnected, isExpanded, onExpand, onConnect, onDisconnect, connecting, disconnecting }) {
  const [form, setForm] = useState({});

  const handleConnect = async () => {
    await onConnect(connector.id, form);
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      isConnected
        ? 'border-emerald-200 shadow-sm shadow-emerald-50'
        : isExpanded
          ? 'border-slate-300 shadow-md'
          : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
    }`}>
      {/* Top status stripe */}
      {isConnected && <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent" />}

      <div className="p-4">
        {/* Card header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${connector.bg} ${connector.border} p-1.5`}>
            <BrandIcon connectorId={connector.id} name={connector.name} size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-slate-900 leading-tight">{connector.name}</p>
              {isConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Connected" />
              )}
            </div>
            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest mt-0.5 ${CAT_COLORS[connector.category] || 'bg-slate-100 text-slate-600'}`}>
              {connector.category}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{connector.description}</p>

        {/* Action row */}
        {isConnected ? (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
              <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
              <span className="text-xs font-bold text-emerald-700">Connected</span>
            </div>
            <button
              onClick={() => onExpand(isExpanded ? null : connector.id)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all" title="Reconfigure">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
            <button
              onClick={() => onDisconnect(connector.id)}
              disabled={disconnecting === connector.id}
              className="p-2 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all disabled:opacity-40" title="Disconnect">
              {disconnecting === connector.id
                ? <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              }
            </button>
          </div>
        ) : (
          <button
            onClick={() => onExpand(isExpanded ? null : connector.id)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isExpanded
                ? 'bg-slate-100 text-slate-600'
                : 'bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/20 active:scale-95'
            }`}>
            {isExpanded
              ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>Cancel</>
              : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>Connect</>
            }
          </button>
        )}
      </div>

      {/* Credential form — expands below */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 pb-4 pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Credentials</p>
          <div className="space-y-2.5 mb-4">
            {connector.fields.map(f => (
              <div key={f.key}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  placeholder={f.placeholder || ''}
                  value={form[f.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting === connector.id}
            className="w-full bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20">
            {connecting === connector.id
              ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Connecting…</>
              : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>Save & Connect</>
            }
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────

export { CONNECTORS };

export default function ConnectorsTab({ connectors, onConnect, onDisconnect }) {
  const connectedIds = new Set((connectors || []).map(c => c.connector_id));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [disconnecting, setDisconnecting] = useState(null);

  const filtered = CONNECTORS.filter(c => {
    if (category !== 'All' && c.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    }
    return true;
  });

  const connectedFirst = [
    ...filtered.filter(c => connectedIds.has(c.id)),
    ...filtered.filter(c => !connectedIds.has(c.id)),
  ];

  const handleConnect = async (connectorId, credentials) => {
    setConnecting(connectorId);
    await onConnect(connectorId, credentials);
    setConnecting(null);
    setExpandedId(null);
  };

  const handleDisconnect = async (connectorId) => {
    setDisconnecting(connectorId);
    await onDisconnect(connectorId);
    setDisconnecting(null);
  };

  const totalConnected = connectedIds.size;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Integrations</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Connectors</h1>
          <p className="text-slate-500 font-medium text-lg">Connect the tools your agents need to do their jobs.</p>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-display font-extrabold text-emerald-500">{totalConnected}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-display font-extrabold text-slate-700">{CONNECTORS.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          type="text"
          placeholder="Search connectors…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              category === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}>
            {cat}
            {cat !== 'All' && connectedIds.size > 0 && (() => {
              const cnt = CONNECTORS.filter(c => c.category === cat && connectedIds.has(c.id)).length;
              return cnt > 0 ? <span className="ml-1.5 bg-emerald-400 text-white text-[8px] font-extrabold rounded-full px-1 py-0.5">{cnt}</span> : null;
            })()}
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-slate-400 font-medium mb-4">{connectedFirst.length} result{connectedFirst.length !== 1 ? 's' : ''} for "{search}"</p>
      )}

      {/* Grid */}
      {connectedFirst.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-3xl mb-3">🔌</p>
          <p className="text-slate-500 font-semibold">No connectors found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {connectedFirst.map(connector => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              isConnected={connectedIds.has(connector.id)}
              isExpanded={expandedId === connector.id}
              onExpand={setExpandedId}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              connecting={connecting}
              disconnecting={disconnecting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
