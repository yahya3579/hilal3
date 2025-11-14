import React from "react";
import Loader from "../Loader/loader";
import CommonCard2English from "./english/CommonCard2English";
import CommonCard3English from "./english/CommonCard3English";
import { CommonCard2Urdu } from "./urdu/CommonCard2Urdu";
import CommonCard3Urdu from "./urdu/CommonCard3Urdu";
import { useMiscArticles } from "../../hooks/usePublicationArticlesEnhanced";
import { getCurrentMonthYear } from "../../utils/dateUtils";

const TARGET_MONTH = 4;
const TARGET_YEAR = 2025;

const Misc = ({ 
    publicationName = "Hilal English", 
    isUrdu = false,
    className = ""
}) => {
    const { data, isLoading, error } = useMiscArticles(publicationName, TARGET_MONTH, TARGET_YEAR);

    if (isLoading) return <Loader />;
    if (error) return <p className="p-4 text-red-500">Error fetching articles</p>;

    // Choose the appropriate card components based on language
    const LargeCard = isUrdu ? CommonCard2Urdu : CommonCard2English;
    const SmallCard = isUrdu ? CommonCard3Urdu : CommonCard3English;

    // Title and styling based on language
    const title = isUrdu ? "متنوع" : "MISC";
    const titleClassName = isUrdu ? "heading-text-primary font-urdu-nastaliq-sm1" : "heading-text-primary";
    const titleDir = isUrdu ? "rtl" : "ltr";

    const filteredData = (data || []).filter((article) => {
        const publishedAt = article?.publish_date ? new Date(article.publish_date) : null;
        return (
            publishedAt &&
            publishedAt.getMonth() + 1 === TARGET_MONTH &&
            publishedAt.getFullYear() === TARGET_YEAR
        );
    });

    return (
        <div className={`bg-white font-poppins px-4 py-2 ${className}`}>
            {/* Misc Header */}
            <div className="border-t-[3px] border-red-600">
                <div className="py-2 flex justify-between items-center">
                    {isUrdu ? (
                        <>
                            <span className="text-sm text-gray-600 font-medium">
                                {getCurrentMonthYear()}
                            </span>
                            <h2 className={titleClassName} dir={titleDir}>
                                {title}
                            </h2>
                        </>
                    ) : (
                        <>
                            <h2 className={titleClassName} dir={titleDir}>
                                {title}
                            </h2>
                            <span className="text-sm text-gray-600 font-medium">
                                {getCurrentMonthYear()}
                            </span>
                        </>
                    )}
                </div>

                {filteredData && filteredData.length > 0 ? (
                    <div className="py-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Large Featured Article */}
                            <LargeCard key={filteredData[0].id} data={filteredData} />

                            {/* Smaller Articles */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {filteredData.slice(1, 4).map((article) => (
                                    <SmallCard key={article.id} article={article} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-gray-500 text-sm">
                            {isUrdu ? "کوئی مضامین دستیاب نہیں" : "No articles available"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Misc;
