export const CATALOG = [
  {
    category: 'AC & Appliance', icon: '❄️', color: '#E0F2FE',
    services: [
      { name: 'AC Service', variants: ['Split AC', 'Window AC'], priceRange: [599, 899],
        addons: [{ name: 'Deep filter cleaning', price: 150 }, { name: 'Coil sanitisation', price: 200 }, { name: 'PCB inspection', price: 300 }] },
      { name: 'AC Repair', variants: ['Compressor fault', 'PCB fault', 'Fan motor fault'], priceRange: [399, 4500],
        addons: [{ name: 'Compressor replacement', price: 3500 }, { name: 'PCB replacement', price: 2500 }, { name: 'Fan motor replacement', price: 1200 }, { name: 'Capacitor replacement', price: 400 }] },
      { name: 'AC Gas Refill', variants: ['R22 gas', 'R32 gas', 'R410A gas'], priceRange: [2200, 3500],
        addons: [{ name: 'Leak detection & sealing', price: 500 }, { name: 'Extra 100g gas', price: 400 }] },
    ],
  },
  {
    category: 'Plumbing', icon: '🔧', color: '#FEF3C7',
    services: [
      { name: 'Tap / Leak Fix', variants: ['Tap repair', 'Minor pipe joint', 'Under-sink seal'], priceRange: [199, 750],
        addons: [{ name: 'Tap replacement (basic)', price: 350 }, { name: 'Tap replacement (premium)', price: 800 }, { name: 'Sealant & fittings', price: 150 }] },
      { name: 'Pipe Repair', variants: ['Under-sink pipe', 'Wall pipe', 'Overhead pipe'], priceRange: [499, 1800],
        addons: [{ name: 'PVC pipe per ft', price: 80 }, { name: 'Wall opening & closing', price: 600 }, { name: 'Emergency surcharge', price: 250 }] },
      { name: 'Drain Unclog', variants: ['Kitchen drain', 'Bathroom drain', 'Toilet blockage'], priceRange: [299, 1100],
        addons: [{ name: 'Chemical jetting', price: 400 }, { name: 'CCTV pipe inspection', price: 800 }] },
    ],
  },
  {
    category: 'Cleaning', icon: '🧹', color: '#F0FDF4',
    services: [
      { name: 'Bathroom Deep Clean', variants: ['Single bathroom', '2 bathrooms', '3+ bathrooms'], priceRange: [449, 950],
        addons: [{ name: 'Grout scrubbing', price: 150 }, { name: 'Exhaust fan cleaning', price: 100 }] },
      { name: 'Kitchen Deep Clean', variants: ['Basic', 'With chimney', 'Full modular kitchen'], priceRange: [699, 1499],
        addons: [{ name: 'Chimney cleaning', price: 400 }, { name: 'Cabinet interior wipe', price: 200 }] },
      { name: 'Full Home Deep Clean', variants: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'], priceRange: [1999, 5499],
        addons: [{ name: 'Balcony cleaning', price: 300 }, { name: 'Window panel cleaning', price: 150 }] },
      { name: 'Sofa / Carpet Cleaning', variants: ['2-seater sofa', '3-seater sofa', 'L-shape sofa', 'Carpet per sq ft'], priceRange: [499, 2499],
        addons: [{ name: 'Stain treatment', price: 300 }, { name: 'Anti-bacterial spray', price: 200 }] },
    ],
  },
  {
    category: 'Beauty', icon: '💅', color: '#FDF4FF',
    services: [
      { name: 'Salon at Home', variants: ["Women's haircut", "Men's haircut", 'Blow-dry', 'Hair spa'], priceRange: [349, 999],
        addons: [{ name: 'Hair mask treatment', price: 250 }, { name: 'Scalp massage', price: 150 }] },
      { name: 'Facial & Glow Treatment', variants: ['Basic cleanup', 'Gold facial', 'Hydrating facial', 'De-tan pack'], priceRange: [499, 1499],
        addons: [{ name: 'Eyebrow threading', price: 70 }, { name: 'Upper lip', price: 50 }, { name: 'Neck massage', price: 150 }] },
      { name: 'Pre-Event Package', variants: ['Bridal glow', 'Party makeup', 'Mehendi application'], priceRange: [1999, 6999],
        addons: [{ name: 'False lashes', price: 300 }, { name: 'HD foundation upgrade', price: 400 }, { name: 'Hair styling', price: 599 }] },
    ],
  },
  {
    category: 'Electrician', icon: '⚡', color: '#FFFBEB',
    services: [
      { name: 'Fault Finding & Repair', variants: ['Short circuit', 'Tripping MCB', 'Power point fault'], priceRange: [249, 1200],
        addons: [{ name: 'Wiring replacement per metre', price: 60 }, { name: 'MCB replacement', price: 350 }, { name: 'Emergency surcharge', price: 200 }] },
      { name: 'Fixture Installation', variants: ['Ceiling fan', 'Light fitting', 'Switch / socket', 'Geyser'], priceRange: [199, 599],
        addons: [{ name: 'Conduit & casing', price: 150 }, { name: 'Extra wiring 5m', price: 200 }] },
    ],
  },
  {
    category: 'Pest Control', icon: '🪲', color: '#FFF7ED',
    services: [
      { name: 'General Pest Control', variants: ['1 BHK', '2 BHK', '3 BHK'], priceRange: [699, 1499],
        addons: [{ name: 'Cockroach gel bait', price: 300 }, { name: 'Bed bug treatment', price: 1200 }] },
      { name: 'Termite Control', variants: ['Pre-construction', 'Post-construction per room'], priceRange: [1499, 4999],
        addons: [{ name: 'Soil treatment', price: 2000 }, { name: 'Warranty certificate', price: 500 }] },
    ],
  },
];

export const CHIPS = [
  { label: 'Water pooling under sink', text: 'Water is pooling under my kitchen sink — there is a puddle on the floor every morning' },
  { label: 'AC running but not cooling', text: 'My AC runs all day but the room will not get cold at all, it is blowing warm air' },
  { label: 'Dull skin, wedding Saturday', text: 'My skin looks dull and tired. I have a wedding this Saturday and need to look glowing and fresh' },
  { label: 'Bathroom looks really bad', text: 'My bathroom looks really bad, not sure what it needs — could be cleaning or something else' },
];
