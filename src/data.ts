import { Book } from './types';

// ============================================================================
// CONFIGURATION
// Toggle this flag to false when the app is approved and ready for real data.
// ============================================================================
export const USE_MOCK_DATA = true;

const mockBooks: Book[] = [
  { 
    id: "b1", 
    title: "The Savannah Echo", 
    author: "J. Mwangi", 
    authorTagline: "Award-winning historian and cultural essayist.", 
    authorBio: "J. Mwangi has spent three decades recovering archival materials lost during the colonial period. Born in Nyeri, his work revives the silenced voices of pre-independence communities.",
    authorAvatar: "from-amber-700 to-yellow-900",
    month: "JANUARY", 
    monthShort: "Jan", 
    description: "A sweeping deeply researched portrait of traditional communities navigating the edge of modernity in pre-independence Kenya. This historical non-fiction delves into the forgotten archives of the central highlands.", 
    coverGradient: "from-indigo-900 via-indigo-950 to-black", 
    genre: "History",
    excerpt: [
      "The dust had settled, yet the echo of the old drums remained.",
      "Chapter 1: The Gathering\n\nBefore the iron snake stretched across the plains, the land spoke a different language. It was a language of seasons, of soil, and of shared blood. My grandfather, a man of few words, often pointed towards the escarpment. 'They will come,' he would say, staring into the descending sun.",
      "But memory is a fragile vessel. As the first missionaries arrived with their bound books and foreign hymns, the local scribes realized the urgency of carving our stories into something more permanent than whispers."
    ]
  },
  { 
    id: "b2", 
    title: "Rising Dust", 
    author: "Sarah Otieno", 
    authorTagline: "Contemporary poet and voice of the urban youth.", 
    authorBio: "Sarah Otieno draws her inspiration directly from the chaotic, vibrant energy of Eastlands, Nairobi. She is known for her slam poetry performances that blend Swahili, English, and Sheng.",
    authorAvatar: "from-rose-600 to-red-900",
    month: "FEBRUARY", 
    monthShort: "Feb", 
    description: "An anthology of vivid poetry capturing the kinetic energy and resilience of life in Nairobi's sprawling urban estates. Through rhythmic verses, it paints the raw struggle and unyielding hope of the modern generation.", 
    coverGradient: "from-orange-900 via-red-950 to-black", 
    genre: "Poetry",
    excerpt: [
      "Concrete roots, iron leaves.",
      "Nairobi doesn't sleep; it waits.\nIn the Matatu neon glow, the conductor counts silver coins like rosary beads. We are all passengers on this winding tarmac, seeking a destination that keeps shifting.",
      "You hear the bass trembling from the street corners.\nA generation speaking in riddles, in Sheng.\nThey say the dust rises when we dance,\nAnd we haven't stopped dancing since the dawn."
    ]
  },
  { 
    id: "b3", 
    title: "Digital Horizons: Kenya 2030", 
    author: "Dr. Ken Korir", 
    authorTagline: "Leading tech analyst and policy advisor.", 
    authorBio: "Dr. Ken Korir is a foremost thinker in East Africa's digital transformation. With a background in computer science and public policy, he advises governments on building sustainable tech ecosystems.",
    authorAvatar: "from-blue-600 to-indigo-900",
    month: "MARCH", 
    monthShort: "Mar", 
    description: "A comprehensive analytical outlook detailing the technological roadmap and socio-economic shifts defining Kenya's rapid digital awakening. An essential blueprint for understanding the Silicon Savannah.", 
    coverGradient: "from-blue-600 via-gray-900 to-black", 
    genre: "Non-Fiction",
    excerpt: [
      "The Silicon Savannah is not a destination; it is an evolution.",
      "Introduction: The leapfrog effect.\n\nWhile developed nations slowly upgraded legacy infrastructure, Kenya bypassed the wire completely. The mobile money revolution was merely the opening act. As we turn our eyes to 2030, the integration of AI in agrarian economies will redefine productivity.",
      "Data centers are now as critical as water reservoirs. The policy frameworks formulated today will determine whether the impending wave of automation becomes an equalizer or an accelerant for disparity."
    ]
  },
  { 
    id: "b4", 
    title: "Nairobi Nights", 
    author: "Alex Kamau", 
    authorTagline: "Critically acclaimed suspense and thriller novelist.", 
    authorBio: "A former investigative journalist, Kamau brings gritty realism to his fiction. He has written three bestselling novels exposing the shadow economies of East Africa.",
    authorAvatar: "from-emerald-700 to-teal-900",
    month: "APRIL", 
    monthShort: "Apr", 
    description: "A thrilling neo-noir detective novel set heavily against the neon-lit backdrops and shadowy underbelly of modern Nairobi. Fast-paced, mysterious, and dripping with atmosphere.", 
    coverGradient: "from-emerald-900 via-teal-950 to-black", 
    genre: "Fiction",
    excerpt: [
      "Rain rarely washed away the sins of the city; it just made them slippery.",
      "Chapter 1\n\nDetective Makori lit his cigarette under the flickering streetlamp of Koinange Street. It was 2 AM. The city's hum had dropped to a low growl. The body lay exactly where the anonymous caller had promised. A sleek, black ledger rested on the damp asphalt beside it.",
      "Makori knew this wasn't a standard mugging. The victim wore a tailored suit worth more than a detective's annual salary, and the ink inside the ledger was written entirely in cipher."
    ]
  },
  { 
    id: "b5", 
    title: "The Rift Valley", 
    author: "Beatrice N.", 
    authorTagline: "World-renowned geographical photographer.", 
    authorBio: "Beatrice N. has traversed the African continent documenting its shifting topographies. Her works have been featured globally, advocating for geological preservation.",
    authorAvatar: "from-pink-600 to-rose-900",
    month: "MAY", 
    monthShort: "May", 
    description: "A visually stunning geological and cultural exploration of the Great Rift Valley, blending photography with historical prose. It captures the breathtaking landscapes across millions of years.", 
    coverGradient: "from-red-900 via-rose-950 to-black", 
    genre: "Geography",
    excerpt: [
      "A scar upon the earth, beautiful and violent.",
      "To stand at the edge of the escarpment is to look back in time. The tectonic plates here do not rest; they are actively tearing the continent apart. This gradual divergence has birthed volcanoes, soda lakes, and the perfect crucible for early hominid evolution.",
      "The flamingos of Lake Nakuru and the steam vents of Hell's Gate are merely the surface symptoms of a deep, subterranean unrest that continues to shape the physical and cultural landscape of the region."
    ]
  },
  { 
    id: "b6", 
    title: "Whispers of the Ancestors", 
    author: "O. Kenyatta", 
    authorTagline: "Dedicated archivist of Kenyan oral traditions.", 
    authorBio: "Growing up in a Swahili-speaking household on the coast, O. Kenyatta has dedicated his life to transcribing the fading mythological narratives of the Mijikenda people.",
    authorAvatar: "from-purple-600 to-fuchsia-900",
    month: "JUNE", 
    monthShort: "Jun", 
    description: "A rich collection of oral histories and folklore, meticulously compiled to preserve the spiritual heritage of coastal tribes. These are the fables passed down through generations.", 
    coverGradient: "from-violet-900 via-fuchsia-950 to-black", 
    genre: "Folklore",
    excerpt: [
      "The sea remembers what the land forgets.",
      "Before the first dhows arrived carried by the monsoon winds, the Kaya forests held secrets that were only spoken of during the moonless nights. The elders speak of spirits that walk on the surface of the Indian Ocean, wearing garments woven from seafoam.",
      "This is the tale of Mekatilili, told not as history, but as legend. A prophecy etched not in stone, but carried on the salty breeze over the coral reefs."
    ]
  },
  { 
    id: "b7", 
    title: "Beyond the Equator", 
    author: "M. Njoroge", 
    authorTagline: "Passionate environmentalist and memoirist.", 
    authorBio: "M. Njoroge is a prominent conservationist whose afforestation efforts on the slopes of Mount Kenya have restored over 5,000 hectares of indigenous woodland.",
    authorAvatar: "from-lime-600 to-green-900",
    month: "JULY", 
    monthShort: "Jul", 
    description: "A breathtaking autobiographical journey of an environmentalist fighting to protect the fragile ecosystems straddling the equator. A true testament to conservation efforts in East Africa.", 
    coverGradient: "from-teal-600 via-emerald-900 to-black", 
    genre: "Non-Fiction",
    excerpt: [
      "The ice on the equator is melting. We are the generation that must watch it vanish.",
      "There was a time when the peaks of Mount Kenya were shrouded in eternal white. As a child, looking up from the foothills, it seemed like an untouchable crown. Today, we measure its retreat in meters every year.",
      "Conservation is not merely about planting trees; it is about repairing our fractured relationship with the biosphere. We must learn to listen to the canopy before it goes silent forever."
    ]
  }
];

