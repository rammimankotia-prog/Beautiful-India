/**
 * Wanderlust Explorer Pro - Master Site Builder
 * Reads all 56 design subfolders, converts HTML→JSX,
 * strips embedded headers/footers (injected by Layout),
 * adds intelligent React-Router <Link> wiring between pages,
 * and writes routes.jsx.
 */

const fs   = require('fs');
const path = require('path');

const SRC_DIR  = path.resolve(__dirname, '..', 'stitch_wanderlust_explorer_pro_home');
const PAGE_DIR = path.resolve(__dirname, 'src', 'pages');
const COMP_DIR = path.resolve(__dirname, 'src', 'components');

if (!fs.existsSync(PAGE_DIR)) fs.mkdirSync(PAGE_DIR, { recursive: true });

/* =====================================================================
   ROUTE MAP – Every folder → { path, label, group }
   ===================================================================== */
const ROUTE_MAP = {
  wanderlust_explorer_pro_home:             { path: '/',                                     label: 'Home',                      group: 'main' },

  // Tours
  tours_discovery_filtering_1:              { path: '/tours',                                label: 'Tours',                     group: 'tours' },
  tours_discovery_filtering_2:              { path: '/tours/filter/2',                       label: 'Tours – Filter 2',          group: 'tours' },
  tours_discovery_filtering_3:              { path: '/tours/filter/3',                       label: 'Tours – Filter 3',          group: 'tours' },
  tours_discovery_filtering_4:              { path: '/tours/filter/4',                       label: 'Tours – Filter 4',          group: 'tours' },
  tours_discovery_filtering_5:              { path: '/tours/filter/5',                       label: 'Tours – Filter 5',          group: 'tours' },
  tours_discovery_filtering_6:              { path: '/tours/filter/6',                       label: 'Tours – Filter 6',          group: 'tours' },
  tours_discovery_filtering_7:              { path: '/tours/filter/7',                       label: 'Tours – Filter 7',          group: 'tours' },
  tours_discovery_filtering_8:              { path: '/tours/filter/8',                       label: 'Tours – Filter 8',          group: 'tours' },
  tour_detail_view:                         { path: '/tours/detail',                         label: 'Tour Detail',               group: 'tours' },

  // Booking Funnel
  checkout_traveler_details:                { path: '/checkout/traveler',                    label: 'Checkout – Traveler',       group: 'booking' },
  checkout_payment_method:                  { path: '/checkout/payment',                     label: 'Checkout – Payment',        group: 'booking' },
  booking_confirmation_success_1:           { path: '/booking/success',                      label: 'Booking Success',           group: 'booking' },
  booking_confirmation_success_2:           { path: '/booking/success-2',                    label: 'Booking Success 2',         group: 'booking' },
  booking_cancellation_request_form:        { path: '/booking/cancel',                       label: 'Cancel Booking',            group: 'booking' },
  booking_cancellation_confirmation_email:  { path: '/booking/cancel-confirm',               label: 'Cancel Confirmed',          group: 'booking' },

  // User Account
  user_my_bookings_history:                 { path: '/account/bookings',                     label: 'My Bookings',               group: 'account' },
  saved_trips_wishlist:                     { path: '/account/wishlist',                     label: 'Saved Trips',               group: 'account' },
  smart_packing_list_generator:             { path: '/account/packing-list',                 label: 'Packing List',              group: 'account' },
  tour_review_submission_form:              { path: '/account/review',                       label: 'Write a Review',            group: 'account' },
  tour_review_confirmation_email:           { path: '/account/review-confirmed',             label: 'Review Submitted',          group: 'account' },

  // Referral & Rewards
  refer_a_friend_rewards:                   { path: '/referral',                             label: 'Refer a Friend',            group: 'rewards' },
  referral_rewards_dashboard:               { path: '/referral/dashboard',                   label: 'Referral Dashboard',        group: 'rewards' },
  referral_invite_email_template:           { path: '/referral/invite',                      label: 'Invite Email',              group: 'rewards' },
  referral_credit_applied_notification:     { path: '/referral/credit-applied',              label: 'Credit Applied',            group: 'rewards' },
  referral_reward_milestone_pop_up:         { path: '/referral/milestone',                   label: 'Milestone Reward',          group: 'rewards' },
  seasonal_referral_campaign_landing_page:  { path: '/referral/campaign',                    label: 'Seasonal Campaign',         group: 'rewards' },

  // Gift Cards
  gift_card_personalize_your_gift:          { path: '/gift-cards',                           label: 'Gift Cards',                group: 'gifts' },
  gift_card_checkout_delivery:              { path: '/gift-cards/checkout',                  label: 'Gift Card Checkout',        group: 'gifts' },
  gift_card_purchase_confirmed:             { path: '/gift-cards/confirmed',                 label: 'Gift Card Confirmed',       group: 'gifts' },
  gift_card_delivery_email_template:        { path: '/gift-cards/delivery-email',            label: 'Gift Card Email',           group: 'gifts' },

  // WanderBot AI
  wanderbot_tour_matchmaker_chatbot:        { path: '/wanderbot',                            label: 'WanderBot AI',              group: 'ai' },
  wanderbot_recommended_tours_view:         { path: '/wanderbot/recommendations',            label: 'WanderBot Picks',           group: 'ai' },
  wanderbot_consultation_success_screen:    { path: '/wanderbot/success',                    label: 'WanderBot Success',         group: 'ai' },
  wanderbot_limited_time_flash_sale_card:   { path: '/wanderbot/flash-sale',                 label: 'Flash Sale',                group: 'ai' },

  // Guides & Blog
  travel_guides_category_landing:           { path: '/guides',                               label: 'Travel Guides',             group: 'content' },
  travel_blog_post_detail_view_1:           { path: '/blog/post-1',                          label: 'Blog Post 1',               group: 'content' },
  travel_blog_post_detail_view_2:           { path: '/blog/post-2',                          label: 'Blog Post 2',               group: 'content' },
  travel_advisory_safety_guide:             { path: '/guides/safety',                        label: 'Safety Guide',              group: 'content' },

  // Emails (viewable pages)
  welcome_email_template:                   { path: '/emails/welcome',                       label: 'Welcome Email',             group: 'emails' },
  member_only_exclusive_tour_email:         { path: '/emails/member-offer',                  label: 'Member Offer Email',        group: 'emails' },
  seasonal_tour_sale_promotional_email:     { path: '/emails/seasonal-sale',                 label: 'Seasonal Sale Email',       group: 'emails' },
  custom_trip_quote_request_email:          { path: '/emails/quote-request',                 label: 'Quote Request Email',       group: 'emails' },
  upcoming_trip_booking_reminder_email:     { path: '/emails/trip-reminder',                 label: 'Trip Reminder Email',       group: 'emails' },
  '24_hour_trip_departure_countdown_email': { path: '/emails/countdown',                     label: '24h Countdown Email',       group: 'emails' },
  tour_review_confirmation_email:           { path: '/emails/review-confirm',                label: 'Review Confirm Email',      group: 'emails' },
  booking_cancellation_confirmation_email:  { path: '/emails/cancel-confirm',                label: 'Cancel Confirm Email',      group: 'emails' },
  trip_anniversary_milestone_email:         { path: '/emails/anniversary',                   label: 'Anniversary Email',         group: 'emails' },
  waitlist_join_confirmation_email:         { path: '/emails/waitlist',                      label: 'Waitlist Email',            group: 'emails' },
  referral_invite_email_template:           { path: '/emails/referral-invite',               label: 'Referral Invite Email',     group: 'emails' },
  secure_password_reset_email:              { path: '/emails/password-reset',                label: 'Password Reset Email',      group: 'emails' },

  // Admin
  admin_tour_management_dashboard:          { path: '/admin',                                label: 'Admin Dashboard',           group: 'admin' },
  admin_booking_management_dashboard:       { path: '/admin/bookings',                       label: 'Admin Bookings',            group: 'admin' },
  admin_new_tour_upload_form:               { path: '/admin/tours/new',                      label: 'Admin New Tour',            group: 'admin' },
  admin_chatbot_lead_management:            { path: '/admin/leads',                          label: 'Admin Chatbot Leads',       group: 'admin' },

  // Legal & Auth
  customer_success_story_detail:            { path: '/success-story',                        label: 'Success Story',             group: 'content' },
  privacy_policy_layout:                    { path: '/privacy',                              label: 'Privacy Policy',            group: 'legal' },
  terms_of_service_layout:                  { path: '/terms',                               label: 'Terms of Service',          group: 'legal' },
  '404_error_page_not_found':               { path: '/404',                                 label: '404 Error',                 group: 'legal' },
};

