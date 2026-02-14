/// <reference types="@fastly/js-compute" />
import { ConfigStore } from "fastly:config-store";
import { SimpleCache } from "fastly:cache";
import { CacheOverride } from "fastly:cache-override";
import { XMLParser } from "fast-xml-parser";

// Configuration
const LASTFM_USER = "kylelucas93";
const LETTERBOXD_USER = "kylegrantlucas";
const HARDCOVER_USER = "kylegrantlucas";

// Cache settings
const CACHE_TTL = 60; // Fresh content TTL (1 minute)
const SWR_TTL = 300; // Stale-while-revalidate window (5 minutes)
const BACKEND_CACHE_TTL = 120; // Backend fetch cache (2 minutes)
const CACHE_KEY = "currently-into-v1";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  // CORS headers for cross-origin requests from klr.dev
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (event.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to get cached response, or fetch fresh data
    const cacheEntry = await SimpleCache.getOrSet(CACHE_KEY, async () => {
      // Get secrets from Config Store
      const secrets = new ConfigStore("secrets");
      const lastfmApiKey = secrets.get("LASTFM_API_KEY");
      const hardcoverToken = secrets.get("HARDCOVER_TOKEN");

      // Fetch all sources in parallel
      const [music, films, books, recentlyRead] = await Promise.all([
        fetchLastFm(lastfmApiKey),
        fetchLetterboxd(),
        fetchHardcover(hardcoverToken),
        fetchRecentlyRead(hardcoverToken),
      ]);

      const responseData = {
        music,
        films,
        books,
        recentlyRead,
        fetchedAt: new Date().toISOString(),
      };

      return {
        value: JSON.stringify(responseData),
        ttl: CACHE_TTL,
      };
    });

    // Read the cached body (text() returns a Promise)
    const body = await cacheEntry.text();

    return new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_TTL}, stale-while-revalidate=${SWR_TTL}`,
        "Surrogate-Control": `max-age=${CACHE_TTL}, stale-while-revalidate=${SWR_TTL}`,
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

/**
 * Fetch currently playing or last played track from Last.fm
 */
async function fetchLastFm(apiKey) {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${apiKey}&format=json&limit=1`;

    const response = await fetch(url, {
      backend: "lastfm",
      cacheOverride: new CacheOverride("override", {
        ttl: BACKEND_CACHE_TTL,
        swr: SWR_TTL,
      }),
    });

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();
    const track = data.recenttracks?.track?.[0];

    if (!track) {
      return null;
    }

    return {
      artist: track.artist?.["#text"] || track.artist,
      track: track.name,
      album: track.album?.["#text"] || null,
      nowPlaying: track["@attr"]?.nowplaying === "true",
      url: track.url,
    };
  } catch (error) {
    console.error("Last.fm fetch error:", error);
    return null;
  }
}

/**
 * Fetch most recent film from Letterboxd RSS feed
 */
async function fetchLetterboxd() {
  try {
    const url = `https://letterboxd.com/${LETTERBOXD_USER}/rss/`;

    const response = await fetch(url, {
      backend: "letterboxd",
      cacheOverride: new CacheOverride("override", {
        ttl: BACKEND_CACHE_TTL,
        swr: SWR_TTL,
      }),
    });

    if (!response.ok) {
      throw new Error(`Letterboxd RSS error: ${response.status}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      processEntities: true,
      htmlEntities: true,
    });
    const feed = parser.parse(xml);

    const items = feed.rss?.channel?.item;
    if (!items || items.length === 0) {
      return [];
    }

    // Get the 3 most recent items
    const itemList = Array.isArray(items) ? items.slice(0, 3) : [items];

    return itemList.map((item) => {
      const title = item.title || "";
      const link = item.link || "";
      const memberRating = item["letterboxd:memberRating"];
      const rating = memberRating
        ? convertToStars(parseFloat(memberRating))
        : null;
      const filmTitle =
        item["letterboxd:filmTitle"] || title.split(",")[0].trim();
      const filmYear = item["letterboxd:filmYear"] || null;
      const tmdbId = item["tmdb:movieId"] || null;

      // Use TMDB direct link if available, otherwise Letterboxd page
      const movieUrl = tmdbId
        ? `https://www.themoviedb.org/movie/${tmdbId}`
        : link;

      return {
        title: filmTitle,
        year: filmYear ? parseInt(filmYear) : null,
        rating,
        url: link,
        movieUrl,
      };
    });
  } catch (error) {
    console.error("Letterboxd fetch error:", error);
    return [];
  }
}

/**
 * Convert numeric rating to star display
 */
function convertToStars(rating) {
  if (!rating || rating < 0) return null;

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  let stars = "\u2605".repeat(fullStars); // ★
  if (hasHalf) stars += "\u00BD"; // ½

  return stars;
}

/**
 * Convert numeric rating (1-5) to star display
 */
function convertRatingToStars(rating) {
  if (!rating || rating < 0) return null;

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  let stars = "\u2605".repeat(fullStars); // ★
  if (hasHalf) stars += "\u00BD"; // ½

  return stars;
}

/**
 * Fetch recently read books from Hardcover GraphQL API (last 90 days)
 */
