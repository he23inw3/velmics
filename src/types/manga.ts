export interface Manga {
  id: string;
  title: string;
  originalTitle?: string;
  authors: {
    name: string;
    role?: 'writer' | 'artist' | 'both';
  }[];
  artist?: string;
  publisher: string;
  releaseDate: string;
  completionStatus: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  description: string;
  editorialReview?: string;
  genres: string[];
  tags: string[];
  rating: number;
  volumes?: number;
  chapters?: number;
  coverImage: string;
  bannerImage?: string;
  affiliateLinks?: {
    amazon?: string;
    bookWalker?: string;
    ebookJapan?: string;
    other?: string;
  };
  mediaMix?: {
    anime?: {
      available: boolean;
      links?: {
        official?: string;
        crunchyroll?: string;
        netflix?: string;
        other?: string;
      };
    };
    movie?: {
      available: boolean;
      links?: {
        official?: string;
        trailer?: string;
      };
    };
    drama?: {
      available: boolean;
      links?: {
        official?: string;
        trailer?: string;
      };
    };
    game?: {
      available: boolean;
      links?: {
        official?: string;
        store?: string;
      };
    };
    merchandise?: {
      figures?: {
        available: boolean;
        items?: {
          name: string;
          manufacturer: string;
          releaseDate: string;
          price: number;
          image?: string;
          link: string;
        }[];
      };
      other?: {
        available: boolean;
        items?: {
          name: string;
          category: string;
          price: number;
          image?: string;
          link: string;
        }[];
      };
    };
  };
  relatedWorks?: string[];
}

export interface ScoredManga {
  manga: Manga;
  score: number;
  reasons: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export interface FilterOptions {
  search: string;
  genres: string[];
  tags: string[];
  status: string[];
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  chaptersFrom?: number;
  chaptersTo?: number;
}
export interface SortOption {
  field: 'title' | 'releaseDate' | 'rating';
  direction: 'asc' | 'desc';
}

export interface UISettings {
  darkMode: boolean;
  itemsPerPage: number;
  savedFilters?: FilterOptions;
}

export interface HistoryItem {
  mangaId: string;
  timestamp: number;
}

export interface UserPreferences {
  favorites: string[];
  history: HistoryItem[];
  uiSettings: UISettings;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}