/* =====================================================================
   LINK INJECTION – for each folder, specify href → <Link to="">
   ===================================================================== */
const LINK_RULES = [
  // Universal navigation targets
  { find: /href="[^"]*tours[^"]*"/gi,             replace: 'to="/tours"',                                tag: 'Link' },
  { find: /href="[^"]*book-now[^"]*"/gi,          replace: 'to="/checkout/traveler"',                   tag: 'Link' },
  { find: /href="[^"]*checkout[^"]*"/gi,          replace: 'to="/checkout/traveler"',                   tag: 'Link' },
  { find: /href="[^"]*guide[^"]*"/gi,             replace: 'to="/guides"',                              tag: 'Link' },
  { find: /href="[^"]*blog[^"]*"/gi,              replace: 'to="/blog/post-1"',                         tag: 'Link' },
  { find: /href="[^"]*referral[^"]*"/gi,          replace: 'to="/referral"',                            tag: 'Link' },
  { find: /href="[^"]*wishlist[^"]*"/gi,          replace: 'to="/account/wishlist"',                    tag: 'Link' },
  { find: /href="[^"]*bookings[^"]*"/gi,          replace: 'to="/account/bookings"',                    tag: 'Link' },
  { find: /href="[^"]*packing[^"]*"/gi,           replace: 'to="/account/packing-list"',                tag: 'Link' },
  { find: /href="[^"]*privacy[^"]*"/gi,           replace: 'to="/privacy"',                             tag: 'Link' },
  { find: /href="[^"]*terms[^"]*"/gi,             replace: 'to="/terms"',                               tag: 'Link' },
  { find: /href="[^"]*gift[^"]*"/gi,              replace: 'to="/gift-cards"',                          tag: 'Link' },
  { find: /href="[^"]*wanderbot[^"]*"/gi,         replace: 'to="/wanderbot"',                           tag: 'Link' },
];

