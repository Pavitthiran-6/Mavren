/**
 * MAVREN Inventory Seeding Script (Fixed for actual DB Schema)
 */

const SUPABASE_URL = 'https://btaugojhgqkfzlysfhon.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXVnb2poZ3FrZnpseXNmaG9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQyNTY2NywiZXhwIjoyMDkyMDAxNjY3fQ.LofPUEnRBYREV-WVcJNp2oGOP8twUWaXOn7eqknpTmE';

const productsData = [
  {
    "editorialTitle": "Textured Knit Polo – Sage Green",
    "designationName": "Knit Polo Shirt",
    "valuation": 899,
    "referencePricing": 1499,
    "category": "Shirts",
    "affiliateLink": "https://example.com/polo-sage",
    "editorialAbstract": "A soft, textured knit polo with a refined collar and a relaxed drape for modern leisure.",
    "curatorVerdict": "The weave quality exceeds the price point significantly. It offers a premium tactile feel that is rare for budget knits, though it requires gentle washing to maintain its shape.",
    "designHighs": "Breathable cotton-blend yarn; Sophisticated earthy tone; Minimalist rib-free hem",
    "designLows": "Susceptible to slight pilling after heavy use; Tailored fit might be tight for some",
    "imageUrl": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800",
    "pinToHero": true
  },
  {
    "editorialTitle": "Relaxed Canvas Trousers – Bone",
    "designationName": "Canvas Pants",
    "valuation": 1299,
    "referencePricing": 2499,
    "category": "Pants",
    "affiliateLink": "https://example.com/canvas-bone",
    "editorialAbstract": "Straight-leg utility pants crafted from mid-weight canvas for structural silhouette and durability.",
    "curatorVerdict": "Exceptional construction for the cost. The 'Bone' shade is perfectly neutral—not too yellow. The fabric is stiff initially but softens into a great personal fit within 2-3 wears.",
    "designHighs": "High-density cotton canvas; Triple-stitched seams; Clean fatigue-style pockets",
    "designLows": "Attracts dust easily due to light shade; No elastane for stretch",
    "imageUrl": "https://images.unsplash.com/photo-1624371414361-e6e8ea3024d0?auto=format&fit=crop&q=80&w=800",
    "pinToHero": true
  },
  {
    "editorialTitle": "Minimalist Suede Derby – Charcoal",
    "designationName": "Suede Shoes",
    "valuation": 1899,
    "referencePricing": 3499,
    "category": "Shoes",
    "affiliateLink": "https://example.com/charcoal-derby",
    "editorialAbstract": "Versatile charcoal derby shoes with a matte suede finish and tonal crepe-style sole.",
    "curatorVerdict": "A surprisingly comfortable formal-lean shoe. The cushioning is superior to most fast-fashion derbies. Ideal for long workdays where you need to balance style and physical comfort.",
    "designHighs": "Supple faux-suede upper; Lightweight EVA outsole; Seamless toe cap design",
    "designLows": "Not water-resistant; Suede requires a dedicated cleaning brush",
    "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Boxy Heavyweight Tee – Vintage Black",
    "designationName": "Oversized T-shirt",
    "valuation": 599,
    "referencePricing": 999,
    "category": "T-shirts",
    "affiliateLink": "https://example.com/boxy-tee",
    "editorialAbstract": "A substantial 280 GSM cotton tee with a drop-shoulder cut and a structured aesthetic.",
    "curatorVerdict": "The weight of the fabric gives it a high-end streetwear drape. It doesn't cling to the body, ensuring a clean silhouette. The 'Vintage Black' has a sophisticated washed look.",
    "designHighs": "Premium heavyweight feel; Tight crew neckline; Durable double-needle stitching",
    "designLows": "Slow drying time due to thickness; Can feel warm in peak summer",
    "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    "pinToHero": true
  },
  {
    "editorialTitle": "Brushed Metal Dress Watch – Silver",
    "designationName": "Analogue Watch",
    "valuation": 1499,
    "referencePricing": 2999,
    "category": "Watches",
    "affiliateLink": "https://example.com/silver-watch",
    "editorialAbstract": "A timeless 38mm dress watch featuring a brushed steel case and a minimalist sunray dial.",
    "curatorVerdict": "It nails the 'quiet luxury' look. The movement is basic but reliable, and the slim profile fits perfectly under a shirt cuff. The clasp feels more secure than expected at this price point.",
    "designHighs": "Scratch-resistant mineral glass; Deployment buckle; Versatile 38mm size",
    "designLows": "Non-luminous hands; Water resistance limited to incidental splashes",
    "imageUrl": "https://images.unsplash.com/photo-1524336714791-3113054d83b0?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Corduroy Worker Shirt – Umber",
    "designationName": "Cord Shirt Jacket",
    "valuation": 1199,
    "referencePricing": 1999,
    "category": "Shirts",
    "affiliateLink": "https://example.com/cord-umber",
    "editorialAbstract": "Fine-wale corduroy shirt intended for layering, featuring a dual chest-pocket layout.",
    "curatorVerdict": "The texture is rich and provides excellent warmth as a mid-layer. The Umber color is deep and pairs well with dark denim. Button quality is solid with no loose threads.",
    "designHighs": "Soft 16-wale corduroy; Natural oversized fit; Matte-finish buttons",
    "designLows": "Pockets are slightly small for modern phones; Cuffs are a bit narrow",
    "imageUrl": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Supima Cotton Briefs – Tri-Pack",
    "designationName": "Cotton Innerwear",
    "valuation": 799,
    "referencePricing": 1299,
    "category": "Innerwear",
    "affiliateLink": "https://example.com/supima-briefs",
    "editorialAbstract": "Ultra-soft Supima cotton essentials with a no-roll elastic waistband and ergonomic fit.",
    "curatorVerdict": "The go-to daily essential. Supima cotton makes a world of difference in breathability. They retain their stretch and color even after more than 30+ wash cycles.",
    "designHighs": "Long-staple cotton softness; Flat-lock seams; Tagless comfort",
    "designLows": "Limited color variety; Sizing runs slightly large",
    "imageUrl": "https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Linen Blend Drawstring Pants – Khaki",
    "designationName": "Linen Trousers",
    "valuation": 1099,
    "referencePricing": 1799,
    "category": "Pants",
    "affiliateLink": "https://example.com/linen-khaki",
    "editorialAbstract": "Effortless linen-viscose trousers featuring an elasticated drawstring waist and tapered leg.",
    "curatorVerdict": "The ultimate summer staple. The viscose blend significantly reduces the harsh wrinkling typical of pure linen. They look intentional and polished when paired with a simple tank or tee.",
    "designHighs": "Lightweight breathable weave; Adjustable waist; Reinforced crotch stitching",
    "designLows": "Fabric is slightly sheer in bright light; Legs are cut quite long",
    "imageUrl": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Vulcanized High-Top Trainer – Off White",
    "designationName": "Canvas Sneakers",
    "valuation": 999,
    "referencePricing": 1599,
    "category": "Shoes",
    "affiliateLink": "https://example.com/high-top-trainer",
    "editorialAbstract": "Clean high-top sneakers with a vulcanized rubber sole and heavy-duty canvas upper.",
    "curatorVerdict": "A robust alternative to legacy high-tops. The footbed has better arch support than the leading competitor. The 'Off White' shade hides dirt better than pure white canvas.",
    "designHighs": "Impact-absorbing insole; Metal eyelets; Classic waffle tread",
    "designLows": "Requires a break-in period at the heel; Not ideal for wide feet",
    "imageUrl": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Grained Leather Cardholder – Cocoa",
    "designationName": "Leather Wallet",
    "valuation": 499,
    "referencePricing": 899,
    "category": "Accessories",
    "affiliateLink": "https://example.com/leather-cardholder",
    "editorialAbstract": "A slim, front-pocket cardholder crafted from pebbled genuine leather.",
    "curatorVerdict": "The hand-feel of the grained leather is impressive. It carries 6 cards easily without bulging. A perfect entry-level piece for someone looking to declutter their wallet.",
    "designHighs": "Genuine top-grain leather; RFID protection; Ultra-slim profile",
    "designLows": "Cash slot is tight for multiple banknotes; Tension is high initially",
    "imageUrl": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Fine-Gauge Turtleneck – Navy",
    "designationName": "Knit Sweater",
    "valuation": 1199,
    "referencePricing": 1899,
    "category": "Shirts",
    "affiliateLink": "https://example.com/navy-turtleneck",
    "editorialAbstract": "Sophisticated fine-gauge knit turtleneck in a deep navy blue, ideal for layering.",
    "curatorVerdict": "The neck maintains its shape perfectly—no sagging here. It’s thin enough to wear under a blazer without feeling bulky. The wool-acrylic blend is surprisingly non-itchy.",
    "designHighs": "Retains neck structure; Soft non-itchy finish; Deep saturated color",
    "designLows": "Arms are fairly slim; Requires flat-drying to prevent stretching",
    "imageUrl": "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Pleated Tapered Chinos – Olive",
    "designationName": "Pleated Pants",
    "valuation": 1399,
    "referencePricing": 2199,
    "category": "Pants",
    "affiliateLink": "https://example.com/olive-chinos",
    "editorialAbstract": "Vintage-inspired pleated chinos with a relaxed thigh and a sharp taper towards the ankle.",
    "curatorVerdict": "These bring a high-end designer silhouette to a budget price. The single pleat is subtle and adds just enough volume. The fabric has a nice peached finish that feels soft.",
    "designHighs": "Unique designer silhouette; Durable YKK zipper; Peached cotton texture",
    "designLows": "Pleats need careful ironing after wash; Waist runs half a size small",
    "imageUrl": "https://images.unsplash.com/photo-1473966968600-fa804b86862b?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Gum-Sole Court Sneaker – White",
    "designationName": "Minimalist Sneakers",
    "valuation": 1699,
    "referencePricing": 2799,
    "category": "Shoes",
    "affiliateLink": "https://example.com/court-sneaker",
    "editorialAbstract": "A minimal leather-alternative sneaker with a vintage-inspired natural gum-rubber sole.",
    "curatorVerdict": "The silhouette is clean and uncluttered. The gum sole adds a nice heritage touch that separates it from standard white sneakers. It’s easy to wipe clean with a damp cloth.",
    "designHighs": "Durable synthetic leather; Vintage aesthetic; Easy-maintenance upper",
    "designLows": "Breathability is limited; Laces feel slightly thin",
    "imageUrl": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Cotton Mesh Tank – Ecru",
    "designationName": "Mesh Undershirt",
    "valuation": 399,
    "referencePricing": 699,
    "category": "Innerwear",
    "affiliateLink": "https://example.com/mesh-tank",
    "editorialAbstract": "Open-knit cotton mesh tank top designed for maximum airflow during high heat.",
    "curatorVerdict": "The open-weave mesh is surprisingly structural and doesn't look like an undershirt. It works exceptionally well under an unbuttoned campfire or linen shirt.",
    "designHighs": "Excellent airflow; 100% natural cotton; Modern boxy cut",
    "designLows": "Can shrink if machine dried; Very casual aesthetic",
    "imageUrl": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Raw Indigo Denim – Slim Straight",
    "designationName": "Unwashed Jeans",
    "valuation": 1599,
    "referencePricing": 2899,
    "category": "Pants",
    "affiliateLink": "https://example.com/raw-indigo",
    "editorialAbstract": "13oz unwashed indigo denim with a classic slim-straight cut and silver hardware.",
    "curatorVerdict": "An excellent entry into the world of raw denim. It has a great initial crunch and develops personal fade patterns quickly. The weight is perfect for year-round wear.",
    "designHighs": "Sturdy 13oz denim; Deep indigo dye; High-contrast fading potential",
    "designLows": "Dye bleeds onto light surfaces initially; Very stiff for first few wears",
    "imageUrl": "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Waffle Knit Long Sleeve – Moss",
    "designationName": "Thermal T-shirt",
    "valuation": 699,
    "referencePricing": 1199,
    "category": "T-shirts",
    "affiliateLink": "https://example.com/waffle-moss",
    "editorialAbstract": "A thermal long-sleeve tee with a distinct waffle texture and ribbed cuffs.",
    "curatorVerdict": "A thermal that actually holds its shape. Many budget waffle knits stretch out at the collar, but this one remains crisp. The Moss color has a rugged, outdoorsy feel.",
    "designHighs": "High-retention knit; Comfortable thermal insulation; Functional ribbed cuffs",
    "designLows": "Fit is quite slim; Texture can feel coarse initially",
    "imageUrl": "https://images.unsplash.com/photo-1618354721011-20d040854271?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Acetate Square Sunglasses – Tortoise",
    "designationName": "Square Eyewear",
    "valuation": 899,
    "referencePricing": 1599,
    "category": "Accessories",
    "affiliateLink": "https://example.com/tortoise-shades",
    "editorialAbstract": "Classic square-frame sunglasses with a polished tortoiseshell pattern and UV400 lenses.",
    "curatorVerdict": "The weight of the acetate is substantial, making them feel like a much more expensive pair. The hinges are smooth and stable. The frame width is ideal for medium-sized faces.",
    "designHighs": "Premium acetate feel; Reliable UV protection; Timeless silhouette",
    "designLows": "Frame can be heavy for long-term wear; Screws may need occasional tightening",
    "imageUrl": "https://images.unsplash.com/photo-1511499767390-90339045296d?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Merino Wool Blend Socks – 3 Pair Pack",
    "designationName": "Thermal Socks",
    "valuation": 599,
    "referencePricing": 999,
    "category": "Innerwear",
    "affiliateLink": "https://example.com/merino-socks",
    "editorialAbstract": "High-performance merino blend socks with reinforced heels and seamless toe closures.",
    "curatorVerdict": "The best value upgrade for your daily comfort. These moisture-wicking socks prevent odors much better than standard cotton. They are cushioned enough for boots but slim enough for shoes.",
    "designHighs": "Natural moisture wicking; Odor resistant; Reinforced high-stress areas",
    "designLows": "Pilling occurs after first few washes; Elasticity is very firm",
    "imageUrl": "https://images.unsplash.com/photo-1582966298430-8e781111a350?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "Oxford Button Down – Classic White",
    "designationName": "Oxford Shirt",
    "valuation": 999,
    "referencePricing": 1699,
    "category": "Shirts",
    "affiliateLink": "https://example.com/white-oxford",
    "editorialAbstract": "The foundational wardrobe piece: a heavy-weight Oxford cloth button-down with a perfect collar roll.",
    "curatorVerdict": "Every man needs one, and this one gets it right. The fabric is thick enough to be opaque but breathable enough for all-day wear. The button-down collar height is just right.",
    "designHighs": "Authentic heavy Oxford cloth; Box pleat for movement; Classic pearlized buttons",
    "designLows": "Wrinkles heavily if not steamed; Sleeve length is fixed and long",
    "imageUrl": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  },
  {
    "editorialTitle": "NATO Strap Field Watch – Matte Black",
    "designationName": "Tactical Watch",
    "valuation": 1299,
    "referencePricing": 1999,
    "category": "Watches",
    "affiliateLink": "https://example.com/field-watch",
    "editorialAbstract": "Rugged field watch with a matte black alloy case and a durable nylon NATO strap.",
    "curatorVerdict": "A reliable companion for casual outfits. The lume on the numbers is decent, and the lightweight construction makes it disappear on the wrist. The NATO strap is easily swappable.",
    "designHighs": "Interchangeable strap; High-visibility dial; Modern matte finish",
    "designLows": "The tic is slightly audible in quiet rooms; Crystal is prone to hairline scratches",
    "imageUrl": "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=800",
    "pinToHero": false
  }
];

