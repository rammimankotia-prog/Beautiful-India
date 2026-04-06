import{r as i,j as e,L as o}from"./index-BvSXM30j.js";const A=()=>{const[k,z]=i.useState([]),[T,S]=i.useState([]),[s,_]=i.useState("all"),[l,P]=i.useState(""),[h,f]=i.useState(!1),[d,u]=i.useState(1),[c,w]=i.useState(1),p=12,m=5;i.useEffect(()=>{fetch(`/data/guides.json?t=${Date.now()}`,{headers:{"Cache-Control":"no-cache",Pragma:"no-cache",Expires:"0"}}).then(a=>a.json()).then(a=>{const t=[...a].sort((r,n)=>{const Y=r.date?new Date(r.date):new Date(0);return(n.date?new Date(n.date):new Date(0))-Y});z(t),f(!0)}).catch(a=>{console.error("Error fetching guides:",a),f(!0)}),fetch(`/data/tours.json?t=${Date.now()}`).then(a=>a.json()).then(a=>{const t=a.filter(r=>r.status==="active");if(t.length>0){const r=[...t].sort(()=>.5-Math.random());S(r.slice(0,2))}}).catch(a=>console.error("Error fetching tours:",a))},[]);const C=[{id:"all",label:"All Guides",icon:"public"},{id:"destination",label:"Destinations",icon:"location_on"},{id:"tip",label:"Tips & Hacks",icon:"tips_and_updates"}],x=k.filter(a=>{const t=a.status!=="draft",r=s==="all"||a.type===s,n=a.title.toLowerCase().includes(l.toLowerCase())||a.description.toLowerCase().includes(l.toLowerCase());return t&&r&&n}),g=x.filter(a=>a.type==="destination"),b=x.filter(a=>a.type==="tip"),y=x.filter(a=>a.type==="blog"||!a.type),j=Math.ceil(g.length/p)||1,v=Math.ceil(b.length/m)||1,D=g.slice((d-1)*p,d*p),E=b.slice((c-1)*m,c*m),$=a=>{u(a),setTimeout(()=>{window.scrollTo({top:document.querySelector(".destination-section")?.offsetTop-100,behavior:"smooth"})},100)},G=a=>{w(a),setTimeout(()=>{window.scrollTo({top:document.querySelector(".tips-section")?.offsetTop-100,behavior:"smooth"})},100)},N=({current:a,total:t,onChange:r})=>e.jsxs("div",{className:"flex justify-center items-center gap-6 mt-8 mb-4",children:[e.jsx("button",{onClick:()=>r(Math.max(1,a-1)),disabled:a===1,className:"pagination-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"chevron_left"})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest",children:"Page"}),e.jsx("span",{className:"text-lg font-black text-violet-600 leading-none",children:a}),e.jsxs("span",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest",children:["of ",t]})]}),e.jsx("button",{onClick:()=>r(Math.min(t,a+1)),disabled:a===t,className:"pagination-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"chevron_right"})})]}),R=[{label:"Adventure",icon:"🏔️"},{label:"Honeymoon",icon:"💑"},{label:"Budget Travel",icon:"💰"},{label:"Gastronomy",icon:"🍜"},{label:"Europe",icon:"🏰"},{label:"Photography",icon:"📷"},{label:"Backpacking",icon:"🎒"},{label:"Beaches",icon:"🏖️"}];return e.jsxs("div",{"data-page":"travel_guides_category_landing",style:{fontFamily:"'Inter', 'Segoe UI', sans-serif"},children:[e.jsx("style",{children:`
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
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px !important;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
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
          gap: 5px;
          padding: 7px 14px;
          background: #f1f5f9;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid transparent;
          color: #475569;
        }
        .dark .tag { background: rgba(255,255,255,0.06); color: #94a3b8; }
        .tag:hover {
          background: rgba(124,58,237,0.08);
          color: #7c3aed;
          border-color: rgba(124,58,237,0.25);
          transform: translateY(-2px);
        }

        /* Newsletter */
        .newsletter-widget {
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          border-radius: 20px;
          padding: 28px 24px;
          color: #fff;
          position: relative;
          overflow: hidden;
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
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          font-size: 22px !important;
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
          padding: 13px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
          letter-spacing: 0.02em;
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
      `}),e.jsxs("main",{style:{padding:"1.5rem 1rem 3rem",maxWidth:"1400px",margin:"0 auto"},children:[e.jsxs("section",{className:"guides-hero",children:[e.jsx("img",{className:"guides-hero-bg",src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",alt:"Scenic mountain road",onError:a=>{a.target.src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80"}}),e.jsx("div",{className:"guides-hero-overlay"}),e.jsx("div",{className:"guides-hero-particles",children:[...Array(12)].map((a,t)=>e.jsx("div",{className:"particle",style:{width:`${6+t%4*4}px`,height:`${6+t%4*4}px`,left:`${t*8.3%100}%`,animationDuration:`${5+t%5*2}s`,animationDelay:`${t*.6%4}s`}},t))}),e.jsxs("div",{className:"guides-hero-content",children:[e.jsxs("div",{className:"hero-badge",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"explore"}),"The Beautiful India"]}),e.jsxs("h1",{className:"hero-title",children:["Ultimate",e.jsx("br",{}),e.jsx("span",{children:"Travel Guides"})]}),e.jsx("p",{className:"hero-subtitle",children:"Expert insights, local secrets, and professional tips for your next unforgettable global adventure."}),e.jsxs("div",{className:"hero-search-bar",children:[e.jsx("span",{className:"material-symbols-outlined hero-search-icon",children:"search"}),e.jsx("input",{className:"hero-search-input",placeholder:"Search destinations, tips, activities...",type:"text",value:l,onChange:a=>P(a.target.value)}),e.jsx("button",{className:"hero-search-btn",children:"Search"})]})]})]}),e.jsx("div",{className:"filter-pills",children:C.map(a=>e.jsxs("button",{className:`filter-pill ${s===a.id?"active":""}`,onClick:()=>{_(a.id),u(1),w(1)},children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"16px"},children:a.icon}),a.label]},a.id))}),e.jsxs("div",{style:{display:"flex",gap:"2.5rem",alignItems:"flex-start",flexWrap:"wrap"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[(s==="all"||s==="blog")&&y.length>0&&e.jsxs("section",{className:"mb-14",children:[e.jsx("div",{className:"section-header",children:e.jsxs("h2",{className:"section-title",children:[e.jsx("span",{className:"section-title-bar",style:{background:"linear-gradient(to bottom, #ec4899, #8b5cf6)"}}),"Traveler's Journal"]})}),e.jsx("div",{className:"destination-grid",children:y.map((a,t)=>e.jsxs(o,{to:`/guides/${a.id}`,className:"dest-card",style:{animationDelay:`${t*.1}s`},children:[e.jsxs("div",{className:"dest-card-img-wrap",children:[e.jsx("img",{className:"dest-card-img",src:a.image,alt:a.title}),e.jsx("div",{className:"dest-card-overlay"}),e.jsx("span",{className:"dest-card-badge",style:{background:"#ec4899",color:"#fff"},children:"Editorial"})]}),e.jsxs("div",{className:"dest-card-body",children:[e.jsx("h3",{className:"dest-card-title",children:a.title}),e.jsxs("div",{className:"dest-card-meta",children:[e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"history_edu"})," Editorial"]}),e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"calendar_today"})," ",a.date]})]}),e.jsx("p",{className:"dest-card-desc",children:a.description||a.content?.substring(0,100)+"..."}),e.jsxs("div",{className:"dest-card-cta",children:["Read Journal ",e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"16px"},children:"arrow_forward"})]})]})]},a.id))})]}),(s==="all"||s==="destination")&&e.jsxs("section",{className:"destination-section",children:[e.jsx("div",{className:"section-header",children:e.jsxs("h2",{className:"section-title",children:[e.jsx("span",{className:"section-title-bar"}),"Popular Destinations"]})}),e.jsxs("div",{className:"destination-grid",children:[D.map((a,t)=>e.jsxs(o,{to:`/guides/${a.id}`,className:"dest-card",style:{animationDelay:`${t*.1}s`},children:[e.jsxs("div",{className:"dest-card-img-wrap",children:[e.jsx("img",{className:"dest-card-img",src:a.image,alt:a.title}),e.jsx("div",{className:"dest-card-overlay"}),e.jsx("span",{className:"dest-card-badge",children:a.category})]}),e.jsxs("div",{className:"dest-card-body",children:[e.jsx("h3",{className:"dest-card-title",children:a.title}),e.jsxs("div",{className:"dest-card-meta",children:[e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"schedule"})," ",a.readTime]}),e.jsxs("span",{children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"calendar_today"})," ",a.date]})]}),e.jsx("p",{className:"dest-card-desc",children:a.description}),e.jsxs("div",{className:"dest-card-cta",children:["Read Guide ",e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"16px"},children:"arrow_forward"})]})]})]},a.id)),g.length===0&&h&&e.jsxs("div",{className:"empty-state",style:{gridColumn:"1/-1"},children:[e.jsx("span",{className:"material-symbols-outlined empty-state-icon",children:"location_off"}),e.jsx("p",{children:"No destination guides match your search."})]})]}),j>1&&e.jsx(N,{current:d,total:j,onChange:$})]}),(s==="all"||s==="tip")&&e.jsxs("section",{className:"tips-section",style:{marginTop:"3rem"},children:[e.jsx("div",{className:"section-header",children:e.jsxs("h2",{className:"section-title",children:[e.jsx("span",{className:"section-title-bar"}),"Travel Tips & Hacks"]})}),e.jsxs("div",{className:"tips-list",children:[E.map((a,t)=>e.jsxs(o,{to:`/guides/${a.id}`,className:"tip-card",style:{animationDelay:`${t*.12}s`},children:[e.jsx("div",{className:"tip-card-img-wrap",children:e.jsx("img",{className:"tip-card-img",src:a.image,alt:a.title})}),e.jsxs("div",{className:"tip-card-body",children:[e.jsx("h3",{className:"tip-card-title",children:a.title}),e.jsx("p",{className:"tip-card-desc",children:a.description}),e.jsxs("div",{className:"tip-card-footer",children:[e.jsxs("span",{className:"tip-read-time",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"timer"})," ",a.readTime," • ",a.date]}),e.jsxs("span",{className:"tip-read-more",children:["Read More ",e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"15px"},children:"arrow_forward"})]})]})]})]},a.id)),b.length===0&&h&&e.jsxs("div",{className:"empty-state",children:[e.jsx("span",{className:"material-symbols-outlined empty-state-icon",children:"lightbulb_off"}),e.jsx("p",{children:"No tips match your current filter."})]})]}),v>1&&e.jsx(N,{current:c,total:v,onChange:G})]})]}),e.jsxs("aside",{style:{width:"100%",maxWidth:"320px",flexShrink:0},children:[e.jsxs("div",{className:"sidebar-widget",children:[e.jsxs("div",{className:"sidebar-widget-header",children:[e.jsx("span",{className:"material-symbols-outlined sidebar-widget-icon",children:"auto_awesome"}),"Curated Tours"]}),T.map((a,t)=>e.jsxs(o,{to:`/tour/${a.slug}`,className:"featured-tour-card",children:[e.jsxs("div",{className:"featured-tour-img-wrap",children:[e.jsx("img",{src:a.image,className:"featured-tour-img",alt:a.title}),e.jsxs("span",{className:"tour-label",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"12px"},children:t===0?"hotel_class":"trending_up"}),t===0?"Top Rated":"Trending"]})]}),e.jsxs("div",{className:"featured-tour-body",children:[e.jsx("h4",{className:"featured-tour-title",children:a.title}),e.jsxs("div",{className:"featured-tour-meta-row",children:[e.jsxs("span",{className:"featured-tour-info",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"schedule"})," ",a.duration]}),e.jsxs("span",{className:"featured-tour-price",children:["₹",parseInt(a.price).toLocaleString()]})]})]})]},a.slug)),e.jsx(o,{to:"/tours",className:"view-tours-btn",children:"View All Tours"})]}),e.jsxs("div",{className:"sidebar-widget",style:{background:"#fff",border:"1px solid rgba(0,0,0,0.06)"},children:[e.jsxs("div",{className:"sidebar-widget-header",children:[e.jsx("span",{className:"material-symbols-outlined sidebar-widget-icon",children:"local_fire_department"}),"Trending Tags"]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:R.map(a=>e.jsxs("span",{className:"tag",children:[a.icon," ",a.label]},a.label))})]}),e.jsxs("div",{className:"newsletter-widget",children:[e.jsx("span",{className:"material-symbols-outlined newsletter-icon",children:"mail"}),e.jsx("h3",{className:"newsletter-title",children:"Get Inspired Weekly"}),e.jsx("p",{className:"newsletter-sub",children:"Travel hacks and secret destinations straight to your inbox."}),e.jsx("input",{className:"newsletter-input",placeholder:"Enter your email",type:"email"}),e.jsx("button",{className:"newsletter-btn",children:"✈ Join the Club"})]})]})]})]})]})};export{A as default};