/* =====================================================================
   HELPERS
   ===================================================================== */
function toPascalCase(str) {
  let p = str.split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  if (/^[0-9]/.test(p)) p = 'Page' + p;
  return p;
}

function applyStyleFix(content) {
  const fixStyle = (match, styleStr) => {
    const obj = styleStr.split(';').filter(s => s.trim()).map(s => {
      const [prop, ...val] = s.split(':');
      const camel = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      const value = val.join(':').trim().replace(/"/g, "'");
      return `${camel}: "${value}"`;
    }).join(', ');
    return `style={{ ${obj} }}`;
  };
  content = content.replace(/style='([^']+)'/g, fixStyle);
  content = content.replace(/style="([^"]+)"/g, fixStyle);
  return content;
}

function htmlToJsx(html, folder) {
  let c = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, html])[1];

  // Strip embedded header/footer (Layout.jsx provides them)
  c = c.replace(/<header[\s\S]*?<\/header>/gi, '');
  c = c.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Strip scripts
  c = c.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Wrap raw CSS <style> blocks
  c = c.replace(/<style>([\s\S]*?)<\/style>/gi, (_, css) =>
    `<style dangerouslySetInnerHTML={{ __html: \`${css.replace(/`/g,'\\`').replace(/\$/g,'\\$')}\` }} />`
  );

  // Comments
  c = c.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  // Class replacements
  c = c.replace(/className=/g, 'class=');
  c = c.replace(/class=/g, 'className=');

  // Strip width constraints for full-width layout
  c = c.replace(/\bmax-w-\[[^\]]+\]/g, '');
  c = c.replace(/\bmax-w-[a-z0-9]+/g, '');
  c = c.replace(/\bcontainer\b/g, '');
  c = c.replace(/\bmx-auto\b/g, '');

  // Inline styles
  c = applyStyleFix(c);

  // Self-close void elements
  ['img','input','br','hr','meta'].forEach(tag => {
    c = c.replace(new RegExp(`<${tag}([^>]*[^/])>`, 'gi'), `<${tag}$1 />`);
  });

  // HTML attrs → JSX attrs
  c = c.replace(/\bfor=/g,      'htmlFor=');
  c = c.replace(/\btabindex=/g, 'tabIndex=');

  // SVG attrs
  c = c.replace(/stroke-width=/g,   'strokeWidth=');
  c = c.replace(/stroke-linecap=/g, 'strokeLinecap=');
  c = c.replace(/stroke-linejoin=/g,'strokeLinejoin=');
  c = c.replace(/fill-rule=/g,      'fillRule=');
  c = c.replace(/clip-rule=/g,      'clipRule=');

  // Smart <a> → <Link> conversion:
  c = c.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, inner) => {
    const hrefMatch = attrs.match(/href="([^"]*)"/i);
    const href = hrefMatch ? hrefMatch[1] : '';

    // Leave placeholder/empty hrefs untouched
    if (!href || href === '#' || href.startsWith('javascript') || href.startsWith('mailto') || href.startsWith('tel')) {
      return match;
    }

    // Convert to <Link>
    const cleanAttrs = attrs.replace(/\s*href="[^"]*"/i, '').trim();
    return `<Link to="${href}"${cleanAttrs ? ' ' + cleanAttrs : ''}>${inner}</Link>`;
  });

  // Add smart page-specific links by group
  const info = ROUTE_MAP[folder] || {};
  if (info.group === 'tours') {
    c = addLink(c, 'Book Now',       '/checkout/traveler');
    c = addLink(c, 'View Details',   '/tours/detail');
  }
  if (info.group === 'booking') {
    c = addLink(c, 'Continue',       getNextInFunnel(folder));
  }
  if (info.group === 'admin') {
    c = addLink(c, 'Add New Tour',   '/admin/tours/new');
    c = addLink(c, 'View Bookings',  '/admin/bookings');
    c = addLink(c, 'Chatbot Leads',  '/admin/leads');
  }

  return c;
}

