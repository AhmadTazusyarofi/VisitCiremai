import type { Package } from '../types/package';

export const packages: Package[] = [
  // Pendakian Gunung Hutan
  {
    id: 'privat-trip-pendakian-gunung-ciremai-via-apuy',
    title: 'Privat Trip Pendakian Gunung Ciremai Via Apuy',
    category: 'Pendakian Gunung Hutan',
    location: 'Via Apuy',
    price: 2200000,
    priceUnit: 'Orang',
    duration: '2 hari 1 malam',
    image: '/img/placeholder.png',
    description:
      'Nikmati pendakian privat ke puncak Gunung Ciremai via Apuy bersama guide lokal berpengalaman, lengkap dengan peralatan dan logistik.',
    includes: [
      'Guide bersertifikat',
      'Local Porter',
      'Dokumentasi Perjalanan',
      'Tiket Masuk',
      'Simaksi',
      'Booking Online',
      'Cek Kesehatan',
      'Tenda',
      'Matras',
      'Kompor',
      'Cooking Set',
      'Sleeping Bag',
      'Flysheet',
      'Makan 6x by request',
      'Pick Up',
      'Penginapan',
    ],
  },
  {
    id: 'privat-trip-camp-bushcraft',
    title: 'Privat Trip Camp / Bushcraft',
    category: 'Pendakian Gunung Hutan',
    price: 2200000,
    priceUnit: 'Orang',
    duration: 'Unlimited',
    image: '/img/placeholder.png',
    description:
      'Belajar teknik camping dan bushcraft langsung di alam Ciremai bersama pemandu ahli, cocok untuk pemula maupun yang ingin mengasah skill.',
  },
  {
    id: 'trip-hiking-summit-ciremai-via-apuy-min-4-orang',
    title: 'Trip Hiking Summit Ciremai Via Apuy - Min. 4 Orang',
    category: 'Pendakian Gunung Hutan',
    location: 'Via Apuy',
    price: 400000,
    priceUnit: 'Orang',
    duration: '2 hari 1 malam',
    image: '/img/placeholder.png',
    description:
      'Trip hiking hemat menuju puncak Ciremai via Apuy untuk rombongan minimal 4 orang, seru didaki bareng teman-teman.',
  },

  // Petualangan Lainnya
  {
    id: 'mini-season-expedisi-hutan-gunung-ciremai',
    title: 'Mini Season Expedisi Hutan Gunung Ciremai',
    category: 'Petualangan Lainnya',
    price: 2200000,
    priceUnit: 'Orang',
    duration: '2 hari 1 malam',
    image: '/img/placeholder.png',
    description:
      'Ekspedisi mini menyusuri hutan Gunung Ciremai untuk kamu yang ingin pengalaman petualangan lebih menantang dan berkesan.',
  },
  {
    id: 'kelas-navigasi-darat-dan-hutan',
    title: 'Kelas Navigasi Darat & Hutan',
    category: 'Petualangan Lainnya',
    price: 2200000,
    priceUnit: 'Orang',
    duration: 'Unlimited',
    image: '/img/placeholder.png',
    description:
      'Kuasai teknik navigasi darat dan membaca medan hutan bersama instruktur berpengalaman, bekal penting untuk setiap petualang.',
  },
  {
    id: 'rock-climbing-class',
    title: 'Rock Climbing Class',
    category: 'Petualangan Lainnya',
    price: 400000,
    priceUnit: 'Orang',
    duration: '2 hari 1 malam',
    image: '/img/placeholder.png',
    description:
      'Belajar dasar-dasar panjat tebing dengan aman bersama pemandu bersertifikat, dari teknik hingga peralatan keselamatan.',
  },
  {
    id: 'sport-rock-climbing-tebing-kondar',
    title: 'Sport Rock Climbing Tebing Kondar',
    category: 'Petualangan Lainnya',
    price: 250000,
    priceUnit: 'Orang',
    duration: '1 hari',
    image: '/img/placeholder.png',
    description:
      'Rasakan serunya sport climbing di Tebing Kondar dalam satu hari penuh adrenalin, cocok untuk pemula hingga penghobi.',
  },
  {
    id: 'hiking-dan-berbagya-time-curug-muara-jaya',
    title: 'Hiking & Berbagya Time Curug Muara Jaya',
    category: 'Petualangan Lainnya',
    price: 200000,
    priceUnit: 'Orang',
    duration: '1 hari',
    image: '/img/placeholder.png',
    description:
      'Jalan santai menyusuri jalur menuju Curug Muara Jaya sambil menikmati kesegaran air terjun dan kebersamaan.',
  },
  {
    id: 'canyoneering-waterfall-rappelling-curug-muara-jaya',
    title: 'Canyoneering – Waterfall Rappelling Curug Muara Jaya',
    category: 'Petualangan Lainnya',
    price: 600000,
    priceUnit: 'Orang',
    duration: '1 hari',
    image: '/img/placeholder.png',
    description:
      'Uji nyalimu dengan menuruni derasnya Curug Muara Jaya lewat teknik waterfall rappelling bersama tim yang berpengalaman.',
  },

  // Akomodasi
  {
    id: 'rumah-singgah-pendaki-warung-ciremai-via-apuy',
    title: 'Rumah Singgah Pendaki Warung Ciremai Via Apuy',
    category: 'Akomodasi',
    location: 'Via Apuy',
    price: 35000,
    priceUnit: 'Orang',
    duration: 'Per malam',
    image: '/img/placeholder.png',
    description:
      'Tempat singgah nyaman dan terjangkau untuk pendaki sebelum atau sesudah mendaki Ciremai via Apuy, dekat dengan basecamp.',
  },

  // Transportasi
  {
    id: 'pick-up-pendaki',
    title: 'Pick Up Pendaki',
    category: 'Transportasi',
    price: 400000,
    priceUnit: 'Unit',
    duration: 'Sekali jalan',
    image: '/img/placeholder.png',
    description:
      'Layanan pick up untuk mengantar rombongan pendaki dengan aman dan tepat waktu menuju titik pendakian.',
  },
  {
    id: 'transportasi-ke-kirakan-ciremai-via-apuy',
    title: 'Transportasi Ke Kirakan Ciremai Via Apuy',
    category: 'Transportasi',
    price: 1300000,
    priceUnit: 'Unit',
    duration: 'Sekali jalan',
    image: '/img/placeholder.png',
    description:
      'Sewa transportasi menuju kawasan Ciremai via Apuy dengan armada terawat dan sopir yang paham medan.',
  },
  {
    id: 'transportasi-jabodetabek-ciremai-via-apuy',
    title: 'Transportasi Jabodetabek – Ciremai Via Apuy',
    category: 'Transportasi',
    price: 700000,
    priceUnit: 'Unit',
    duration: 'Sekali jalan',
    image: '/img/placeholder.png',
    description:
      'Jemput langsung dari area Jabodetabek menuju Ciremai via Apuy, praktis tanpa perlu repot berganti kendaraan.',
  },
  {
    id: 'pickup-antar-jemput-pendaki-ke-pos-pendakian',
    title: 'Pickup Antar Jemput Pendaki Ke Pos Pendakian',
    category: 'Transportasi',
    price: 400000,
    priceUnit: 'Unit',
    duration: 'Sekali jalan',
    image: '/img/placeholder.png',
    description:
      'Layanan antar jemput pendaki dari titik pertemuan menuju pos pendakian, hemat tenaga sebelum memulai perjalanan.',
  },

  // Sewa Alat
  {
    id: 'tenda-dome-4-5-orang',
    title: 'Tenda Dome 4–5 Orang',
    category: 'Sewa Alat',
    price: 40000,
    priceUnit: 'Unit',
    duration: 'Per hari',
    image: '/img/placeholder.png',
    description:
      'Sewa tenda dome berkapasitas 4–5 orang yang bersih dan mudah dipasang, siap menemani petualanganmu.',
  },
];
