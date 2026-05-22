export interface Book {
  id: string;
  title: string;
  author: string;
  authorTagline: string;
  authorBio?: string;
  authorAvatar?: string;
  month: string;
  monthShort: string;
  description: string;
  coverGradient: string;
  genre: string;
  excerpt?: string[];
}

export interface DisplayBook extends Book {
  uniqueId: string;
}
