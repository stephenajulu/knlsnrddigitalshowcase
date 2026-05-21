import { Book } from './types';

export const books: Book[] = [
  { id: "b1", title: "The Savannah Echo", author: "J. Mwangi", authorTagline: "Award-winning historian and cultural essayist.", month: "JANUARY", monthShort: "Jan", description: "A sweeping deeply researched portrait of traditional communities navigating the edge of modernity in pre-independence Kenya. This historical non-fiction delves into the forgotten archives of the central highlands.", coverGradient: "from-indigo-900 via-indigo-950 to-black", genre: "History" },
  { id: "b2", title: "Rising Dust", author: "Sarah Otieno", authorTagline: "Contemporary poet and voice of the urban youth.", month: "FEBRUARY", monthShort: "Feb", description: "An anthology of vivid poetry capturing the kinetic energy and resilience of life in Nairobi's sprawling urban estates. Through rhythmic verses, it paints the raw struggle and unyielding hope of the modern generation.", coverGradient: "from-orange-900 via-red-950 to-black", genre: "Poetry" },
  { id: "b3", title: "Digital Horizons: Kenya 2030", author: "Dr. Ken Korir", authorTagline: "Leading tech analyst and policy advisor.", month: "MARCH", monthShort: "Mar", description: "A comprehensive analytical outlook detailing the technological roadmap and socio-economic shifts defining Kenya's rapid digital awakening. An essential blueprint for understanding the Silicon Savannah.", coverGradient: "from-blue-600 via-gray-900 to-black", genre: "Non-Fiction" },
  { id: "b4", title: "Nairobi Nights", author: "Alex Kamau", authorTagline: "Critically acclaimed suspense and thriller novelist.", month: "APRIL", monthShort: "Apr", description: "A thrilling neo-noir detective novel set heavily against the neon-lit backdrops and shadowy underbelly of modern Nairobi. Fast-paced, mysterious, and dripping with atmosphere.", coverGradient: "from-emerald-900 via-teal-950 to-black", genre: "Fiction" },
  { id: "b5", title: "The Rift Valley", author: "Beatrice N.", authorTagline: "World-renowned geographical photographer.", month: "MAY", monthShort: "May", description: "A visually stunning geological and cultural exploration of the Great Rift Valley, blending photography with historical prose. It captures the breathtaking landscapes across millions of years.", coverGradient: "from-red-900 via-rose-950 to-black", genre: "Geography" },
  { id: "b6", title: "Whispers of the Ancestors", author: "O. Kenyatta", authorTagline: "Dedicated archivist of Kenyan oral traditions.", month: "JUNE", monthShort: "Jun", description: "A rich collection of oral histories and folklore, meticulously compiled to preserve the spiritual heritage of coastal tribes. These are the fables passed down through generations.", coverGradient: "from-violet-900 via-fuchsia-950 to-black", genre: "Folklore" },
  { id: "b7", title: "Beyond the Equator", author: "M. Njoroge", authorTagline: "Passionate environmentalist and memoirist.", month: "JULY", monthShort: "Jul", description: "A breathtaking autobiographical journey of an environmentalist fighting to protect the fragile ecosystems straddling the equator. A true testament to conservation efforts in East Africa.", coverGradient: "from-teal-600 via-emerald-900 to-black", genre: "Non-Fiction" }
];

export const featuredAuthor = {
  name: "Dr. Ken Korir",
  bio: "Dr. Ken Korir is a foremost thinker in East Africa's digital transformation. With a background in computer science and public policy, he has advised multiple governments on building sustainable tech infrastructure for the future. His writing bridges the gap between complex technological theory and practical socio-economic realities.",
  quote: "The future of our nation is written in code, but rooted deeply in our traditions and shared stories.",
  bookIds: ["b3"]
};

