import React, { useEffect, useRef } from 'react';

const BikeTourMap = ({ slug, title }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        console.log('BikeTourMap useEffect triggered for slug:', slug);
        if (!mapRef.current) return;
        
        // Clean up previous instance if it exists (for HMR or slug changes)
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }

        // Initialize Leaflet Map
        const L = window.L;
        if (!L) {
            console.error('Leaflet (window.L) is not available');
            return;
        }

        console.log('Initializing map on', mapRef.current);
        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: false,
            trackResize: true
        }).setView([34.1, 77.8], 8);

        mapInstance.current = map;

        // Force a size recalculation after the component has fully mounted
        setTimeout(() => {
            if (mapInstance.current) {
                mapInstance.current.invalidateSize();
                console.log('Map size invalidated');
            }
        }, 100);

        // Light, neutral map tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            maxZoom: 14
        }).addTo(map);

        // Extract map data from tour prop if available
        let locations = null;
        let routeCoordinates = null;
        let mapCenter = [20.5937, 78.9629]; // Default India center
        let mapZoom = 5;

        // 1. Check for specific map data in tour object
        if (tour?.mapData) {
            locations = tour.mapData.locations;
            routeCoordinates = tour.mapData.route;
            mapCenter = tour.mapData.center || mapCenter;
            mapZoom = tour.mapData.zoom || mapZoom;
        } 
        // 2. Legacy fallback for the Leh tour
        else if (slug === 'leh-and-leh-grand-circuit') {
            locations = {
                leh: { coords: [34.1526, 77.5771], label: 'F', classes: 'marker-green', name: 'Leh', desc: 'Start / Finish' },
                khardungLa: { coords: [34.2787, 77.6047], label: 'K', classes: 'marker-orange', name: 'Khardung La', desc: 'High Pass (5,359m)' },
                nubra: { coords: [34.5459, 77.5606], label: 'N', classes: 'marker-red', name: 'Nubra Valley', desc: 'Overnight Stop' },
                turtuk: { coords: [34.8485, 76.8267], label: 'T', classes: 'marker-red', name: 'Turtuk', desc: 'Overnight Stop' },
                changLa: { coords: [34.0450, 77.9304], label: 'C', classes: 'marker-orange', name: 'Chang La', desc: 'High Pass (5,360m)' },
                pangong: { coords: [33.722, 78.435], label: 'P', classes: 'marker-blue', name: 'Pangong Tso', desc: 'Scenic Highlight' },
                tsoMoriri: { coords: [32.946, 78.261], label: 'M', classes: 'marker-blue', name: 'Tso Moriri', desc: 'Scenic Highlight' }
            };
            routeCoordinates = [
                locations.leh.coords,
                locations.khardungLa.coords,
                locations.nubra.coords,
                locations.turtuk.coords,
                locations.nubra.coords,
                locations.changLa.coords,
                locations.pangong.coords,
                locations.tsoMoriri.coords,
                locations.leh.coords
            ];
            mapCenter = [34.1, 77.8];
            mapZoom = 8;
        }
        // 3. Simple coordinate fallback (if tour has lat/lon)
        else if (tour?.coordinates) {
            locations = {
                destination: { 
                    coords: tour.coordinates, 
                    label: 'D', 
                    classes: 'marker-primary', 
                    name: tour.title, 
                    desc: tour.destination 
                }
            };
            mapCenter = tour.coordinates;
            mapZoom = 10;
        }

        // Set initial view
        map.setView(mapCenter, mapZoom);

        if (locations) {
            // Add polyline if route exists
            if (routeCoordinates && routeCoordinates.length > 0) {
                L.polyline(routeCoordinates, {
                    color: '#b75b5b',
                    weight: 3,
                    dashArray: '10, 10',
                    opacity: 0.8,
                    lineJoin: 'round'
                }).addTo(map);
            }

            // Add Markers
            Object.values(locations).forEach(loc => {
                const icon = L.divIcon({
                    className: 'custom-icon',
                    html: `<div class="custom-marker ${loc.classes || 'marker-primary'}">${loc.label || '•'}</div>`,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                    popupAnchor: [0, -40]
                });

                L.marker(loc.coords, { icon })
                    .addTo(map)
                    .bindPopup(`
                        <h3 class="popup-title">${loc.name}</h3>
                        <p class="popup-desc">${loc.desc || ''}</p>
                    `);
            });

            // Fit bounds if multiple points exist
            if (routeCoordinates && routeCoordinates.length > 1) {
                map.fitBounds(L.polyline(routeCoordinates).getBounds(), { padding: [50, 50] });
            } else if (Object.keys(locations).length > 1) {
                const bounds = L.latLngBounds(Object.values(locations).map(l => l.coords));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [slug]);

    return (
        <div className="w-full space-y-4">
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-marker {
                    position: relative;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 3px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    font-size: 16px;
                    color: white;
                    box-shadow: 0 8px 16px -4px rgba(0,0,0,0.3), 0 4px 8px -2px rgba(0,0,0,0.2);
                    z-index: 100;
                }
                .custom-marker::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 8px solid white;
                }
                .marker-green { background-color: #1a6442; }
                .marker-red { background-color: #b73229; }
                .marker-blue { background-color: #3b5998; }
                .marker-orange { background-color: #d18a30; }

                .leaflet-popup-content-wrapper { border-radius: 12px; padding: 4px; }
                .leaflet-popup-content { margin: 12px 16px; text-align: center; }
                .popup-title { font-weight: 900; font-size: 16px; color: #0f172a; margin: 0 0 4px 0; font-family: 'Playfair Display', serif; }
                .popup-desc { font-size: 12px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
            `}} />
            
            <div 
                ref={mapRef} 
                className="w-full h-[500px] md:h-[600px] rounded-2xl shadow-inner bg-slate-100 dark:bg-slate-800"
                style={{ zIndex: 1 }}
            />
            
            <div className="flex flex-wrap gap-6 items-center px-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#1a6442]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Start/Finish</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#b73229]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overnight</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3b5998]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Highlight</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#d18a30]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">High Pass</span>
                </div>
            </div>
        </div>
    );
};

export default BikeTourMap;