async function fetchRecentlyRead(token) {
  try {
    const query = `
      query GetRecentlyRead($username: citext!) {
        users(where: { username: { _eq: $username } }) {
          user_books(
            where: { status_id: { _eq: 3 } }
            order_by: { updated_at: desc }
            limit: 20
          ) {
            rating
            user_book_reads(
              limit: 1
              order_by: { finished_at: desc_nulls_last }
              where: { finished_at: { _is_null: false } }
            ) {
              finished_at
              edition {
                isbn_10
                isbn_13
                asin
              }
            }
            book {
              title
              slug
              contributions {
                author {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.hardcover.app/v1/graphql", {
      backend: "hardcover",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: HARDCOVER_USER },
      }),
      cacheOverride: new CacheOverride("override", {
        ttl: BACKEND_CACHE_TTL,
        swr: SWR_TTL,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hardcover API error: ${response.status}`);
    }

    const data = await response.json();
    const userBooks = data.data?.users?.[0]?.user_books;

    if (!userBooks || userBooks.length === 0) {
      return [];
    }

    // Filter to books with a finish date, sorted most recent first
    const withFinishDate = userBooks.filter(
      (userBook) => userBook.user_book_reads?.[0]?.finished_at,
    );

    // Get start of current month (UTC)
    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );

    // Books finished this month
    const thisMonth = withFinishDate.filter(
      (userBook) =>
        new Date(userBook.user_book_reads[0].finished_at) >= startOfMonth,
    );

    // Guarantee a minimum of 3: backfill from older books if needed
    let selected;
    if (thisMonth.length >= 3) {
      selected = thisMonth;
    } else {
      const older = withFinishDate.filter(
        (userBook) =>
          new Date(userBook.user_book_reads[0].finished_at) < startOfMonth,
      );
      selected = [...thisMonth, ...older.slice(0, 3 - thisMonth.length)];
    }

    return selected.map((userBook) => {
        const book = userBook.book;
        const latestRead = userBook.user_book_reads?.[0];
        const edition = latestRead?.edition;
        const author = book.contributions?.[0]?.author?.name || null;
        const rating = convertRatingToStars(userBook.rating);

        // Generate Amazon URL
        let amazonUrl;
        if (edition?.asin) {
          amazonUrl = `https://www.amazon.com/dp/${edition.asin}`;
        } else if (edition?.isbn_10) {
          amazonUrl = `https://www.amazon.com/dp/${edition.isbn_10}`;
        } else if (edition?.isbn_13) {
          amazonUrl = `https://www.amazon.com/dp/${edition.isbn_13}`;
        } else {
          const amazonQuery = encodeURIComponent(
            `${book.title}${author ? ` ${author}` : ""}`,
          );
          amazonUrl = `https://www.amazon.com/s?k=${amazonQuery}&i=stripbooks`;
        }

        // Hardcover book page URL
        const hardcoverUrl = `https://hardcover.app/books/${book.slug}`;

        return {
          title: book.title,
          author,
          rating,
          amazonUrl,
          hardcoverUrl,
        };
      });
  } catch (error) {
    console.error("Hardcover recently read fetch error:", error);
    return [];
  }
}

/**
 * Fetch currently reading book from Hardcover GraphQL API
 */
async function fetchHardcover(token) {
  try {
    const query = `
      query GetCurrentlyReading($username: citext!) {
        users(where: { username: { _eq: $username } }) {
          user_books(
            where: { status_id: { _eq: 2 } }
            order_by: { updated_at: desc }
          ) {
            user_book_reads(limit: 1, order_by: { started_at: desc_nulls_last }) {
              progress
              edition {
                isbn_10
                isbn_13
                asin
              }
            }
            book {
              title
              slug
              pages
              contributions {
                author {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.hardcover.app/v1/graphql", {
      backend: "hardcover",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: HARDCOVER_USER },
      }),
      cacheOverride: new CacheOverride("override", {
        ttl: BACKEND_CACHE_TTL,
        swr: SWR_TTL,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hardcover API error: ${response.status}`);
    }

    const data = await response.json();
    const userBooks = data.data?.users?.[0]?.user_books;

    if (!userBooks || userBooks.length === 0) {
      return [];
    }

    return userBooks.map((userBook) => {
      const book = userBook.book;
      const latestRead = userBook.user_book_reads?.[0];
      const edition = latestRead?.edition;
      const author = book.contributions?.[0]?.author?.name || null;

      // Progress is already a percentage from user_book_reads
      const percent = latestRead?.progress
        ? Math.round(latestRead.progress)
        : null;

      // Generate Amazon URL - prefer ASIN/ISBN for direct product link, fallback to search
      let amazonUrl;
      if (edition?.asin) {
        amazonUrl = `https://www.amazon.com/dp/${edition.asin}`;
      } else if (edition?.isbn_10) {
        amazonUrl = `https://www.amazon.com/dp/${edition.isbn_10}`;
      } else if (edition?.isbn_13) {
        amazonUrl = `https://www.amazon.com/dp/${edition.isbn_13}`;
      } else {
        // Fallback to search
        const amazonQuery = encodeURIComponent(
          `${book.title}${author ? ` ${author}` : ""}`,
        );
        amazonUrl = `https://www.amazon.com/s?k=${amazonQuery}&i=stripbooks`;
      }

      return {
        title: book.title,
        author,
        percent,
        amazonUrl,
      };
    });
  } catch (error) {
    console.error("Hardcover fetch error:", error);
    return [];
  }
}
