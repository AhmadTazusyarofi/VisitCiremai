export type Category =
  | 'Pendakian Gunung Hutan'
  | 'Petualangan Lainnya'
  | 'Akomodasi'
  | 'Transportasi'
  | 'Sewa Alat';

export type ItineraryStep = {
  time: string;   // e.g. '06:00'
  title: string;
  desc?: string;
};

export type Package = {
  id: string;
  title: string;
  category: Category;
  location?: string;
  price: number;        // rupiah, integer
  priceUnit: string;    // 'Orang' | 'Unit'
  duration: string;     // e.g. '2 hari 1 malam' | 'Unlimited'
  image: string;        // '/img/placeholder.jpg' for now
  description: string;  // 1-2 sentences, Indonesian, friendly
  includes?: string[];
  gallery?: string[];   // extra photos; main image is shown first
  itinerary?: ItineraryStep[];
};
