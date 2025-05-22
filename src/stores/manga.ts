import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Manga, FilterOptions, SortOption, ScoredManga } from '@/types/manga';

/**
 * マンガ関連処理
 */
export const useMangaStore = defineStore('manga', () => {
  const mangaList = ref<Manga[]>([]);
  const mediaMixData = ref<Record<string, any>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * マンガデータ全件検索
   */
  const fetchMangas = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const [mangaResponse, mediaMixResponse] = await Promise.all([
        fetch('/data/manga.json'),
        fetch('/data/media-mix.json')
      ]);

      if (!mangaResponse.ok) {
        throw new Error('マンガデータの取得に失敗しました');
      }
      if (!mediaMixResponse.ok) {
        throw new Error('メディアミックスデータの取得に失敗しました');
      }

      const [mangas, mediaMix] = await Promise.all([
        mangaResponse.json(),
        mediaMixResponse.json()
      ]);
      
      // Sort mangas by release date before assigning to store
      const sortedMangas = [...mangas].sort((a, b) => {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });

      // メディアミックス情報をマンガデータにマージ
      mangaList.value = sortedMangas.map((manga: Manga) => ({
        ...manga,
        mediaMix: mediaMix[manga.id] || manga.mediaMix
      }));
      mediaMixData.value = mediaMix;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '不明なエラーが発生しました';
      console.error('Error fetching data:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * マンガ取得
   * @param id マンガID
   * @returns マンガ
   */
  const getMangaById = (id: string): Manga | undefined => {
    return mangaList.value.find(manga => manga.id === id);
  };

  /**
   * マンガフィルタリング
   * @param options 検索オプション
   * @returns マンガ
   */
  const filterMangas = (options: FilterOptions): Manga[] => {
    return mangaList.value.filter(manga => {
      // テキスト検索
      if (options.search && !matchesSearch(manga, options.search)) {
        return false;
      }

      // ジャンル
      if (options.genres.length > 0 && !containsAny(manga.genres, options.genres)) {
        return false;
      }

      // タグ
      if (options.tags.length > 0 && !containsAny(manga.tags, options.tags)) {
        return false;
      }

      // ステータス
      if (options.status.length > 0 && !options.status.includes(manga.completionStatus)) {
        return false;
      }

      // 発売年
      if (options.yearFrom || options.yearTo) {
        const releaseYear = new Date(manga.releaseDate).getFullYear();
        if (options.yearFrom && releaseYear < options.yearFrom) {
          return false;
        }
        if (options.yearTo && releaseYear > options.yearTo) {
          return false;
        }
      }

      // 巻数
      if (options.chaptersFrom || options.chaptersTo) {
        const chapters = manga.chapters || 0;
        if (options.chaptersFrom && chapters < options.chaptersFrom) {
          return false;
        }
        if (options.chaptersTo && chapters > options.chaptersTo) {
          return false;
        }
      }

      // 評価
      if (typeof options.minRating === 'number' && options.minRating > 0) {
        if (manga.rating < options.minRating) {
          return false;
        }
      }

      return true;
    });
  };

  /**
   * マンガソート
   * @param mangas マンガ
   * @param sortOption ソートオプション 
   * @returns マンガ
   */
  const sortMangas = (mangas: Manga[], sortOption: SortOption) => {
    return [...mangas].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ja');
          break;
        case 'releaseDate':
          comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return sortOption.direction === 'asc' ? comparison : -comparison;
    });
  };

  /**
   * 関連度スコアリング
   * @param manga1 マンガ1
   * @param manga2 マンガ2
   * @returns スコア値
   */
  const calculateRelationshipScore = (manga1: Manga, manga2: Manga): number => {
    let score = 0;

    // 1. 作者が完全一致する場合: 100点
    const manga1Authors = manga1.authors?.map(a => a.name) || [];
    const manga2Authors = manga2.authors?.map(a => a.name) || [];
    if (manga1Authors.length > 0 && manga2Authors.length > 0) {
      const authorMatch = manga1Authors.every(author => manga2Authors.includes(author)) &&
                         manga2Authors.every(author => manga1Authors.includes(author));
      if (authorMatch) score += 100;
    }

    // 2. 同一シリーズに属する場合: 80点
    if (manga1.relatedWorks?.includes(manga2.id) || manga2.relatedWorks?.includes(manga1.id)) {
      score += 80;
    }

    // 3. ジャンルが一致する場合: 1ジャンルにつき20点を加算
    const matchingGenres = manga1.genres.filter(g => manga2.genres.includes(g));
    score += matchingGenres.length * 20;

    // 4. タグが一致する場合: 1タグにつき15点を加算
    const matchingTags = manga1.tags.filter(t => manga2.tags.includes(t));
    score += matchingTags.length * 15;

    // 5. 出版社が同じ場合: 10点
    if (manga1.publisher === manga2.publisher) {
      score += 10;
    }

    // 6. 発売時期の近接性: 1年以内の差の場合5点を加算
    const releaseDate1 = new Date(manga1.releaseDate).getTime();
    const releaseDate2 = new Date(manga2.releaseDate).getTime();
    const yearInMs = 365 * 24 * 60 * 60 * 1000;
    if (Math.abs(releaseDate1 - releaseDate2) <= yearInMs) {
      score += 5;
    }

    // スコアの上限を100点に制限
    return Math.min(100, Math.floor(score));
  };

  const getRelatedMangas = (manga: Manga) => {
    // 自分自身を除外した他の全マンガをスコアリング
    const scoredMangas = mangaList.value
      .filter(m => m.id !== manga.id)
      .map(m => ({
        manga: m,
        score: calculateRelationshipScore(manga, m)
      }))
      .filter(item => item.score >= 65) // スコアが65点以上のものだけを選択
      .sort((a, b) => b.score - a.score); // スコアの高い順にソート

    // 上位2作品までを返す
    return scoredMangas.slice(0, 2).map(item => item.manga);
  };

  /**
   * マンガ曖昧検索
   * @param manga マンガ
   * @param search 検索キーワード
   * @returns マンガの有無
   */
  function matchesSearch(manga: Manga, search: string): boolean {
    const searchLower = search.toLowerCase();
    
    // タイトル検索
    if (manga.title.toLowerCase().includes(searchLower)) return true;
    if (manga.originalTitle?.toLowerCase().includes(searchLower)) return true;
    
    // 作者検索
    if (manga.authors && Array.isArray(manga.authors)) {
      // 複数作者の場合
      for (const author of manga.authors) {
        if (author.name.toLowerCase().includes(searchLower)) return true;
        
        // 役割に基づく検索（例：「原作」「作画」）
        const roleText = author.role === 'writer' ? '原作' : 
                        author.role === 'artist' ? '作画' : '';
        if (roleText && `${author.name}${roleText}`.toLowerCase().includes(searchLower)) {
          return true;
        }
      }
    }
    
    // 出版社検索
    if (manga.publisher.toLowerCase().includes(searchLower)) return true;
    
    return false;
  }

  function containsAny(list1: string[], list2: string[]): boolean {
    return list1.some(item => list2.includes(item));
  }

  return {
    mangaList,
    mediaMixData,
    isLoading,
    error,
    fetchMangas,
    getMangaById,
    filterMangas,
    sortMangas,
    getRelatedMangas
  };
});