// ============================================================================
// REAL DATA (Legal Deposits)
// Populate this array with the real legal deposit data once ready,
// including real coverImage URLs, excerpts, and author details.
// ============================================================================
const realBooks: Book[] = [
  // Example placeholder for real data:
  // {
  //   id: "real-1",
  //   title: "Real Legal Deposit Title",
  //   author: "Real Author",
  //   authorTagline: "Real Tagline",
  //   authorBio: "Real Bio",
  //   authorAvatar: "from-blue-600 to-blue-900",
  //   month: "AUGUST",
  //   monthShort: "Aug",
  //   description: "Real description",
  //   coverGradient: "from-gray-900 to-black",
  //   coverImage: "https://example.com/real-cover.jpg",
  //   genre: "Fiction",
  //   excerpt: ["Real excerpt page 1", "Real excerpt page 2"]
  // }
];

export const books: Book[] = USE_MOCK_DATA ? mockBooks : realBooks;

export const featuredAuthor = {
  name: USE_MOCK_DATA ? "Dr. Ken Korir" : "Real Featured Author",
  bio: USE_MOCK_DATA ? "Dr. Ken Korir is a foremost thinker in East Africa's digital transformation. With a background in computer science and public policy, he has advised multiple governments on building sustainable tech infrastructure for the future. His writing bridges the gap between complex technological theory and practical socio-economic realities." : "Real Bio",
  quote: USE_MOCK_DATA ? "The future of our nation is written in code, but rooted deeply in our traditions and shared stories." : "Real Quote",
  bookIds: USE_MOCK_DATA ? ["b3"] : ["real-1"]
};

export const heroContent = {
  badge: USE_MOCK_DATA ? "National Reading Day 2026" : "National Reading Day 2026",
  titleLine1: USE_MOCK_DATA ? "Our Stories, Our Future:" : "Our Stories, Our Future:",
  titleLine2: USE_MOCK_DATA ? "Empowering Minds Through Reading" : "Empowering Minds Through Reading",
  description: USE_MOCK_DATA 
    ? "A curated digital archive of Kenya's preserved literary heritage. Explore the newest works received through legal deposit during the first seven months of 2026. Scroll down to enter the chronological timeline." 
    : "Actual description text for the live display goes here."
};

