import { Landmark, Feather, BookOpen, BookText, Map, Sparkles, FileText, LucideProps } from 'lucide-react';

interface Props extends Omit<LucideProps, 'ref'> {
  genre: string;
  className?: string;
}

export default function GenreIcon({ genre, ...props }: Props) {
  switch (genre) {
    case 'History':
      return <Landmark {...props} />;
    case 'Poetry':
      return <Feather {...props} />;
    case 'Non-Fiction':
      return <BookOpen {...props} />;
    case 'Fiction':
      return <BookText {...props} />;
    case 'Geography':
      return <Map {...props} />;
    case 'Folklore':
      return <Sparkles {...props} />;
    default:
      return <FileText {...props} />;
  }
}
