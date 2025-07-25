import { Navigate, type RouteObject } from "react-router";
import styles from "./LandingPage.module.css";
import { useEffect, useState } from "react";
import phrases from "../../assets/splashTexts.json";
import { useRootStore } from "../../providers/RootStoreProvider";
import { useAuthStore } from "../../providers/AuthStoreProvider";
import { observer } from "mobx-react";

const LandingPage = () => {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const rootStore = useRootStore();
  const authStore = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => {
        let next = prev;
        while (next === prev) {
          next = phrases[Math.floor(Math.random() * phrases.length)];
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (authStore.loggedIn) return <Navigate to={"/dashboard"} />;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Explain your code. Visually. Clearly.</h1>
        <p className={`${styles.phrase} ${styles.slideIn}`}>{currentPhrase}</p>
        <button
          className={styles.cta}
          onClick={() => {
            rootStore.headerStore?.setLoginModalOpen(true);
          }}
        >
          Start Creating →
        </button>
      </section>

      <section id="features" className={styles.features}>
        <h2>Why Codemo?</h2>
        <ul>
          <li>
            <strong>Step-by-step guides</strong> that walk through code with explanations
          </li>
          <li>
            <strong>Highlight specific lines</strong> as you explain
          </li>
          <li>
            <strong>Share your guides</strong> with teammates or students
          </li>
        </ul>
      </section>

      <section id="how-it-works" className={styles.howItWorks}>
        <h2>How It Works</h2>
        <ol>
          <li>Paste your code snippet</li>
          <li>Add guided steps with explanations</li>
          <li>Preview, edit, and share</li>
        </ol>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CodeGuide.</p>
      </footer>
    </main>
  );
};

export default observer(LandingPage);
