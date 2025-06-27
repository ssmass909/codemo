import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import styles from "./GuideDetailsPage.module.css";
import GuideDetailsStore from "../../stores/GuideDetailsPageStore";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { useRootStore } from "../../providers/RootStoreProvider";
import Modal from "../../components/Modal/Modal";

const GuideDetailsPage = () => {
  const [store] = useState(new GuideDetailsStore());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const authStore = useAuthStore();
  const rootStore = useRootStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    store.setApi(rootStore.api);
    if (id) {
      store.fetchGuideFlow(id);
    }

    return () => {
      store.reset();
    };
  }, [id, rootStore.api]);

  const handleDelete = async () => {
    if (!id) return;

    const success = await store.deleteGuideFlow(id);
    if (success) {
      navigate("/dashboard");
    }
    setShowDeleteModal(false);
  };

  const handleCopyCode = async () => {
    if (store.currentStep?.code) {
      try {
        await navigator.clipboard.writeText(store.currentStep.code);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (store.isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            Loading guide...
          </div>
        </div>
      </main>
    );
  }

  if (store.error || !store.guide) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>{store.error || "Guide not found"}</div>
          <Link to="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = store.isOwner(authStore.user?._id);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link to="/dashboard" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
            <h1 className={styles.title}>{store.guide.title}</h1>

            <div className={styles.metadata}>
              <div className={styles.metadataItem}>
                <span>🗣️</span>
                <span>{store.guide.language}</span>
              </div>
              <div className={styles.metadataItem}>
                <span>📝</span>
                <span>{store.guide.steps.length} steps</span>
              </div>
              {store.guide.createdAt && (
                <div className={styles.metadataItem}>
                  <span>📅</span>
                  <span>Created {formatDate(store.guide.createdAt)}</span>
                </div>
              )}
            </div>

            {store.guide.description && <p className={styles.description}>{store.guide.description}</p>}
          </div>

          <div className={styles.headerRight}>
            {isOwner && (
              <>
                <Link to={`/edit-guide/${store.guide._id}`} className={`${styles.actionBtn} ${styles.secondary}`}>
                  ✏️ Edit
                </Link>
                <button
                  className={`${styles.actionBtn} ${styles.danger}`}
                  onClick={() => setShowDeleteModal(true)}
                  disabled={store.isDeleting}
                >
                  {store.isDeleting ? "Deleting..." : "🗑️ Delete"}
                </button>
              </>
            )}
          </div>
        </div>

        {store.guide.concepts.length > 0 && (
          <div className={styles.conceptsSection}>
            <h2 className={styles.sectionTitle}>🏷️ Concepts</h2>
            <div className={styles.conceptsContainer}>
              {store.guide.concepts.map((concept, index) => (
                <span key={index} className={styles.conceptTag}>
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {store.hasSteps ? (
          <div className={styles.contentContainer}>
            <div className={styles.stepsNavigation}>
              <h3 className={styles.stepsNavTitle}>📋 Steps</h3>
              <div className={styles.stepsList}>
                {store.guide.steps.map((step, index) => (
                  <button
                    key={index}
                    className={`${styles.stepNavItem} ${index === store.currentStepIndex ? styles.active : ""}`}
                    onClick={() => store.setCurrentStepIndex(index)}
                  >
                    <div>Step {index + 1}</div>
                    <div className={styles.stepProgress}>{step.annotations.length} annotations</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>
                  Step {store.currentStepIndex + 1} of {store.guide.steps.length}
                </h2>
                <div className={styles.stepNavigation}>
                  <button
                    className={styles.navBtn}
                    onClick={() => store.previousStep()}
                    disabled={store.currentStepIndex === 0}
                  >
                    ← Previous
                  </button>
                  <button
                    className={styles.navBtn}
                    onClick={() => store.nextStep()}
                    disabled={store.currentStepIndex === store.guide.steps.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {store.currentStep && (
                <>
                  <div className={styles.codeBlock}>
                    <button className={styles.copyBtn} onClick={handleCopyCode}>
                      📋 Copy
                    </button>
                    <pre className={styles.codeContent}>{store.currentStep.code}</pre>
                  </div>

                  <div className={styles.annotationsSection}>
                    <h3 className={styles.annotationsTitle}>💡 Annotations ({store.currentStep.annotations.length})</h3>
                    {store.currentStep.annotations.length > 0 ? (
                      <div className={styles.annotationsList}>
                        {store.currentStep.annotations.map((annotation, index) => (
                          <div key={index} className={styles.annotationItem}>
                            <p className={styles.annotationText}>{annotation}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noAnnotations}>No annotations for this step</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.noSteps}>This guide doesn't have any steps yet.</div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} setOpen={setShowDeleteModal}>
        <div className={styles.deleteModalContent}>
          <h3 className={styles.deleteModalTitle}>Delete Guide</h3>
          <p className={styles.deleteModalText}>
            Are you sure you want to delete "{store.guide.title}"? This action cannot be undone.
          </p>
          <div className={styles.deleteModalActions}>
            <button
              className={`${styles.modalBtn} ${styles.cancelModalBtn}`}
              onClick={() => setShowDeleteModal(false)}
              disabled={store.isDeleting}
            >
              Cancel
            </button>
            <button
              className={`${styles.modalBtn} ${styles.confirmDeleteBtn}`}
              onClick={handleDelete}
              disabled={store.isDeleting}
            >
              {store.isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default observer(GuideDetailsPage);