function getNextInFunnel(folder) {
  const order = ['checkout_traveler_details','checkout_payment_method','booking_confirmation_success_1'];
  const i = order.indexOf(folder);
  if (i >= 0 && i < order.length - 1) {
    return ROUTE_MAP[order[i + 1]]?.path || '/';
  }
  return '/booking/success';
}

function addLink(content, label, to) {
  // Wraps buttons/anchors containing the label text
  const re = new RegExp(`(<button[^>]*>)([^<]*${label}[^<]*)(</button>)`, 'gi');
  return content.replace(re, `<Link to="${to}">$1$2$3</Link>`);
}

/* =====================================================================
   MAIN CONVERSION LOOP
   ===================================================================== */
// Folders with hand-crafted pages - skip auto-generation for these
const SKIP_FOLDERS = new Set([
  'wanderlust_explorer_pro_home',
  'privacy_policy_layout',
  'terms_of_service_layout',
  'tour_detail_view'
]);

const folders = fs.readdirSync(SRC_DIR).filter(f =>
  fs.statSync(path.join(SRC_DIR, f)).isDirectory()
);

// Initialize with hand-crafted pages to ensure they are first and correctly routed
const generatedRoutes = [
  { name: 'WanderlustExplorerProHome', path: '/', label: 'Home', group: 'main', folder: 'wanderlust_explorer_pro_home' },
  { name: 'PrivacyPolicyLayout', path: '/privacy', label: 'Privacy Policy', group: 'legal', folder: 'privacy_policy_layout' },
  { name: 'TermsOfServiceLayout', path: '/terms', label: 'Terms of Service', group: 'legal', folder: 'terms_of_service_layout' },
  { name: 'TourDetailView', path: '/tours/detail', label: 'Tour Detail (Static)', group: 'tours', folder: 'tour_detail_view' },
  // Dynamic Route (Hidden from Hub navigation by default, or we can handle it specifically)
  { name: 'TourDetailView', path: '/tours/:id', label: 'Tour Detail (Dynamic)', group: 'tours', folder: 'tour_detail_view', hidden: true }
];
const skipped = [];

folders.forEach(folder => {
  if (SKIP_FOLDERS.has(folder)) { console.log(`⏭  Skipping hand-crafted: ${folder}`); return; }
  const htmlPath = path.join(SRC_DIR, folder, 'code.html');
  if (!fs.existsSync(htmlPath)) { skipped.push(folder); return; }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const jsx  = htmlToJsx(html, folder);
  const name = toPascalCase(folder);
  const routeInfo = ROUTE_MAP[folder] || {
    path: `/${folder.replace(/_/g,'-')}`,
    label: folder.replace(/_/g,' '),
    group: 'misc',
  };

  const component = `
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auto-generated from: ${folder}/code.html
 * Group: ${routeInfo.group} | Path: ${routeInfo.path}
 */
const ${name} = () => {
  return (
    <div data-page="${folder}">
      ${jsx.trim()}
    </div>
  );
};

export default ${name};
`;

  fs.writeFileSync(path.join(PAGE_DIR, `${name}.jsx`), component);
  console.log(`✓ ${name}  →  ${routeInfo.path}`);

  generatedRoutes.push({ name, ...routeInfo, folder });
});

