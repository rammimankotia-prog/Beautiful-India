import React from 'react';
import { Link } from 'react-router-dom';

const AdminArticleManagementDashboard = () => {
  const [guides, setGuides] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/guides')
      .then(res => res.json())
      .then(data => {
        setGuides(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      fetch(`http://localhost:3001/api/guides/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) fetchGuides();
          else alert("Failed to delete article");
        });
    }
  };

  return (
    <div data-page="admin_article_management_dashboard">
      <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden">
        {/* Top Nav Bar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col hidden md:flex">
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin">
                <span className="material-symbols-outlined text-[20px] text-slate-500">space_dashboard</span>
                <span className="text-[15px] font-medium">Overview</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin">
                <span className="material-symbols-outlined text-[20px] text-slate-500">tour</span>
                <span className="text-[15px] font-medium">Manage Tours</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] bg-[#eefaf9] text-[#0a6c75] transition-colors" to="/admin/guides">
                <span className="material-symbols-outlined text-[20px] text-[#0a6c75]">map</span>
                <span className="text-[15px] font-medium">Guides</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/guides/new">
                <span className="material-symbols-outlined text-[20px] text-slate-500">edit_document</span>
                <span className="text-[15px] font-medium">Write a Blog</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/categorization">
                <span className="material-symbols-outlined text-[20px] text-slate-500">category</span>
                <span className="text-[15px] font-medium">Categorization</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/bookings">
                <span className="material-symbols-outlined text-[20px] text-slate-500">group</span>
                <span className="text-[15px] font-medium">Bookings</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/referral/dashboard">
                <span className="material-symbols-outlined text-[20px] text-slate-500">payments</span>
                <span className="text-[15px] font-medium">Financials</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/queries">
                <span className="material-symbols-outlined text-[20px] text-slate-500">contact_support</span>
                <span className="text-[15px] font-medium">Queries</span>
              </Link>
              <Link className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] text-slate-600 hover:bg-slate-50 transition-colors" to="/admin/leads">
                <span className="material-symbols-outlined text-[20px] text-slate-500">smart_toy</span>
                <span className="text-[15px] font-medium">Chatbot Leads</span>
              </Link>
            </nav>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-background-dark p-6 lg:p-10">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h1 className="text-[#0a6c75] text-3xl font-extrabold leading-tight tracking-tight">Manage Guides</h1>
                  <p className="text-slate-500 mt-1 font-medium">View, edit, and create new guides, travel tips, and hacks.</p>
                </div>
                <Link to="/admin/guides/new" className="flex items-center justify-center rounded-[10px] px-6 py-2.5 bg-[#0a6c75] text-white text-[13px] font-bold hover:bg-[#07565e] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-2">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Create New Guide</span>
                </Link>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-[14px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        <th className="px-6 py-4 text-[11px] font-extrabold text-[#0a6c75] uppercase tracking-widest">Article Title</th>
                        <th className="px-6 py-4 text-[11px] font-extrabold text-[#0a6c75] uppercase tracking-widest">Category</th>
                        <th className="px-6 py-4 text-[11px] font-extrabold text-[#0a6c75] uppercase tracking-widest">Read Time</th>
                        <th className="px-6 py-4 text-[11px] font-extrabold text-[#0a6c75] uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[11px] font-extrabold text-[#0a6c75] uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr><td colSpan="5" className="text-center py-10 font-bold text-slate-500">Loading articles...</td></tr>
                      ) : guides.map(guide => (
                        <tr key={guide.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-slate-200 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url('${guide.image}')` }}></div>
                              <span className="text-[14px] font-extrabold text-slate-900 group-hover:text-[#0a6c75] transition-colors">{guide.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-[13px] font-bold text-slate-600">{guide.category}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-[13px] font-bold text-slate-600">{guide.readTime}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1 bg-[#eefaf9] text-[#0f766e] text-[11px] font-extrabold rounded-full">{guide.type}</span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2.5">
                              <Link to={`/admin/guides/edit/${guide.id}`} className="px-4 py-1.5 rounded-[6px] border border-slate-200 text-slate-600 bg-white text-[12px] font-extrabold hover:bg-slate-50 flex items-center justify-center transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">Edit</Link>
                              <button onClick={() => handleDelete(guide.id)} className="px-4 py-1.5 rounded-[6px] bg-red-50 text-red-600 text-[12px] font-extrabold hover:bg-red-100 flex items-center justify-center transition-colors shadow-sm">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminArticleManagementDashboard;
