import { Link } from "react-router";
import type { GuideType } from "../../global/types";
import styles from "./GuideCard.module.css";
import { observer } from "mobx-react";

interface GuideCardProps {
  guide: GuideType;
}

const GuideCard = ({ guide }: GuideCardProps) => {
  const handleEditGuide = (guideId: string) => {
    // Handle edit guide
    console.log("Edit guide:", guideId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link to={`/guide/${guide._id}`} className={styles.main}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleSection}>
          <h3 className={styles.cardTitle}>{guide.title}</h3>
          <span className={styles.language}>{guide.language}</span>
        </div>
        <button className={styles.editButton} onClick={() => handleEditGuide(guide._id)}>
          {/* Add your edit icon here */}
          Edit
        </button>
      </div>

      {guide.description && <p className={styles.description}>{guide.description}</p>}

      <div className={styles.cardFooter}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            {guide.steps.length} step{guide.steps.length !== 1 ? "s" : ""}
          </span>
          {guide.concepts.length > 0 && (
            <span className={styles.stat}>
              {guide.concepts.length} concept{guide.concepts.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className={styles.date}>{formatDate(guide.createdAt)}</span>
      </div>
    </Link>
  );
};

export default GuideCard;