/* =====================================================================
   NAVIGATION HUB
   ===================================================================== */
const groups = {};
generatedRoutes.forEach(r => {
  if (r.hidden) return; // Skip dynamic/hidden routes in the hub
  if (!groups[r.group]) groups[r.group] = [];
  groups[r.group].push(r);
});

const groupColors = {
  main:    '#006D77', tours:  '#2a9d8f', booking: '#e9c46a',
  account: '#f4a261', rewards:'#e76f51', gifts:   '#457b9d',
  ai:      '#7b2d8b', content:'#264653', emails:  '#6c757d',
  admin:   '#c1121f', legal:  '#8d99ae', misc:    '#adb5bd',
};

const hubJsx = `
import React from 'react';
import { Link } from 'react-router-dom';

const GROUP_META = ${JSON.stringify(Object.keys(groups).map(g => ({
  id: g,
  label: g.charAt(0).toUpperCase() + g.slice(1),
  color: groupColors[g] || '#006D77',
  routes: groups[g],
})), null, 2)};

const NavigationHub = () => (
  <div style={{ fontFamily:'Montserrat,sans-serif', minWidth:1200, padding:'40px 60px', background:'#EDF6F9', minHeight:'100vh' }}>
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:8 }}>
        <span className="material-symbols-outlined" style={{ fontSize:40, color:'#006D77' }}>explore</span>
        <h1 style={{ fontSize:36, fontWeight:900, color:'#006D77', margin:0 }}>Wanderlust Explorer Pro</h1>
      </div>
      <p style={{ color:'#7F8C8D', marginBottom:48, fontWeight:500 }}>
        56 pages · Full site map · Click any card to navigate
      </p>

      {GROUP_META.map(group => (
        <div key={group.id} style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color: group.color, borderLeft:\`4px solid \${group.color}\`, paddingLeft:12, marginBottom:16, textTransform:'capitalize' }}>
            {group.label} <span style={{ fontWeight:400, color:'#aaa', fontSize:14 }}>({group.routes.length} pages)</span>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {group.routes.map(r => (
              <Link key={r.path} to={r.path} style={{ textDecoration:'none' }}>
                <div style={{ background:'#fff', border:\`1.5px solid \${group.color}30\`, borderRadius:12, padding:'14px 16px',
                              display:'flex', alignItems:'center', justifyContent:'space-between',
                              boxShadow:'0 2px 8px rgba(0,0,0,0.05)', transition:'all .15s', cursor:'pointer' }}
                     onMouseEnter={e => e.currentTarget.style.boxShadow=\`0 4px 18px \${group.color}40\`}
                     onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'}>
                  <span style={{ fontWeight:700, fontSize:13, color:'#2C3E50', lineHeight:1.3 }}>{r.label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize:18, color:group.color }}>arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NavigationHub;
`;

fs.writeFileSync(path.join(PAGE_DIR, 'NavigationHub.jsx'), hubJsx);
console.log('\n✓ NavigationHub generated');

/* =====================================================================
   ROUTES.JSX
   ===================================================================== */
const uniqueImports = Array.from(new Set(generatedRoutes.map(r => `import ${r.name} from './pages/${r.name}';`))).join('\n');

const routesSrc = `
import React from 'react';
import NavigationHub from './pages/NavigationHub';
${uniqueImports}

/**
 * All 56 Wanderlust pages, organised by group.
 * Generated by build-site.cjs
 */
export const routes = [
  { path: '/nav',  element: <NavigationHub /> },
  ${generatedRoutes.map(r => `{ path: '${r.path}', element: <${r.name} /> }`).join(',\n  ')}
];
`;

fs.writeFileSync(path.join(__dirname, 'src', 'routes.jsx'), routesSrc);

console.log(`\n🚀  Done!  ${generatedRoutes.length} pages converted.`);
console.log(`   Skipped: ${skipped.length} folders without code.html`);
console.log(`   Open http://localhost:5000/nav  to see the full site map.`);
