import { Link, useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import styles from "./CreateGuidePage.module.css";
import CreateGuidePageStore from "../../stores/CreateGuidePageStore";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { useRootStore } from "../../providers/RootStoreProvider";
import { useEffect, useState } from "react";

const CreateGuidePage = () => {
  const [store] = useState(new CreateGuidePageStore());
  const [authStore] = useState(useAuthStore());
  const [rootStore] = useState(useRootStore());
  const navigate = useNavigate();

  useEffect(() => {
    store.setApi(rootStore.api);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authStore.user?._id) return;

    const result = await store.createGuideFlow(authStore.user._id);
    if (result) {
      navigate("/dashboard");
    }
  };

  const handleAddConcept = (e: React.FormEvent) => {
    e.preventDefault();
    store.addConcept();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      store.addConcept();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Guide</h1>
          <Link to="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>

        {store.error && <div className={styles.error}>{store.error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.basicInfoSection}>
              <h2 className={styles.sectionTitle}>📋 Basic Information</h2>

              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className={styles.input}
                  value={store.title}
                  onChange={(e) => store.setTitle(e.target.value)}
                  placeholder="Enter guide title..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  value={store.description}
                  onChange={(e) => store.setDescription(e.target.value)}
                  placeholder="Describe what this guide covers..."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="language" className={styles.label}>
                  Programming Language *
                </label>
                <input
                  id="language"
                  type="text"
                  className={styles.input}
                  value={store.language}
                  onChange={(e) => store.setLanguage(e.target.value)}
                  placeholder="e.g., JavaScript, Python, React..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Concepts & Tags</label>
                <div className={styles.conceptsContainer}>
                  {store.concepts.map((concept, index) => (
                    <span key={index} className={styles.conceptTag}>
                      {concept}
                      <button
                        type="button"
                        className={styles.conceptRemoveBtn}
                        onClick={() => store.removeConcept(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className={styles.conceptInputContainer}>
                  <input
                    type="text"
                    className={styles.conceptInput}
                    value={store.newConcept}
                    onChange={(e) => store.setNewConcept(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a concept..."
                  />
                  <button
                    type="button"
                    className={styles.addConceptBtn}
                    onClick={handleAddConcept}
                    disabled={!store.newConcept.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className={styles.stepsSection}>
              <div className={styles.stepsHeader}>
                <h2 className={styles.sectionTitle}>🔧 Guide Steps</h2>
                <button type="button" className={styles.addStepBtn} onClick={() => store.addStep()}>
                  + Add Step
                </button>
              </div>

              <div className={styles.stepsList}>
                {store.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className={`${styles.stepItem} ${stepIndex === store.currentStepIndex ? styles.active : ""}`}
                  >
                    <div className={styles.stepHeader}>
                      <h3 className={styles.stepTitle}>Step {stepIndex + 1}</h3>
                      <div className={styles.stepControls}>
                        {stepIndex > 0 && (
                          <button
                            type="button"
                            className={styles.stepControlBtn}
                            onClick={() => store.moveStep(stepIndex, stepIndex - 1)}
                            title="Move up"
                          >
                            ↑
                          </button>
                        )}
                        {stepIndex < store.steps.length - 1 && (
                          <button
                            type="button"
                            className={styles.stepControlBtn}
                            onClick={() => store.moveStep(stepIndex, stepIndex + 1)}
                            title="Move down"
                          >
                            ↓
                          </button>
                        )}
                        <button
                          type="button"
                          className={`${styles.stepControlBtn} ${styles.delete}`}
                          onClick={() => store.removeStep(stepIndex)}
                          title="Delete step"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <textarea
                      className={styles.codeTextarea}
                      value={step.code}
                      onChange={(e) => store.updateStep(stepIndex, "code", e.target.value)}
                      onClick={() => store.setCurrentStepIndex(stepIndex)}
                      placeholder="Enter your code here..."
                      required
                    />

                    <div className={styles.annotationsContainer}>
                      <div className={styles.annotationsHeader}>
                        <span className={styles.annotationsTitle}>Annotations ({step.annotations.length})</span>
                        <button
                          type="button"
                          className={styles.addAnnotationBtn}
                          onClick={() => store.addAnnotationToStep(stepIndex)}
                        >
                          + Add Note
                        </button>
                      </div>

                      <div className={styles.annotationsList}>
                        {step.annotations.map((annotation, annotationIndex) => (
                          <div key={annotationIndex} className={styles.annotationItem}>
                            <input
                              type="text"
                              className={styles.annotationInput}
                              value={annotation}
                              onChange={(e) => store.updateAnnotationInStep(stepIndex, annotationIndex, e.target.value)}
                              placeholder="Add annotation or explanation..."
                            />
                            <button
                              type="button"
                              className={styles.removeAnnotationBtn}
                              onClick={() => store.removeAnnotationFromStep(stepIndex, annotationIndex)}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {store.steps.length === 0 && (
                  <div className={styles.loading}>No steps added yet. Click "Add Step" to get started!</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actionsContainer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/dashboard")}
              disabled={store.isLoading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={!store.isFormValid || store.isLoading}>
              {store.isLoading ? "Creating..." : "Create Guide"}
              {!store.isLoading && "🚀"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default observer(CreateGuidePage);
