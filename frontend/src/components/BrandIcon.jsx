import React, { useState } from 'react';
import {
  siGoogledrive, siGoogledocs, siGooglesheets, siGoogleanalytics,
  siDropbox, siBox,
  siAirtable, siNotion, siConfluence,
  siGmail, siMailchimp,
  siDiscord, siWhatsapp, siTelegram,
  siHubspot, siZoho,
  siJira, siAsana, siLinear, siTrello, siClickup,
  siGithub, siGitlab, siVercel,
  siStripe, siXero, siQuickbooks,
  siMixpanel,
  siPostgresql, siMysql, siMongodb, siSupabase,
  siZapier, siMake, siGraphql,
} from 'simple-icons';

// ── Simple-Icons map ───────────────────────────────────────────────────────
const SI_MAP = {
  google_drive:     siGoogledrive,
  google_docs:      siGoogledocs,
  google_sheets:    siGooglesheets,
  google_analytics: siGoogleanalytics,
  dropbox:          siDropbox,
  box:              siBox,
  airtable:         siAirtable,
  notion:           siNotion,
  confluence:       siConfluence,
  gmail:            siGmail,
  mailchimp:        siMailchimp,
  discord:          siDiscord,
  whatsapp:         siWhatsapp,
  telegram:         siTelegram,
  hubspot:          siHubspot,
  zoho_crm:         siZoho,
  jira:             siJira,
  asana:            siAsana,
  linear:           siLinear,
  trello:           siTrello,
  clickup:          siClickup,
  github:           siGithub,
  gitlab:           siGitlab,
  vercel:           siVercel,
  stripe:           siStripe,
  xero:             siXero,
  quickbooks:       siQuickbooks,
  mixpanel:         siMixpanel,
  postgres:         siPostgresql,
  mysql:            siMysql,
  mongodb:          siMongodb,
  supabase:         siSupabase,
  zapier:           siZapier,
  make:             siMake,
  graphql:          siGraphql,
};

// ── Clearbit domains for brands not in simple-icons ───────────────────────
const CLEARBIT_MAP = {
  slack:      'slack.com',
  onedrive:   'onedrive.live.com',
  sharepoint: 'sharepoint.com',
  outlook:    'outlook.com',
  teams:      'teams.microsoft.com',
  sendgrid:   'sendgrid.com',
  salesforce: 'salesforce.com',
  pipedrive:  'pipedrive.com',
  monday:     'monday.com',
  amplitude:  'amplitude.com',
};

// ── Custom SVGs for generic connectors ────────────────────────────────────
function WebhookIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function RestApiIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}

// ── BrandIcon component ───────────────────────────────────────────────────

function ClearbitIcon({ domain, name, size }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || domain || '?').slice(0, 2).toUpperCase();

  if (failed) {
    const hue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
      <div
        className="flex items-center justify-center text-white font-extrabold"
        style={{ width: size, height: size, fontSize: size * 0.38, borderRadius: Math.round(size * 0.25), background: `hsl(${hue}, 55%, 55%)`, flexShrink: 0 }}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={size}
      height={size}
      style={{ borderRadius: Math.round(size * 0.2), objectFit: 'contain' }}
      onError={() => setFailed(true)}
    />
  );
}

export default function BrandIcon({ connectorId, name, size = 28 }) {
  // 1. Try simple-icons
  const si = SI_MAP[connectorId];
  if (si) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={`#${si.hex}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}>
        <path d={si.path} />
      </svg>
    );
  }

  // 2. Try Clearbit image
  const domain = CLEARBIT_MAP[connectorId];
  if (domain) {
    return <ClearbitIcon domain={domain} name={name} size={size} />;
  }

  // 3. Custom generic SVGs
  if (connectorId === 'webhook') return <WebhookIcon size={size} />;
  if (connectorId === 'rest_api') return <RestApiIcon size={size} />;

  // 4. Last-resort: colored initial
  const hue = [...(connectorId || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center text-white font-extrabold"
      style={{ width: size, height: size, fontSize: size * 0.38, borderRadius: Math.round(size * 0.25), background: `hsl(${hue}, 55%, 55%)`, flexShrink: 0 }}>
      {(name || connectorId || '?').slice(0, 2).toUpperCase()}
    </div>
  );
}
