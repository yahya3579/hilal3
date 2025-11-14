import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/loader";
import { CommonCard1English } from "./english/CommonCard1English";
import CommonCard1Urdu from "./urdu/CommonCard1Urdu";
import { getCurrentMonthYear, getCurrentMonthYearUrdu } from "../../utils/dateUtils";
import { usePublicationArticles } from "../../hooks/usePublicationArticles";
import { usePublicationCategoryArticlesEnhanced } from "../../hooks/usePublicationArticlesEnhanced";

const TARGET_MONTH = 4;
const TARGET_YEAR = 2025;
const HILAL_URDU_FALLBACK_CATEGORY = "our-martyrs-and-heroes";
const FALLBACK_ARTICLE_COUNT = 6;

const normalizePublicationName = (name = "") =>
    name.trim().toLowerCase().replace(/\s+/g, "-");

const fillArticleSlots = (slots = [], fallbackList = [], existingList = []) => {
    const usedIds = new Set(
        (existingList || [])
            .filter(Boolean)
            .map((article) => article.id)
    );
    const fallbackArticles = Array.isArray(fallbackList) ? fallbackList : [];
    let fallbackIndex = 0;

    return (slots || []).map((article) => {
        if (article && article.id) {
            usedIds.add(article.id);
            return article;
        }

        while (fallbackIndex < fallbackArticles.length) {
            const fallbackArticle = fallbackArticles[fallbackIndex++];
            if (fallbackArticle && !usedIds.has(fallbackArticle.id)) {
                usedIds.add(fallbackArticle.id);
                return fallbackArticle;
            }
        }

        return null;
    });
};

