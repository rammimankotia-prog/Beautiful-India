import{r as s,j as e,L as n}from"./index-Cw24h56x.js";import{S as A}from"./SEO-Ab2dFfVi.js";const q=()=>{const[S,T]=s.useState([]),[_,D]=s.useState([]),[i,C]=s.useState("all"),[l,P]=s.useState(""),[b,f]=s.useState(!1),[d,u]=s.useState(1),[c,w]=s.useState(1),p=12,x=6;s.useEffect(()=>{fetch(`/data/guides.json?t=${Date.now()}`,{headers:{"Cache-Control":"no-cache",Pragma:"no-cache",Expires:"0"}}).then(t=>t.json()).then(t=>{const a=[...t].sort((r,o)=>{const $=r.lastModified||r.date||"",W=o.lastModified||o.date||"",N=new Date($).getTime()||0,z=new Date(W).getTime()||0;if(N!==z)return z-N;const Y=String(r.id||"");return String(o.id||"").localeCompare(Y,void 0,{numeric:!0,sensitivity:"base"})});T(a),f(!0)}).catch(t=>{console.error("Error fetching guides:",t),f(!0)}),fetch(`/data/tours.json?t=${Date.now()}`).then(t=>t.json()).then(t=>{const a=t.filter(r=>r.status==="active");if(a.length>0){const r=[...a].sort(()=>.5-Math.random());D(r.slice(0,2))}}).catch(t=>console.error("Error fetching tours:",t))},[]);const E=[{id:"all",label:"All Guides",icon:"public"},{id:"destination",label:"Destinations",icon:"location_on"},{id:"tip",label:"Tips & Hacks",icon:"tips_and_updates"}],m=S.filter(t=>{const a=t.status!=="draft",r=i==="all"||t.type===i,o=t.title.toLowerCase().includes(l.toLowerCase())||t.description.toLowerCase().includes(l.toLowerCase());return a&&r&&o}),g=m.filter(t=>t.type==="destination"),h=m.filter(t=>t.type==="tip"),y=m.filter(t=>t.type==="blog"||!t.type),j=Math.ceil(g.length/p)||1,v=Math.ceil(h.length/x)||1,I=g.slice((d-1)*p,d*p),R=h.slice((c-1)*x,c*x),G=t=>{u(t),setTimeout(()=>{window.scrollTo({top:document.querySelector(".destination-section")?.offsetTop-100,behavior:"smooth"})},100)},M=t=>{w(t),setTimeout(()=>{window.scrollTo({top:document.querySelector(".tips-section")?.offsetTop-100,behavior:"smooth"})},100)},k=({current:t,total:a,onChange:r})=>e.jsxs("div",{className:"flex justify-center items-center gap-6 mt-8 mb-4",children:[e.jsx("button",{onClick:()=>r(Math.max(1,t-1)),disabled:t===1,className:"pagination-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"chevron_left"})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest",children:"Page"}),e.jsx("span",{className:"text-lg font-black text-violet-600 leading-none",children:t}),e.jsxs("span",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest",children:["of ",a]})]}),e.jsx("button",{onClick:()=>r(Math.min(a,t+1)),disabled:t===a,className:"pagination-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"chevron_right"})})]}),B=[{label:"Adventure",icon:"🏔️"},{label:"Honeymoon",icon:"💑"},{label:"Budget Travel",icon:"💰"},{label:"Gastronomy",icon:"🍜"},{label:"Europe",icon:"🏰"},{label:"Photography",icon:"📷"},{label:"Backpacking",icon:"🎒"},{label:"Beaches",icon:"🏖️"}];return e.jsxs("div",{"data-page":"travel_guides_category_landing",style:{fontFamily:"'Inter', 'Segoe UI', sans-serif"},children:[e.jsx(A,{title:"Travel Guides - Expert Tips and Destination Insights",description:"Explore our curated travel guides for expert tips, destination insights, and travel inspiration across India and beyond.",keywords:"Travel Guides, India Travel Tips, Destination Insights, Bharat Darshan Guides"}),e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .guides-hero {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 3rem;
          min-height: 420px;
          display: flex;
          align-items: center;
        }
        .guides-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .guides-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,10,40,0.85) 0%, rgba(75,0,130,0.55) 50%, rgba(0,100,200,0.4) 100%);
          z-index: 1;
        }
        .guides-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          animation: float-particle linear infinite;
        }
        @keyframes float-particle {
          0% { transform: translateY(100%) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-120%) scale(1.5); opacity: 0; }
        }
        .guides-hero-content {
          position: relative;
          z-index: 10;
          padding: 3.5rem 3rem;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .hero-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .hero-title span {
          background: linear-gradient(90deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 1.05rem;
          margin-bottom: 2rem;
          max-width: 520px;
          line-height: 1.7;
          font-weight: 400;
        }
        .hero-search-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.97);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.2);
          padding: 6px 6px 6px 16px;
          max-width: 560px;
          gap: 10px;
        }
        .hero-search-icon {
          color: #7c3aed;
          font-size: 22px !important;
        }
        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: #1e293b;
          font-family: inherit;
        }
        .hero-search-input::placeholder {
          color: #94a3b8;
        }
        .hero-search-btn {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          border: none;
          padding: 12px 26px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .hero-search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(124,58,237,0.4);
        }
        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
        }
        .hero-stat-num {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
        }

        /* Filter Pills */
        .filter-pills {
          display: flex;
          gap: 10px;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.25s ease;
          font-family: inherit;
          background: #f1f5f9;
          color: #64748b;
        }
        .dark .filter-pill {
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
        }
        .filter-pill:hover {
          background: rgba(124,58,237,0.08);
          color: #7c3aed;
          border-color: rgba(124,58,237,0.25);
        }
        .filter-pill.active {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(124,58,237,0.35);
        }

        .pagination-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        .dark .pagination-btn {
          background: rgba(15,23,42,0.6);
          border-color: rgba(255,255,255,0.08);
          color: #94a3b8;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: #7c3aed;
          color: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(124,58,237,0.15);
        }
        .pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: #f8fafc;
        }
        .dark .pagination-btn:disabled {
          background: rgba(0,0,0,0.2);
        }

        /* Section Header */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
        }
        .dark .section-title { color: #f1f5f9; }
        .section-title-bar {
          width: 4px;
          height: 28px;
          border-radius: 4px;
          background: linear-gradient(to bottom, #7c3aed, #3b82f6);
        }
        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #7c3aed;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(124,58,237,0.08);
          transition: all 0.2s;
        }
        .view-all-link:hover {
          background: rgba(124,58,237,0.15);
          gap: 8px;
        }

        /* Destination Cards */
        .destination-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 1.5rem;
        }
        .dest-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          text-decoration: none;
          color: inherit;
          display: block;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s forwards;
        }
        .dark .dest-card {
          background: rgba(15,23,42,0.7);
          border-color: rgba(255,255,255,0.07);
        }
        .dest-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 50px rgba(124,58,237,0.18), 0 8px 20px rgba(0,0,0,0.12);
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .dest-card-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .dest-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .dest-card:hover .dest-card-img { transform: scale(1.08); }
        .dest-card-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          color: #7c3aed;
          border-radius: 100px;
          padding: 5px 13px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        }
        .dest-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
        }
        .dest-card-body {
          padding: 20px 22px 22px;
        }
        .dest-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #0f172a;
          line-height: 1.35;
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark .dest-card-title { color: #f1f5f9; }
        .dest-card:hover .dest-card-title { color: #7c3aed; }
        .dest-card-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 12px;
        }
        .dest-card-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .dest-card-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark .dest-card-desc { color: #94a3b8; }
        .dest-card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08));
          color: #7c3aed;
          font-weight: 700;
          font-size: 0.88rem;
          transition: all 0.25s;
          border: 1.5px solid rgba(124,58,237,0.15);
        }
        .dest-card:hover .dest-card-cta {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 18px rgba(124,58,237,0.3);
        }

        /* Tip Cards */
        .tips-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 1.5rem; }
        .tip-card {
          display: flex;
          gap: 20px;
          align-items: center;
          background: #fff;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          opacity: 0;
          transform: translateX(-15px);
          animation: fadeRight 0.5s forwards;
        }
        .dark .tip-card {
          background: rgba(15,23,42,0.7);
          border-color: rgba(255,255,255,0.07);
        }
        @keyframes fadeRight {
          to { opacity: 1; transform: translateX(0); }
        }
        .tip-card:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 30px rgba(124,58,237,0.14);
          border-color: rgba(124,58,237,0.2);
        }
        .tip-card-img-wrap {
          width: 130px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .tip-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .tip-card:hover .tip-card-img { transform: scale(1.1); }
        .tip-card-body { flex: 1; }
        .tip-card-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: #0f172a;
          transition: color 0.2s;
          line-height: 1.35;
        }
        .dark .tip-card-title { color: #f1f5f9; }
        .tip-card:hover .tip-card-title { color: #7c3aed; }
        .tip-card-desc {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.55;
        }
        .dark .tip-card-desc { color: #94a3b8; }
        .tip-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tip-read-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: #94a3b8;
        }
        .tip-read-more {
          font-size: 0.82rem;
          font-weight: 700;
          color: #7c3aed;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: gap 0.2s;
        }
        .tip-card:hover .tip-read-more { gap: 7px; }

        /* Sidebar Redesign - Premium Glassmorphism */
        .sidebar-widget {
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 30px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-widget-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          font-size: 1.15rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .dark .sidebar-widget-header { color: #f1f5f9; }
        .sidebar-widget-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 24px !important;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }

        /* Featured Tour Card - Premium Modern Face */
        .featured-tour-card {
          position: relative;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 20px;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        }
        .dark .featured-tour-card {
          background: rgba(30, 41, 59, 0.6);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .featured-tour-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(124, 58, 237, 0.18);
          border-color: rgba(124, 58, 237, 0.3);
        }
        .featured-tour-img-wrap {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }
        .featured-tour-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .featured-tour-card:hover .featured-tour-img {
          transform: scale(1.15);
        }
        .tour-label {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.25);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .featured-tour-body {
          padding: 18px 20px 20px;
        }
        .featured-tour-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
          transition: color 0.2s;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark .featured-tour-title { color: #f1f5f9; }
        .featured-tour-card:hover .featured-tour-title { color: #7c3aed; }
        
        .featured-tour-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
        }
        .featured-tour-info {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
        }
        .dark .featured-tour-info { color: #94a3b8; }
        
        .featured-tour-price-box {
          text-align: right;
        }
        .featured-tour-price-label {
          display: block;
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 2px;
        }
        .featured-tour-price {
          font-size: 1.25rem;
          font-weight: 900;
          color: #7c3aed;
          letter-spacing: -0.02em;
        }

        /* Tags */
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #f1f5f9;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          color: #334155;
        }
        .dark .tag { background: rgba(255,255,255,0.06); color: #cbd5e1; }
        .tag:hover {
          background: #e2e8f0;
          color: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* Newsletter Modernized */
        .newsletter-widget {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          border-radius: 24px;
          padding: 32px 28px;
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(30, 27, 75, 0.3);
        }
        .newsletter-glow-1 {
          position: absolute;
          top: -40px; right: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%);
          border-radius: 50%;
        }
        .newsletter-glow-2 {
          position: absolute;
          bottom: -30px; left: -30px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%);
          border-radius: 50%;
        }
        .newsletter-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          font-size: 24px !important;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .newsletter-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 6px; }
        .newsletter-sub { font-size: 0.83rem; color: rgba(255,255,255,0.55); margin-bottom: 18px; line-height: 1.6; }
        .newsletter-input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-size: 0.88rem;
          font-family: inherit;
          margin-bottom: 10px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
        .newsletter-input:focus { border-color: rgba(124,58,237,0.6); }
        .newsletter-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(124,58,237,0.45);
        }

        /* View More Tours btn */
        .view-tours-btn {
          width: 100%;
          margin-top: 20px;
          padding: 13px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .view-tours-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(124,58,237,0.4);
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #94a3b8;
        }
        .empty-state-icon { font-size: 48px !important; margin-bottom: 10px; opacity: 0.4; }

        @media (max-width: 768px) {
          .guides-hero-content { padding: 2.5rem 1.5rem; }
          .hero-title { font-size: 2rem; }
          .hero-stats { gap: 1.5rem; }
          .tip-card { flex-direction: column; }
          .tip-card-img-wrap { width: 100%; height: 160px; }
          .destination-grid { grid-template-columns: 1fr; }
        }
      `}),e.jsxs("main",{style:{padding:"1.5rem 1rem 3rem",maxWidth:"1400px",margin:"0 auto"},children:[e.jsxs("section",{className:"guides-hero",children:[e.jsx("img",{className:"guides-hero-bg",src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",alt:"Scenic mountain road",onError:t=>{t.target.src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80"}}),e.jsx("div",{className:"guides-hero-overlay"}),e.jsx("div",{className:"guides-hero-particles",children:[...Array(12)].map((t,a)=>e.jsx("div",{className:"particle",style:{width:`${6+a%4*4}px`,height:`${6+a%4*4}px`,left:`${a*8.3%100}%`,animationDuration:`${5+a%5*2}s`,animationDelay:`${a*.6%4}s`}},a))}),e.jsxs("div",{className:"guides-hero-content",children:[e.jsxs("div",{className:"hero-badge",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"explore"}),"The Beautiful India"]}),e.jsxs("h1",{className:"hero-title",children:["Ultimate",e.jsx("br",{}),e.jsx("span",{children:"Travel Guides"})]}),e.jsx("p",{className:"hero-subtitle",children:"Expert insights, local secrets, and professional tips for your next unforgettable global adventure."}),e.jsxs("div",{className:"hero-search-bar",children:[e.jsx("span",{className:"material-symbols-outlined hero-search-icon",children:"search"}),e.jsx("input",{className:"hero-search-input",placeholder:"Search destinations, tips, activities...",type:"text",value:l,onChange:t=>P(t.target.value)}),e.jsx("button",{className:"hero-search-btn",children:"Search"})]})]})]}),e.jsx("div",{className:"filter-pills",children:E.map(t=>e.jsxs("button",{className:`filter-pill ${i===t.id?"active":""}`,onClick:()=>{C(t.id),u(1),w(1)},children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"16px"},children:t.icon}),t.label]},t.id))}),e.jsxs("div",{style:{display:"flex",gap:"2.5rem",alignItems:"flex-start",flexWrap:"wrap"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[(i==="all"||i==="blog")&&y.length>0&&e.jsxs("section",{className:"mb-14",children:[e.jsx("div",{className:"section-header",children:e.jsxs("h2",{className:"section-title",children:[e.jsx("span",{className:"section-title-bar",style:{background:"linear-gradient(to bottom, #ec4899, #8b5cf6)"}}),"Traveler's Journal"]})}),e.jsx("div",{className:"destination-grid",children:y.map((t,a)=>e.jsxs(n,{to:`/guides/${t.id}`,className:"dest-card",style:{animationDelay:`${a*.1}s`},children:[e.jsxs("div",{className:"dest-card-img-wrap",children:[e.jsx("img",{className:"dest-card-img",src:t.image,alt:t.title}),e.jsx("div",{className:"dest-card-overlay"}),e.jsx("span",{className:"dest-card-badge",style:{background:"#ec4899",color:"#fff"},children:"Editorial"})]}),e.jsxs("div",{className:"dest-card-body",children:[e.jsx("h3",{className:"dest-card-title",children:t.title}),e.jsxs("div",{className:"dest-card-meta",children:[e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"history_edu"})," Editorial"]}),e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"calendar_today"})," ",t.date]})]}),e.jsx("p",{className:"dest-card-desc",children:t.description||t.content?.substring(0,100)+"..."}),e.jsxs("div",{className:"dest-card-cta",children:["Read Journal ",e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"16px"},children:"arrow_forward"})]})]})]},t.id))})]}),(i==="all"||i==="destination")&&e.jsxs("section",{className:"destination-section",children:[e.jsx("div",{className:"section-header",children:e.jsxs("h2",{className:"section-title",children:[e.jsx("span",{className:"section-title-bar"}),"Popular Destinations"]})}),e.jsxs("div",{className:"destination-grid",children:[I.map((t,a)=>e.jsxs(n,{to:`/guides/${t.id}`,className:"dest-card",style:{animationDelay:`${a*.1}s`},children:[e.jsxs("div",{className:"dest-card-img-wrap",children:[e.jsx("img",{className:"dest-card-img",src:t.image,alt:t.title}),e.jsx("div",{className:"dest-card-overlay"}),e.jsx("span",{className:"dest-card-badge",children:t.category})]}),e.jsxs("div",{className:"dest-card-body",children:[e.jsx("h3",{className:"dest-card-title",children:t.title}),e.jsxs("div",{className:"dest-card-meta",children:[e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"schedule"})," ",t.readTime]}),e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"calendar_today"})," ",t.date]})]}),e.jsx("p",{className:"dest-card-desc",children:t.description}),e.jsxs("div",{className:"dest-card-cta",children:["Read Guide ",e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"16px"},children:"arrow_forward"})]})]})]},t.id)),g.length===0&&b&&e.jsxs("div",{className:"empty-state",style:{gridColumn:"1/-1"},children:[e.jsx("span",{className:"material-symbols-outlined empty-state-icon",children:"location_off"}),e.jsx("p",{children:"No destination guides match your search."})]})]}),j>1&&e.jsx(k,{current:d,total:j,onChange:G})]}),(i==="all"||i==="tip")&&e.jsxs("section",{className:"tips-section",style:{marginTop:"3rem"},children:[e.jsx("div",{className:"section-header",children:e.jsxs("h2",{className:"section-title",children:[e.jsx("span",{className:"section-title-bar"}),"Travel Tips & Hacks"]})}),e.jsxs("div",{className:"tips-list",children:[R.map((t,a)=>e.jsxs(n,{to:`/guides/${t.id}`,className:"tip-card",style:{animationDelay:`${a*.12}s`},children:[e.jsx("div",{className:"tip-card-img-wrap",children:e.jsx("img",{className:"tip-card-img",src:t.image,alt:t.title})}),e.jsxs("div",{className:"tip-card-body",children:[e.jsx("h3",{className:"tip-card-title",children:t.title}),e.jsx("p",{className:"tip-card-desc",children:t.description}),e.jsxs("div",{className:"tip-card-footer",children:[e.jsxs("span",{className:"tip-read-time",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"timer"})," ",t.readTime," • ",t.date]}),e.jsxs("span",{className:"tip-read-more",children:["Read More ",e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"15px"},children:"arrow_forward"})]})]})]})]},t.id)),h.length===0&&b&&e.jsxs("div",{className:"empty-state",children:[e.jsx("span",{className:"material-symbols-outlined empty-state-icon",children:"lightbulb_off"}),e.jsx("p",{children:"No tips match your current filter."})]})]}),v>1&&e.jsx(k,{current:c,total:v,onChange:M})]})]}),e.jsxs("aside",{style:{width:"100%",maxWidth:"320px",flexShrink:0},children:[e.jsxs("div",{className:"sidebar-widget",children:[e.jsxs("div",{className:"sidebar-widget-header",children:[e.jsx("span",{className:"material-symbols-outlined sidebar-widget-icon",children:"auto_awesome"}),"Curated Tours"]}),_.map((t,a)=>e.jsxs(n,{to:`/tour/${t.slug}`,className:"featured-tour-card",children:[e.jsxs("div",{className:"featured-tour-img-wrap",children:[e.jsx("img",{src:t.image,className:"featured-tour-img",alt:t.title}),e.jsxs("span",{className:"tour-label",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"12px"},children:a===0?"hotel_class":"trending_up"}),a===0?"Top Rated":"Trending"]})]}),e.jsxs("div",{className:"featured-tour-body",children:[e.jsx("h4",{className:"featured-tour-title",children:t.title}),e.jsxs("div",{className:"featured-tour-meta-row",children:[e.jsxs("span",{className:"featured-tour-info",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"schedule"})," ",t.duration]}),e.jsxs("span",{className:"featured-tour-price",children:["₹",parseInt(t.price).toLocaleString()]})]})]})]},t.slug)),e.jsx(n,{to:"/tours",className:"view-tours-btn",children:"View All Tours"})]}),e.jsxs("div",{className:"sidebar-widget",style:{background:"#fff",border:"1px solid rgba(0,0,0,0.04)",borderRadius:"32px",boxShadow:"0 10px 30px rgba(0,0,0,0.03)"},children:[e.jsxs("div",{className:"sidebar-widget-header",style:{fontSize:"1.25rem"},children:[e.jsx("span",{className:"material-symbols-outlined sidebar-widget-icon",children:"local_fire_department"}),"Trending Tags"]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:B.map(t=>e.jsxs("span",{className:"tag",children:[t.icon," ",t.label]},t.label))})]}),e.jsxs("div",{className:"newsletter-widget",style:{marginBottom:"30px"},children:[e.jsx("span",{className:"material-symbols-outlined newsletter-icon",children:"mail"}),e.jsx("h3",{className:"newsletter-title",children:"Get Inspired Weekly"}),e.jsx("p",{className:"newsletter-sub",children:"Travel hacks and secret destinations straight to your inbox."}),e.jsxs("form",{onSubmit:t=>{t.preventDefault(),alert("✨ Welcome to the Club! Check your inbox soon.")},children:[e.jsx("input",{className:"newsletter-input",placeholder:"Enter your email",type:"email",required:!0}),e.jsxs("button",{type:"submit",className:"newsletter-btn",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"20px"},children:"flight_takeoff"}),"Join the Club"]})]})]}),e.jsxs("div",{className:"sidebar-widget",style:{background:"#fff",border:"1px solid rgba(0,0,0,0.04)",borderRadius:"32px",boxShadow:"0 10px 30px rgba(0,0,0,0.03)",padding:"24px"},children:[e.jsxs("div",{className:"sidebar-widget-header",style:{fontSize:"1.25rem"},children:[e.jsx("span",{className:"material-symbols-outlined sidebar-widget-icon",children:"public"}),"Follow Our Journey"]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"12px"},children:[e.jsxs("a",{href:"https://www.facebook.com/honeymoon.package/",target:"_blank",rel:"noopener noreferrer",style:{display:"flex",alignItems:"center",gap:"8px",padding:"10px",borderRadius:"12px",background:"#3b5998",color:"#fff",textDecoration:"none",fontSize:"12px",fontWeight:"bold"},children:[e.jsx("svg",{className:"w-5 h-5 fill-white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"})}),"Honeymoon"]}),e.jsxs("a",{href:"https://www.facebook.com/TouristDestinationsofIndia",target:"_blank",rel:"noopener noreferrer",style:{display:"flex",alignItems:"center",gap:"8px",padding:"10px",borderRadius:"12px",background:"#3b5998",color:"#fff",textDecoration:"none",fontSize:"12px",fontWeight:"bold"},children:[e.jsx("svg",{className:"w-5 h-5 fill-white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"})}),"Destinations"]}),e.jsxs("a",{href:"https://www.instagram.com/holidaydestinations9/",target:"_blank",rel:"noopener noreferrer",style:{display:"flex",alignItems:"center",gap:"8px",padding:"10px",borderRadius:"12px",background:"linear-gradient(to tr, #f9ce34, #ee2a7b, #6228d7)",color:"#fff",textDecoration:"none",fontSize:"12px",fontWeight:"bold"},children:[e.jsx("svg",{className:"w-5 h-5 fill-white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"})}),"Instagram"]}),e.jsxs("a",{href:"https://www.reddit.com/r/holidaydestination/",target:"_blank",rel:"noopener noreferrer",style:{display:"flex",alignItems:"center",gap:"8px",padding:"10px",borderRadius:"12px",background:"#ff4500",color:"#fff",textDecoration:"none",fontSize:"12px",fontWeight:"bold"},children:[e.jsx("svg",{className:"w-5 h-5 fill-white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M24 11.5c0-1.654-1.346-3-3-3-.674 0-1.296.226-1.802.603-2.181-1.503-5.111-2.457-8.384-2.58l1.735-5.432 4.764 1.041c.044.872.766 1.568 1.649 1.568 1.01 0 1.832-.821 1.832-1.832s-.822-1.832-1.832-1.832c-.803 0-1.48.518-1.72 1.233l-5.234-1.144c-.23-.051-.458.082-.531.31l-1.954 6.114c-3.353.078-6.386 1.026-8.636 2.56-.505-.386-1.14-.622-1.828-.622-1.654 0-3 1.346-3 3 0 1.135.635 2.119 1.572 2.628-.024.122-.037.245-.037.372 0 3.309 4.029 6 9 6s9-2.691 9-6c0-.124-.013-.245-.036-.364.95-.503 1.598-1.5 1.598-2.636zm-18.067 2.132c.738 0 1.334.597 1.334 1.334s-.596 1.334-1.334 1.334-1.334-.597-1.334-1.334.596-1.334 1.334-1.334zm10.741 4.562c-1.144 1.144-3.084 1.654-4.674 1.654-1.591 0-3.531-.51-4.674-1.654-.195-.195-.195-.512 0-.707.196-.195.513-.195.708 0 .86.86 2.522 1.278 3.966 1.278 1.444 0 3.106-.418 3.966-1.278.195-.195.512-.195.707 0 .196.195.196.512 0 .707zm-1.008-3.228c-.738 0-1.334-.597-1.334-1.334s.596-1.334 1.334-1.334 1.334.597 1.334 1.334-.596 1.334-1.334 1.334z"})}),"Reddit"]}),e.jsxs("a",{href:"https://www.plurk.com/HolidayDestinations",target:"_blank",rel:"noopener noreferrer",style:{display:"flex",alignItems:"center",gap:"8px",padding:"10px",borderRadius:"12px",background:"#cf4732",color:"#fff",textDecoration:"none",fontSize:"12px",fontWeight:"bold",gridColumn:"span 2"},children:[e.jsx("svg",{className:"w-5 h-5 fill-white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.75 16.5h-9.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-9.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-9.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75z"})}),"Holiday Destinations on Plurk"]})]})]})]})]})]})]})};export{q as default};