async function seed() {
  console.log('--- Phase 1: Syncing Taxonomy ---');
  const headers = { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` };
  
  // Get all unique categories
  const catNames = [...new Set(productsData.map(p => p.category))];
  const categoryMap = {};

  for (const name of catNames) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?name=eq.${encodeURIComponent(name)}`, { headers });
    const existing = await res.json();
    
    if (existing.length === 0) {
      console.log(`Registering category: ${name}`);
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify({ name })
      });
      const [newCat] = await insertRes.json();
      categoryMap[name] = newCat.id;
    } else {
      console.log(`Category exists: ${name}`);
      categoryMap[name] = existing[0].id;
    }
  }

  console.log('\n--- Phase 2: Injecting Artifacts (Adapting to DB Schema) ---');
  // NOTE: Based on DB inspection, we use 'discount' instead of 'discount_price' and 'category_id' instead of 'category'
  // Also omitting 'curator_rating', 'curator_verdict', 'highs', 'lows' as they are currently missing from DB columns.
  
  const payload = productsData.map(p => ({
    title: p.editorialTitle,
    description: p.editorialAbstract,
    price: p.valuation,
    discount: p.referencePricing,
    category_id: categoryMap[p.category],
    affiliate_link: p.affiliateLink,
    is_featured: p.pinToHero,
    tags: [p.category.toLowerCase()],
    image_url: p.imageUrl
  }));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: { 
      ...headers,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    console.log(`Success: Successfully injected ${productsData.length} artifacts into the MAVREN vault.`);
    console.log('\nNOTE: Your database is currently missing the "curator_rating", "curator_verdict", "highs", and "lows" columns defined in SUPABASE_SETUP.md.');
    console.log('I have omitted these rich metadata fields for now to unblock the base product listing.');
  } else {
    const error = await res.text();
    console.error(`Failure: Injection failed. Status: ${res.status}`);
    console.error(error);
  }
}

seed();
