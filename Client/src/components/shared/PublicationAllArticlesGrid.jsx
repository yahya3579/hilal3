import React from "react";
import Loader from "../Loader/loader";
import { usePublicationArticles } from "../../hooks/usePublicationArticles";
import { CommonCard1English } from "./english/CommonCard1English";
import CommonCard1Urdu from "./urdu/CommonCard1Urdu";

const TARGET_MONTH = 4;
const TARGET_YEAR = 2025;

const PublicationAllArticlesGrid = ({
    publicationName = "",
    isUrdu = false,
    className = "",
}) => {
    const {
        data: articles = [],
        isLoading,
        error,
    } = usePublicationArticles(publicationName, TARGET_MONTH, TARGET_YEAR);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <p className="p-4 text-red-500">
                {isUrdu ? "مضامین لوڈ کرنے میں مسئلہ پیش آیا" : "Error fetching articles"}
            </p>
        );
    }

    const CardComponent = isUrdu ? CommonCard1Urdu : CommonCard1English;
    const normalizedPublication = (publicationName || "").toLowerCase();
    const skipCount =
        normalizedPublication.includes("kids") || normalizedPublication.includes("hilal-her")
            ? 6
            : 0;
    const titleDir = isUrdu ? "rtl" : "ltr";

    const filteredArticles = (articles || []).filter((article) => {
        const publishedAt = article?.publish_date ? new Date(article.publish_date) : null;
        return (
            publishedAt &&
            publishedAt.getMonth() + 1 === TARGET_MONTH &&
            publishedAt.getFullYear() === TARGET_YEAR
        );
    });

    const displayedArticles = filteredArticles.slice(skipCount);
    const emptyMessage =
        skipCount > 0
            ? isUrdu
                ? "مزید مضامین دستیاب نہیں"
                : "No additional articles"
            : isUrdu
            ? "کوئی مضمون دستیاب نہیں"
            : "No articles available";

    return (
        <div className={`bg-white py-2 px-4 font-poppins ${className}`}>
            <div>
                {displayedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {displayedArticles.map((article) => (
                            <CardComponent
                                key={article.id}
                                article={article}
                                publicationName={publicationName}
                                showBadge={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                        <p
                            className={`text-gray-500 text-sm ${isUrdu ? "font-urdu" : ""}`}
                            dir={titleDir}
                        >
                            {emptyMessage}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicationAllArticlesGrid;

