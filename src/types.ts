export interface Book {
  id: string;
  title: string;
  author: string;
  authorTagline: string;
  month: string;
  monthShort: string;
  description: string;
  coverGradient: string;
  genre: string;
}

export interface DisplayBook extends Book {
  uniqueId: string;
}
