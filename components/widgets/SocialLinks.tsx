import { useTranslations } from "next-intl";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaImdb,
  FaGlobe,
} from "react-icons/fa";

interface SocialLinksProps {
  external_ids: {
    imdb_id?: string;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
  };
  homepage?: string;
  // IMDb has separate addresses for titles and people
  kind?: "title" | "name";
}

export default function SocialLinks({
  external_ids,
  homepage,
  kind = "title",
}: SocialLinksProps) {
  const t = useTranslations("SocialLinks");

  const { imdb_id, facebook_id, instagram_id, twitter_id } = external_ids ?? {};
  if (!(imdb_id || facebook_id || instagram_id || twitter_id || homepage)) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-4 shadow-lg w-fit">
      {external_ids?.imdb_id && (
        <a
          href={`https://www.imdb.com/${kind}/${external_ids.imdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-yellow-500 transition-colors text-2xl"
          title="IMDb"
        >
          <FaImdb />
        </a>
      )}
      {external_ids?.facebook_id && (
        <a
          href={`https://facebook.com/${external_ids.facebook_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-600 transition-colors text-2xl"
          title="Facebook"
        >
          <FaFacebook />
        </a>
      )}
      {external_ids?.instagram_id && (
        <a
          href={`https://instagram.com/${external_ids.instagram_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-500 transition-colors text-2xl"
          title="Instagram"
        >
          <FaInstagram />
        </a>
      )}
      {external_ids?.twitter_id && (
        <a
          href={`https://twitter.com/${external_ids.twitter_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"
          title="Twitter"
        >
          <FaTwitter />
        </a>
      )}
      {homepage && (
        <a
          href={homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors text-2xl"
          title={t("officialSite")}
        >
          <FaGlobe />
        </a>
      )}
    </div>
  );
}
