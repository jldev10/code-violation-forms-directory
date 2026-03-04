import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';

// A large list of US cities with their states for autocomplete
const US_CITIES = [
  "Abilene, TX","Akron, OH","Albany, GA","Albany, NY","Albuquerque, NM","Alexandria, LA","Alexandria, VA",
  "Allentown, PA","Amarillo, TX","Anaheim, CA","Anchorage, AK","Ann Arbor, MI","Antioch, CA","Arlington, TX",
  "Arlington, VA","Arvada, CO","Athens, GA","Atlanta, GA","Augusta, GA","Aurora, CO","Aurora, IL",
  "Austin, TX","Bakersfield, CA","Baltimore, MD","Baton Rouge, LA","Beaumont, TX","Bellevue, WA",
  "Berkeley, CA","Birmingham, AL","Boise, ID","Boston, MA","Bridgeport, CT","Broken Arrow, OK",
  "Buffalo, NY","Cape Coral, FL","Carrollton, TX","Cary, NC","Cedar Rapids, IA","Chandler, AZ",
  "Charlotte, NC","Chattanooga, TN","Chesapeake, VA","Chicago, IL","Chula Vista, CA","Cincinnati, OH",
  "Clarksville, TN","Clearwater, FL","Cleveland, OH","Colorado Springs, CO","Columbia, MO","Columbia, SC",
  "Columbus, GA","Columbus, OH","Concord, CA","Concord, NC","Coral Springs, FL","Corona, CA",
  "Corpus Christi, TX","Dallas, TX","Dayton, OH","Denton, TX","Denver, CO","Des Moines, IA",
  "Detroit, MI","Durham, NC","El Monte, CA","El Paso, TX","Elk Grove, CA","Escondido, CA",
  "Eugene, OR","Evansville, IN","Fayetteville, AR","Fayetteville, NC","Fontana, CA","Fort Collins, CO",
  "Fort Lauderdale, FL","Fort Wayne, IN","Fort Worth, TX","Fremont, CA","Fresno, CA","Frisco, TX",
  "Fullerton, CA","Gainesville, FL","Garden Grove, CA","Garland, TX","Gilbert, AZ","Glendale, AZ",
  "Glendale, CA","Grand Prairie, TX","Grand Rapids, MI","Greensboro, NC","Gresham, OR",
  "Hampton, VA","Hartford, CT","Henderson, NV","Hialeah, FL","High Point, NC","Hollywood, FL",
  "Honolulu, HI","Houston, TX","Huntington Beach, CA","Huntsville, AL","Independence, MO",
  "Indianapolis, IN","Irvine, CA","Irving, TX","Jackson, MS","Jacksonville, FL","Jersey City, NJ",
  "Kansas City, KS","Kansas City, MO","Killeen, TX","Knoxville, TN","Lakewood, CO","Lancaster, CA",
  "Lansing, MI","Laredo, TX","Las Vegas, NV","Lexington, KY","Lincoln, NE","Little Rock, AR",
  "Long Beach, CA","Los Angeles, CA","Louisville, KY","Lubbock, TX","Madison, WI","McKinney, TX",
  "Memphis, TN","Mesa, AZ","Mesquite, TX","Miami, FL","Miami Gardens, FL","Milwaukee, WI",
  "Minneapolis, MN","Miramar, FL","Mobile, AL","Modesto, CA","Montgomery, AL","Moreno Valley, CA",
  "Nashville, TN","New Haven, CT","New Orleans, LA","New York, NY","Newark, NJ","Newport News, VA",
  "Norfolk, VA","North Las Vegas, NV","Oakland, CA","Oklahoma City, OK","Omaha, NE","Ontario, CA",
  "Orange, CA","Orlando, FL","Overland Park, KS","Oxnard, CA","Palm Bay, FL","Palmdale, CA",
  "Pasadena, CA","Pasadena, TX","Paterson, NJ","Pembroke Pines, FL","Peoria, AZ","Peoria, IL",
  "Philadelphia, PA","Phoenix, AZ","Pittsburgh, PA","Plano, TX","Pomona, CA","Port St. Lucie, FL",
  "Portland, OR","Providence, RI","Provo, UT","Pueblo, CO","Raleigh, NC","Rancho Cucamonga, CA",
  "Reno, NV","Richmond, VA","Riverside, CA","Rochester, MN","Rochester, NY","Rockford, IL",
  "Sacramento, CA","Salem, OR","Salt Lake City, UT","San Antonio, TX","San Bernardino, CA",
  "San Diego, CA","San Francisco, CA","San Jose, CA","Santa Ana, CA","Santa Clarita, CA",
  "Santa Rosa, CA","Savannah, GA","Scottsdale, AZ","Seattle, WA","Shreveport, LA",
  "Sioux Falls, SD","South Bend, IN","Spokane, WA","Springfield, IL","Springfield, MA",
  "Springfield, MO","St. Louis, MO","St. Paul, MN","St. Petersburg, FL","Stockton, CA",
  "Sunnyvale, CA","Syracuse, NY","Tacoma, WA","Tallahassee, FL","Tampa, FL","Tempe, AZ",
  "Toledo, OH","Tucson, AZ","Tulsa, OK","Vancouver, WA","Virginia Beach, VA","Washington, DC",
  "Wichita, KS","Winston-Salem, NC","Worcester, MA","Yonkers, NY"
];

export default function MarketAutocomplete({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    const q = value.toLowerCase();
    return US_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || 'e.g. Fort Worth, TX'}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map(city => (
            <button
              key={city}
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onChange(city); setOpen(false); }}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}