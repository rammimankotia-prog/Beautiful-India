import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SmartPackingListGenerator = () => {
    const [destination, setDestination] = useState("Santorini, Greece");
    const [duration, setDuration] = useState("10 Days");

    const [activities, setActivities] = useState([
        { id: 1, name: "Hiking", active: true, icon: "hiking" },
        { id: 2, name: "Swimming", active: true, icon: "waves" },
        { id: 3, name: "Formal Dinners", active: false, icon: "diamond" },
        { id: 4, name: "Photography", active: false, icon: "photo_camera" },
    ]);

    const [categories, setCategories] = useState([
        {
            id: "clothing",
            title: "Clothing",
            icon: "checkroom",
            items: [
                { id: 11, text: "Light breathable shirts (5x)", completed: true },
                { id: 12, text: "Comfortable walking shoes", completed: true },
                { id: 13, text: "Hiking boots & wool socks", completed: false },
                { id: 14, text: "Swimwear & beach cover-up", completed: false },
                { id: 15, text: "Lightweight jacket for evenings", completed: false },
            ]
        },
        {
            id: "electronics",
            title: "Electronics",
            icon: "devices",
            items: [
                { id: 21, text: "Universal travel adapter", completed: true },
                { id: 22, text: "Portable power bank", completed: false },
                { id: 23, text: "Camera & extra memory cards", completed: false },
                { id: 24, text: "Noise-canceling headphones", completed: false },
            ]
        },
        {
            id: "documents",
            title: "Documents",
            icon: "import_contacts",
            items: [
                { id: 31, text: "Passport & Visas", completed: true },
                { id: 32, text: "Travel Insurance details", completed: true },
                { id: 33, text: "Flight & Hotel confirmations", completed: true },
            ]
        }
    ]);

    const toggleActivity = (id) => {
        setActivities(activities.map(act => act.id === id ? { ...act, active: !act.active } : act));
    };

    const addActivity = () => {
        const name = window.prompt("Enter new activity:");
        if (name) {
            setActivities([...activities, { id: Date.now(), name, active: true, icon: "star" }]);
        }
    };

    const toggleItem = (categoryId, itemId) => {
        setCategories(categories.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    items: cat.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
                };
            }
            return cat;
        }));
    };

    const addCustomItem = () => {
        const text = window.prompt("Enter new custom item:");
        if (text) {
            setCategories(categories.map(cat => {
                if (cat.id === "clothing") {
                    return { ...cat, items: [...cat.items, { id: Date.now(), text, completed: false }] };
                }
                return cat;
            }));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        alert("Share link copied to clipboard!");
    };

    const handleSave = () => {
        alert("Packing list saved to My Trips!");
    };

    return (
        <div data-page="smart_packing_list_generator">
            <div className="layout- flex h-full grow flex-col">
                <main className="flex-1 w-full px-6 py-8">
                    {/* Hero Title Section */}
                    <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
                        <div className="flex-1 min-w-[300px]">
                            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold leading-tight tracking-tight font-montserrat mb-2">Smart Packing List Generator</h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">Tailor your gear based on your destination, weather, and activities.</p>
                        </div>
                        <button onClick={handlePrint} className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-accent text-slate-900 font-bold font-montserrat shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                            <span>Download as PDF</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content: Configuration & Checklist */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Trip Config Section */}
                            <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-primary/5">
                                <h2 className="text-xl font-bold font-montserrat mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">travel_explore</span>
                                    Trip Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Destination</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                                            <input 
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary/10 bg-background-light focus:ring-2 focus:ring-primary outline-none" 
                                                placeholder="e.g. Bali, Indonesia" 
                                                type="text" 
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trip Duration</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                                            <input 
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary/10 bg-background-light focus:ring-2 focus:ring-primary outline-none" 
                                                placeholder="e.g. 7 Days" 
                                                type="text" 
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Planned Activities</label>
                                    <div className="flex flex-wrap gap-3">
                                        {activities.map(activity => (
                                            <button 
                                                key={activity.id} 
                                                onClick={() => toggleActivity(activity.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activity.active ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{activity.icon}</span> {activity.name}
                                            </button>
                                        ))}
                                        <button onClick={addActivity} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-slate-500 border border-dashed border-slate-300 text-sm font-medium cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">add</span> Add Activity
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Packing Checklist Section */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold font-montserrat">Your Packing List</h2>
                                    <button onClick={addCustomItem} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
                                        <span className="material-symbols-outlined text-lg">playlist_add</span> Add Custom Item
                                    </button>
                                </div>

                                {categories.map(category => {
                                    const completedCount = category.items.filter(item => item.completed).length;
                                    const totalCount = category.items.length;

                                    return (
                                        <div key={category.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                                            <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex items-center gap-3 border-b border-primary/5">
                                                <span className="material-symbols-outlined text-primary">{category.icon}</span>
                                                <h3 className="font-bold font-montserrat">{category.title}</h3>
                                                <span className="ml-auto text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                                                    {completedCount}/{totalCount} Items
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-1">
                                                {category.items.map(item => (
                                                    <label key={item.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors select-none">
                                                        <input 
                                                            checked={item.completed} 
                                                            onChange={() => toggleItem(category.id, item.id)}
                                                            className="w-5 h-5 rounded border-primary text-primary outline-none focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors"
                                                            type="checkbox"
                                                        />
                                                        <span className={`text-slate-700 dark:text-slate-300 transition-all ${item.completed ? 'line-through opacity-60' : ''}`}>
                                                            {item.text}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>
                        </div>

                        {/* Sidebar: Weather Forecast & Map */}
                        <div className="space-y-8">
                            {/* Weather Widget */}
                            <aside className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-primary/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-6xl">sunny</span>
                                </div>
                                <h3 className="text-lg font-bold font-montserrat mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">partly_cloudy_day</span>
                                    Weather Forecast
                                </h3>
                                <div className="text-center mb-8">
                                    <p className="text-slate-500 font-medium text-sm">{destination}</p>
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        <span className="text-5xl font-extrabold font-montserrat text-slate-800 dark:text-slate-100">26°C</span>
                                        <span className="material-symbols-outlined text-amber-400 text-5xl">wb_sunny</span>
                                    </div>
                                    <p className="text-primary font-bold mt-2">Clear Skies</p>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 flex-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Mon</span>
                                        <span className="material-symbols-outlined text-amber-400 text-xl my-1">sunny</span>
                                        <span className="text-xs font-bold">27°</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 flex-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tue</span>
                                        <span className="material-symbols-outlined text-amber-400 text-xl my-1">sunny</span>
                                        <span className="text-xs font-bold">28°</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 flex-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Wed</span>
                                        <span className="material-symbols-outlined text-slate-400 text-xl my-1">cloud</span>
                                        <span className="text-xs font-bold">24°</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 flex-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Thu</span>
                                        <span className="material-symbols-outlined text-blue-400 text-xl my-1">rainy</span>
                                        <span className="text-xs font-bold">22°</span>
                                    </div>
                                </div>
                            </aside>

                            {/* Destination Glance */}
                            <aside className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXZGYXay8MUGpsFt6yUIOPHvVwORTsXi0lkVom2Nn-EVhB3NjdPBIFmhXvqOU_v0F4HPYUCbLplYcpPG6kb_XMpRL1lyMgno7zCgj3IgP76HtLy7Bzo1rn8hggaX9gc0GhhTBZIoY2NdWJOzoh4tm8qr7Dyi4PhZGEYAev7iH7GzbwXuJCudptjjkzbyULWUOr3w7OxerV6_WxZAbAEN_rRVCH4Fl61iA0T-951LUC2lbK4peGPLWc75a846LCYty1QwtW2GMFZVO0')" }}></div>
                                <div className="p-6">
                                    <h3 className="font-bold font-montserrat text-lg mb-2">Traveler Pro-Tips</h3>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary text-lg shrink-0">info</span>
                                            <span>Pack reef-safe sunscreen to protect the marine ecosystem during your swim.</span>
                                        </li>
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary text-lg shrink-0">info</span>
                                            <span>Cobblestone paths are uneven; leave the high heels and opt for stylish flats.</span>
                                        </li>
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary text-lg shrink-0">info</span>
                                            <span>Tap water is not drinkable in Santorini. Bring a reusable bottle with a filter.</span>
                                        </li>
                                    </ul>
                                </div>
                            </aside>

                            {/* Quick Actions */}
                            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Trip Management</p>
                                <div className="space-y-3">
                                    <button onClick={handleShare} className="w-full flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 text-sm font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer">
                                        <span>Share list with partners</span>
                                        <span className="material-symbols-outlined text-sm">share</span>
                                    </button>
                                    <button onClick={handleSave} className="w-full flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 text-sm font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer">
                                        <span>Save to My Trips</span>
                                        <span className="material-symbols-outlined text-sm">bookmark</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SmartPackingListGenerator;