const TrendingPublications = ({ 
    publicationName = "Hilal English", 
    isUrdu = false,
    className = ""
}) => {
    const rawPublicationName = (publicationName || "").trim();
    const publicationSlug = normalizePublicationName(rawPublicationName);
    const effectivePublicationName = publicationSlug || rawPublicationName;

    const isHilalHer = publicationSlug === "hilal-her";
    const shouldUseHilalUrduFallback = publicationSlug === "hilal-urdu";

    const {
        data: fallbackArticlesRaw = [],
    } = usePublicationCategoryArticlesEnhanced(
        shouldUseHilalUrduFallback ? effectivePublicationName : null,
        shouldUseHilalUrduFallback ? HILAL_URDU_FALLBACK_CATEGORY : null,
        FALLBACK_ARTICLE_COUNT,
        TARGET_MONTH,
        TARGET_YEAR
    );

    const { data: trendingArticles = [], isLoading: trendingLoading, error: trendingError } = useQuery({
        queryKey: ["trending-articles", effectivePublicationName],
        queryFn: async () => {
            if (!effectivePublicationName) {
                return [];
            }
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles/trending/${effectivePublicationName}/`);
            return res.data.data || [];
        },
        enabled: !isHilalHer && !!effectivePublicationName,
    });

    const {
        data: hilalHerArticles = [],
        isLoading: hilalHerLoading,
        error: hilalHerError,
    } = usePublicationArticles(isHilalHer ? effectivePublicationName : null, TARGET_MONTH, TARGET_YEAR);

    const isLoading = isHilalHer ? hilalHerLoading : trendingLoading;
    const error = isHilalHer ? hilalHerError : trendingError;
    const baseArticles = isHilalHer ? hilalHerArticles : trendingArticles;

    if (isLoading) return <Loader />;
    if (error) return <p className="p-4 text-red-500">Error fetching articles</p>;

    const filteredArticles = (baseArticles || []).filter((article) => {
        const publishedAt = article?.publish_date ? new Date(article.publish_date) : null;
        return (
            publishedAt &&
            publishedAt.getMonth() + 1 === TARGET_MONTH &&
            publishedAt.getFullYear() === TARGET_YEAR
        );
    });

    const fallbackArticles = shouldUseHilalUrduFallback
        ? (fallbackArticlesRaw || []).filter(
            (article) =>
                article &&
                !filteredArticles.some((existing) => existing?.id === article.id)
        )
        : [];

    // Choose the appropriate card component based on language
    const CardComponent = isUrdu ? CommonCard1Urdu : CommonCard1English;

    // Title and styling based on language and publication
    const getTitle = () => {
        if (publicationSlug === "hilal-english") {
            return "TRENDING";
        } else if (publicationSlug === "hilal-urdu") {
            return "ہلال اردو";
        } else if (publicationSlug === "hilal-urdu-kids") {
            return "ہلال بچوں کے لیے اردو";
        } else if (publicationSlug === "hilal-digital") {
            return "ہلال دیجیٹل";
        } else {
            // For other English publications, use the publication name
            if (rawPublicationName) {
                return rawPublicationName.toUpperCase();
            }
            return publicationSlug.toUpperCase();
        }
    };
    
    const title = getTitle();
    const titleClassName = isUrdu ? "heading-text-primary font-urdu-nastaliq-sm1" : "heading-text-primary";
    const titleDir = isUrdu ? "rtl" : "ltr";

    // For mixed publications (hilal-english, hilal-urdu), arrange articles in a specific grid pattern
    // For others, just display in a simple grid
    const isMixedPublication = publicationSlug === "hilal-english" || publicationSlug === "hilal-urdu";

    if (isMixedPublication) {
        // For mixed publications: arrange in 3 columns with specific pattern
        // Backend returns: [in-focus1, in-focus2, national-news1, national-news2, misc1, misc2]
        // We want: Left column (in-focus), Middle column (national-news), Right column (misc)
        const baseGridArticles = [
            // Row 1: Column 1 (in-focus), Column 2 (national-news), Column 3 (misc)
            filteredArticles[0] || null, // in-focus1
            filteredArticles[2] || null, // national-news1
            filteredArticles[4] || null, // misc1
            // Row 2: Column 1 (in-focus), Column 2 (national-news), Column 3 (misc)
            filteredArticles[1] || null, // in-focus2
            filteredArticles[3] || null, // national-news2
            filteredArticles[5] || null, // misc2
        ];

        const gridArticles = shouldUseHilalUrduFallback
            ? fillArticleSlots(baseGridArticles, fallbackArticles, filteredArticles)
            : baseGridArticles;

        return (
            <div className={`py-2 px-4 font-poppins ${className}`}>
                {/* Header */}
                <div className="border-t-[3px] border-red-600">
                    <div className={`bg-white py-2 mb-2 flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <h2 className={titleClassName} dir={titleDir}>{title}</h2>
                        <span className={`text-sm text-gray-600 font-medium ${isUrdu ? 'font-urdu-nastaliq-sm1' : ''}`} dir={titleDir}>
                            {isUrdu ? getCurrentMonthYearUrdu() : getCurrentMonthYear()}
                        </span>
                    </div>

                    {/* Images Grid - 3 columns for mixed publications */}
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                        {gridArticles.map((article, index) => (
                            article ? (
                                <CardComponent key={`${article.id}-${index}`} article={article} publicationName={effectivePublicationName} />
                            ) : (
                                <div key={`empty-${index}`} className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                                    <p className={`text-gray-500 text-sm ${isUrdu ? 'font-urdu' : ''}`} dir={titleDir}>
                                        {isUrdu ? "کوئی مضمون دستیاب نہیں" : "No article available"}
                                    </p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        );
    } else {
        // For other publications: simple 3-column grid (limit to first 6 articles)
        const articlesToRender = filteredArticles.slice(0, 6);

        return (
            <div className={`py-2 px-4 font-poppins ${className}`}>
                {/* Header */}
                <div className="border-t-[3px] border-red-600">
                    <div className={`bg-white py-2 mb-2 flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <h2 className={titleClassName} dir={titleDir}>{title}</h2>
                        <span className={`text-sm text-gray-600 font-medium ${isUrdu ? 'font-urdu-nastaliq-sm1' : ''}`} dir={titleDir}>
                            {isUrdu ? getCurrentMonthYearUrdu() : getCurrentMonthYear()}
                        </span>
                    </div>

                    {/* Images Grid - 3 columns for other publications */}
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                        {articlesToRender.map((article) => (
                            <CardComponent key={article.id} article={article} publicationName={effectivePublicationName} />
                        ))}
                        {articlesToRender.length === 0 && (
                            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                                <p className={`text-gray-500 text-sm ${isUrdu ? 'font-urdu' : ''}`} dir={titleDir}>
                                    {isUrdu ? "کوئی مضمون دستیاب نہیں" : "No article available"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default TrendingPublications;
